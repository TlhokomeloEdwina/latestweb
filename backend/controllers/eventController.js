const Event = require("../models/eventModel");
const Activity = require("../models/activityModel");

exports.createEvent = async (req, res) => {
  console.log("Req:", req.body);
  const { id, name, date, description, stime, etime, activities, fam_recommend } = req.body;
  try {
    const event = new Event(
      id,
      name,
      date,
      description,
      stime,
      etime,
      fam_recommend
    );
    await Event.createEvent(event);
    activities &&
      (await Promise.all(
        activities?.map(async (act) => {
          const response = await fetch("http://localhost:3000/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: act.id,
              name: act.name,
              time: act.time,
              description: act.description,
              type: "Social",
              event_id: act.event_id,
            }),
          });
        })
      ));

    console.log("Req: ", req.body);

    res.status(201).json({ message: "New event created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to create an event",
    });
  }
};

exports.editEvent = async (req, res) => {
  const { id, name, date, description, stime, etime, activities, fam_recommend } = req.body;
  try {
    const event = new Event(
      id,
      name,
      date,
      description,
      stime,
      etime,
      fam_recommend
    );
    await Event.editEvent(event);
    activities &&
      (await Promise.all(
        activities?.map(async (act) => {
          const response = await fetch("http://localhost:3000/editActivity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: act.id,
              name: act.name,
              time: act.time,
              description: act.description,
              type: "Social",
              event_id: act.event_id,
            }),
          });
        })
      ));

    res.status(201).json({ message: "Event editted succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occured while trying to create an event",
    });
  }
};

exports.getAllEvents = async function (req, res) {
  try {
    const events = await Event.getAllEvents();
    const formatedEvents = JSON.stringify(events, null, 2);
    res.status(200).type("json").send(formatedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured!" });
  }
};

exports.getEventById = async function (req, res) {
  try {
    const id = req.params.id;
    const event = await Event.getEventById(id);
    const formatedEvent = JSON.stringify(event, null, 2);
    res.status(200).type("json").send(formatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Could not get an event!" });
  }
};

exports.getCurrentEvent = async function (req, res) {
  const reqDate = req.params.date;
  const date = new Date(reqDate);

  const day = date.getMonth() + 1;
  const formattedDate = `${date.getFullYear()}-${day
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  try {
    const event = await Event.getCurrentEvent(formattedDate);
    const formatedEvent = JSON.stringify(event, null, 2);
    res.status(200).type("json").send(formatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Couldn't get current event" });
  }
};
