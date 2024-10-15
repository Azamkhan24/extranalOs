require("dotenv").config();
const gstUser = require("../../model/gstModel/Gst");
const axios = require("axios");

const cleanGSTData = (data) => {
  return {
      stjCd: data.stjCd,
      lgnm: data.lgnm,
      stj: data.stj,
      dty: data.dty,
      adadr: data.adadr.map(addrObj => ({
          addr: {
              bnm: addrObj.addr.bnm,
              st: addrObj.addr.st,
              loc: addrObj.addr.loc,
              bno: addrObj.addr.bno,
              dst: addrObj.addr.dst,
              lt: addrObj.addr.lt,
              locality: addrObj.addr.locality,
              pncd: addrObj.addr.pncd,
              landMark: addrObj.addr.landMark,
              stcd: addrObj.addr.stcd,
              geocodelvl: addrObj.addr.geocodelvl,
              flno: addrObj.addr.flno,
              lg: addrObj.addr.lg
          },
          ntr: addrObj.ntr
      })),
      cxdt: data.cxdt,
      gstin: data.gstin,
      nba: data.nba,
      lstupdt: data.lstupdt,
      rgdt: data.rgdt,
      ctb: data.ctb,
      pradr: {
          addr: {
              bnm: data.pradr.addr.bnm,
              st: data.pradr.addr.st,
              loc: data.pradr.addr.loc,
              bno: data.pradr.addr.bno,
              dst: data.pradr.addr.dst,
              lt: data.pradr.addr.lt,
              locality: data.pradr.addr.locality,
              pncd: data.pradr.addr.pncd,
              landMark: data.pradr.addr.landMark,
              stcd: data.pradr.addr.stcd,
              geocodelvl: data.pradr.addr.geocodelvl,
              flno: data.pradr.addr.flno,
              lg: data.pradr.addr.lg
          },
          ntr: data.pradr.ntr
      },
      tradeNam: data.tradeNam,
      ctjCd: data.ctjCd,
      sts: data.sts,
      ctj: data.ctj,
      einvoiceStatus: data.einvoiceStatus
  };
};
 
 
const compareGSTData = (storedData, fetchedData) => {
  const changes = {};
 
  // Remove unwanted fields (like _id) from all layers
  const cleanedStoredData = cleanGSTData(storedData);
  const cleanedFetchedData = cleanGSTData(fetchedData);
 
  // Compare root-level fields
  const fieldsToCompare = [
      "stjCd", "lgnm", "stj", "dty", "gstin", "nba", "lstupdt", "rgdt", "ctb", "tradeNam", "ctjCd", "sts", "ctj", "einvoiceStatus"
  ];
 
  fieldsToCompare.forEach(field => {
      if (JSON.stringify(cleanedStoredData[field]) !== JSON.stringify(cleanedFetchedData[field])) {
          changes[field] = { stored: cleanedStoredData[field], fetched: cleanedFetchedData[field] };
      }
  });
 
  // Compare pradr.addr fields
  if (JSON.stringify(cleanedStoredData.pradr?.addr) !== JSON.stringify(cleanedFetchedData.pradr?.addr)) {
      changes["pradr.addr"] = {
          stored: cleanedStoredData.pradr?.addr,
          fetched: cleanedFetchedData.pradr?.addr
      };
  }
 
  // Compare pradr.ntr
  if (JSON.stringify(cleanedStoredData.pradr?.ntr) !== JSON.stringify(cleanedFetchedData.pradr?.ntr)) {
      changes["pradr.ntr"] = {
          stored: cleanedStoredData.pradr?.ntr,
          fetched: cleanedFetchedData.pradr?.ntr
      };
  }
 
  // Compare adadr array
  if (JSON.stringify(cleanedStoredData.adadr) !== JSON.stringify(cleanedFetchedData.adadr)) {
      changes["adadr"] = {
          stored: cleanedStoredData.adadr,
          fetched: cleanedFetchedData.adadr
      };
  }
 
  return changes;
};
 
 
const enterGst = async (req, res) => {
  try {
    const { gstin } = req.body;
 
    if (!gstin) {
      return res.status(400).json({ error: "Missing GSTIN number" });
    }
 
    // Check if GST user exists
    let user = await gstUser.findOne({ gstin });
 
    if (user) {
      // Fetch GST data from the external API
      const url = `https://gstapi.charteredinfo.com/commonapi/v1.1/search?action=TP&aspid=${process.env.aspid}&password=${process.env.asppassword}&gstin=${gstin}`;
      const response = await axios.get(url);
      const gstData = response.data;
 
      // Define fields to ignore in comparison (system and unchanged fields)
     
 
      // Detect changes between stored data and fetched data
      const changes = compareGSTData(user, gstData);
      
      // Proceed only if changes are detected
      if (Object.keys(changes).length > 0) {
        if (!user.versionHistory) {
          user.versionHistory = []; // Initialize versionHistory if not present
        }
 
        // Push current record to versionHistory
        user.versionHistory.push({
          record: { ...user.toObject(), _id: undefined }, // Exclude _id
          updatedAt: new Date(),
        });
 
        // Update user with the new data
        Object.assign(user, gstData);
        user.lastModified = new Date(); // Update last modified timestamp
 
        // Save updated document
        const formattedUser = await user.save();
        return res.status(200).json({
          message: "GST data updated with changes",
          changes,
          user: formattedUser,
        });
      } else {
        return res
          .status(200)
          .json({ message: "No changes detected", user });
      }
    }
 
    // If user doesn't exist, create a new record
    const url = `https://gstapi.charteredinfo.com/commonapi/v1.1/search?action=TP&aspid=${process.env.aspid}&password=${process.env.asppassword}&gstin=${gstin}`;
    const response = await axios.get(url);
    const gstData = response.data;
 
    const newGstUser = new gstUser(gstData);
    const formattedUser=await newGstUser.save();
 
    return res
      .status(201)
      .json({ message: "GST data saved successfully", user: formattedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "GST enter controller error", error: error.message });
  }
};

// Controller to retrieve all GST users in a streaming format
const getAllGst = (req, res) => {
  try {
    // Stream data from the database
    const gstStream = gstUser.find().cursor(); // Stream data using cursor

    // Set the response header for JSON content
    res.setHeader("Content-Type", "application/json");

    // Create a transform stream to handle custom formatting
    const transformStream = JSONStream.stringify("[", ", ", "]", 2);

    // Write the initial part of the response
    res.write('{"message": "All GST of organization", "gst": ');

    let count = 0;

    gstStream.on("data", () => {
      count++;
    });

    // Transform the stream and handle the end event
    gstStream.pipe(transformStream).pipe(res, { end: false });

    gstStream.on("end", () => {
      res.write(',\n "length": ' + count + ",\n }");
      res.end(); // Close the JSON array and end the response
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch GST details in gst controller",
      error: error.message,
    });
  }
};

// Controller to retrieve GST user by ID
const getGstById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(204)
        .json({ message: "Please enter user id in params" });
    }

    const user = await gstUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch GST details in GST controller",
      error: error.message,
    });
  }
};

// Controller to retrieve GST user version history
const getGstHistory = async (req, res) => {
  try {
    const { gstin } = req.params;

    // Find the user based on GSTIN
    const user = await gstUser.findOne({ gstin });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the version history
    return res.status(200).json({ versionHistory: user.versionHistory });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch GST version history",
      error: error.message,
    });
  }
};

module.exports = {
  enterGst,
  getAllGst,
  getGstById,
  getGstHistory,
};
