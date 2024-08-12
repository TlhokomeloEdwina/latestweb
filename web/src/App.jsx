import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Home from "./pages/Home";
import People from "./pages/People";
import Planner from "./pages/Planner";
import Visitation from "./pages/Visitation";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import EventPlannerPage from "./pages/EventPlannerPage";
import Event from "./pages/Event";
import CreateEvent from "./pages/CreateEvent";
import WeeklySchedule from "./pages/WeeklySchedule";
import EditEvent from "./pages/EditEvent";
//2024/07-15
import Checkin from "./pages/Checkin";
//end

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Melo-Added state for sidebar collapse

  const handleToggleSidebar = (collapsed) => {
    setIsCollapsed(collapsed); // Melo-Function to handle sidebar toggle
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <div className="flex">
              <Sidebar onToggleSidebar={handleToggleSidebar} />
              <div
                className={`flex-grow  min-h-screen p-3 ml-2 bg-zinc-100 transition-all duration-300 ${
                  isCollapsed ? "ml-[57px]" : "ml-[235px]"
                }`}
              >
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/checkin" element={<Checkin />} />
                  <Route path="/planner" element={<EventPlannerPage />} />
                  <Route path="/visitation" element={<Visitation />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/events/:id" element={<Event />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/schedule" element={<WeeklySchedule />} />
                  <Route path="/events/:id/edit" element={<EditEvent />} />
                </Routes>
              </div>
            </div>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
