const db = require("../data/db");

class Passout {
  constructor(
    resident_id,
    start_date,
    end_date,
    destination,
    reason,
    emergency_contact
  ) {
    //date includes time
    this.resident_id = resident_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.destination = destination;
    this.reason = reason;
    this.emergency_contact = emergency_contact;
  }

  //Create a passout
  static async createPassout(newPassout) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Passout (resident_id, start_date, end_date, destination, reason, emergency_contact,status) values (?,?,?,?,?,?,?)",
        [
          newPassout.resident_id,
          newPassout.start_date,
          newPassout.end_date,
          newPassout.destination,
          newPassout.reason,
          newPassout.emergency_contact,
          "Pending",
        ],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          //console.log(result);
          resolve(result);
        }
      );
    });
  }

  //get all passout
  static async getAllPasout() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT p.id,p.resident_id,p.request_date,p.start_date,p.end_date,p.destination,p.reason,p.emergency_contact,p.medical_clearance,p.status,u.id as user_id,u.first_name,u.last_name FROM carewise.passout p join User u on p.resident_id = u.id;",
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

  //passout made by a resident
  static async getResidentPassout(resident_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * from Passout where resident_id = ?",
        [resident_id],
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

  static async getPassout(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from passout where id = ? order by request_date limit 1",
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

  //update passout status
  static async updatePassout(id, status, reason) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE Passout SET status =?,decline_reason=? WHERE id = ?",
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

  //last passout made
  static async getPassout(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from passout join User on passout.resident_id = User.id  where passout.id = ?;",
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

module.exports = Passout;
