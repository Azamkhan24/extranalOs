const mongoose = require('mongoose');
const Sales = require('../../model/transactionModel/salesModel'); // Adjust the path to your sales schema
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;

const connectionCache = {};

// Controller to create a sales transaction
const createSales = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  // Check if the connection for the organization exists in the cache, if not, create a new one
  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;

    console.log(`Successfully connected to the organization's database: ${orgDbName}`);
  }

  // Retrieve the sales model for the specific organization's database
  const SalesModel = connectionCache[orgDbName].model("Transaction_Sales", Sales);

  try {
    // Destructure the required fields from the request body
    const {
      series,
      date,
      voucherNo,
      party,
      narration,
      items,
      transporter,
      gr_rrNo,
      vehicleNo,
      eInvoiceRequired,
      eWayBillRequired,
      modeOfTransport,
      billFrom,
      billTo,
      distance,
      eWayBillDetails,
      eInvoiceDetails,
    } = req.body;

    // Validate that required fields are provided
    if (!series || !date || !voucherNo || !party || !items || !billFrom || !billTo) {
      return res.status(400).json({
        message: 'Please provide all the required fields (series, date, voucherNo, party, items, billFrom, billTo)',
      });
    }

    // Calculate the price and amount for each item
    const updatedItems = items.map(item => {
      const discountAmount = (item.discountPercentage / 100) * item.listPrice;
      const price = item.listPrice - discountAmount;
      const taxAmount = (item.taxPercentage / 100) * price * item.quantity;
      const amount = price * item.quantity + taxAmount;

      return {
        ...item,
        discountAmount,
        price,
        taxAmount,
        amount
      };
    });

    // Create a new sales transaction object
    const newSale = new SalesModel({
      series,
      date,
      voucherNo,
      party,
      narration,
      items: updatedItems, // Use the updated items
      transporter,
      gr_rrNo,
      vehicleNo,
      eInvoiceRequired,
      eWayBillRequired,
      modeOfTransport,
      billFrom,
      billTo,
      distance,
      eWayBillDetails,
      eInvoiceDetails,
    });

    // Save the new sales transaction to the database
    const savedSale = await newSale.save();

    // Return a success response
    res.status(201).json({
      message: 'Sales transaction created successfully',
      data: savedSale,
    });
  } catch (error) {
    console.error('Error creating sales transaction:', error);
    res.status(500).json({
      message: 'Error creating sales transaction',
      error: error.message,
    });
  }
};

// Export the function
module.exports = { createSales };
