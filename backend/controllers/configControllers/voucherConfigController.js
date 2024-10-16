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

    const currentConfig = await VoucherConfigModel.findOne({});

    // Check if config is locked
    if (
      currentConfig &&
      currentConfig.isLocked &&
      new Date() < currentConfig.lockUntil
    ) {
      return res.status(403).json({
        message:
          "The voucher configuration is locked and cannot be modified until the lock period expires.",
      });
    }

    let { voucherType, autoNumbering, withTax, voucherParts, startingNumber, resetNumbering } = req.body;

    // Extract the part between `org_` and the numeric part at the end from orgDbName (e.g., JPS in acc_org_jps_9325)
    const abbreviationMatch = orgDbName.match(/org_([a-zA-Z]+)_\d+/);
    const abbreviation = abbreviationMatch ? abbreviationMatch[1].toUpperCase() : orgDbName;

    // Auto-generate the Abbreviation part with the extracted orgDbName part
    const abbreviationPart = {
      partType: 'Abbreviation',
      value: abbreviation // Auto-insert extracted part of orgDbName as the abbreviation
    };

    // Check if voucherParts is provided by the user and ensure it doesn't already include an abbreviation part
    voucherParts = voucherParts.filter(part => part.partType !== 'Abbreviation');

    // Insert the auto-generated abbreviation part into the voucherParts
    voucherParts.push(abbreviationPart);

    // If config exists, update it; otherwise, create a new config
    const updatedConfig = await VoucherConfigModel.findOneAndUpdate(
      {},
      {
        $set: {
          voucherType,
          autoNumbering,
          withTax,
          voucherParts,
          startingNumber,
          resetNumbering,
          isLocked: true, // Lock the config after the first save
          lockUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Lock it for 1 year
        },
      },
      { new: true, upsert: true } // Upsert if it doesn't exist
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