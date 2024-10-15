const User = require("../../model/userModel/User");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const orgExternalMeta = require("../../model/orgExternal/orgExternalMeta");
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const mongoose = require("mongoose");
const userSchmea = require("./../../model/orgExternal/User");
const { response } = require("express");

const connectionCache = {};

const registerUser = async (req, res) => {
  try {
    const {
      userType,
      role,
      name,
      email,
      password,
      phoneNo,
      organizationType,
      team,
      employeeType,
      orgAdmins,
      professionType,
      orgEntity,
      account,
      crm,
      ecom,
      payroll,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email, isDelete: false });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // Validate userType and professionType
    if (userType === "Business" && professionType) {
      return res
        .status(400)
        .json({
          message: "ProfessionType should be null for Business userType.",
        });
    }

    if (userType === "Professional" && !professionType) {
      return res
        .status(400)
        .json({
          message: "ProfessionType is required for Professional userType.",
        });
    }

    if (userType === "Professional" && (ecom || payroll)) {
      return res
        .status(400)
        .json({
          message:
            "Professional users can only access CRM. Ecom and Payroll should be false.",
        });
    }

    if (userType === "Business" && crm) {
      return res
        .status(400)
        .json({
          message:
            "Business users can only access Ecom and Payroll. CRM should be false.",
        });
    }

    // Generate a salt and hash the password
    const salt = genSaltSync(parseInt(process.env.saltRounds));
    const hashedPassword = hashSync(password, salt);

    // Find the organization
    const organization = await orgExternalMeta.findOne({ orgName: orgEntity });
    if (!organization) {
      return res.status(400).json({ message: "Organization not found." });
    }

    // Create a new user
    const objectUser = {
      userType,
      role,
      name,
      email,
      password: hashedPassword,
      phoneNo,
      organizationType,
      team,
      employeeType,
      orgAdmins,
      professionType: userType === "Professional" ? professionType : null,
      orgEntity,
      account,
      accountDatabase: organization.accountingDatabaseName,
      crm: userType === "Professional" ? crm : false,
      ecom: userType === "Business" ? ecom : false,
      payroll: userType === "Business" ? payroll : false,
    };
    const newUser = new User({ ...objectUser });

    // Save the user to the main database
    await newUser.save();

    // Create a connection to the organization's database
    const dbUri = `${MONGO_ATLAS_URI}/${organization.accountingDatabaseName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});

    // Create an internal user instance for the organization's database
    const internalUser = orgConnection.model("RegisterUser", userSchmea);
    const internalUserSave = new internalUser({
      ...objectUser,
    });
    await internalUserSave.save();

    // Respond with success message
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Server error in user creation", error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email and ensure they are not marked as deleted
    const user = await User.findOne({ email, isDelete: false });

    if (!user || !compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Find the organization associated with the user
    const organization = await orgExternalMeta.findOne({
      orgName: user.orgEntity,
    });
    if (!organization)
      return res.status(400).json({ message: "Organization not found" });

    const orgDbName = organization.accountingDatabaseName;

    // Cache the org-specific connection
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;

      // Log the successful connection to the organization database
      console.log(
        `Successfully connected to the organization's database: ${orgDbName}`
      );
    }

    // Generate JWT token for user session
    const internalUserCollection = connectionCache[orgDbName].model(
      "RegisterUser",
      userSchmea
    );
    const internalUser = await internalUserCollection.findOne({ email });
    const token = jwt.sign(
      { id: user._id, orgId: internalUser._id, orgDbName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store token and org database name in cookies for future requests
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Strict",
      secure: isProduction,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("dbConnection", orgDbName, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Strict", // 'None' for cross-domain cookies
      secure: isProduction, // Enable in production environment (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });

    // Respond with success message
    res
      .status(200)
      .json({ message: "Login successful", response: { token, orgDbName } });
  } catch (error) {
    // Handle server error
    res
      .status(500)
      .json({ message: "Server error in login", error: error.message });
  }
};

// User logout
const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });

    // Clear the database connection cookie
    res.clearCookie('dbConnection', { httpOnly: true, secure: true, sameSite: 'strict' });

    // Optionally clear any additional cookies if needed
    // res.clearCookie("otherCookie", { path: "/", domain: req.hostname });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout", error: error.message });
  }
};


