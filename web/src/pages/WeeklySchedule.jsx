import EventPlannerHeader from "../components/EventPlannerHeader.jsx";
import EventPlanner from "../components/EventPlanner.jsx";
import EventSection from "../components/EventSection.jsx";
import ClickableBubble from "../components/ClickableBubble.jsx";
import CustomButton from "../components/CustomButton.jsx";
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
    return <div className="absolute flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-r from-[rgb(135,206,250)] to-[rgb(100,149,237)] p-5">
      
      <EventPlannerHeader setShowModal={setShowModal}/>
      
      {!loading && <EventPlanner>
            
        <EventSection>
          {days?.map((day) => (
            <ClickableBubble key={day.id} event={day} activities={activity}/>
          ))}
        </EventSection>
      </EventPlanner>}
      {showModal && 
        <ActivityModal mode={"Create"} setShowModal={setShowModal}/>
      }
    </div>
  );
};

export default WeeklySchedule;

