const mongoose = require('mongoose');
const OrgExternalMeta = require('../../model/orgExternal/orgExternalMeta');
const MONGO_ATLAS_URI = 'mongodb+srv://it:4uDp8VUCLqIz9nma@project1.8wzgi.mongodb.net'; // MongoDB Atlas base URI
 
// Middleware to connect to organization's database based on orgId and store in session
const connectOrgDB = (req, res, next) => {
  try {
    const { dbConnection } = req.cookies; // Retrieve dbConnection (organization database) from cookies

    if (!dbConnection) {
      return res.status(400).json({ message: 'No organization database found in cookies' });
    }

    // Check if the connection to this organization's database is cached
    if (!connectionCache[dbConnection]) {
      console.log(`Creating new connection to org database: ${dbConnection}`);
      const dbUri = `${MONGO_ATLAS_URI}/${dbConnection}?retryWrites=true&w=majority`;
      
      const orgConnection = mongoose.createConnection(dbUri, {
       
      });
      
      connectionCache[dbConnection] = orgConnection;
    }

    // Attach the cached connection to the request object
    req.orgDbConnection = connectionCache[dbConnection];
    
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error('Error connecting to organization DB:', error.message);
    res.status(500).json({ message: 'Server error while connecting to organization DB', error: error.message });
  }
};
 
module.exports = connectOrgDB;
 
 