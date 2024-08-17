import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  CartesianGrid,
  Line,
  Label,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const ACTIVITY_COLORS = {
  Exercise: "#FFBB28",
  Worship: "#00C49F",
  Socialize: "#0088FE",
};

const Alert_Type_COLORS = {
  "Meal service": "#0088FE",
  Assistance: "#00C49F",
  Maintenance: "#FFBB28",
  "Medical Refill": "#f4acb7",
};
const MOOD_TYPES = ["mental", "physical", "social"];
const Activity_Types = ["Exercise", "Worship", "Socialize"];

const Home = () => {
  const [Residents, setResidents] = useState([]);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [residentMoodData, setResidentMoodData] = useState([]);
  const [data, setData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitData, setVisitData] = useState([]);
  const [passoutData, setPassoutData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [alertFrequencyData, setAlertFrequencyData] = useState([]);
  const [homeData, setHomeData] = useState([]);
  const [AppointmentData, setAppointmentData] = useState({});

  const getAllResidents = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/Residents`
      );

      setResidents(response.data.Residents);
      setResidents(response.data.Residents);
    } catch (error) {
      console.error(error);
    }
  };

  const getCheckinReport = async (date) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/wellbeing`,
        {
          params: { date: date },
        }
      );

      const formattedData = response.data.newCheckin.map((item) => ({
        name: item.mood_type,
        value: parseFloat(item.avg_score),
      }));

      setData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getResidentMoodReport = async (residentId, date) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/residentMoodReport/${residentId}`,
        {
          params: { date },
        }
      );

      console.log("Resident data: ", response.data);

      const formattedData = response.data.newCheckin.map((item) => ({
        name: item.mood_type,
        value: parseFloat(item.avg_score),
      }));

      setResidentMoodData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getActivityReport = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/attendanceReport`
      );

      const formattedActivityData = response.data.AttendanceReport.map(
        (item) => ({
          name: item.activity_name,
          attendance: item.attendance_count,
          type: item.activity_type,
          color: ACTIVITY_COLORS[item.activity_type] || "#8884d8",
        })
      );
      setActivityData(formattedActivityData);
    } catch (error) {
      console.error(error);
    }
  };

  const getVisitReport = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/visitTimeReport`
      );

      setVisitData(response.data.VisitReport);
    } catch (error) {
      console.error(error);
    }
  };

  const getPassoutReport = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/PassoutTimeReport`
      );
      setPassoutData(response.data.PassoutTimeReport);
    } catch (error) {
      console.error(error);
    }
  };

  const getEventReport = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/eventAttendanceReport`
      );

      const formattedEventData = response.data.map((item) => ({
        event_name: item.event_name,
        event_type: item.event_type,
        event_date: item.event_date,
        event_start_time: item.event_start_time,
        event_end_time: item.event_end_time,
        attendance_count: item.attendance_count,
        color: ACTIVITY_COLORS[item.event_type] || "#8884d8",
      }));

      setEventData(formattedEventData);
    } catch (error) {
      console.error(error);
    }
  };

  const getAlertFrequency = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/alertFrequencyReport`
      );

      const formattedAlertData = response.data.AlertFrequency.map((item) => ({
        alert_Type: item.alert_Type,
        count: item.count,
        color: Alert_Type_COLORS[item.alert_Type] || "#8884d8",
      }));

      setAlertFrequencyData(formattedAlertData);
    } catch (error) {
      console.error(error);
    }
  };

  const getHomeData = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/UsersNumberReport`
      );

      const formattedUserData = response.data.Users.map((item) => {
        if (item.UserType === "Residents") {
          return {
            UserType: "Residents",
            NumberOfUsers: item.NumberOfUsers,
          };
        } else if (item.UserType === "Caregivers") {
          return {
            UserType: "Staff",
            NumberOfUsers: item.NumberOfUsers,
          };
        }
      });

      setHomeData(formattedUserData);
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointment = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/todaysAppointment`
      );

      if (response.data.visitReport && response.data.visitReport.length > 0) {
        setAppointmentData(response.data.visitReport[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    getCheckinReport(formattedDate);
  }, [selectedDate]);

  useEffect(() => {
    getAllResidents();
    getAppointment();
    getActivityReport();
    getVisitReport();
    getPassoutReport();
    getEventReport();
    getAlertFrequency();
    getHomeData();
  }, []);

  useEffect(() => {
    console.log("Selected Id: ", selectedResidentId);
    if (selectedResidentId) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      getResidentMoodReport(selectedResidentId, formattedDate);
    }
  }, [selectedResidentId, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mr-10 grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        {homeData.map((user) => (
          <div
            key={user.UserType}
            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {user.NumberOfUsers}
              </h2>
              <p className="text-xl font-bold">{user.UserType}</p>
            </div>
            <div className="bg-gray-200 rounded-full p-2">
              <FontAwesomeIcon icon={faUserAlt} className="text-xl" />
            </div>
          </div>
        ))}
        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {AppointmentData.appointments || 0}
            </h2>
            <p className="text-xl font-bold">Appointments</p>
          </div>
          <div className="bg-gray-200 rounded-full p-2">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-xl" />
          </div>
        </div>
      </div>

      <div>
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name }) => name}
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
            No Overall health record found
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
        {activityData.length > 0 ? (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Activity Attendance Report
            </h1>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="attendance" name="Attendance">
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Legend
                  payload={Activity_Types.map((type, index) => ({
                    value: type,
                    type: "square",
                    id: type,
                    color: ACTIVITY_COLORS[type],
                  }))}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold text-gray-600 mt-10">
            No Activities record found
          </div>
        )}

        {eventData.length > 0 ? (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Event Attendance Report
            </h1>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventData}>
                <XAxis dataKey="event_name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="attendance_count" name="Attendance">
                  {eventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Legend
                  payload={Activity_Types.map((type, index) => ({
                    value: type,
                    type: "square",
                    id: type,
                    color: ACTIVITY_COLORS[type],
                  }))}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold text-gray-600 mt-10">
            No Activities record found
          </div>
        )}

        {visitData.length > 0 ? (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Visit Duration Report
            </h1>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                width={500}
                height={400}
                data={visitData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="visit_hour" />
                <YAxis
                  label={{
                    value: "Visit Time",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="visit_count"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold text-gray-600 mt-10">
            No record found
          </div>
        )}

        {passoutData.length > 0 ? (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Passout Report
            </h1>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                width={500}
                height={400}
                data={passoutData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="request_time" />
                <YAxis
                  label={{
                    value: "Requests",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="Hour"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold text-gray-600 mt-10">
            No record found
          </div>
        )}

        {alertFrequencyData.length > 0 ? (
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              Alert Frequency Report
            </h1>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={alertFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="alert_Type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Frequency"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold text-gray-600 mt-10">
            No record found
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Resident Mood Report
        </h1>
        <div className="flex justify-center mb-6">
          <select
            value={selectedResidentId}
            onChange={(e) => setSelectedResidentId(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select a Resident</option>
            {Residents.map((resident) => (
              <option key={resident.id} value={resident.id}>
                <img src={resident.image_url} />
                {resident.first_name} {resident.last_name}
              </option>
            ))}
          </select>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border border-gray-300 rounded p-2 ml-4"
          />
        </div>

        {residentMoodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={residentMoodData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name }) => name}
              >
                {residentMoodData.map((entry, index) => (
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
            No mood data found for the selected resident
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;