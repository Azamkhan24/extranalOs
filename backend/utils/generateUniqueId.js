const count = require('../model/internalModel/countSchema')


const generateUniqueId = async({department, role}) => {
  try{
    
    const departmentCode = department?.substring(0,2)?.toUpperCase();
    const roleCode = role?.substring(0,2)?.toUpperCase();
    const updatedCount = await count.findOneAndUpdate(
      {},
      { $inc: { role: 1 } },
      {  new: true , upsert: true}

    )
    const number = updatedCount.role

    return `${roleCode}-${departmentCode}-${number}`;
  }catch(error){
    console.log(error);
  }
  
};

module.exports = { generateUniqueId };