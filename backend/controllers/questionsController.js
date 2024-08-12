const Question = require("../models/questionsModel");
//add question to questions list
exports.addQuestion = async function (req, res) {
  const mood_type = req.body.mood_type;
  const questiondescrip = req.body.question;
  const questiontype = req.body.question_type;
  const optionvalues = req.body.options;
  try {
    if (!Array.isArray(optionvalues)) {
      return res.status(400).send("not a list of posible options");
    }
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Error adding new question." });
  }
  const optionsjson = JSON.stringify(optionvalues);
  try {
    await Question.addQuestion(
      mood_type,
      questiondescrip,
      optionsjson,
      questiontype
    );
    res.status(201).json({ message: "question added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding question." });
  }
};

//get all questions
exports.getQuestions = async function (req, res) {
  try {
    const questions = await Question.getQuestions();
    res.status(200).json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving questions." });
  }
};
//deletes a question from the list
exports.deleteQuestion = async function (req, res) {
  const { questionId } = req.params;
  try {
    await Question.deleteQuestion(questionId);
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    console.error("error occured deleting question", error);
    res.status(500).json({ message: "error deleting question" });
  }
};
//get question by id
exports.getQuestion = async function (req, res) {
  const questionId = req.params.questionId;
  try {
    const question = await Question.getQuestionbyId(questionId);
    res.status(200).json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving question." });
  }
};

exports.updateQuestion = async function (req, res) {
  const questionId = req.params.questionId;
  const mood_type = req.body.mood_type;
  const questiondescrip = req.body.question;
  const questiontype = req.body.question_type;
  const optionvalues = req.body.options;
  try {
    if (!Array.isArray(optionvalues)) {
      return res.status(400).send("not a list of posible options");
    }
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Error updating question." });
  }
  const optionsjson = JSON.stringify(optionvalues);
  try {
    await Question.updateQuestion(
      mood_type,
      questiondescrip,
      optionsjson,
      questiontype,
      questionId
    );
    res.status(200).json({ message: "question updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating question." });
  }
};
