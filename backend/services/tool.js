var UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//create admin
var createadmin = () => {
  const password = "<password_here>";

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      var tempdata = new UserModel({
        name: "<Some_Name",
        password: hash,
        emailid: "<Some_Email>",
        contact: "<Some_Contact>",
        type: "ADMIN",
      });

      tempdata
        .save()
        .then(() => console.log("Admin created"))
        .catch((err) => console.log("err1", err));
    })
    .catch((err) => console.log("err2", err));
};

var hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => resolve(hash))
      .catch((err) => reject(err));
  });
};

module.exports = {
  createadmin,
  hashPassword,
};
