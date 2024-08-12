import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faTasks } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "./CustomButton";
import axios from "axios";

const EventActivity = ({ activities,setShowModal, setCurrentAct }) => {
  
  const handleClick = async () => {
    try {
        const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/deleteActivity/${activities.id}`
      );
        console.log(response);      
      } catch (error) {
        console.error(error);
      }
  }

  const handleModal = () => {
    setShowModal(true);
    setCurrentAct(activities);
    console.log("CurrentAct has been set")
  }

  const formatTime = (timeStr) => {
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  }
  
  return (
    
    <div className="flex font-serif h-20 w-full rounded-md p-2 mt-2 bg-blue-300 items-center justify-between">
      <div className="flex gap-x-3">
        <FontAwesomeIcon icon={faTasks} className="text-black" size="lg" />
        <h1 className="font-serif font-bold text-blue-500">{activities.name}</h1>
      </div>
      <div className="flex gap-x-3">
        <div className="flex gap-2">
          <p className="bg-white px-1 mr-4 rounded-md">{activities.type}</p>
          <p className="bg-white flex justify-center items-center w-28 px-1 rounded-md">From: {formatTime(activities.start_time)}</p>
          <p className="bg-white flex justify-center items-center w-28 px-1 rounded-md">To: {formatTime(activities.end_time)}</p>
        </div>
        <CustomButton
          title={"edit"}
          styles={"w-fit px-1"}
          handlePress={() => handleModal()}
        />
        <button
          onClick={()=>handleClick()}
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-400"
            size="sm"
          />
        </button>
        {/* {showModal && (
          <Modal
            mode={"Edit"}
            setShowModal={setShowModal}
            setActivity={setActivity}
            activity={activity}
            act={activities}
          />
        )} */}
      </div>
    </div>

    );
  
};

export default EventActivity;