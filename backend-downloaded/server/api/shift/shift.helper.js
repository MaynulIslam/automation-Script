const { Shift } = require('../../model');

const getAllShifts = async () => {
  return Shift.findAll({ order: [['id', 'ASC']] });
};

const getShiftById = async (id) => {
  return Shift.findByPk(id);
};

const insertShift = async (data) => {
  return Shift.create(data);
};

const updateShift = async (id, data) => {
  const shift = await Shift.findByPk(id);
  if (!shift) return null;
  await shift.update(data);
  return shift;
};

const deleteShift = async (id) => {
  const shift = await Shift.findByPk(id);
  if (!shift) return null;
  await shift.destroy();
  return true;
};

module.exports = {
  getAllShifts,
  getShiftById,
  insertShift,
  updateShift,
  deleteShift
}; 