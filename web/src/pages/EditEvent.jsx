import { useParams } from "react-router-dom";
import CreateEvent from "./CreateEvent";
import { useEffect, useState } from "react";

const EditEvent = () => {
  const [event, setEvent] = useState();
  const [activity, setActivity] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/event/${id}`);
        const json = await response.json();
        setEvent(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getActivities = async () => {
      try {
        const response = await fetch(`http://localhost:3000/dayActivity/${id}`);
        const json = await response.json();
        setActivity(json);
      } catch (error) {
        console.error(error);
      }
    };

    getActivities();
    getEvent();
  }, [id]);
  return event ? (
    <CreateEvent eventEdit={event[0]} activityEdit={activity} />
  ) : null;
};

export default EditEvent;
