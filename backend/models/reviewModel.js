const db = require("../data/db");

class Review {
  constructor(description, alert_id, caregiver_id) {
    this.time = new Date();
    this.description = description;
    this.alert_id = alert_id;
    this.caregiver_id = caregiver_id;
  }

  //Make an alert
  static async createReview(newReview) {
    return new Promise((resolve, reject) => {
      db.query(
        "Insert into Review(time,description,alert_id,caregiver_id) values (?,?,?,?)",
        [
          newReview.time,
          newReview.description,
          newReview.alert_id,
          newReview.caregiver_id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  }

  //get a specific alert
  static async getAlertReview(alert_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * from review where alert_id = ?",
        [alert_id],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result[0]);
        }
      );
    });
  }
}

module.exports = Review;
