import EventPlannerHeader from "../components/EventPlannerHeader.jsx";
import EventPlanner from "../components/EventPlanner.jsx";
import EventSection from "../components/EventSection.jsx";
import ClickableEvent from "../components/ClickableEvent";
import EventActivity from "../components/EventActivity"
import SlideShow from "../components/SlideShow.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import EventModal from "../components/EventModal.jsx";
import CalendarGrid from "../components/CalendarGrid.jsx";

const EventPlannerPage = () => {
  const [events, setEvents] = useState([]);
  const [eventEdit, setEventEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localEvents, setLocalEvents] = useState([]);
  const [dayActivity, setDayActivity] = useState([]);
  const [date, setDate] = useState();
  const [showModal, setShowModal] = useState(false);
  const [activity, setActivity] = useState();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState();

  const handleCreateEvent = () => {

  }

  const handleGeneralTasks = () => {

  }

  useEffect(() => {
    getDayActivity();
    getEvents();
  }, [])

  useEffect(() => {
    populateLocalEvents(events);
  }, [events])

  useEffect(() => {
    sortEvents(localEvents);
    console.log("Current: ", currentEvent);
    console.log("Upcoming", upcomingEvents)
  }, [localEvents])

  useEffect(() => {
    const activities = [];
    dayActivity?.forEach(act => {
      activities.push(act);
    });
    setActivity(activities);
  }, [dayActivity])

  const getDayActivity = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:3000/dayActivity/${new Date().getDay() + 1}`)
      setDayActivity(response.data);
      setLoading(false);
      console.log("Response", response);
      console.log("DayAct: ", dayActivity);
    } catch (error) {
      console.error(error);
    }
  }
  const getEvents = async () => {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/events`
      );
      const json = await response.json();
      setEvents(json);
      setLoading(false);
    } catch (error) {
      console.error("Could not fetch data from the web server!");
      setLoading(false);
    }
  };

  const sortEvents = (inputEvents) => {
    let upcoming = [];

    inputEvents?.map((event) => {
      if (event.daysLeft > 0 && event.daysLeft < 11) {
        if (upcoming.length < 2) {
          upcoming.push(event);
        }
      } else if (event.daysLeft === 0) {
        setCurrentEvent(event);
      }
    });

    if (upcoming.length > 0) {
      setUpcomingEvents(upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
  }

  const handleDayClick = (date, parseEvent) => {
    setEventEdit(null);
    parseEvent && setEventEdit(parseEvent);
    date && setDate(date);
    setShowModal(true);
  }

  const populateLocalEvents = (events) => {
    const today = new Date();
    const millisecondsInDay = 1000 * 60 * 60 * 24;

    const updatedLocalEvents = events.map((event) => {
      const days = Math.floor((new Date(event.date) - today) / millisecondsInDay) + 1;
      return {
        id: event.id,
        name: event.name,
        date: event.date,
        description: event.description,
        daysLeft: days
      };
    });


    setLocalEvents(updatedLocalEvents);


  };


  if (loading) {
    return <div className="font-bold font-serif text-center text-3xl">Loading...</div>;
  }

  return (
    <div className="h-screen-min bg-zinc-100 p-5">
      {/* Melo-made sure the eventeHeader only show the link insted of both the link and button */}
      <EventPlannerHeader setShowModal={setShowModal}
        showType="link" />
      <h1 className="text-2xl font-bold mt-4 font-serif">{`${days[new Date().getDay()]} Activities`}:</h1>

      <SlideShow>
        {dayActivity && dayActivity.length > 0 ?

          dayActivity.map((act) => <EventActivity key={act.id} activities={act} setActivity={setActivity} />) : <h1 className="font-bold font-serif text-center text-3xl">No activities today</h1>
        }
      </SlideShow>


      {/* {!loading && <EventPlanner>
          <div className="h-full w-full">
          {currentEvent && 
            <EventSection>
              <ClickableEvent event={currentEvent} />
            </EventSection>
            } 
            
            <EventSection>
              {dayActivity && dayActivity.length > 0 ?
          
                dayActivity.map((act) => <EventActivity key={act.id} activities={act} setActivity={setActivity} />) : <h1 className="font-bold">No activities today</h1>
              }
            </EventSection>
            {upcomingEvents && upcomingEvents.length > 0 &&
              <EventSection>
                {upcomingEvents.map((eve) =>
                  <ClickableEvent key={eve.id} event={eve} />
                )}
              </EventSection>
            }
            </div>
        </EventPlanner>} */}

      <div className="h-screen bg-zinc-100 shadow-2xl rounded-lg p-5">
        <CalendarGrid handleClick={handleDayClick} />
        {showModal && <EventModal eventEdit={eventEdit} date={date} setShowModal={setShowModal} />}
      </div>
    </div>
  );
};

export default EventPlannerPage;

