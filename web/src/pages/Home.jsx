import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const MOOD_TYPES = ["mental", "physical", "social"];

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getCheckinReport = async (date) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/wellbeing`,
        {
          params: {
            date: date,
          },
        }
      );

      const formattedData = response.data.map((item) => ({
        name: item.mood_type,
        value: parseFloat(item.avg_score),
      }));

      setData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    getCheckinReport(formattedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Overall Home Wellbeing Report
      </h1>
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd-MM-yyyy"
          className="border border-gray-300 rounded p-2"
        />
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ name }) => name} // Only display the name, not the value
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              payload={MOOD_TYPES.map((type, index) => ({
                value: type,
                type: "square",
                id: type,
                color: COLORS[index % COLORS.length],
              }))}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-lg font-semibold text-gray-600 mt-10">
          No record found
        </div>
      )}
    </div>
  );
};

export default Home;
