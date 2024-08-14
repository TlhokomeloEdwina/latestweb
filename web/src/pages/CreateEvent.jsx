import CustomDatePicker from "../components/CustomDatePicker";
import React, { useEffect, useState } from "react";
import EventActivity from "../components/EventActivity";
import CustomButton from "../components/CustomButton";
import Modal from "../components/Modal";
import { v4 as uuidv4 } from "uuid";
import EditEvent from "./EditEvent";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = ({ eventEdit, date }) => {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    id: eventEdit ? eventEdit.id : uuidv4(),
    name: eventEdit ? eventEdit.name : "",
    date: eventEdit ? eventEdit.date : startDate.toISOString().split("T")[0],
    description: eventEdit ? eventEdit.description : "",
  });


  const postEvent = async () => {

    const response = await axios.post(
      `http://${process.env.REACT_APP_IP_ADDRESS}:3000/${eventEdit ? "eventEdit" : "event"
      }`,
      {
        id: event.id,
        name: event.name,
        date: event.date,
        description: event.description,
      }
    );
  };

  useEffect(() => {
    eventEdit && setEvent(eventEdit);
    eventEdit && setStartDate(new Date(eventEdit.date));
  }, []);


  useEffect(() => {
    setEvent((event) => ({
      ...event,
      date: startDate.toISOString().split("T")[0],
    }));
  }, [startDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((event) => ({
      ...event,
      [name]: value,
    }));
  };

  return (
    <div className="create-event bg-[rgb(135,206,250)] h-screen flex items-center flex-col -mt-2">
      <ToastContainer />
      <h1 className="font-bold flex justify-center rounded-md pt-4 bg-[rgb(135,206,250)] h-16 w-11/12 text-3xl font-serif mt-16">
        {eventEdit ? "Edit Event" : "Create Event"}
      </h1>

      <div className="bg-[rgb(135,206,250)] rounded-md py-10 gap-10 px-10 mt-4 h-fit w-11/12 flex flex-col justify-center">
        <div className="flex justify-center w-full h-full">
          <form className="flex flex-col text-black items-center w-11/12 text-lg">
            <div className="w-full my-3">
              <label className="block mb-2 font-serif" htmlFor="name">
                Name:
              </label>
              <input
                className="w-full p-2 text-slate-500 border-2 h-10 rounded-md border-slate-300 focus:border-cyan-200 outline-none focus:ring-1 focus:ring-blue-300"
                type="text"
                name="name"
                value={event.name}
                onChange={handleChange}
                placeholder="Event name..."
              />
            </div>
            <div className="w-full my-3">
              <label className="block mb-2 font-serif" htmlFor="description">
                Description:
              </label>
              <textarea
                className="w-full p-2 text-slate-500 border-2 h-fit rounded-md border-slate-300 focus:border-sky-100 outline-none focus:ring-4 focus:ring-blue-300"
                name="description"
                value={event.description}
                onChange={handleChange}
                placeholder="Brief description of the event..."
                cols="30"
                rows="3"
              />
            </div>
            <div className="w-full my-2">
              <label className="block mb-2 font-serif" htmlFor="">
                Date:
              </label>
              <CustomDatePicker
                startDate={startDate}
                handleChange={(date) => setStartDate(date)}
                value={event.date}
              />
            </div>
          </form>
          {/* <div className="activity-section px-4 w-1/2 flex flex-col items-center">
            <h1 className="font-bold text-black text-xl font-serif">Event Activities</h1>
            <div className="w-full flex mt-4 justify-stretch">
              <CustomButton
                title="Add New Activity"
                handlePress={() => setShowModal(true)}
                styles="text-sm w-1/2 hover:bg-zinc-300 hover:border-zinc-300"
              />
              <CustomButton
                title="Add general activity"
                handlePress={generalAct}
                styles="text-sm w-1/2 hover:bg-zinc-300 hover:border-zinc-300"
              />
              {showModal && (
                <Modal
                  mode={"Create"}
                  setShowModal={setShowModal}
                  setActivity={setActivity}
                  activity={activity}
                  setEvent={setEvent}
                  event={event}
                />
              )}
            </div>
            <div className="w-full">
              {activity.length>0 && activity.map((act) => (
                <EventActivity
                  key={act.id}
                  activities={act}
                  setActivity={setActivity}
                  time={act.time}
                />
              ))}
            </div>
          </div> */}
        </div>
        <CustomButton title={"Submit event"} handlePress={postEvent} styles="text-sm flex justify-center hover:bg-zinc-300 w-11/12 hover:border-zinc-300" />
      </div>
    </div>
  );
};

export default CreateEvent;
