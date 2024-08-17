import EventPlannerHeader from "../components/EventPlannerHeader.jsx";
import EventPlanner from "../components/EventPlanner.jsx";
import EventSection from "../components/EventSection.jsx";
import ClickableBubble from "../components/ClickableBubble.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ActivityModal from "../components/ActivityModal.jsx";

const WeeklySchedule = () => {
  const [days, setDays] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const id = new Date().getDay() + 1;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    getDays();
    console.log("Days", days);
  }, []);

  const getDays = async () => {
    try {
      const response = await axios(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/days`
      );
      setDays(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Could not fetch data from the web server!");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="font-bold font-serif text-center text-3xl">Loading...</div>;
  }

  return (
    <div className="h-screen-min bg-zinc-100  p-5">



      <div className="mt-4 mb-4">
        {/*Melo-Show EventPlannerHeader with only the CustomButton */}
        <EventPlannerHeader setShowModal={setShowModal} showType="button" />
      </div>

      {/* Render EventPlanner and EventSection */}
      {!loading && (
        <EventPlanner>
          <EventSection>
            {days?.map((day) => (
              <ClickableBubble key={day.id} event={day} activities={activity} />
            ))}
          </EventSection>
        </EventPlanner>
      )}

      {/* Conditionally render ActivityModal */}
      {showModal && <ActivityModal mode={"Create"} setShowModal={setShowModal} />}
    </div>
  );
};

export default WeeklySchedule;