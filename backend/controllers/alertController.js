const Alert = require("../models/alertModel");
const Cottage = require("../models/cottageModel");
const User = require("../models/userModel");

// function to create an alert
exports.createAlert = async function (req, res) {
  const { alert_type, resident_id, caregiver_id } = req.body;

  try {
    const newAlert = new Alert(alert_type, resident_id, caregiver_id);
    await Alert.createAlert(newAlert);
    res.status(201).json({ message: "Alert Sent!" });

    await sendPushNotificationToResident(newAlert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating alerts" });
  }
};

//function to get all the residents alerts
exports.residentAlerts = async function (req, res) {
  const { id } = req.params;
  try {
    const alerts = await Alert.Resident_Alerts(id);
    res.status(200).json({ alerts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errror fetching alerts made by this resident" });
  }
};

//functions to get all the alerts made to this caregiver
exports.caregiverAlerts = async function (req, res) {
  const { id } = req.params;
  try {
    const alerts = await Alert.Caregiver_Alerts(id);
    res.status(200).json({ alerts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errror fetching alerts made by to this caregiver" });
  }
};

async function sendPushNotificationToResident(alert) {
  const user = await User.getResident(alert.resident_id);
  const caregiver = await Cottage.CaregiverInfo(user.id);

  let message = {};

  if (alert.alert_Type != "Emergency") {
    message = {
      to: caregiver.expoDeviceToken,
      sound: "default",
      title: ` Alert from ${user.first_name} ${user.last_name} Room : ${user.room_number}`,
      body: `${alert.alert_Type} Alert`,
    };
  } else {
    message = {
      to: caregiver.expoDeviceToken,
      sound: "default",
      title: `Emergency in room : ${user.room_number}`,
      body: `${user.first_name} ${user.last_name} made an Emergency Alert`,
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
