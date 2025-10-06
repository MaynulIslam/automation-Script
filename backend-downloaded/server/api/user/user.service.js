const jwt = require("jsonwebtoken");
const fs = require("fs");

const common = require('../../util/common');
const constant = require('../../util/constant');
const userDAL = require('./user.helper');
const moduleDAL = require('../module/module.helper');

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userDAL.getUser(id);
    if (!user) {
      return common.sendResponse(res, constant.requestMessages.USER_NOT_FOUND, false, 404);
    }
    delete user.password;
    return common.sendResponse(res, user, true, 200);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER, false, 500);
  }
}

exports.getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userDAL.getUsers();

    common.sendResponse(res, users, true, 200);
  } catch (error) {
    console.error('Error retrieving users:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USERS, false, 500);
  }
}

exports.insertUser = async (req, res) => {
  try {
    // Extract data from the request body
    const { first_name, last_name, email, password, mobile, user_name, user_type, status } = req.body;
    // Create the user record in the database
    const newUser = await userDAL.insertUser({ first_name, last_name, email, password: await common.hashPassword(password), mobile, user_name, user_type, status });

    // If user is admin (user_type = 1), assign all modules
    if (user_type === 1 || user_type === '1') {
      try {
        const allModules = await moduleDAL.getAllModules();
        const moduleIds = allModules.map(module => module.id);
        await moduleDAL.updateUserModules(newUser.id, moduleIds);
        console.log(`Assigned all modules to admin user ${newUser.id}`);
      } catch (moduleError) {
        console.error('Error assigning modules to admin user:', moduleError);
      }
    }

    // Return a success response with the newly created user data
    common.sendResponse(res, newUser, true, 201, constant.requestMessages.CREATED_USER_SUCCESSFULLY);
  } catch (error) {
    // If there's an error during the insertion process, handle it here
    console.error('Error inserting user:', error);
    common.sendResponse(res, constant.requestMessages.FAILED_TO_INSERT_USER, false, 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, mobile, user_name, user_type, status } = req.body;

    // Find the user in the database based on the provided ID
    let user = await userDAL.getUser(id);

    if (!user) {
      return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER, false, 404);
    }
    
    // Prepare update data
    const updateData = {
      first_name,
      last_name,
      email,
      mobile,
      user_name,
      user_type,
      status
    };
    
    // Only update password if a new one is provided
    if (password && password.trim() !== '') {
      updateData.password = await common.hashPassword(password);
    }
    
    console.log('Updating user with data:', updateData);
    
    // Save the updated user record to the database
    const updatedUser = await userDAL.updateUser(id, updateData);

    // If user is being updated to admin (user_type = 1), assign all modules
    if (user_type === 1 || user_type === '1') {
      try {
        const allModules = await moduleDAL.getAllModules();
        const moduleIds = allModules.map(module => module.id);
        await moduleDAL.updateUserModules(user.id, moduleIds);
        console.log(`Assigned all modules to admin user ${user.id}`);
      } catch (moduleError) {
        console.error('Error assigning modules to admin user:', moduleError);
      }
    }

    // Get the updated user without password
    const userResponse = updatedUser.toJSON();
    delete userResponse.password;
    
    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.USER_UPDATED_SUCCESSFULLY,
      user: userResponse,
    }, true, 200);
  } catch (error) {
    console.error('Error updating user:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_USER_UPDATE, false, 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user in the database based on the provided ID
    const user = await userDAL.getUser(id);

    if (!user) {
      return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_USER, false, 404);
    }

    // Check if user type is protected from deletion
    // Protected types: 1 (Admin), 3 (Service Technician), 4 (Guest)
    // Only user type 2 (User) can be deleted
    const protectedUserTypes = [1, 3, 4];
    if (protectedUserTypes.includes(Number(user.user_type))) {
      return common.sendResponse(res, 'This user type cannot be deleted. Only regular users can be deleted.', false, 403);
    }

    // Delete the user from the database
    await userDAL.deleteUser(id);

    common.sendResponse(res, {
      success: true,
      message: constant.requestMessages.USER_DELETED_SUCCESSFULLY,
    }, true, 200);
  } catch (error) {
    console.error('Error deleting user:', error);
    common.sendResponse(res, constant.requestMessages.ERROR_USER_DELETE, false, 500);
  }
};

exports.login = async (request, res) => {
  try {
    const { user_name, password } = request.body;

    // Check if the request body contains valid user_name and password
    const isValidObj = common.validateObject([request.body]);
    const isValidParams = common.validateParams([user_name, password]);

    if (!isValidObj || !isValidParams) {
      return common.sendResponse(res, constant.userMessages.INVALID_REQUEST_TO_SIGN_IN_USER, false, 400);
    } else {
      // Find the user with the provided user_name
      const user = await userDAL.getUserByUserName(user_name);
      if (user) {
        console.log('user--->', user.toJSON());
        // Validate the password
        const validatePassword = await common.validatePassword(password, user.password);

        if (validatePassword.status) {
          // Password is valid, generate JWT token
          const privateKey = fs.readFileSync(`${appRoot}/server/security/jwtRS256.key`);
          const token = jwt.sign({ user_id: user.id, user_name: user.user_name }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
          });

          // Get user data without password
          const userData = user.toJSON();
          delete userData.password;

          const values = { key: "user", data: {...userData, token}, message: constant.userMessages.USER_SIGNED_IN_SUCCESSFUL };
          // await createSequelizeConnection();
          return common.sendObjectResponse(
            res,
            values,
            true,
            200
          );
        } else {
          return common.sendResponse(res, constant.userMessages.INVALID_PASSWORD, false, 200);
        }
      } else {
        return common.sendResponse(res, constant.userMessages.USER_NOT_EXIST_WITH_EMAIL, false, 200);
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    return common.sendResponse(res, constant.userMessages.FAILED_TO_SIGN_IN_USER, false, 500);
  }
};

exports.verifyAccessToken = async function (request, response) {
  console.log("settings.service -> verifyAccessToken");
  const isValidObj = common.validateObject([request.body]);
  const isValidParams = common.validateParams([request.body.token]);
  if (!isValidObj || !isValidParams) {
      return common.sendResponse(response, constant.userMessages.ERROR_INVALID_REQUEST_TO_VERIFY_TOKEN, false, 400)
  } else {
      const publicKey = fs.readFileSync(`${appRoot}/server/security/jwtRS256.key.pub`);

      return jwt.verify(request.body.token, publicKey, function(err, decoded) {
          if(err){
              if(err.name && err.name === 'TokenExpiredError'){
                  return common.sendResponse(response, {...constant.requestMessages.ERR_EXPIRED_AUTH_TOKEN, active: false }, false, 401)
              } else {
                  return common.sendResponse(response, {...constant.requestMessages.UNKNOWN_AUTH_ERRR, ...decoded}, false, 401)
              }
          } else {
              decoded.active = true;
              return common.sendResponse(response, decoded, true, 200)
          }
      });
  }
}