import CustomButton from "../components/CustomButton";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EventActivity from "../components/EventActivity";
import Modal from "../components/Modal";
import axios from "axios";
import ActivityModal from "../components/ActivityModal";



const Event = () => {
  const { id } = useParams();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [activity, setActivity] = useState([]);
  const [currentAct, setCurrentAct] = useState(null);
  const [dayActivity, setDayActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [day, setDay] = useState({
    id: id,
    activities: activity
  });


  //Update day activity when you add a new activity
  useEffect(() => {
    setDay(day => ({
      ...day,
      activities: activity
    }))
    setDayActivity(prevDayActivity => ([...prevDayActivity, ...activity]));

  }, [activity])

  const handleSubmit = async (data) => {
    //If current activity exist, means we are editing
    if (currentAct !== null) {
      console.log("CurrentAct Exist")
      try {
        const response = await axios.post(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/editActivity`,
          {
            id: data.id,
            name: data.name,
            time: data.time,
            description: data.description,
            type: "Social",
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }

      setCurrentAct(null);
      setShowModal(false);
      return;
    }
    //Else we creating a new activity, there by adding it inside activity array
    setActivity([...activity, data]);
    setCurrentAct(null);
    setShowModal(false);
  }

  //When you update day activities
  const handleUpdate = async () => {
    const response = await axios.post(
      `http://${process.env.REACT_APP_IP_ADDRESS}:3000/dayActivity`,
      day
    );

    console.log(response);
  }

  //Get day activities from the server
  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await fetch(`http://localhost:3000/dayActivity/${id}`);
        const json = await response.json();
        setDayActivity(json);
      } catch (error) {
        console.error(error);
      }
    };
    getActivities();
  }, []);

  // const formatDate = (dateString) => {
  //   const options = {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   };
  //   return new Intl.DateTimeFormat("en-GB", options).format(
  //     new Date(dateString)
  //   );
  // };

  return (
    <div className="event font-serif h-screen flex flex-col py-5 items-center">
      <div className="w-full h-full font-serif flex gap-4 flex-col items-center">
        <div className="font-bold bg-sky-200 flex justify-around py-3 w-11/12 rounded-md  text-lg">
          <h1 className="font-bold text-3xl text-black">{days[id - 1]}</h1>
          <CustomButton
            title="Add New Activity"
            handlePress={() => setShowModal(true)}
            styles="text-sm w-1/2 hover:bg-zinc-300 hover:border-zinc-300"
          />
        </div>
        {showModal && (
          currentAct ?
            <ActivityModal
              mode={"Edit"}
              setShowModal={setShowModal}
              handleSubmit={handleSubmit}
              act={currentAct}
              setCurrentAct={setCurrentAct}
              dayId={id}
            /> :
            <ActivityModal
              mode={"Create"}
              setShowModal={setShowModal}
              handleSubmit={handleSubmit}
              setCurrentAct={setCurrentAct}
            />
        )}
        <div className="flex gap-3 w-11/12 h-[700px] rounded-md py-5 bg-sky-200 justify-evenly">
          <div className="w-11/12 mr-3">
            <h1 className="flex justify-center font-bold text-2xl text-black">
              {dayActivity && dayActivity.length > 0 ? "Activities" : "No Activities availabe"}
            </h1>
            <div className="w-full">
              {dayActivity &&
                dayActivity.map((act) => (
                  <EventActivity
                    key={act.id}
                    activities={act}
                    setCurrentAct={setCurrentAct}
                    setShowModal={setShowModal}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
