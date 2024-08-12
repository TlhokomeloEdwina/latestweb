const Review = require('../models/checkinreviewModel');
//adds a review for the residents checkin
exports.addReview = async function (req, res) {
    const { checkin_id, review } = req.body;
    try {
        await Review.addReview(checkin_id, review);
        res.status(201).json({ message: "review added" });
    } catch (error) {
        res.status(500).json({ message: `Error adding review` });
    }
}
// returns reviews by the resident 
exports.getCheckinReview = async function (req, res) {
    const checkinId = req.params.checkinId;
    try {
        const review = await Review.getCheckinReview(checkinId);
        res.status(201).json({ review });
    } catch (error) {
        res.status(500).json({ message: `Error fetching responses` });
    }
}

// returns reviews made by specific caregiver
exports.getCaregiverReviews = async function (req, res) {
    const caregiver_id = req.params.caregiver_id;
    try {
        const caregiver_reviews = await Review.getReviewsByCaregiverId(caregiver_id);
        res.status(201).json({ caregiver_reviews });
    } catch (error) {
        res.status(500).json({ message: `Error fetching responses` });
    }
}
// return review using specific date 
exports.getResidentReviewbydate = async function (req, res) {
    const { resident_id, date } = req.query;
    console.log(resident_id, date);
    try {
        const review = await Review.getReviewsByDate(resident_id, date);
        res.status(201).json({ review });
    } catch (error) {
        res.status(500).json({ message: `Error fetching responses` });
    }
}