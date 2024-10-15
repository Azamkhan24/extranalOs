const specificationSchema = require('../../model/financeModel/specificationModel');
const itemGroupSchema = require('../../model/financeModel/itemGroupModel');
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI;
const mongoose = require('mongoose');
const connectionCache = {};

exports.createGroup = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const specificationModel = connectionCache[orgDbName].model('Specification', specificationSchema);
  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  const session = await connectionCache[orgDbName].startSession();
  session.startTransaction();
  
  try {
    const { groupName, alias, primary, under, specification, furtherSubCategories } = req.body;
    let group;

    if (primary) {
      group = alias ? { groupName, alias, primary, specification } : { groupName, primary, specification };
    } else {
      if (!under) {
        await session.abortTransaction();
        return res.status(400).json({ message: "SubGroup must be under a parent group" });
      }

      const checkUnder = await itemGroup.findOne({ groupName: under }).session(session);
      if (!checkUnder || checkUnder.specification) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Parent group not found or further subcategories can't be added" });
      }

      checkUnder.dependencies += 1;
      await checkUnder.save({ session });
      group = alias
        ? { groupName, alias, hierarchyNo: checkUnder.hierarchyNo + 1, primary, under, specification }
        : { groupName, hierarchyNo: checkUnder.hierarchyNo + 1, primary, under, specification };
    }

    const newItemGroup = new itemGroup(group);
    const response = await newItemGroup.save({ session });

    if (specification) {
      const newSpecification = new specificationModel({
        sub_category_id: response._id,
        further_sub_categories: furtherSubCategories,
      });
      const responseSpecification = await newSpecification.save({ session });
      await session.commitTransaction();
      return res.status(201).json({ message: "Group created successfully", response, responseSpecification });
    }

    await session.commitTransaction();
    return res.status(201).json({ message: "Group created successfully", response });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in Creating Item Group", error);
    return res.status(500).json({ message: "Error in Creating Item Group", error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getAllItemGroup = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  
  try {
    const itemGroups = await itemGroup.find({ isDelete: false });
    res.status(200).json({ success: true, message: 'Data fetch successful', itemGroups });
  } catch (error) {
    console.log('Error message', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.modifyItemGroup = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const specificationModel = connectionCache[orgDbName].model('Specification', specificationSchema);
  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  const session = await connectionCache[orgDbName].startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    const { groupName, alias, primary, under, specification, furtherSubCategories } = req.body;

    if (alias) {
      const existingAlias = await itemGroup.findOne({ alias, isDelete: false }).session(session);
      if (existingAlias) {
        await session.abortTransaction();
        return res.status(400).json({ message: "This alias is already in use" });
      }
    }

    const group = await itemGroup.findById(id).session(session);
    if (!group) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Group not found" });
    }

    if (under) {
      const findUnder = await itemGroup.findOne({ groupName: under }).session(session);
      if (findUnder.hierarchyNo >= group.hierarchyNo) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Hierarchy No is not valid" });
      }
    }

    if (groupName !== group.groupName) {
      const getAllGroupDependent = await itemGroup.find({ under: group.groupName }).session(session);
      for (let i = 0; i < getAllGroupDependent.length; i++) {
        getAllGroupDependent[i].under = groupName;
        await getAllGroupDependent[i].save({ session });
      }
    }

    let groupData;
    if (primary) {
      groupData = alias ? { groupName, hierarchyNo: 0, alias, primary, specification } : { groupName, hierarchyNo: 0, alias: null, primary, specification };
    } else {
      if (!under) {
        await session.abortTransaction();
        return res.status(400).json({ message: "SubGroup must be under a parent group" });
      }

      const checkUnder = await itemGroup.findOne({ groupName: under }).session(session);
      if (!checkUnder || checkUnder.specification) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Parent group not found or further subcategories can't be added" });
      }

      if (under !== group.under) {
        const oldUnderGroup = await itemGroup.findOne({ groupName: group.under }).session(session);
        if (oldUnderGroup) {
          oldUnderGroup.dependencies = Math.max(oldUnderGroup.dependencies - 1, 0);
          await oldUnderGroup.save({ session });
        }
        checkUnder.dependencies += 1;
        await checkUnder.save({ session });
      }

      groupData = alias ? { groupName, alias, hierarchyNo: checkUnder.hierarchyNo + 1, primary, under, specification }
                        : { groupName, alias: null, hierarchyNo: checkUnder.hierarchyNo + 1, primary, under, specification };
    }

    const modifiedGroup = await itemGroup.findByIdAndUpdate(id, groupData, { new: true, session });
    let responseSpecification;

    if (specification === false) {
      const existingSpecification = await specificationModel.findOne({ sub_category_id: id }).session(session);
      if (existingSpecification) {
        existingSpecification.isDelete = true;
        responseSpecification = await existingSpecification.save({ session });
      }
    } else if (specification) {
      const existingSpecification = await specificationModel.findOne({ sub_category_id: id }).session(session);
      if (existingSpecification) {
        existingSpecification.further_sub_categories = furtherSubCategories;
        existingSpecification.isDelete = false;
        responseSpecification = await existingSpecification.save({ session });
      } else {
        const newSpecification = new specificationModel({
          sub_category_id: id,
          further_sub_categories: furtherSubCategories,
        });
        responseSpecification = await newSpecification.save({ session });
      }
    }

    const message = await UpdatedhierarchyNo(itemGroup, groupName, session);
    await session.commitTransaction();
    res.status(200).json({ message: "Group modified successfully", modifiedGroup, responseSpecification: responseSpecification || "No specification changes" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error in modifying Item Group", error: error.message });
  } finally {
    session.endSession();
  }
};

exports.deleteItemGroup = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const specificationModel = connectionCache[orgDbName].model('Specification', specificationSchema);
  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  const session = await connectionCache[orgDbName].startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    const group = await itemGroup.findById(id).session(session);
    if (!group) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Group not Found" });
    }

    if (group.specification) {
      await specificationModel.findOneAndDelete({ sub_category_id: id }).session(session);
    }

    if (group.dependencies) {
      await session.abortTransaction();
      return res.status(401).json({ message: "This Group can't be deleted because it has dependencies" });
    }

    if (group.under) {
      const findUnder = await itemGroup.findOne({ groupName: group.under }).session(session);
      if (!findUnder) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Under dependent group does not exist" });
      }
      findUnder.dependencies = Math.max(findUnder.dependencies - 1, 0);
      await findUnder.save({ session });
    }

    await itemGroup.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error in deletion", error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getGroupById = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  
  try {
    const id = req.params.id;
    const response = await itemGroup.findById(id);
    res.status(200).json({ success: true, message: "Fetched Successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getGroupSpecification = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);
  
  try {
    const response = await itemGroup.find({ specification: true });
    res.status(200).json({ message: 'Data Fetch Successful', response });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getSpecification = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const specificationModel = connectionCache[orgDbName].model('Specification', specificationSchema);

  try {
    const id = req.params.id;
    const response = await specificationModel.findOne({ sub_category_id: id });
    res.status(200).json({ message: 'Data Fetch Successful', response });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllGroupDependent = async (req, res) => {
  const orgDbName = req.cookies.dbConnection;

  if (!orgDbName) {
    return res.status(401).json({ message: "Please login First" });
  }

  if (!connectionCache[orgDbName]) {
    const dbUri = `${MONGO_ATLAS_URI}/${orgDbName}?retryWrites=true&w=majority`;
    const orgConnection = await mongoose.createConnection(dbUri, {});
    connectionCache[orgDbName] = orgConnection;
  }

  const itemGroup = connectionCache[orgDbName].model('ItemGroup', itemGroupSchema);

  try {
    const groupName = req.params.name;
    const response = await itemGroup.find({ under: groupName });
    res.status(200).json({ message: "Get All dependent group", response });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

