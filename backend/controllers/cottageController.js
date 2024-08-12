const Cottage = require("../models/cottageModel");
const dotenv = require("dotenv");

dotenv.config();

//fucntion to get Information about a specific cottage
exports.CottageInfo = async function (req, res) {
  const { caregiver_id } = req.params;

  try {
    const cottage = await Cottage.cottageInfo(caregiver_id);
    res.status(200).json({ cottage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting cottage information" });
  }
};

//function to get all the people in a specific cottage
exports.AllPeople = async function (req, res) {
  const { cottage_id } = req.params;

  try {
    const cottage = await Cottage.AllPeople(cottage_id);
    res.status(200).json({ cottage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting All People in the cottage" });
  }
};

//fucntion to get the caregivers information
exports.CaregiverInfo = async function (req, res) {
  const { id } = req.params;

  try {
    const caregiver = await Cottage.CaregiverInfo(id);
    res.status(200).json({ caregiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting caregiver information" });
  }
};
