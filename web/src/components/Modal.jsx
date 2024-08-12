import CustomButton from "./CustomButton";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Modal = ({
  mode,
  setShowModal,
  handleSubmit,
  act,
  setCurrentAct
}) => {
  const editMode = act ? true : false;

  const [data, setData] = useState({
    id: editMode ? act.id : uuidv4(),
    time: editMode ? act.time : "",
    name: editMode ? act.name : "",
    description: editMode ? act.description : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };
  return (
    <div className="absolute flex items-center justify-center w-screen h-screen left-0 top-0 bg-black bg-opacity-35">
      <div className="w-1/2 h-fit py-10 flex flex-col justify-center items-center rounded-md bg-sky-100 shadow-sm shadow-slate-500">
        <h1 className="font-serif text-2xl pb-5 font-bold text-black">
          {mode} activity
        </h1>
        <form className="flex flex-col text-slate-500 items-center w-2/3">
          <div className="w-full my-3">
            <label className="block mb-2 font-serif text-lg" htmlFor="name">
              Name:
            </label>
            <input
              maxLength={30}
              className="w-full p-2 text-slate-500 border-2 h-10 rounded-md  outline-none focus:ring-4 focus:ring-blue-200"
              type="text"
              name="name"
              required
              value={data.name}
              onChange={handleChange}
              placeholder="Activity name..."
            />
          </div>
          <div>
            <label className="font-bold text-slate-500 text-sm" htmlFor="time">
              Time:
            </label>
            <input
              className="p-2 font-bold text-black ms-1 border-2 h-8 rounded-md border-slate-300 focus:border-cyan-200 outline-none focus:ring-1 focus:ring-cyan-200"
              type="time"
              required
              value={data.time}
              onChange={handleChange}
              aria-label="Time"
              name="time"
            />
          </div>
          <div className="w-full my-3">
            <label className="block mb-2 font-serif text-lg" htmlFor="description">
              Description:
            </label>
            <textarea
              maxLength={100}
              className="w-full p-2 text-slate-500 border-2 h-fit rounded-md outline-none focus:ring-4 focus:ring-blue-200"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Brief description of the event..."
              cols="30"
              rows="3"
            />
          </div>
          <div className="w-full flex justify-around">
            <CustomButton
              title="Submit"
              styles="w-1/3 hover:bg-blue-300
              hover:border-blue-300"
              handlePress={() => handleSubmit(data)}
            />
            <CustomButton
              title="Cancel"
              styles="w-1/3  text-black hover:text-white hover:bg-red-300"
              handlePress={() => {
                setShowModal(false);
                setCurrentAct(null);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;