const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
}


module.exports = connectDB;
