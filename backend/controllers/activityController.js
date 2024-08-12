const Activity = require("../models/activityModel");
const Day = require("../models/dayModel");

exports.createActivity = async (req, res) => {
  const {  id, name, start_time,end_time, description, type, days} = req.body;
  try {
    const activity = new Activity( id, name, start_time,end_time, description, type);
    await Activity.createActivity(activity);
    res.status(201).json({ message: "New activity was created successfully" });
    
    if (days && days.length > 0) {
    await Promise.all(
      days.map(dayId => {
        return Day.sendDayActivity({ day_id: dayId, act_id: activity.id });
      })
    );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to create an activitys",
    });
  }
};

exports.editActivity = async (req, res) => {
  console.log("Act Reg: ", req.body);
  const {  id, name, start_time,end_time, description, type} = req.body;
  try {
    const activity = new Activity( id, name, start_time,end_time, description, type);
    await Activity.editActivity(activity);
    res.status(201).json({ message: "Activity was edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to create an activitys",
    });
  }
};

exports.deleteActivity = async (req, res) => {
  console.log("Act Reg: ", req.body);
  const id = req.params.id;
  try {
    await Activity.deleteActivity(id);
    res.status(201).json({ message: "Activity was deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to create an activitys",
    });
  }
};

exports.getGeneralActivities = async function (req, res) {
  try {
    const genActivities = await Activity.getGeneralActivities();
    const formatedActivities = JSON.stringify(genActivities, null, 2);
    res.status(200).type("json").send(formatedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured!" });
  }
};

exports.getActivities = async function (req, res) {
  const event_id = req.params.id;
  try {
    const acts = await Activity.getActivities(event_id);
    const formatedActivities = JSON.stringify(acts, null, 2);
    res.status(200).type("json").send(formatedActivities);
  } catch (error) {
    res.status(500).json({ message: "Could not get activities!" });
  }
};

exports.sendAttandance = async function (req, res) {
  console.log("This is the req body:", req.body);
  const { date, time, actId, careId, resident } = req.body.actAttendance;

  const attendance = {
    date: date,
    time: time,
    actId: actId,
    careId: careId,
    resident: resident,
  };
  console.log("This is the attendance in whole:", attendance);
  try {
    await Activity.sendAttendance(attendance);
    res.status(200).json({ message: "Attendance created" });
  } catch (error) {
    res.status(500).json({ message: "Could not create attendance!" });
  }
};
