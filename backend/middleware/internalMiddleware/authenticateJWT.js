require("dotenv").config();
const jwt = require("jsonwebtoken");
const osInteral = require("../../model/internalModel/osInternal");

const approveMiddleware = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) return res.status(401).send({ message: "Unauthorized" });

  try {
    // Get the token from the cookies
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // const approval = await osInteral.findById(req.userId);
    // console.log(approval.role);
    if (req.userRole === "SuperAdmin") next();
    else res.status(403).send({ message: "Forbidden in approveMiddleware" });
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Authentication failed: Invalid token",
        error: error.message,
      });
  }
};

module.exports = { approveMiddleware };