// Update user information
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT token
    const updates = req.body;
    updates.updatedAt = Date.now();
    if (updates.password) {
      const salt = genSaltSync(parseInt(process.env.saltRounds));
      const hashedPassword = hashSync(updates.password, salt);
      updates.password = hashedPassword;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User donot exist in internal database",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    const orgDbName = req.cookies.dbConnection;
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;

      // Log the successful connection to the organization database
      console.log(
        `Successfully connected to the organization's database: ${orgDbName}`
      );
    }

    // Generate JWT token for user session
    const internalUserCollection = connectionCache[orgDbName].model(
      "RegisterUser",
      userSchmea
    );
    const updatedUserInternal = await internalUserCollection.findByIdAndUpdate(
      req.user.orgId,
      updates,
      { new: true }
    );
    if (!updatedUserInternal) {
      res.status(404).json({
        message: "User donot exist in internal database",
      });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error in updated User", error: error.message });
  }
};

// Delete (soft delete) a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDelete: true },
      { new: true }
    );
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error in delete  User", error: error.message });
  }
};

// Get user information by ID (no authorization required)
const getUserById = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error  in get User by ID",
        error: error.message,
      });
  }
};

// Get all users (no authorization required)
// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Fetch users with pagination
    const users = await User.find({ isDelete: false }) // Adjust query if needed to filter out soft deleted users
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: Sort by created date, most recent first

    // Count total users for pagination info
    const totalUsers = await User.countDocuments({ isDelete: false });

    // If no users found, return a 204 status
    if (!users.length) {
      return res.status(204).json({ message: "No users found" });
    }

    // Return paginated results with total count
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error in getting all users",
        error: error.message,
      });
  }
};

// Get users by orgEntity with pagination
const getUsersByOrgEntity = async (req, res) => {
  try {
    const orgEntity = req.params.orgEntity;
    const regex = new RegExp(`^${orgEntity.replace(/\s+/g, "\\s*")}$`, "i"); // Flexible matching of orgEntity

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Fetch users with pagination and regex matching
    const users = await User.find({
      orgEntity: regex,
      isDelete: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: Sort by created date, most recent first

    // Count total users for pagination info
    const totalUsers = await User.countDocuments({
      orgEntity: regex,
      isDelete: false,
    });

    // If no users found, return a 204 status
    if (!users.length) {
      return res
        .status(204)
        .json({ message: "No users found with this orgEntity" });
    }

    // Return paginated results with total count
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error in get users by orgEntity",
        error: error.message,
      });
  }
};

const getOrgSpecificData = async (req, res) => {
  try {
    // Extract organization database name from cookies
    const orgDbName = req.cookies.dbConnection;

    // Check if the connection exists in the cache
    const orgConnection = connectionCache[orgDbName];
    if (!orgConnection) {
      return res
        .status(400)
        .json({ message: "No connection to the organization database found." });
    }

    // Define the schema for the user model in the organization's database
    const OrgUser = orgConnection.model("RegisterUsers", userSchmea); // Assuming userSchmea is the schema for the User model

    // Fetch users from the organization's database
    const orgUsers = await OrgUser.find(); // You can customize this query as needed

    res.status(200).json({ users: orgUsers });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching organization data",
        error: error.message,
      });
  }
};

const checkUserLogin = (req, res, next) => {
  const { token } = req.cookies; // Get the token from cookies

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  try {
    // Verify the token using jwt.verify to ensure it's valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to set JWT_SECRET in your environment variables

    // Attach the decoded token data (e.g., user info) to the request object
    res.status(200).json({ message: "login user is", response: decoded });
  } catch (e) {
    // Handle invalid or expired tokens
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  getUsersByOrgEntity,
  logoutUser,
  getOrgSpecificData,
  checkUserLogin,
};
