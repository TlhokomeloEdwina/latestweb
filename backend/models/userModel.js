const db = require("../data/db");

class User {
  constructor(
    id_number,
    first_name,
    last_name,
    gender,
    contact_number,
    email,
    password,
    imageUrl,
    expoDeviceToken,
    userType
  ) {
    this.id_number = id_number;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.contact_number = contact_number;
    this.email = email;
    this.password = password;
    this.imageUrl = imageUrl;
    this.expoDeviceToken = expoDeviceToken;
    this.userType = userType;
  }

  //create a user
  static async createUser(newUser) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO User(id_number, first_name, last_name, gender, contact_number,email, password, image_url, expoDeviceToken, userType) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newUser.id_number,
          newUser.first_name,
          newUser.last_name,
          newUser.gender,
          newUser.contact_number,
          newUser.email,
          newUser.password,
          newUser.imageUrl,
          newUser.expoDeviceToken,
          newUser.userType,
        ],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(result);
          newUser.id = result.insertId; // Assuming `id` is auto-generated in the database
          resolve(result);
        }
      );
    });
  }

  //get user by email
  static async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM User WHERE email = ?", [email], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result[0]);
      });
    });
  }

  //save admin user
  static async saveAdmin(newUser) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Admin(admin_id) VALUES (?)",
        [newUser.id],
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

  //save caregiver user
  static async saveCaregiver(newUser) {
    return new Promise((resolve, reject) => {
      db.query(
        "Insert into Caregiver(caregiver_id,available_status) Values (?,?)",
        [newUser.id, 0],
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

  //save Residet user
  static async saveResident(newUser, sassa_number, room_number, cottage_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Resident(resident_id,sassa_number,room_number,cottage_id) Values (?,?,?,?)",
        [newUser.id, sassa_number, room_number, cottage_id],
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

  //save family member user
  static async saveFamily_Member(newUser) {
    return new Promise((resolve, reject) => {
      db.query(
        "Insert into Family_member(family_member_id) Values (?)",
        [newUser.id],
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

  //update user notification token
  static async updateNotificationToken(userId, token) {
    return new Promise((resolve, reject) => {
      db.query(
        "Update User Set expoDeviceToken = ? Where id = ?",
        [token, userId],
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

  //get user notification token
  static async getNotificationToken(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT expoDeviceToken FROM User WHERE id = ?",
        [userId],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result[0].expoDeviceToken);
        }
      );
    });
  }

  //fetch resident information using family member id
  static async getResidentInfomration(family_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select id,id_number,first_name,last_name,gender,contact_number,email,image_url from User join Resident_Family on User.id=Resident_Family.resident_id where Resident_Family.family_member_id = ?",
        [family_id],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          console.log("Result from the Model: ", result);
          resolve(result[0]);
        }
      );
    });
  }

  //get resident by id number
  static async getResidentByIdNumber(id_number) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from User where id_number = ?",
        [id_number],
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

  //add the family member and resident
  static async addFamily_Resident(resident_id, family_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into Resident_Family(resident_id,family_member_id) values (?,?)",
        [resident_id, family_id],
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

  //get caregiver information using resident id(linked via the cottage)
  static async getCaregiverInfo(resident_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT User.id As caregiver_id, User.id_number, User.first_name,User.last_name,User.gender,User.contact_number,User.email,User.password,User.image_url,User.expoDeviceToken,User.userType,Caregiver.available_status From Resident JOIN Cottage ON Resident.cottage_id = Cottage.id JOIN Caregiver ON Cottage.caregiver_id = Caregiver.caregiver_id JOIN User ON Caregiver.caregiver_id = User.id WHERE Resident.resident_id = ?",
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

  //get all caregivers
  static async getAllCaregiver() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT User.id, User.id_number, User.first_name,  User.last_name, User.gender, User.contact_number, User.email, User.password, User.image_url, User.expoDeviceToken, User.userType,Caregiver.available_status FROM User JOIN Caregiver ON User.id = Caregiver.caregiver_id WHERE User.userType = 'Caregiver';",
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

  //Get all users in the database(active)
  static async getAllUsers() {
    const query = `
    SELECT 
        u.id,
        u.id_number,
        u.first_name,
        u.last_name,
        u.gender,
        u.contact_number,
        u.email,
        u.image_url,
        u.expoDeviceToken,
        u.userType,
        a.admin_id AS admin_id,
        cg.available_status AS caregiver_available_status,
        c_caregiver.name AS caregiver_cottage_name,
        r.sassa_number AS resident_sassa_number,
        r.room_number AS resident_room_number,
        r.cottage_id AS resident_cottage_id,
        c_resident.name AS resident_cottage_name,
        fm.family_member_id AS family_member_id
      FROM 
          User u
      LEFT JOIN 
          Admin a ON u.id = a.admin_id AND u.userType = 'Admin'
      LEFT JOIN 
          Caregiver cg ON u.id = cg.caregiver_id AND u.userType = 'Caregiver'
      LEFT JOIN 
          Resident r ON u.id = r.resident_id AND u.userType = 'Resident'
      LEFT JOIN 
          Family_member fm ON u.id = fm.family_member_id AND u.userType = 'Family Member'
      LEFT JOIN 
          Cottage c_resident ON r.cottage_id = c_resident.id
      LEFT JOIN 
          Cottage c_caregiver ON cg.caregiver_id = c_caregiver.caregiver_id;
      `;

    return new Promise((resolve, reject) => {
      db.query(query, [], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  //update Resident
  static async updateUser(id, updatedUser) {
    let query =
      "UPDATE User SET id_number = ?, first_name = ?, last_name = ?, gender = ?, contact_number = ?, email = ?,  expoDeviceToken = ?, userType = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [
          updatedUser.id_number,
          updatedUser.first_name,
          updatedUser.last_name,
          updatedUser.gender,
          updatedUser.contact_number,
          updatedUser.email,

          updatedUser.expoDeviceToken,
          updatedUser.userType,
          id,
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

  static async getResident(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from user join Resident on user.id=Resident.resident_id where user.id=?",
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

module.exports = User;
