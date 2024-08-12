const db = require("../data/db");

class Cottage {
  constructor(name, caregiver_id) {
    this.name = name;
    this.caregiver_id = caregiver_id;
  }

  //cottage information using caregiver_id
  static async cottageInfo(caregiver_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select id,name from cottage join caregiver on caregiver.caregiver_id = cottage.caregiver_id where caregiver.caregiver_id = ?",
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

  //get All people in a cottage
  static async AllPeople(cottage_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select id,first_name,last_name,gender,contact_number,email,image_url,userType from Resident join User on Resident.resident_id = User.id Where resident.cottage_id = ?",
        [cottage_id],
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

  //find caregiver info by resident id
  static async CaregiverInfo(resident_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select caregiver.caregiver_id,User.expoDeviceToken from resident join cottage on resident.cottage_id=cottage.id join caregiver on cottage.caregiver_id = caregiver.caregiver_id join User on caregiver.caregiver_id=user.id where resident.resident_id = ?",
        [resident_id],
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

module.exports = Cottage;
