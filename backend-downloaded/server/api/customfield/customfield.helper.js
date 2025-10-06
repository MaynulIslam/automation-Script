const DatabaseHelper = require('../../util/databaseHelper');
const { Op } = require('sequelize');
const { CustomField } = require('../../model');

const customFieldHelper = new DatabaseHelper(CustomField);

const insertCustomField = async(data)=>{
  return await customFieldHelper.create(data)
}

const updateCustomField = async( id, data)=>{
  return await customFieldHelper.update(id, data)
}

const deleteCustomField = async(id)=>{
  return await customFieldHelper.delete(id)
}

const getCustomField = async(id)=>{
  return await customFieldHelper.findByPk(id);
}

const getAllCustomField = async (field_type = null) => {

  const criteria = {
    where: {
      id: { [Op.ne]: 0 }
    }
  };

  if (field_type) {
    criteria.where.field_type = field_type;
  }

  // Execute the query with the specified options
  return await customFieldHelper.findByCriteria(criteria);
};




module.exports = {
  insertCustomField,
  updateCustomField,
  deleteCustomField,
  getCustomField,
  getAllCustomField
}