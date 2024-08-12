const db = require("../data/db");

class Review {
  // adds review after resident completed checkin
  static async addReview(checkin_id, review) {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into checkinreview (checkin_id,review) values (?,?)",
        [checkin_id, review],
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
  // fetches review for each resident
  static async getCheckinReview(checkinId) {
    return new Promise((resolve, reject) => {
      db.query(
        "select  u.first_name, rw.review, rw.datecreated from checkinreview rw join checkin c on rw.checkin_id = c.id join user u on c.caregiver_id = u.id where c.id = ?",
        [checkinId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results[0]);
        }
      );
    });
  }
  // fetch reviews done by specific caregiver
  static async getReviewsByCaregiverId(caregiver_id) {
    return new Promise((resolve, reject) => {
      db.query(
        " select u.first_name as caregiver, r.review from checkinreview r join checkin c on r.checkin_id = c.id join user u on c.caregiver_id = u.id where u.id = ?",
        [caregiver_id],
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

  // fetch resident review based on specific date
  // static async getReviewsByDate(resident_id, date) {
  //     return new Promise((resolve, reject) => {
  //         db.query('select * from checkinreview where resident_id = ? and datecreated = ?', [resident_id, date], (err, result) => {
  //             if (err) {
  //                 reject(err);
  //                 return;
  //             }
  //             resolve(result);
  //         });
  //     });
  // }
}

module.exports = Review;
