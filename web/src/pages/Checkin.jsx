import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

//Checkin page

const Checkin = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [addquestion, setAddQuestion] = useState(false);
  const [editquestion, setEditquestion] = useState(false);
  const [mood, setMood] = useState("");
  const [questiondescrip, setQuestiondescrip] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [responseOptions, setResponseOptions] = useState([]);

  //gets current questions
  const getquestions = async () => {
    const response = await axios.get(
      `http://${process.env.REACT_APP_IP_ADDRESS}:3000/questions`
    );
    console.log(response.data);
    if (response.data) {
      setQuestions(response.data.questions);
    } else {
      console.error("error occured fetching questions");
    }
  };
  // when page loads
  useEffect(() => {
    getquestions();
  }, []);
  // gets selected question
  const getquestion = async (selectedQuestionId) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}/question/${selectedQuestionId}`
      );
      console.log(response.data);
      if (response.data) {
        setMood(response.data.mood_type);
        setQuestiondescrip(response.data.question);
        setQuestionType(response.data.question_type);
        setResponseOptions(response.data.options);
      } else {
        console.log("no question returned");
      }
    } catch (error) {
      console.error("error occured fetching question", error);
    }
  };
  //only when a question is selected to be edited
  useEffect(() => {
    if (selectedQuestionId) {
      getquestion(selectedQuestionId);
      setEditquestion(true);
    }
  }, [selectedQuestionId]);
  // to delete existing question from list
  const handleDelete = async (selectedQuestionId) => {
    try {
      await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}/deletequestion/${selectedQuestionId}`
      );
      console.log("deleting question : " + selectedQuestionId);
      toast.success("Question succuessfully editted");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("could not delete question", error);
    }
  };
  //to clear text fields after saving
  const handleclear = () => {
    setMood("");
    setQuestiondescrip("");
    setQuestionType("");
    setResponseOptions([]);
    setEditquestion(false);
    setSelectedQuestionId(null);
    setAddQuestion(false);
  };
  const handleSave = async () => {
    const formatQuestion = {
      mood_type: mood,
      question: questiondescrip,
      question_type: questionType,
      options: responseOptions,
    };
    if (selectedQuestionId) {
      try {
        const response = await axios.put(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/question/${selectedQuestionId}`,
          formatQuestion
        );
        if (response.data) {
          toast.success("Question succuessfully editted");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error("Error updating question:", error);
      }
    } else if (addquestion) {
      try {
        const response = await axios.post(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/addquestion`,
          formatQuestion
        );
        if (response.data) {
          toast.success("Succesfully added a question");
        }
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
    //to reload page
    getquestions();
    handleclear();
  };

  const handleButtonclick = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md p-4 w-1/2">
        <h3 className="font-semibold text-center rounded-sm bg-gray-200">
          {editquestion
            ? `Edit Question ${selectedQuestionId}`
            : "Add new question"}
        </h3>
        <div>
          <div className="border border-gray-400 rounded-sm">
            <label className="font-semibold min-w-full bg-gray-100 border rounded-sm">
              Mood Type
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="border border-gray-200  min-w-full rounded-md"
              required
            >
              <option value="">select mood type</option>
              <option value="social">Social</option>
              <option value="mental">Mental</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div>
            <label className="font-semibold min-w-full bg-gray-100 border rounded-sm">
              Question
            </label>
            <input
              type="text"
              value={questiondescrip}
              className="border border-gray-200  min-w-full rounded-md"
              onChange={(e) => setQuestiondescrip(e.target.value)}
              required
              placeholder="Enter question "
            />
          </div>
          <div>
            <label className="font-semibold  min-w-full bg-gray-100 border rounded-sm">
              Question Type
            </label>
            <select
              value={questionType}
              className="border border-gray-200  min-w-full rounded-md"
              onChange={(e) => setQuestionType(e.target.value)}
              required
            >
              <option value="">select question type</option>
              <option value="yes_no">Yes/No</option>
              <option value="choice">Choice</option>
              <option value="scale">Scale</option>
            </select>
          </div>
          <div className="flex-row">
            <label className="font-semibold min-w-full bg-gray-100 border rounded-sm">
              Options
            </label>
            {responseOptions.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  className="border  min-w-full border-gray-200 rounded-md"
                  required
                  placeholder={`Enter option ${index + 1}`}
                  onChange={(e) => {
                    const newOptions = [...responseOptions];
                    newOptions[index] = e.target.value;
                    setResponseOptions(newOptions);
                  }}
                />
              </div>
            ))}
            <button
              className="bg-green-200 min-w-full mb-4 rounded-md text-black font-bold"
              onClick={() => setResponseOptions([...responseOptions, ""])}
            >
              Add Option
            </button>
          </div>
        </div>
        <button
          className="bg-green-200 min-w-full rounded-md text-black font-bold mt-1"
          onClick={() => handleSave()}
        >
          Save
        </button>
        <button
          className="bg-red-200 min-w-full rounded-md text-black font-bold mt-2"
          onClick={() => handleclear()}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="mt-6">
        <ToastContainer />
        <h1 className="text-3xl font-bold font-serif">Checkin</h1>
      </div>
      <div className="bg-[#fafbfb] rounded-md border border-gray-100 h-20 ">
        <div clsssName=" justify-between">
          <h1 className="text-xl font-semibold text-center mb-2 font-serif">
            Current Checkin Questions
          </h1>
          <button
            className="bg-green-200 min-w-full mb-2 rounded-md text-black font-bold"
            onClick={() => {
              setAddQuestion(true);
            }}
          >
            add Question
          </button>
        </div>
        <table className=" min-w-full border border-gray-300 rounded-md">
          <thead>
            <tr className="w-full bg-sky-200 border-b font-serif text-lg text-gray-600">
              <th className="px-4 py-2  border-r text-left">Mood</th>
              <th className="px-4 py-2 border-r text-left">Question</th>
              <th className="px-4  py-2 border-r text-left">Options</th>
              <th className="px-4 py-2  border-r text-left">Type</th>
              <th className="py-2 px-4 border-r text-left">Modify</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr
                className="w-full border-b hover:bg-green-100"
                key={question.id}
              >
                <td className="py-2 px-4 border-r">{question.mood_type}</td>
                <td className="py-2 px-4 border-r">{question.question}</td>
                <td className="py-2 px-4 border-r">
                  {question.options
                    .replace(/^\[|\]$/g, "")
                    .replace(/['"]/g, "")}
                </td>
                <td className="py-2 px-4 border-r">{question.question_type}</td>
                <td className="flex-row py-2 justify-around px-4 ">
                  <button
                    className="bg-green-200 min-w-full mb-2 rounded-md text-black font-bold"
                    onClick={() => setSelectedQuestionId(question.id)}
                  >
                    Edit
                  </button>
                  {/* <button className="bg-red-300 min-w-full rounded-md text-black font-bold" onClick={() => handleDelete(question.id)}>Delete</button>*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(editquestion || addquestion) && handleButtonclick()}
    </>
  );
};

export default Checkin;
