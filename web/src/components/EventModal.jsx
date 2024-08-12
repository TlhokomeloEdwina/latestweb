import CustomButton from "./CustomButton";
import { useState} from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const EventModal = ({
  date,
setShowModal,
    eventEdit
}) => {   
    const [event, setEvent] = useState({
        id: eventEdit ? eventEdit.id : uuidv4(),
        name: eventEdit ? eventEdit.name : "",
        date: date.toISOString().split("T")[0],
        stime: eventEdit ? eventEdit.stime : "",
        etime: eventEdit ? eventEdit.etime : "",
        description: eventEdit ? eventEdit.description : "",
        fam_recommend: eventEdit ? eventEdit.fam_recommend : 0
    });
    
    const postEvent = async () => {
    
        const response = await axios.post(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/${eventEdit ? "eventEdit" : "event"
        }`,
        {
            id: event.id,
            name: event.name,
            date: event.date,
            stime: event.stime,
            etime: event.etime,
            description: event.description,
            fam_recommend: event.fam_recommend
        }
      );
      console.log(event);
        console.log(response);
    };
  
    const handleSubmit = () => {
        setShowModal(false);
        postEvent();
    }

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (type === 'checkbox') {
    setEvent((event) => ({
      ...event,
      [name]: checked ? 1 : 0,
    }));

  } else {
    setEvent((event) => ({
      ...event,
      [name]: value,
    }));
  }
};
  return (
    <div className="absolute flex items-center justify-center w-screen h-screen left-0 top-0 bg-black bg-opacity-35">
      <div className="w-1/2 h-fit py-10 flex flex-col justify-center items-center rounded-md bg-sky-100 shadow-sm shadow-slate-500">
        <h1 className="font-serif text-2xl pb-5 font-bold text-black">
          {eventEdit ? "Edit Event" : "New Event"}
        </h1>
        <form className="flex flex-col text-slate-500 items-center w-2/3">
            <div className="w-full my-3">
                <label className="block mb-2 font-serif text-lg" htmlFor="name">
                Event name:
                </label>
                <input
                maxLength={30}
                className="w-full p-2 text-slate-500 border-2 h-10 rounded-md  outline-none focus:ring-4 focus:ring-blue-200"
                type="text"
                name="name"
                required
                value={event.name}
                onChange={handleChange}
                placeholder="Event name..."
                />
            </div>
            
            <div className="flex w-full justify-between my-3">
                <div className="">
                    <label className="font-bold text-slate-500 text-sm" htmlFor="time">
                    Start time:
                    </label>
                    <input
                    className="p-2 font-bold text-black ms-1 border-2 h-8 rounded-md border-slate-300 focus:border-cyan-200 outline-none focus:ring-1 focus:ring-cyan-200"
                    type="time"
                    required
                    value={event.stime}
                    onChange={handleChange}
                    aria-label="Time"
                    name="stime"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-500 text-sm" htmlFor="time">
                    End time:
                    </label>
                    <input
                    className="p-2 font-bold text-black ms-1 border-2 h-8 rounded-md border-slate-300 focus:border-cyan-200 outline-none focus:ring-1 focus:ring-cyan-200"
                    type="time"
                    required
                    value={event.etime}
                    onChange={handleChange}
                    aria-label="Time"
                    name="etime"
                    />
                </div>    
          </div>
          
            <div className="w-full my-3">
                <label className="block mb-2 font-serif text-lg" htmlFor="description">
                Description:
                </label>
                <textarea
                maxLength={100}
                className="w-full p-2 text-slate-500 border-2 h-fit rounded-md outline-none focus:ring-4 focus:ring-blue-200"
                name="description"
                value={event.description}
                onChange={handleChange}
                placeholder="Brief description of the event..."
                cols="30"
                rows="3"
                />
          </div>
          <div className="w-full flex  items-center mt-2">
                <label className="block font-serif text-lg" htmlFor="fam_recommend">
                Recommend families to come:
                </label>
              <input
                type="checkbox"
                className="h-4 w-4 rounded-xl p-2 border-black ring-black ml-2 text-cyan-500"
                name="fam_recommend"
                checked={event.fam_recommend === 1}
                value={event.fam_recommend}
                onChange={handleChange}
                />
            </div>
            <div className="w-full flex mt-5 justify-between">
                <CustomButton
                title="Submit"
                styles="w-1/3 hover:bg-blue-300
                hover:border-blue-300"
                handlePress={() => handleSubmit()}
                />
                <CustomButton
                title="Cancel"
                styles="w-1/3  text-black hover:text-white hover:bg-red-300"
                handlePress={() => setShowModal(false)}
                />
            </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;