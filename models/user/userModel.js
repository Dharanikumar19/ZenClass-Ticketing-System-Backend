const Users = require("./userSchema");

const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    Users(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};


const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;

    try {
      Users.findOne({ email }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updatePassword = (email, newhashedPass) => {
  return new Promise((resolve, reject) => {
    try {
      Users.findOneAndUpdate(
        { email },
        {
          $set: { password: newhashedPass },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};



 module.exports = {
  insertUser,
  getUserByEmail,
  updatePassword,
};