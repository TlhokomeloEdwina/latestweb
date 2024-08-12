const db = require("../data/db");

class question {
  //add new question
  static async addQuestion(mood_type, question, options, question_type) {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into questions (mood_type, question, options,question_type) values(?,?,?,?)",
        [mood_type, question, options, question_type],
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

  // get all questions
  static async getQuestions() {
    return new Promise((resolve, reject) => {
      db.query("select * from questions", [], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  // get question by id
  static async getQuestionbyId(question_id) {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from questions where id = ?",
        [question_id],
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
  //delete question from list
  static async deleteQuestion(questionId) {
    return new Promise((resolve, reject) => {
      db.query(
        "delete from questions where id = ?",
        [questionId],
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
  //edit question
  static async updateQuestion(
    mood_type,
    question,
    options,
    question_type,
    questionId
  ) {
    return new Promise((resolve, reject) => {
      db.query(
        "update questions set mood_type = ?, question = ?, options = ?,question_type = ?  where id = ?",
        [mood_type, question, options, question_type, questionId],
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
module.exports = question;
