import EventSection from "./EventSection";

const EventPlanner = ({ children }) => {
  return (
    <div className="bg-[#0b4dad] flex justify-evenly shadow-md font-sans rounded-md mt-8">
      {children}
    </div>
  );
};

export default EventPlanner;