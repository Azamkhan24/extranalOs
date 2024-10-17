const VoucherConfigSchema = require("../../model/configModel/voucherConfigModel");
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const mongoose = require("mongoose");

const connectionCache = {};


const createOrUpdateVoucherConfig = async (req, res) => {
  const orgDbName = req.cookies.dbConnection; // Assuming the organization DB name is passed in cookies

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login first." });
  }

  try {
    // Check if the connection for the organization exists in the cache, if not, create a new one
    if (!connectionCache[orgDbName]) {
      const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
      const orgConnection = await mongoose.createConnection(dbUri, {});
      connectionCache[orgDbName] = orgConnection;
      console.log(
        `Successfully connected to the organization's database: ${orgDbName}`
      );
    }

    const VoucherConfigModel = connectionCache[orgDbName].model(
      "VoucherConfig",
      VoucherConfigSchema
    );

    // Fetch the current configuration to check if it's locked
    const currentConfig = await VoucherConfigModel.findOne({
      voucherType: req.body.voucherType,
    });

    // If configuration is locked, prevent updates
    if (
      currentConfig &&
      currentConfig.isLocked &&
      new Date() < currentConfig.lockUntil
    ) {
      return res.status(403).json({
        message: `The voucher configuration for ${req.body.voucherType} is locked and cannot be modified until ${currentConfig.lockUntil}.`,
      });
    }

    // Extract the configuration details from the request body
    const {
      voucherType,
      autoNumbering,
      withTax,
      numberOfParts, // How many parts the voucher number will be divided into
      voucherParts, // Parts selected by the user (Type, Year, etc.)
      separatorSymbol, // Separator between parts
      resetNumbering,
    } = req.body;


    // Prepare the voucher number with separators
    const voucherNumber = voucherParts
      .map((part) => part.value)
      .join(separatorSymbol); // Join parts with the selected separator

    // Ensure the voucher number (with separators) does not exceed 16 characters
    if (voucherNumber.length > 16) {
      return res.status(400).json({
        message:
          "The total length of the voucher number (including separators) cannot exceed 16 characters.",
      });
    }

    // Prepare the updated configuration data
    const configData = {
      voucherType,
      autoNumbering,
      withTax,
      numberOfParts,
      voucherParts,
      separatorSymbol,
      resetNumbering,
      isLocked: true, // Lock the config after the first save
      lockUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Lock for 1 year
    };

    // Upsert the voucher configuration (create or update)
    const updatedConfig = await VoucherConfigModel.findOneAndUpdate(
      { voucherType }, // Find by voucher type
      { $set: configData }, // Update the config data
      { new: true, upsert: true } // Create a new entry if it doesn't exist
    );

    res.status(200).json({
      message: "Voucher configuration saved successfully.",
      config: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating voucher configuration:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};




module.exports = {
  createOrUpdateVoucherConfig
};