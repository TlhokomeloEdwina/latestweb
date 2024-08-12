const db = require("../data/db");

class Visitation {
  constructor(resident_id, family_id, reason, visit_date, Duration) {
    this.resident_id = resident_id;
    this.family_id = family_id;
    this.reason = reason;
    this.visit_date = visit_date;
    this.Duration = Duration;
  }

  //Create a Visitation
  static async createVisit(newVist) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Visit (resident_id, family_id, reason, visit_date, Duration,status) values (?,?,?,?,?,?)",
        [
          newVist.resident_id,
          newVist.family_id,
          newVist.reason,
          newVist.visit_date,
          newVist.Duration,
          "Pending",
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

  //get all visitation
  static async getAllVisitation() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT v.id,v.resident_id,v.family_id,v.duration,v.reason,v.visit_date,v.status,u.id as user_id,u.first_name,u.last_name FROM carewise.visit v join User u on v.resident_id = u.id ORDER BY SubmittedAt DESC",
        [],
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

  //visit made by a family_member
  static async getFamilyVisit(family_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * from Visit where family_id = ? ORDER BY SubmittedAt DESC",
        [family_id],
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

  //update visit status
  static async updateVisit(id, status, reason) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE Visit SET status =?,decline_reason=? WHERE id = ?",
        [status, reason, id],
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

  static async getVisit(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from visit join User on visit.family_id = User.id  where visit.id = ?",
        [id],
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

module.exports = Visitation;
