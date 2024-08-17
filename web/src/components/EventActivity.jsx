import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faTasks } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "./CustomButton";
import axios from "axios";

const EventActivity = ({ activities, setShowModal, setCurrentAct }) => {

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

    <div className="flex font-serif h-20 w-full rounded-md p-2 mt-2 bg-blue-200 items-center justify-between border-2 shadow border-blue-200">
      <div className="flex gap-x-3">
        <FontAwesomeIcon icon={faTasks} className="text-[#0b4dad]" size="xl" />
        <h1 className="font-serif font-bold text-xl text-black">{activities.name}</h1>
      </div>
      <div className="flex gap-x-3">
        <div className="flex gap-2">
          <p className="bg-transparent px-1 mr-6 shadow border-2 border-transparent justify-center items-center rounded-lg text-lg w-40 flex">{activities.type}</p>
          <p className="bg-transparent flex justify-center items-center w-40 px-1 rounded-lg text-lg mr-6 border-transparent border-2 shadow">From: {formatTime(activities.start_time)}</p>
          <p className="bg-transparent flex justify-center items-center w-40 px-1 rounded-lg shadow border-transparent boreder-2 text-lg mr-6">To: {formatTime(activities.end_time)}</p>
        </div>
        {/* <CustomButton
          title={"Edit"}
          styles="font-serif bg-white text-[#0b4dad] mx-1 text-lg shadow border-2 hover:bg-[#0b4dad]
          hover:text-white border-transparent p-3 rounded-lg font-bold h-10 flex justify-center"
          handlePress={() => handleModal()}
        /> */}
        <button
          onClick={() => handleClick()}
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-500 mr-6"
            size="xl"
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