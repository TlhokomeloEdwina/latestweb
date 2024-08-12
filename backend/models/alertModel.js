const db = require("../data/db");

class Alert {
  constructor(alert_Type, resident_id, caregiver_id) {
    this.time = new Date();
    this.alert_Type = alert_Type;
    this.resident_id = resident_id;
    this.caregiver_id = caregiver_id;
  }

  //Create the alert
  static async createAlert(newAlert) {
    return new Promise((resolve, reject) => {
      db.query(
        "Insert into Alert(Time,alert_type,resident_id,caregiver_id) Values (?,?,?,?)",
        [
          newAlert.time,
          newAlert.alert_Type,
          newAlert.resident_id,
          newAlert.caregiver_id,
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

  //Alert made by a Resident
  static async Resident_Alerts(resident_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * From Alert where resident_id = ? AND alert_Type='Emergency'  Order By Time DESC;",
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

  //Alerts recieved by a caregiver
  static async Caregiver_Alerts(caregiver_id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT Alert.id AS alert_id, 
                    Alert.Time, 
                    Alert.alert_Type, 
                    Resident.resident_id, 
                    User.first_name, 
                    User.last_name, 
                    User.image_url 
             FROM Alert 
             JOIN Resident ON Alert.resident_id = Resident.resident_id 
             JOIN Caregiver ON Alert.caregiver_id = Caregiver.caregiver_id 
             JOIN User ON Resident.resident_id = User.id 
             WHERE Caregiver.caregiver_id = ? Order By Time DESC`,
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
}

module.exports = Alert;
