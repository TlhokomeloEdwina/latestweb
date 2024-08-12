import CustomButton from "./CustomButton";
import ClickableBubble from "./ClickableBubble";
import { Link } from "react-router-dom";

const EventPlannerHeader = ({ setShowModal }) => {
  return (
    <div className="bg-slate-300 flex justify-between p-4 shadow-md shadow-slate-300 font-sans rounded-md -mt-2">
      <h1 className="font-serif text-black text-3xl font-bold leading-10">
        Event Planner
      </h1>
      <div>
        <CustomButton
            title="Add New Weekly Activity"
            handlePress={() => setShowModal(true)}
            styles="text-sm ml-16 hover:bg-zinc-300 hover:border-zinc-300"
      />
        <Link
          to="/schedule"
          className="uppercase bg-transparent text-black mx-1 shadow border-2 hover:bg-gray-300
          hover:text-black border-black-400 p-3 rounded-lg font-bold h-10"
        >
          Weekly Schedule
        </Link>
      </div>
    </div>
  );
};

export default EventPlannerHeader;