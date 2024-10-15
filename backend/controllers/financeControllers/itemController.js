const itemSchema = require('../../model/financeModel/itemModel');
const mongoose = require('mongoose');
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const connectionCache = {};

exports.createItem = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const Item = connectionCache[orgDbName].model('Item', itemSchema);

  try {
    const {
      name,
      printName,
      alias,
      openingStockQuantity,
      openingStockValue,
      unit,
      hsn_code,
      tax_category,
      Group_item,
      specification
    } = req.body;

    const checkExistItemName = await Item.findOne({ name: name, isDelete: false });
    const checkExistItemAlias = await Item.findOne({ alias: alias, isDelete: false });

    if (checkExistItemName || checkExistItemAlias) {
      return res.status(400).json({
        message: "Item name or alias already exists",
      });
    }

    const item = new Item({
      name,
      printName,
      alias,
      openingStockQuantity,
      openingStockValue,
      unit,
      hsn_code,
      tax_category,
      Group_item,
      specification
    });

    const response = await item.save();
    res.status(201).json({
      message: "Item created successfully",
      response
    });

  } catch (error) {
    console.log("Error in createItem:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

exports.getAllItem = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const Item = connectionCache[orgDbName].model('Item', itemSchema);

  try {
    const response = await Item.find({ isDelete: false });
    res.status(200).json({
      message: "Item list fetched successfully",
      response
    });
  } catch (error) {
    console.log("Error in getAllItem:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

exports.modifyItem = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const Item = connectionCache[orgDbName].model('Item', itemSchema);

  try {
    const id = req.params.id;
    const checkItem = await Item.findById(id);

    if (!checkItem) {
      return res.status(400).json({
        message: "Item not found"
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Item updated successfully",
      updatedItem
    });

  } catch (error) {
    console.log("Error in modifyItem:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

exports.deleteItem = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const Item = connectionCache[orgDbName].model('Item', itemSchema);

  try {
    const id = req.params.id;
    const checkItem = await Item.findById(id);

    if (!checkItem) {
      return res.status(400).json({
        message: "Item not found"
      });
    }

    checkItem.isDelete = true;
    const response = await checkItem.save();

    res.status(200).json({
      message: "Item deleted successfully",
      response
    });

  } catch (error) {
    console.log("Error in deleteItem:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

exports.getItemById = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const Item = connectionCache[orgDbName].model('Item', itemSchema);
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ "message": "There is no item for this request" });
  }
 
  try {
    const item = await Item.findById(id);
 
    if (!item) {
      return res.status(404).json({ "message": "Item not found" });
    }
 
    return res.status(200).json({ "message": "Item retrieved successfully", response: item });
  } catch (e) {
    return res.status(500).json({ "message": "There was an error retrieving the item from the database", error: e.message });
  }
};
