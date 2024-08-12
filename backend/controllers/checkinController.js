const Checkin = require("../models/checkinModel");

// creates checkin record
exports.createCheckin = async function (req, res) {
  const { resident_id, caregiver_id } = req.body;
  try {
    const checkin = await Checkin.createCheckin(resident_id, caregiver_id);
    res.status(201).json({ message: "checkin created", checkin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error creating checkin` });
  }
};
// returns checkin record for selected date
exports.getCheckinbyresident = async function (req, res) {
  const resident_id = req.params.resident_id;
  try {
    const checkins = await Checkin.getResidentCheckins(resident_id);
    res.status(200).json({ checkins });
  } catch (error) {
    res.status(500).json({ message: `Error fetching checkins` });
  }
};

// gets all checkins for resident on admin page
exports.getResidentCheckins = async function (req, res) {
  const residentId = req.params.residentId;
  try {
    const checkins = await Checkin.getResidentCheckins(residentId);
    res.status(200).json({ checkins });
  } catch (error) {
    res.status(500).json({ message: `Error fetching checkins` });
  }
};

//submits resident checkin
exports.submitCheckin = async function (req, res) {
  const { question_id, selected_option, checkin_id, score } = req.body;
  try {
    await Checkin.submitCheckIn(
      question_id,
      selected_option,
      checkin_id,
      score
    );
    res.status(201).json({ message: "response added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error adding response` });
  }
};
//returns all checkins
exports.getcheckins = async function (req, res) {
  try {
    const checkins = await Checkin.getCheckins();
    res.status(200).json({ checkins });
  } catch (error) {
    res.status(500).json({ message: `Error fetching responses` });
  }
};
//returns checkin of specific resident
exports.getcheckinbyId = async function (req, res) {
  const checkin_id = req.params.checkin_id;
  try {
    const checkin = await Checkin.getCheckinByID(checkin_id);
    res.status(200).json({ checkin });
  } catch (error) {
    res.status(500).json({ message: `Error fetching checkins` });
  }
};
// gets mood scores of checkin
exports.getCheckinmoods = async function (req, res) {
  const checkinId = req.params.checkinId;
  try {
    const scores = await Checkin.getCheckinmoods(checkinId);
    res.status(200).json({ scores });
  } catch (error) {
    res.status(500).json({ message: `Error fetching checkins` });
  }
};
//gets caregiver checkins for admin
exports.getCaregiverCheckins = async function (req, res) {
  const { userId } = req.params;
  try {
    const checkins = await Checkin.getCaregivercheckins(userId);
    res.status(200).json({ checkins });
  } catch (error) {
    res.status(500).json({ message: `Error fetching checkins` });
  }
};
// resident info using checkin
exports.residentInfo = async function (req, res) {
  const checkin_id = req.params.checkin_id;
  try {
    const resident = await Checkin.getResidentInfo(checkin_id);
    res.status(200).json({ resident });
  } catch (error) {
    res.status(500).json({ message: `Error fetching responses` });
  }
};
// check if the resident completed their checkin
exports.ischeckindone = async function (req, res) {
  const { id } = req.params;
  console.log("Id from params", id);
  try {
    const newCheckin = await Checkin.checkindone(id);
    console.log("This is the checkin", newCheckin);
    res.status(200).json({ newCheckin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error occured fetching checkin" });
  }
};

// returns checkin record
exports.getCheckin = async function (req, res) {
  const { residentId } = req.params;
  try {
    const checkin = await Checkin.getCheckin(residentId);
    res.status(200).json(checkin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching checkin` });
  }
};
// checkin records  using resident id
exports.getcheckinResponses = async function (req, res) {
  const { userId } = req.params;
  try {
    const checkins = await Checkin.getCheckinResponses(userId);
    res.status(200).json({ checkins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching checkin` });
  }
};

exports.getResidentDailyCheckin = async function (req, res) {
  const { id } = req.params;

  try {
    const newCheckin = await Checkin.getResidentDailyCheckin(id);
    res.status(200).json({ newCheckin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching daily checkin" });
  }
};
