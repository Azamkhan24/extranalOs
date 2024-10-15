const masterSchema = require('../../model/masterModel/mastermodel');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const osInternal = require('../../model/internalModel/osInternal')
const createOrganizationDatabase = require('../../utils/clusterService')


async function authenticateUser(req) {
  const token = req.cookies.token;
 
  if (!token) throw new Error("No token provided");
 
 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) throw new Error("Unauthorized");
 
  const user = await osInternal.findById(decoded.id);
  if (!user) throw new Error("User not found");
 
  return user; // Returns the authenticated user
}


// Your MongoDB Atlas connection string with the placeholder for the database

// Example of creating a new organization and adding a user



const orgControllers = async (req, res) => {
  try {
    // Define the API endpoint
    const apiUrl = `${process.env.API}/api/gst/gst-details`;


    // Extract values from req.body
    let {
      name,
      typeOfAssessee,
      pan,
      PhoneNo,
      EmailId,
      dateOfIncorporation,
      gstin,
      gst // Boolean to indicate if GST is applicable
    } = req.body;

    // If GST is true, extract PAN from GSTIN
    console.log("gst in backcend ", gst, " this is gstin ", gstin)
    if (gst && gstin) {
      pan = gstin.substring(2, 12); // Extract PAN from GSTIN
      console.log("Here is gst and gstin", gst, gstin);
      
    }
   
    // Validate that PAN is provided
    if (!pan) {
      return res.status(400).json({ message: "Please provide PAN or GSTIN." });
    }

    // Check if an organization with the same PAN already exists
    // Log the current date and time
  console.log(new Date());

    const orgSaved = await masterSchema.findOne({ pan });
    if (orgSaved) {
      return res.status(404).json({
        message: 'Organization already exists',
        orgSaved
      });
    }
// Log the current date and time
console.log(new Date());

    // If GSTIN is provided, fetch details from the GST API
    if (gst && gstin) {
      try {
        const requestData = { gstin };
        const response = await axios.post(apiUrl, requestData, {
          headers: { 'Content-Type': 'application/json' }
        });
        // Extract data from the API response and update missing fields
        console.log(new Date())
        name =  response.data.userExist[0]?.lgnm||name ;
        typeOfAssessee = response.data.userExist[0]?.ctb||typeOfAssessee;
        dateOfIncorporation = response.data.userExist[0]?.rgdt||dateOfIncorporation;
        console.log(dateOfIncorporation);
        const gstDetails = {
          tradeName: response.data.userExist[0]?.tradeNam,
          gstin,
          principalPlaceOfAddress: response.data.userExist[0]?.pradr,
          additionalPlaceOfAddress: response.data.userExist[0]?.adadr,// Mapping address list
          jurisdictionDetails: {
            center: response.data.userExist[0]?.ctj,
            state: response.data.userExist[0]?.stj
          }
        };

        const registrationNumbers = {
          cin: req.body.cin,
          tan: req.body.tan,
          udhyam: req.body.udhyam,
          esic: req.body.esic,
          epfo: req.body.epfo,
          llpin: req.body.llpin
        };

        // Ensure CIN is provided if the organization is a Private Limited Company
        // if (typeOfAssessee === 'Private Limited Company' && !registrationNumbers.cin) {
        //   return res.status(400).json({ message: "If you are a Private Limited Company, CIN is required." });
        // }

        // Construct the masterData object
        const masterData = {
          name,
          typeOfAssessee,
          pan,
          PhoneNo,
          EmailId,
          dateOfIncorporation,
          gstDetails,
          registrationNumbers,
          gst
        };

        // Save the data into MongoDB
        const master = new masterSchema(masterData);
        const savedMaster = await master.save();
        
        

        // Respond with success message
        return res.status(201).json({
          message: "Data inserted into master module.",
          savedMaster
        });

      } catch (error) {
        return res.status(400).json({
          message: 'Error fetching GST details from API.',
          error: error.message
        });
      }
    } else {
      // If GST is not provided, save only basic details
      const masterData = {
        name,
        typeOfAssessee,
        pan,
        PhoneNo,
        EmailId,
        dateOfIncorporation,
        gst
      };

      // Save the data into MongoDB
      const master = new masterSchema(masterData);
      const savedMaster = await master.save();

      // Respond with success message
      return res.status(201).json({
        message: "Data inserted into master module.",
        savedMaster
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error in orgController',
      error: error.message
    });
  }
};

const getByPan = async(req,res)=>{
    const {pan} = req.params;
    try{
        const orgSaved =await masterSchema.find({pan: pan});
        if(orgSaved.length === 0){
            return  res.status(404).json({
                message: "No data found for the given PAN number",
            })

        }
        res.status(200).json({
            messae:  "Data found for the given PAN number",
            orgSaved
        })
    }
    catch(error){
        res.status(500).json({
            message:  'Error occurred while fetching org details',
            error: error
        })
    }
}


const getAllOrg = async(req, res)=>{
  try{
    const orgs =  await masterSchema.find();
    return  res.status(200).json({
      message: "Data fetched successfully",
      Number: orgs.length,
      orgs
    })


  }
  catch(error){
    res.status(500).json({
      messae:"Server Error",
      error: error.messae
    })
  }
}

const getAllOrgUnapproved =  async(req, res)=>{
  try{
    const user = await authenticateUser(req);
  // Ensure only Admin or Sales department can access this resource
    if (user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }
    const orgs =  await masterSchema.find({"isApproved" : false});
    console.log(orgs)
    if(!orgs.length){
      return res
      .status(400).json({message: "No any organization  is unapproved" });
    }
    res.status(200).json({
      message: "Data fetched successfully",
      Org: orgs
    })
  }
  catch(error){
    res.status(500).json({
      messae:"Server Error",
      error: error.message
    })
  }
}
const approveOrgById = async (req, res) => {
  try {
    // Authenticate user and check authorization
    const user = await authenticateUser(req);
    // Ensure only SuperAdmin can approve organizations
    if (user.role !== "SuperAdmin") {
      return res.status(403).json({
        message: "You are not authorized to access this resource",
      });
    }
    // Get the organization ID from the request body
    const orgId = req.body.id;
    // Log orgId to check its value
    console.log("Received Organization ID:", orgId);
    // Validate the organization ID
    if (!orgId ) {
      return res.status(400).json({ message: "Invalid organization ID" });
    }
    // Find and update the organization using findByIdAndUpdate
    const updatedOrg = await masterSchema.findByIdAndUpdate(
      orgId,
      { isApproved: true }, // Update the isApproved field
      { new: true } // Return the updated document
    );
    // If the organization was not found
    if (!updatedOrg) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }
    createOrganizationDatabase(updatedOrg.name)
    .then(() => {
      console.log('Organization and database created successfully.');
    })
    .catch((err) => {
      console.error('Error creating organization database:', err);
    });
    // Respond with success
    return res.status(200).json({
      message: "Organization approved successfully",
      updatedOrg,
    });
  } catch (error) {
    console.error("Error approving organization:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const getOrgByName = async (req, res) => {
  const { orgName } = req.params; // Extract the organization name from the request parameters

  try {
    // Find the organization by name (case-insensitive search)
    const org = await masterSchema.findOne({ name: { $regex: new RegExp(`^${orgName}$`, 'i') } });

    // If no organization is found, return a 404 response
    if (!org) {
      return res.status(404).json({
        message: `No organization found with the name: ${orgName}`,
      });
    }

    // Return the organization details if found
    return res.status(200).json({
      message: `Organization details for ${orgName} fetched successfully`,
      org,
    });

  } catch (error) {
    // Return a 500 response if there is a server error
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


module.exports = { orgControllers,  getByPan, getAllOrg ,getOrgByName, approveOrgById, getAllOrgUnapproved};

