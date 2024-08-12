const db = require("../data/db");

class Event {
  constructor(id, name, date, description, stime, etime,fam_recommend) {
    (this.id = id),
      (this.name = name),
      (this.date = date),
      (this.description = description),
      (this.stime = stime),
      (this.etime = etime),
      this.fam_recommend = fam_recommend
  }

  static async createEvent(newEvent) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Event (id,name, date, description,stime,etime,fam_recommend) VALUES( ?,?,?,?,?,?,?)",
        [
          newEvent.id,
          newEvent.name,
          newEvent.date,
          newEvent.description,
          newEvent.stime,
          newEvent.etime,
          newEvent.fam_recommend
        ],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );
    });
  }

  static async editEvent(event) {
    const { id, name, date, description, stime, etime,fam_recommend } = event;
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE Event SET name = ?, date = ?, description = ?,stime = ?,etime = ?, fam_recommend = ? WHERE id = ?",
        [name, date, description, stime, etime,fam_recommend, id],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
    });
  }

  static async getEventById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Event WHERE id = ?", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  static async getAllEvents() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Event", (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static async getCurrentEvent(date) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Event WHERE date = ?",
        [date],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result[0]);
        }
      );
    });
  }
}

module.exports = Event;
