const { User } = require('../../model');

const insertUser = async (data) => {
  return await User.create(data);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await user.update(data);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await user.destroy();
};

const getUser = async (id) => {
  return await User.findByPk(id);
};

const getUserByUserName = async (user_name) => {
  return await User.findOne({ where: { user_name } });
};

const getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['id', 'ASC']]
  });
};

module.exports = {
  insertUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByUserName
};