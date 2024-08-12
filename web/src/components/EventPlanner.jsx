import EventSection from "./EventSection";

const EventPlanner = ({ children }) => {
  return (
    <div className="bg-[rgb(135,206,250)] flex justify-evenly shadow-md font-sans rounded-md">
      {children}
    </div>
  );
};

export default EventPlanner;