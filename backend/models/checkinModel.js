const db = require("../data/db");

class Checkin {
  // for resident
  //creates checkin record
  static async createCheckin(resident_id, caregiver_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into checkin (resident_id,caregiver_id) values (?,?)",
        [resident_id, caregiver_id],
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
  //get checkin record using resident id
  static async getCheckin(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "select id from checkin where resident_id = ? and datecreated = CURDATE()",
        [userId],
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
  // returns checkin record for specific resident on a specific date
  static async getCheckinbyresident(resident_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "with checkin as (select c.id as checkin_id, c.datecreated as datecreated, rw.review as review from checkin c left join checkinreview rw on c.id = rw.checkin_id where c.resident_id = ? ) select row_number() over(order by datecreated desc ) as id, checkin_id, datecreated,review from checkin limit 3",
        [resident_id],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          console.log("Resident checkins", result);
          resolve(result);
        }
      );
    });
  }
  //submits residents checkin
  static async submitCheckIn(question_id, selected_option, checkin_id, score) {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into responses (question_id,selected_option,checkin_id,score) values (?,?,?,?)",
        [question_id, selected_option, checkin_id, score],
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

  static async checkindone(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * from checkin where resident_id = ? order by datecreated DESC limit 1;",
        [id],
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

  // to get all checkins using resident id for admin
  static async getResidentCheckins(residentId) {
    return new Promise((resolve, reject) => {
      db.query(
        "with checkins as (select c.id as checkin_id, sum(r.score) as totalscore,c.datecreated as date from responses r join checkin c on r.checkin_id = c.id where c.resident_id = ? group by c.id)select row_number() over (order by checkin_id) as id, checkin_id,totalscore,date from checkins",
        [residentId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }



  //to get 1 checkin for that specific day (if done)
  static async getResidentDailyCheckin(id) {
    let query = `with checkins as (select c.id as checkin_id, sum(r.score) as totalscore,u.first_name as first_name, u.last_name as last_name,u.image_url as image_url,c.datecreated as date from responses r join checkin c on r.checkin_id = c.id join user u on c.resident_id = u.id where c.resident_id = ? group by c.id)select row_number() over (order by date) as id,first_name,last_name,image_url,checkin_id,totalscore,date from checkins order by date desc limit 1`;
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }
  //get checkin mood scores for admin
  static async getCheckinmoods(checkin_id) {
    return new Promise((resolve, reject) => {
      db.query(
        " with moodscores as(select q.mood_type as mood_type,sum(r.score) as totalscore from responses r join questions q on r.question_id = q.id where r.checkin_id = ? group by q.mood_type) select row_number() over (order by mood_type) as id, mood_type, totalscore from moodscores",
        [checkin_id],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static async getCheckins() {
    return new Promise((resolve, reject) => {
      db.query(
        " select u.first_name, u.last_name, u.image_url, c.datecreated from checkin c join user u on c.resident_id = u.id",
        [],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }
  //checkin by id
  static async getCheckinByID(checkin_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select q.id,q.mood_type, q.question, r.selected_option, r.score from responses r join questions q on r.question_id = q.id join checkin c on r.checkin_id = c.id where r.checkin_id = ?",
        [checkin_id],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  // gets checkins reviewed by specific cargiver for admin
  static async getCaregivercheckins(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "with checkins as (select c.id as checkin_id, sum(r.score) as totalscore,u.id as resident_id, u.first_name as first_name, u.last_name as last_name, u.image_url as image_url, c.datecreated as date from responses r join checkin c on r.checkin_id = c.id join user u on c.resident_id = u.id where c.caregiver_id = ? and c.datecreated = CURDATE() group by c.id order by totalscore desc)select row_number() over (order by checkin_id) as id,first_name,last_name,image_url,resident_id,checkin_id,totalscore,date from checkins",
        [userId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  //resident responses
  static async getCheckinResponses(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        "select q.question, q.mood_type, r.selected_option from responses r join questions q on r.question_id = q.id join checkin c on r.checkin_id = c.id where c.resident_id = ? and c.datecreated = CURDATE()",
        [userId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }
  //resident info using checkin id
  static async getResidentInfo(checkin_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select u.first_name, u.last_name, u.image_url from user u join checkin c on c.resident_id = u.id where c.id = ?",
        [checkin_id],
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

module.exports = Checkin;
