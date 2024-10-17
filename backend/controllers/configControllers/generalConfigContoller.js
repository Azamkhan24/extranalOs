const GeneralConfig = require("../../model/configModel/generalConfigModel");
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const mongoose = require("mongoose");

const connectionCache = {};

const createOrUpdateConfig = async (req, res) => {
    const orgDbName = req.cookies.dbConnection;

    if (!orgDbName) {
        return res.status(401).json({ message: "Please login First" });
    }

    // Check if the connection for the organization exists in the cache, if not, create a new one
    if (!connectionCache[orgDbName]) {
        try {
            const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
            const orgConnection = await mongoose.createConnection(dbUri, {});
            connectionCache[orgDbName] = orgConnection;

            console.log(
                `Successfully connected to the organization's database: ${orgDbName}`
            );
        } catch (error) {
            return res.status(500).json({ message: "Database connection failed", error });
        }
    }

    // Retrieve the GeneralConfig model for the specific organization's database
    const ConfigModel = connectionCache[orgDbName].model(
        "GeneralConfig",
        GeneralConfig
    );

    const session = await connectionCache[orgDbName].startSession(); // Start session here
    session.startTransaction(); // Start a transaction

    try {
        // Extract account and inventory configuration from the request body
        const { accountConfig, inventoryConfig } = req.body;

        // Fetch existing configuration
        const existingConfig = await ConfigModel.findOne().session(session);

        // Check if configuration is locked
        if (existingConfig?.isLocked && new Date() < existingConfig.lockUntil) {
            return res
                .status(403)
                .json({
                    message: `This configuration is locked and cannot be modified until ${existingConfig.lockUntil}`,
                });
        }

        // If maintainStock is false, set qtyDecimalPlace to 0
        if (inventoryConfig.maintainStock === false) {
            inventoryConfig.qtyDecimalPlace = 0;
        }

        // Prepare the config data from the request body
        const configData = {
            accountConfig: accountConfig,
            inventoryConfig: inventoryConfig,
        };

        // Upsert configuration: create if it doesn't exist, update if it does
        const config = await ConfigModel.findOneAndUpdate(
            {}, // Empty filter as config is unique per orgDB
            { $set: configData }, // Update data
            { new: true, upsert: true, session } // Attach the session here
        );

        // Update timestamps and lock the configuration for one year if it's new
        if (!existingConfig) {
            config.isLocked = true;
            config.lockUntil = new Date();
            config.lockUntil.setFullYear(config.lockUntil.getFullYear() + 1);
        }

        await config.save({ session }); // Save with session

        await session.commitTransaction(); // Commit the transaction

        res.status(200).json({
            message: "Configuration saved successfully",
            config,
        });
    } catch (error) {
        await session.abortTransaction(); // Abort transaction on error
        console.error("Error Config:", error);
        res.status(500).json({ message: "Error Config", error });
    } finally {
        session.endSession(); // Ensure session is ended
    }
};


// Get General Configuration for an organization
const getConfig = async (req, res) => {
    try {
        const { organizationId } = req.params;

        if (!organizationId) {
            return res.status(400).json({ message: "Organization ID is required" });
        }

        // Find the configuration for the given organization ID
        const config = await GeneralConfig.findOne({ organizationId });

        if (!config) {
            return res.status(404).json({ message: "Configuration not found" });
        }

        res.status(200).json(config);
    } catch (error) {
        console.error("Error fetching configuration:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Optional: Delete General Configuration for an organization
const deleteConfig = async (req, res) => {
    try {
        const { organizationId } = req.params;

        if (!organizationId) {
            return res.status(400).json({ message: "Organization ID is required" });
        }

        // Find and delete the configuration for the given organization ID
        const deletedConfig = await GeneralConfig.findOneAndDelete({
            organizationId,
        });

        if (!deletedConfig) {
            return res.status(404).json({ message: "Configuration not found" });
        }

        res.status(200).json({ message: "Configuration deleted successfully" });
    } catch (error) {
        console.error("Error deleting configuration:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    createOrUpdateConfig,
    getConfig,
    deleteConfig,
};