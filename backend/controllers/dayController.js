const Day = require("../models/dayModel");

exports.sendDayActivity = async function (req, res) {
  const {id, act_id} = req.body;
  try {  
    Day.sendDayActivity({
      day_id: id,
      act_id: act_id,
  });
  
  console.log("Req: ", req.body);
  res.status(201).json({ message: "Day activity edited successfully" });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to edit day activity",
    });
  }
};

exports.getDayActivity = async function (req, res) {
  const day_id = req.params.id;
  try {
    const dayActivity = await Day.getDayActivity(day_id);
    const formatedActivities = JSON.stringify(dayActivity, null, 2);
    res.status(200).type("json").send(formatedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured!" });
  }
};

exports.getDays = async function (req, res) {
  try {
    const days = await Day.getDays();
    const formatedDays = JSON.stringify(days, null, 2);
    res.status(200).type("json").send(formatedDays);
  } catch (error) {
    res.status(500).json({ message: "Could not get days!" });
  }
};
