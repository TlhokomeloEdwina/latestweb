const db = require("../data/db");

class Day {
  constructor(name, activities) {
    (this.name = name), (this.activities = activities);
  }

  static async getDayActivity(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT a.id, a.name, a.start_time,a.end_time, a.description, a.type FROM Day d INNER JOIN DayActivity da ON d.id = da.day_id INNER JOIN Activity a ON da.act_id = a.id WHERE d.id = ? ORDER BY a.start_time",
        [id],
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

  static async sendDayActivity(dayAct) {
    const { day_id, act_id } = dayAct;
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO DayActivity (day_id, act_id) VALUES( ?, ?)",
        [day_id, act_id],
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

  static async getDays() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Day", (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Day;
