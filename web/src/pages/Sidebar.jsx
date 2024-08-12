/**
 * Sidebar page
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCalendar,
  faClipboard,
  faCog,
  faSignOutAlt,
  faFileWaveform,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { images } from "../constants/images";
//Melo-Added this to accept onToggerSidebar as a prop
const Sidebar = ({ onToggleSidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    //Melo-tells the parent component about the state change
    onToggleSidebar(!isCollapsed);
  };

  // Item for the nav items
  const NavItem = ({ to, icon, text, isCollapsed }) => (
    <Link
      to={to}
      className="flex items-center py-3 px-4 rounded-2xl hover:text-[#0b4dad] hover:bg-white transition-transform transform hover:scale-90"
    >
      <FontAwesomeIcon icon={icon} className="mr-4" size="lg" />
      {!isCollapsed && <span className="text-lg">{text}</span>}
    </Link>
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`${isCollapsed ? "w-[57px]" : "w-[235px]"
        } h-screen bg-[#0b4dad] text-zinc-100 fixed top-0 left-0 flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        <div className="flex items-center justify-evenly p-4">
          <h1
            className={`${isCollapsed ? "hidden" : "text-3xl font-semibold font-serif "
              }`}
          >
            Carewise
          </h1>
          <button className="text-xl" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
        <nav className="flex flex-col space-y-1 font-serif">
          <NavItem
            to="/home"
            icon={faHome}
            text="Home"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/people"
            icon={faUser}
            text="People"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/planner"
            icon={faCalendar}
            text="Planner"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/visitation"
            icon={faClipboard}
            text="Visitation"
            isCollapsed={isCollapsed}
          />
          {/* <NavItem
            to="/checkin"
            icon={faFileWaveform}
            text="Checkin"
            isCollapsed={isCollapsed}
          /> */}
          {/* <NavItem
            to="/settings"
            icon={faCog}
            text="Settings"
            isCollapsed={isCollapsed}
          /> */}
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 py-2 px-4 rounded hover:bg-red-700 flex items-center justify-center transition-transform transform hover:scale-105"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className=" justify-center"
            size="lg"
          />
          {!isCollapsed && <span className="text-lg">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
