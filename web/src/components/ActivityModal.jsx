import CustomButton from "./CustomButton";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const ActivityModal = ({
  mode,
  setShowModal,
  act,
  dayId
}) => {
  const editMode = mode === "Edit";

  const [data, setData] = useState({
    id: editMode ? act.id : uuidv4(),
    start_time: editMode ? act.start_time : "",
    end_time: editMode ? act.end_time : "",
    name: editMode ? act.name : "",
    description: editMode ? act.description : "",
    days: editMode ? [dayId] : [],
    type: editMode ? act.type : "", // Add type to state
    predefinedSelection: {
      weekdays: false,
      weekend: false,
      fullWeek: false,
    },
  });

  const [errorMessage, setErrorMessage] = useState(""); // State for error message


  // Predefined days
  const WEEKDAYS = [2, 3, 4, 5, 6];
  const WEEKEND = [1, 7];
  const FULL_WEEK = [1, 2, 3, 4, 5, 6, 7];

  const handleChange = (e) => {
    const { name, checked } = e.target;

    let newDays = [...data.days];
    const dayNumber = parseInt(name); // Convert day to number (1-7)

    // Updating days selected
    if (checked) {
      if (!newDays.includes(dayNumber)) {
        newDays.push(dayNumber);
      }

    } else {
      newDays = newDays.filter(day => day !== dayNumber);
    }

    setData((data) => ({
      ...data,
      days: newDays,
    }));
  };

  const handleSubmit = async () => {
    //If current activity exist, means we are editing
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/${editMode ? "editActivity" : "activity"}`,
        {
          id: data.id,
          name: data.name,
          start_time: data.start_time,
          end_time: data.end_time,
          description: data.description,
          type: data.type,
          days: data.days
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    setShowModal(false);
  }

  const handlePredefinedSelection = (type, checked) => {
    let days = [];

    switch (type) {
      case 'weekdays':
        days = checked ? WEEKDAYS : data.days.filter(day => !WEEKDAYS.includes(day));
        break;
      case 'weekend':
        days = checked ? WEEKEND : data.days.filter(day => !WEEKEND.includes(day));
        break;
      case 'fullWeek':
        days = checked ? FULL_WEEK : data.days.filter(day => !FULL_WEEK.includes(day));
        break;
      default:
        days = data.days;
    }

    setData((data) => ({
      ...data,
      days,
      predefinedSelection: {
        ...data.predefinedSelection,
        [type]: checked,
      }
    }));
  };

  const handlePredefinedChange = (e) => {
    const { name, checked } = e.target;
    handlePredefinedSelection(name, checked);
  };

  const handleTypeChange = (e) => {
    setData((data) => ({
      ...data,
      type: e.target.value
    }));
  };

  const validateTimes = () => {
    const { start_time, end_time } = data;
    if (start_time && end_time && start_time >= end_time) {
      setErrorMessage("Start time must be earlier than end time.");
      return false;
    }
    setErrorMessage(""); // Clear the error message if valid
    return true;
  };

  useEffect(() => {
    const { start_time, end_time } = data;
    if (start_time && end_time && start_time >= end_time) {
      setErrorMessage("Start time must be earlier than end time.");
    } else {
      setErrorMessage("");
    }
  }, [data.end_time])

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const submit = data.days.length > 0;
    if (!submit) {
      setErrorMessage("Select days before you submit");
      return;
    }
    if (!validateTimes()) {
      setErrorMessage("Start time must be earlier than end time.")
      return;
    }

    handleSubmit();

  };

  return (
    <div className="absolute flex items-center justify-center w-screen h-screen left-0 top-0 bg-black bg-opacity-35 ">
      <div className="w-3/4 h-fit py-10 flex flex-col justify-center items-center rounded-md bg-white shadow-sm shadow-slate-500">
        <h1 className="font-serif text-2xl pb-5 font-bold text-[#0b4dad]">
          {mode} Activity
        </h1>
        <form className="flex flex-col justify-center items-center w-full" onSubmit={handleFormSubmit}>
          <div className="flex w-full justify-center">
            <div className="w-1/2 flex-col items-center">
              <div className="w-full my-4">
                <label className="block mb-2 font-serif text-lg" htmlFor="name">
                  Name:
                </label>
                <input
                  maxLength={30}
                  className="w-full p-2 text-slate-500 border-2 h-10 rounded-md outline-none focus:ring-4 focus:ring-blue-200"
                  type="text"
                  name="name"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Activity name..."
                />
              </div>
              <div className="w-full my-4">
                <label className="block mb-2 font-serif text-lg" htmlFor="type">
                  Type:
                </label>
                <select
                  className="w-full p-2 text-slate-500 border-2 h-10 rounded-md outline-none focus:ring-4 focus:ring-blue-200"
                  name="type"
                  value={data.type}
                  onChange={handleTypeChange}
                >
                  <option value="">Select a type</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Worship">Worship</option>
                  <option value="Socialize">Socialize</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>
              <div className="flex justify-between my-4">
                <div>
                  <label className="font-bold text-slate-500 mb-2 font-serif text-base" htmlFor="stime">
                    From:
                  </label>
                  <input
                    className="p-2 font-bold text-black ms-1 border-2 h-8 rounded-md border-slate-300 focus:border-blue-200 outline-none focus:ring-1 focus:ring-blue-200"
                    type="time"
                    required
                    name="start_time"
                    value={data.start_time}
                    onChange={handleTimeChange}
                    aria-label="Start Time"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500  mb-2 font-serif text-base" htmlFor="etime">
                    To:
                  </label>
                  <input
                    className="p-2 font-bold text-black ms-1 border-2 h-8 rounded-md border-slate-300 focus:border-blue-200 outline-none focus:ring-1 focus:ring-blue-200"
                    type="time"
                    required
                    name="end_time"
                    value={data.end_time}
                    onChange={handleTimeChange}
                    aria-label="End Time"
                  />
                </div>
              </div>
              <div className="w-full mt-2">
                <label className="block mb-2 font-serif text-lg" htmlFor="description">
                  Description:
                </label>
                <textarea
                  maxLength={100}
                  className="w-full p-2 text-slate-500 border-2 h-fit rounded-md outline-none focus:ring-4 focus:ring-blue-200"
                  name="description"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Brief description of the event..."
                  cols="30"
                  rows="3"
                />
              </div>
            </div>
            <div className="p-2 ">
              <p className="mt-3 mb-1 font-serif  text-lg">Days:</p>
              <div className="flex justify-center text-[#0b4dad]">
                <div className="w-full flex flex-col">
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      name="weekdays"
                      checked={data.predefinedSelection.weekdays}
                      onChange={handlePredefinedChange}
                    />
                    <span className="ml-2 font-serif ">Weekdays</span>
                  </label>
                  <label className="flex items-center mt-2 text-lg">
                    <input
                      type="checkbox"
                      name="weekend"
                      checked={data.predefinedSelection.weekend}
                      onChange={handlePredefinedChange}
                    />
                    <span className="ml-2 font-serif">Weekend</span>
                  </label>
                  <label className="flex items-center mt-2 font-serif">
                    <input
                      type="checkbox"
                      name="fullWeek"
                      checked={data.predefinedSelection.fullWeek}
                      onChange={handlePredefinedChange}
                    />
                    <span className="ml-2 text-lg">Full Week</span>
                  </label>
                </div>
                <div>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <div key={index} className="flex items-center justify-end w-full ml-2">
                      <label className="block mb-2 font-serif text-base" htmlFor={`day-${index + 1}`}>
                        {day}
                      </label>
                      <input
                        className="mb-2 ml-2"
                        type="checkbox"
                        id={`day-${index + 1}`}
                        name={`${index + 1}`}
                        checked={data.days.includes(index + 1)}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error message display */}
          <div className="h-3 mb-2">
            <p className="text-red-600 mr-60">{errorMessage}</p>
          </div>
          <div className="w-full flex justify-around mt-4">
            <CustomButton
              title="Submit"
              styles="w-1/3 hover:bg-[#0b4dad] hover:text-white hover:border-transparent shadow text-[#0b4dad]"
              handlePress={handleFormSubmit}
            />
            <CustomButton
              title="Cancel"
              styles="w-1/3 hover:bg-[#0b4dad] hover:text-white hover:border-transparent shadow text-[#0b4dad]
              "
              handlePress={() => {
                setShowModal(false);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
