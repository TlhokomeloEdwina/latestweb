import CustomButton from "./CustomButton";
import ClickableBubble from "./ClickableBubble";
import { Link } from "react-router-dom";

const EventPlannerHeader = ({ setShowModal, showType }) => {
  return (
    <div className="bg-zinc-100 flex justify-between p-4 shadow-md shadow-slate-300 font-sans rounded-md -mt-2">
      <h1 className="font-serif text-[#0b4dad] text-3xl font-bold leading-10">
        Event Planner
      </h1>
      <div>
        {/*Melo- created this to pick to show either the link or the button */}
        {showType === "link" && (
          <Link
            to="/schedule"
            className="font-serif bg-white text-[#0b4dad] mx-1 shadow border-2 hover:bg-[#0b4dad]
            hover:text-white border-transparent p-3 rounded-lg font-bold h-10 text-lg"
          >
            Weekly Schedule
          </Link>
        )}

        {showType === "button" && (
          <CustomButton
            title="Add New Weekly Activity"
            handlePress={() => setShowModal(true)}
            styles="bg-white text-[#0b4dad] mx-1 shadow border-2 hover:bg-[#0b4dad]
            hover:text-white border-transparent p-3 rounded-lg font-bold h-12 text-lg"
          />
        )}
      </div>
    </div>
  );
};

export default EventPlannerHeader;