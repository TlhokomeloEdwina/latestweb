// Visitation.jsx
import React, { useState, useEffect } from "react";
import Visits from "../components/Visits";
import Passouts from "../components/Passouts";
import axios from "axios";

const Visitation = () => {
  const [visits, setVisits] = useState([]);
  const [passouts, setPassouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("visitation");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch visits data
  const fetchVisits = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/visits`
      );
      if (response.data && response.data.Visits) {
        setVisits(response.data.Visits);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch passouts data
  const fetchPassouts = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/passouts`
      );
      if (response.data && response.data.Passouts) {
        setPassouts(response.data.Passouts);
      }
    } catch (error) {
      console.error("Error fetching passouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
    fetchPassouts();
  }, []);

  // Check if visits or passouts are still loading
  if (loading) {
    return <div className="text-3xl text-center font-serif font-bold">Loading...</div>;
  }

  // Filtered visits or passouts based on date and status
  const filteredVisits = visits.filter((visit) => {
    return (
      (!filterDate ||
        new Date(visit.visit_date).toDateString() ===
        new Date(filterDate).toDateString()) &&
      (filterStatus === "all" || visit.status === filterStatus)
    );
  });

  const filteredPassouts = passouts.filter((passout) => {
    return (
      (!filterDate ||
        new Date(passout.start_date).toDateString() ===
        new Date(filterDate).toDateString()) &&
      (filterStatus === "all" || passout.status === filterStatus)
    );
  });

  return (
    <div className="mt-6">
      {/* <h1 className="text-4xl font-bold text-center  font-serif ">
        Visitation and Passouts
      </h1> */}

      {/* Filtering options */}
      <div className="flex items-center mb-4 justify-center">
        <div className="mr-4">
          <label className="mr-2 font-serif text-xl">Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 bg-[#fafbfb]  rounded px-3 py-2"
          >
            <option value="visitation">Visits</option>
            <option value="passout">Passouts</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-serif text-xl">Filter by Date:</label>
          <input
            type="date"
            className="px-2 py-1 border border-gray-300 bg-[#fafbfb] rounded"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Conditionally render visits or passouts based on filterType */}
      {filterType === "visitation" ? (
        <Visits
          visits={filteredVisits}
          filterDate={filterDate}
          filterStatus={filterStatus}
        />
      ) : (
        <Passouts
          passouts={filteredPassouts}
          filterDate={filterDate}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setFilterDate={setFilterDate}
        />
      )}
    </div>
  );
};

export default Visitation;

