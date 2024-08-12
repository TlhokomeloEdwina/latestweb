const Visitation = require("../models/visitModel");
const User = require("../models/userModel");

exports.createVisit = async function (req, res) {
  const { resident_id, family_id, reason, visit_date, Duration } = req.body;

  console.log(req.body);

  try {
    const newVist = new Visitation(
      resident_id,
      family_id,
      reason,
      visit_date,
      Duration
    );
    const id = await Visitation.createVisit(newVist);
    res.status(201).json({ message: "Visitation submitted" });

    if (!checkPassoutRequestTime(req.body.visit_date)) {
      const visit = await Visitation.updateVisit(
        id.insertId,
        "Declined",
        "Time out of bound"
      );

      console.log(visit);
      const newVisit = await Visitation.getVisit(id.insertId);

      await sendPushNotificationToResident(
        newVisit.family_id,
        newVisit.status,
        "Retirement home will be closed"
      );
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message:
        "Error submitting Visitation, Check your information and try again",
    });
  }
};

exports.getAllVisitation = async function (req, res) {
  try {
    const Visits = await Visitation.getAllVisitation();

    res.status(200).json({ Visits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting Visits" });
  }
};

exports.getFamilyVisits = async function (req, res) {
  const { id } = req.params;

  try {
    const Visits = await Visitation.getFamilyVisit(id);
    res.status(200).json({ Visits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting Family Visits" });
  }
};

exports.updateVisits = async function (req, res) {
  const { id, status } = req.params;

  try {
    const Visits = await Visitation.updateVisit(id, status);

    const newVisit = await Visitation.getVisit(id);

    console.log("Changed Visit", newVisit);

    await sendPushNotificationToResident(
      newVisit.family_id,
      newVisit.status,
      "This is the reason"
    );

    res.status(200).json({ message: "Succesfully update the Visit status" });
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
      title: "Visitation Request Update",
      body: `Your visit request has been ${status.toLowerCase()}.`,
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
