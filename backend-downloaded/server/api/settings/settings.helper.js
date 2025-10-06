const DatabaseHelper = require('../../util/databaseHelper');
const { Settings } = require('../../model');

const settingsHelper = new DatabaseHelper(Settings);

const insertSettings = async(data)=>{
  return await settingsHelper.create(data)
}

const updateSettings = async( id, data)=>{
  return await settingsHelper.update(id, data)
}

const deleteSettings = async(id)=>{
  return await settingsHelper.delete(id)
}

const getSettings = async(id)=>{
  return await settingsHelper.findByPk(id);
}

const getAllSettings = async()=>{
  return await settingsHelper.findAll();
}


module.exports = {
  insertSettings,
  updateSettings,
  deleteSettings,
  getSettings,
  getAllSettings
}