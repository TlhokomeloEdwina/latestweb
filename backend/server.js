const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./data/db");
const app = express();

// Controllers
const userController = require("./controllers/userController");
const cottageController = require("./controllers/cottageController");
const alertController = require("./controllers/alertController");
const reviewController = require("./controllers/reviewController");
const eventController = require("./controllers/eventController");
const activityController = require("./controllers/activityController");
const dayController = require("./controllers/dayController");
const passoutsController = require("./controllers/passoutController");
const visitController = require("./controllers/visitController");
const checkinController = require("./controllers/checkinController");
const questionController = require("./controllers/questionsController");
const checkinreviewController = require("./controllers/checkinReviewController");

//Middlware
const verifyToken = require("./middleware/auth");

app.use(bodyParser.json());
app.use(cors());

//User management routes
app.post("/user", userController.createUser);
app.put("/user/:id", userController.updateUser);
app.post("/updateToken", userController.UpdateToken); //Update device token
app.get("/AllUsers", userController.AllUsers);
app.post("/login", userController.loginUser); //Login route

//Cottage routes
app.get("/cottage/:caregiver_id", verifyToken, cottageController.CottageInfo);
app.get("/cottagePeople/:cottage_id", verifyToken, cottageController.AllPeople);
app.get("/caregiverInfo/:id", cottageController.CaregiverInfo);

//Resident and Family member routes
app.post("/addFamilyResident", userController.addResident_Family); //Connectinf residet and family member
app.get("/familyResident/:id", userController.getResidentInfo);

//Caregiver routes
app.get("/caregiverInfo/:id", cottageController.CaregiverInfo); //Specific caregiver information
app.get("/AllCaregivers", userController.AllCaregivers); //Caregivers

//Alerts routes
app.post("/alert", alertController.createAlert);
app.get("/residentAlerts/:id", alertController.residentAlerts);
app.get("/caregiverAlerts/:id", alertController.caregiverAlerts);

//Review(Alert) routes
app.post("/review", reviewController.createReview);
app.get("/alertReview/:id", reviewController.getAlertReview);

//Event
app.post("/event", eventController.createEvent);
app.post("/eventEdit", eventController.editEvent);
app.get("/events", eventController.getAllEvents);
app.get("/event/:date", eventController.getCurrentEvent);
//app.get("/event/:id", eventController.getEventById);

//Activity
app.post("/activity", activityController.createActivity);
app.post("/editActivity", activityController.editActivity);
app.get("/deleteActivity/:id", activityController.deleteActivity);
app.get("/activities/:id", activityController.getActivities);
app.get("/general-activities", activityController.getGeneralActivities);
app.get("/dayActivity/:id", dayController.getDayActivity);
app.post("/dayActivity", dayController.sendDayActivity);
app.post("/attendance", activityController.sendAttandance);
app.get("/days", dayController.getDays);

//passouts
app.post("/passouts", passoutsController.createPassout);
app.get("/passouts", passoutsController.getAllPassout);
app.get("/passouts/:id", passoutsController.getResidentPassout);
app.put("/passouts/:id/:status", passoutsController.updatePassout);

//Visits
app.post("/visits", visitController.createVisit);
app.get("/visits", visitController.getAllVisitation);
app.get("/visits/:id", visitController.getFamilyVisits);
app.put("/visits/:id/:status", visitController.updateVisits);

// checkin routes
app.post("/createCheckin", checkinController.createCheckin);
app.get("/checkindate/:id", checkinController.ischeckindone);
app.get("/getcheckin/:residentId", checkinController.getCheckin);
app.post("/submitcheckin", checkinController.submitCheckin);
app.get("/checkins", checkinController.getcheckins);
app.get("/checkinbyId/:checkin_id", checkinController.getcheckinbyId);
app.get(
  "/checkinbyresident/:resident_id",
  checkinController.getCheckinbyresident
);
/*app.get("/cargiverCheckins/:userId", checkinController.CaregiverCheckins);*/
app.get("/residentInfo/:checkin_id", checkinController.residentInfo);
app.get("/residentCheckins/:residentId", checkinController.getResidentCheckins);
app.get("/checkinmoods/:checkinId", checkinController.getCheckinmoods);
app.get("/caregiverCheckins/:userId", checkinController.getCaregiverCheckins);
app.get("/ResidentDailyCheckin/:id", checkinController.getResidentDailyCheckin);

//questions
//app.post("/question",questionController.addQuestion);
app.post("/addquestion", questionController.addQuestion);
app.delete("/deletequestion/:questionId", questionController.deleteQuestion);
app.get("/questions", questionController.getQuestions);
app.put("/question/:questionId", questionController.updateQuestion);
app.get("/question/:questionId", questionController.getQuestion);

//checkinrevew
app.post("/reviewcheckin", checkinreviewController.addReview);
app.get("/checkinreview/:checkinId", checkinreviewController.getCheckinReview);

//Reports
app.get("/wellbeing", (req, res) => {
  const date = req.query.date;

  const query = `
    SELECT
      q.mood_type,
      AVG(res.score) AS avg_score
    FROM
      checkin c
    JOIN
      responses res ON c.id = res.checkin_id
    JOIN
      questions q ON res.question_id = q.id
    WHERE
      DATE(c.datecreated) = ?
    GROUP BY
      q.mood_type;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
