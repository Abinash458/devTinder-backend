const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateProfileEditField = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateProfileEditData = (req) => {
  const { age, gender, photoUrl, about, skills } = req?.body;

  const allowedGender = ["male", "female", "others"];

  if (age && age < 18) {
    throw new Error("Age is not valid");
  } else if (gender && !validator.isIn(gender, allowedGender)) {
    throw new Error("Gender is not valid");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("PhotoUrl is not valid");
  } else if (about && !validator.isLength(about, { min: 0, max: 500 })) {
    throw new Error("About should contain maximum 500 letters");
  } else if (skills && skills.length > 10) {
    throw new Error("Maxmimum 10 skills allowed");
  }
};

module.exports = {
  validateSignUpData,
  validateProfileEditField,
  validateProfileEditData,
};
