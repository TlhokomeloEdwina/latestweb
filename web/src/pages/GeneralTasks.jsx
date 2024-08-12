import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import EventActivity from "../components/EventActivity";
import Modal from "../components/Modal";

const GeneralTasks = () => {
  const [activity, setActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3000/general-activities");
      const activities = await response.json();
      setActivity(activities);
    } catch (error) {
      console.error(error);
    }
  };

  const getTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/general-activities");
      const activities = await response.json();
      setActivity(activities);
    } catch (error) {
      console.error(error);
    }
  };
  //this 

  useEffect(() => getData, []);

  return (
    <div className="bg-[#fafbfb] p-4 flex flex-col gap-5">
      <div className=" bg-[#bfcddb] py-2 text-white rounded-md flex items-center justify-around">
        <h1 className="font-bold text-2xl font-serif">General Tasks</h1>
        <CustomButton
          title={"Create new"}
          handlePress={() => setShowModal(true)}
        />
      </div>
      <div className="bg-blue-300 rounded-md p-5">
        {activity?.map((act) => (
          <EventActivity key={act.id} activities={act} />
        ))}
        {showModal && (
          <Modal
            mode="Create"
            activity={activity}
            setActivity={setActivity}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </div>
  );
};

export default GeneralTasks;
