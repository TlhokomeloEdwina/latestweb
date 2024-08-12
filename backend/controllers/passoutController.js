const Passout = require("../models/passoutModel");
const User = require("../models/userModel");

exports.createPassout = async function (req, res) {
  const {
    resident_id,
    start_date,
    end_date,
    destination,
    reason,
    emergency_contact,
  } = req.body;

  console.log(req.body);

  try {
    const newPassout = new Passout(
      resident_id,
      start_date,
      end_date,
      destination,
      reason,
      emergency_contact
    );
    const id = await Passout.createPassout(newPassout);

    res.status(201).json({ message: "Passout submitted" });

    if (!checkPassoutRequestTime(req.body.start_date)) {
      const passOut = await Passout.updatePassout(
        id.insertId,
        "Declined",
        "Time out of bound"
      );

      const newPassout = await Passout.getPassout(id.insertId);

      await sendPushNotificationToResident(
        newPassout.resident_id,
        newPassout.status,
        "Retirement home will be closed"
      );
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Error submitting passout, Check your information and try again",
    });
  }
};

exports.getAllPassout = async function (req, res) {
  try {
    const Passouts = await Passout.getAllPasout();

    res.status(200).json({ Passouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting passouts" });
  }
};

exports.getResidentPassout = async function (req, res) {
  const { id } = req.params;

  try {
    const Passouts = await Passout.getResidentPassout(id);
    res.status(200).json({ Passouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting Resident passouts" });
  }
};

exports.updatePassout = async function (req, res) {
  const { id, status } = req.params;
  const { reason } = req.body;

  try {
    const Passouts = await Passout.updatePassout(id, status, reason);

    const newPassout = await Passout.getPassout(id);

    console.log("Changed pasosut", newPassout);

    await sendPushNotificationToResident(
      newPassout.resident_id,
      newPassout.status,
      ""
    );

    res.status(200).json({ message: "Succesfully update the passout status" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting passouts" });
  }
};

async function sendPushNotificationToResident(id, status, reason) {
  const token = await User.getNotificationToken(id);
  console.log("This is the token");
  let message = {};
  if (reason) {
    message = {
      to: token,
      sound: "default",
      title: "Passout Request Update",
      body: `Your passout request has been ${status.toLowerCase()}. Reason: ${reason}`,
      data: { url: "/passout-status", someData: "goes here" },
    };
  } else {
    message = {
      to: token,
      sound: "default",
      title: "Passout Request Update",
      body: `Your passout request has been ${status.toLowerCase()}.`,
      data: { url: "/passout-status", someData: "goes here" },
    };
  }
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const checkPassoutRequestTime = (requestDate) => {
  const requestTime = new Date(requestDate);
  const dayOfWeek = requestTime.getDay();
  const hourOfDay = requestTime.getHours();

  // Weekday hours: Monday to Friday, 8 AM to 4 PM
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isWithinWeekdayHours = hourOfDay >= 8 && hourOfDay < 16;

  // Weekend hours: Saturday and Sunday, 9 AM to 4 PM
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWithinWeekendHours = hourOfDay >= 9 && hourOfDay < 16;

  if (isWeekday && isWithinWeekdayHours) {
    return true;
  } else if (isWeekend && isWithinWeekendHours) {
    return true;
  } else {
    return false;
  }
};
