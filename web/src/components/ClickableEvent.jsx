import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ClickableBubble = ({ event }) => {

    return (
        <Link
            to={`/events/${event.id}/edit`}
            className="font-serif font-medium bg-sky-100 px-2 rounded-md py-2 shadow  border-2 hover:shadow hover:shadow-blue-300 w-11/12 h-fit
      hover:bg-blue-300  hover:ring-blue-300
      hover:ring-4"
        >
            <div className="flex h-3/4 justify-between">
                <div>
                    <div className="flex">
                        <FontAwesomeIcon
                            icon={faCalendarDays}
                            className="text-blue-700"
                            size="4x"
                        />

                        <div className="flex flex-col mt-2 ml-2">
                            <h1 className="text-gray-500 text-lg font-bold">{event.name}</h1>
                            <p>{event.date}</p>
                        </div>

                    </div>

                </div>
                {event.daysLeft > 0 ? <h1 className="border-4 font-bold border-red-400 p-4 rounded-full">{`${event.daysLeft} days left`}</h1> :
                    <p className="bg-yellow-300 text-slate-900 p-5 font-bold rounded-full">Today</p>
                }
            </div>
        </Link>
    );
};

export default ClickableBubble;