require('dotenv').config();
const OsInternal = require('../../model/internalModel/osInternal'); // Update the path to where your model is located
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateUniqueId } = require('../../utils/generateUniqueId')
const  cookieParser = require('cookie-parser')
const JSONStream = require('JSONStream');
const osInternal = require('../../model/internalModel/osInternal');

// Create a new user
const createUserOS = async (req, res) => {
  try {
    // Extract data from the request body
    let {
      name,
      fatherName,
      email,
      phoneNumber,
      password,
      role,
      department,
      img,
      DOB,
      DateOfJoining,
      permanentAddress,
      isPresentAddressSameAsPermanent,
      presentAddress,
      educationQualification,
      bankAccountDetails,
      familyDetails,
      localFamilyDetails,
      managementTeamAttribute,
      salesTeamAttribute,
      financeTeamAttribute,
      outreachTeamAttribute,
      dataMigrationTeamAttribute,
      learningAndDevelopmentTeamAttribute,
      hrTeamAttribute,
      itTeamAttribute,
      supportTeamAttribute,
      onBoardingTeamAttribute,
      proof,
      PFno,
      UAN,
      ESIC
    } = req.body;

    // Check if the email already exists
    const existingUser = await OsInternal.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    if (isPresentAddressSameAsPermanent) {
      presentAddress = permanentAddress
    }

    // Validate password
    if (!password) return res.status(400).json({ message: 'Password is required' });

    // Validate for job role
    if (role === 'User' && department === 'IT' && itTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'IT Team Attribute is required for IT Department' });
    }

    if (role === 'User' && department === 'HR' && hrTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'HR Team Attribute is required for HR Department' });
    }

    if (role === 'User' && department === 'Learning and Development' && learningAndDevelopmentTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Learning and Development Team Attribute is required for Learning and Development Department' });
    }

    if (role === 'User' && department === 'Finance' && financeTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Finance Team Attribute is required for Finance Department' });
    }

    if (role === 'User' && department === 'Sales' && salesTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Sales Team Attribute is required for Sales Department' });
    }

    if (role === 'User' && department === 'Outreach' && outreachTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Outreach Team Attribute is required for Outreach Department' });
    }

    if (role === 'User' && department === 'Migration' && dataMigrationTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Data Migration Team Attribute is required for Migration Department' });
    }

    if (role === 'User' && department === 'Support' && supportTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Support Team Attribute is required for Support Department' });
    }

    if (role === 'User' && department === 'Management' && managementTeamAttribute.length === 0) {
      return res.status(400).json({ message: 'Management Team Attribute is required for Management Department' });
    }
    console.log(onBoardingTeamAttribute, "before onboardin function");
    if(role === 'User' && department === 'OnBoard' &&  onBoardingTeamAttribute.length === 0) {
      return res.status(400).json({message: 'OnBoarding Team Attribute is required for OnBoarding Department' });

    }


    // Hash the password
    const saltSync = bcrypt.genSaltSync(Number(process.env.saltRounds));
    const hash = bcrypt.hashSync(password, saltSync);
    const convertedMail = email.toLowerCase();


    // Generate unique ID
    const id = await generateUniqueId({ department, role });


    // Create new user object
    const newUser = new OsInternal({
      id,
      name,
      fatherName,
      email: convertedMail,
      phoneNumber,
      password: hash,
      role,
      department,
      img,
      DOB,
      DateOfJoining,
      permanentAddress,
      isPresentAddressSameAsPermanent,
      presentAddress,
      educationQualification,
      bankAccountDetails,
      familyDetails,
      localFamilyDetails,
      managementTeamAttribute,
      salesTeamAttribute,
      financeTeamAttribute,
      outreachTeamAttribute,
      dataMigrationTeamAttribute,
      learningAndDevelopmentTeamAttribute,
      hrTeamAttribute,
      itTeamAttribute,
      proof,
      PFno,
      UAN,
      ESIC
    });

    // Save the new user to the database
    const response = await newUser.save();

    // Send success response
    res.status(201).json({
      message: 'User created successfully',
      user: response
    });
  } catch (error) {
    // Handle errors (e.g., validation errors, database errors)
    console.error(error.message);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

const approve = async (req, res) => {
  const id = req.params.id;

  const user = await OsInternal.findById(id);
  if (!user) return res.status(404).send({
    message: 'User not found'
  })
  const result = await OsInternal.findByIdAndUpdate(
    id,
    { $set: { isApproved: true } }, // Use $set to specify fields to update
    { new: true, runValidators: true } // Return the updated document and run validators
  );
  res.status(200).json({
    message: 'User approved',
    result
  })
};

const loginUserOS = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check if the user exists
    const user = await OsInternal.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ message: 'Invalid email or password' });
    if (!user.isApproved) return res.status(400).json({ message: 'User is not approved' });

    // Check if the password matches
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the cookie options
    const tokenOptions = {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Only set the cookie over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for cross-site requests in production, 'lax' otherwise
      maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    };

    // Set the cookie and send the response
    res.cookie('token', token, tokenOptions).status(200).json({
      message: 'Login successfully',
      role: user.role,
      name: user.name,
      department: user.department,
      success: true,
      error: false
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error in user login', error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    // Fetch the user details using the ID from the middleware
    const user = await OsInternal.findById(req.userId).select('-password'); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user details in the response
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        // Add any other fields you want to include
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};

const getAll = (req, res) => {
  try {
    const userStream = OsInternal.find({ isDeleted: false, isApproved: false, isActive: true }).cursor(); // Stream the data using cursor

    res.setHeader('Content-Type', 'application/json');

    // Custom formatting for the response
    const output = {
      message: 'All OS internal',
      user: []
    };

    // Create a transform stream to handle custom formatting
    const transformStream = JSONStream.parse('*')
      .on('data', (data) => {
        output.user.push(data);
      })
      .on('end', () => {
        if (output.user.length === 0) {
          res.status(204).json({ message: 'No users found' });
        } else {
          res.status(200).json(output);
        }
      });

    // Pipe the userStream into the transform stream
    userStream
      .pipe(JSONStream.stringify())
      .pipe(transformStream);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from URL parameters

    // Find the user by ID, ensuring it is not deleted
    const user = await OsInternal.findOne({ _id: id, isDeleted: false });

    // If the user doesn't exist or has been deleted, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user details
    res.status(200).json({
      message: 'User details',
      user,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: 'Server error fetching user details',
      error: error.message,
    });
  }
};

const getAllApprovedUser = async (req, res) => {
  try {
    // Fetch all approved and non-deleted users from the database
    const users = await OsInternal.find({ isApproved: true, isDeleted: false });
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No approved users found" });
    }

    // Return the list of users as a response
    res.status(200).json({ message: "All approved users", user: users });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUserOS = async (req, res) => {
  try {
    const username = req.cookies['token'];
    res.clearCookie('token');
    res.status(200).send('logout  successfully');
  }
  catch (error) {
    res.status(500).json({ message: 'Server error user in logout', error: error.message });

  }
};

const resignationApproval = async (req, res) => {
  try {
    const { id } = req.body;
    // Find the user by the provided ID
    const user = await OsInternal.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update the user's status and resignation date
    const response = await osInternal.findByIdAndUpdate({ _id: user._id },
      { isActive: false, resignDate: Date.now(), isApproved: false },

    );

    res.status(200).json({
      message: "Resignation acceptance approved",
      response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { createUserOS, getUserDetails, approve, loginUserOS, logoutUserOS, getAll, getAllApprovedUser, resignationApproval, getUserById };