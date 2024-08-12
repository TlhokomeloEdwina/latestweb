const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

//function to make a new user
exports.createUser = async function (req, res) {
  const {
    id_number,
    first_name,
    last_name,
    gender,
    contact_number,
    password,
    email,
    image_url,
    expoDeviceToken,
    userType,
    sassa_number,
    room_number,
    cottage_id,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //hashing password for safety

    const newUser = new User(
      id_number,
      first_name,
      last_name,
      gender,
      contact_number,
      email,
      hashedPassword,
      image_url,
      expoDeviceToken,
      userType
    );
    await User.createUser(newUser);
    switch (userType) {
      case "Admin":
        await User.saveAdmin(newUser);
        res.status(201).json({ message: "Admin Profile created succesful" });
        break;
      case "Caregiver":
        await User.saveCaregiver(newUser);
        res
          .status(201)
          .json({ message: "Caregiver Profile created succesful" });
        break;
      case "Resident":
        await User.saveResident(newUser, sassa_number, room_number, cottage_id);
        res.status(201).json({ message: "Resident Profile created succesful" });
        break;
      case "Family_Member":
        await User.saveFamily_Member(newUser);
        res
          .status(201)
          .json({ message: "Family Member Profile created succesful" });
        break;
      default:
        console.log("Wrong user Type");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating a user" });
  }
};

// function to Login
exports.loginUser = async function (req, res) {
  console.log("Login request body: ", req.body);
  const { email, password } = req.body;

  try {
    const newUser = await User.getUserByEmail(email);
    if (newUser) {
      const passwordMatch = await bcrypt.compare(password, newUser.password); //comparing given password and hashed one
      if (passwordMatch) {
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email },
          process.env.SECRET_KEY,
          { expiresIn: "3m" }
        );
        res.status(200).json({ message: "Login successful.", token, newUser });
      } else {
        res.status(401).json({ message: "Invalid email or password." });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in." });
  }
};

// exports.loginUser = async function (req, res) {
//   const { email, password } = req.body;

//   try {
//     const newUser = await User.getUserByEmail(email);
//     if (newUser && newUser.password === password) {
//       const token = jwt.sign(
//         { id: newUser.id, email: newUser.email },
//         process.env.SECRET_KEY,
//         { expiresIn: "3m" }
//       );
//       res.status(200).json({ message: "Login successful.", token, newUser });
//     } else {
//       res.status(401).json({ message: "Invalid email or password." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging in." });
//   }
// };

//function to get all users
exports.AllUsers = async function (req, res) {
  try {
    const Users = await User.getAllUsers();
    res.status(200).json({ Users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching all users" });
  }
};

//function to update a specific user
exports.updateUser = async function (req, res) {
  const { id } = req.params;
  const {
    id_number,
    first_name,
    last_name,
    gender,
    contact_number,
    password,
    email,
    image_url,
    expoDeviceToken,
    userType,
    sassa_number,
    room_number,
    cottage_id,
  } = req.body;

  try {
    const updateUser = {
      id_number,
      first_name,
      last_name,
      gender,
      contact_number,
      email,
      image_url,
      expoDeviceToken,
      userType,
    };
    await User.updateUser(id, updateUser);
    res.status(200).json({ message: "Succesfully update the User" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user information" });
  }
};

//function to update a device token
exports.UpdateToken = async function (req, res) {
  const { id, token } = req.body;
  try {
    await User.updateNotificationToken(id, token);
    res.status(200).json({ message: "Notification token updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating device notification token" });
  }
};

//function to get a resident information
exports.getResidentInfo = async function (req, res) {
  console.log(
    "This is the request for getting resident information ",
    req.params
  );
  const { id } = req.params;
  try {
    const resident = await User.getResidentInfomration(id);
    res.status(200).json({ resident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting resident information" });
  }
};

//function to add resident and family
exports.addResident_Family = async function (req, res) {
  console.log(
    "This is the request body for adding resident and family_member, ",
    req.body
  );
  const { id_number, id } = req.body;

  try {
    const resident = await User.getResidentByIdNumber(id_number);
    console.log("This is the user with the id:", resident);
    const AddUser = await User.addFamily_Resident(resident.id, id);
    res
      .status(200)
      .json({ message: "Succesfully added the resident and family member" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding resident and information" });
  }
};

//function to get a caregiver's information
exports.caregiverInfo = async function (req, res) {
  const { id } = req.params;

  try {
    const caregiver = await User.getCaregiverInfo(id);
    res.status(200).json({ caregiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching caregiver information" });
  }
};

//function to get all the caregivers
exports.AllCaregivers = async function (req, res) {
  try {
    const Caregivers = await User.getAllCaregiver();
    res.status(200).json({ Caregivers });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching all caregiver information" });
  }
};
