const db = require("../data/db");

class Activity {
  constructor(id, name, start_time,end_time, description, type, event_id) {
    (this.id = id),
      (this.name = name),
      (this.start_time = start_time),
      this.end_time = end_time,
      (this.description = description),
      (this.type = type),
      (this.event_id = event_id);
  }

  static async createActivity(newActivity) {
    const { id, name, start_time,end_time, description, type} = newActivity;
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Activity (id,name,start_time,end_time, description,type) VALUES( ?, ?,?, ?,?,?)",
        [id, name, start_time,end_time, description, type],
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

  static async editActivity(act) {
    const { id, name, start_time,end_time, description, type } = act;
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE Activity SET name = ?, start_time = ?, end_time = ?, description = ?, type = ? WHERE id = ?",
        [name, start_time,end_time, description, type, id],
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

  static async deleteActivity(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM DayActivity WHERE act_id = ?",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      db.query(
        "DELETE FROM Activity WHERE id = ?",
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


  static async getActivities(event_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Activity WHERE event_id = ?",
        [event_id],
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

  static async sendAttendance(attendance) {
    const { date, time, careId, actId, resident } = attendance;
    resident.length !== 0 &&
      resident.map((res) => {
        return new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO Attendance (date,time,care_id,act_id,res_id) VALUE(?,?,?,?,?)",
            [date, time, careId, actId, res],
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(result);
            }
          );
        });
      });
  }
}

module.exports = Activity;
