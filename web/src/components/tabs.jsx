/**
 * Tabs component
 */

import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Alerts", "Check-ins"];

  return (
    <div className="flex justify-center mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-36 py-2 rounded-t-lg focus:outline-none ${activeTab === tab
            ? "bg-white text-[#0b4dad] border-t-4 border-[#0b4dad] font-serif text-xl"
            : "bg-gray-300  text-gray-600 font-serif "
            }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
