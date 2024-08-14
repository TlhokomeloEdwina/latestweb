import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

// Define a custom tooltip component with Tailwind CSS classes
const CustomTooltip = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    return (
      <div className="">
        <p className="text-white font-semibold text-xs">{`${payload[0].value.toFixed(
          1
        )}%`}</p>
      </div>
    );
  }

  return null;
};

const ClickableBubble = ({ event }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/dayActivity/${event.id}`
        );
        const json = await response.json();
        setActivities(json);
      } catch (error) {
        console.error(error);
      }
    };
    getActivities();
  }, [event.id]);

  // Initialize counts for each activity type
  const typeCounts = {
    Exercise: 0,
    Socialize: 0,
    Worship: 0,
  };

  // Count each activity type
  if (activities.length > 0) {
    activities.forEach((activity) => {
      if (typeCounts[activity.type] !== undefined) {
        typeCounts[activity.type] += 1;
      }
    });
  }

  // Calculate total number of activities
  const totalActivities = Object.keys(typeCounts).reduce(
    (acc, type) => acc + typeCounts[type],
    0
  );

  // Prepare data for the bar chart
  const data = Object.keys(typeCounts).map((type) => ({
    type,
    percentage:
      totalActivities === 0 ? 0 : (typeCounts[type] / totalActivities) * 100,
  }));

  return (
    <Link
      to={`/events/${event.id}`}
      className="font-serif font-medium bg-sky-100 px-2 rounded-md py-1 shadow border-2 hover:shadow hover:shadow-blue-300 w-full h-fit hover:bg-blue-300 hover:ring-blue-300 hover:ring-4"
    >
      <div className="flex h-3/4 gap-2 justify-between">
        <div className="flex shadow px-4 w-1/3 py-1">
          <FontAwesomeIcon
            icon={faClipboardList}
            className="text-blue-700"
            size="2x"
          />
          <div className="flex flex-col mt-2 ml-2">
            <h1 className="text-gray-500 text-lg font-bold">{event.name}</h1>
          </div>
        </div>
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={60}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="percentage"
                fill="#8884d8"
                background={{ fill: "transparent" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
};

export default ClickableBubble;