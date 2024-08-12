const Review = require("../models/reviewModel");

//Fucntion to make a review for the alert
exports.createReview = async function (req, res) {
  const { description, alert_id, caregiver_id } = req.body;

  try {
    const newReview = new Review(description, alert_id, caregiver_id);
    await Review.createReview(newReview);
    res.status(201).json({ message: "Review succesfully done" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating a review" });
  }
};

//Function to get a review for a specific alert
exports.getAlertReview = async function (req, res) {
  const { id } = req.params;

  try {
    const review = await Review.getAlertReview(id);
    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching review for this alert" });
  }
};
