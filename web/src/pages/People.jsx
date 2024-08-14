import React, { useState, useEffect } from "react";
import axios from "axios";
import UserDetailPage from "../components/UserDetailPage";
import UserForm from "../components/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const People = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserDetail, setShowUserDetail] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  //handle to open the form when we want to add a user
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  //handle to open the close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(null);
  };

  //submit the form
  const handleFormSubmit = (data) => {
    setFormData(data);
    setIsFormOpen(false);
  };

  //confirm after submiting
  const handleConfirm = () => {
    console.log(formData);
    setFormData(null);
  };

  //fetch all users in the database
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/AllUsers`
      );

      console.log(response.data);

      if (response.data.Users) {
        setUsersData(response.data.Users);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  //handle when clicking the user card
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  //redirect back to the page of users
  const handleBackToList = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  //filter by userType
  const filteredUsers = usersData.filter((user) =>
    filter === "All" ? true : user.userType === filter
  );

  //filter alphabetically
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.first_name.localeCompare(b.first_name);
    } else {
      return b.first_name.localeCompare(a.first_name);
    }
  });

  //when the users are still loading
  if (loading) {
    return <div className="font-bold font-serif text-center text-3xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      {showUserDetail ? (
        <UserDetailPage user={selectedUser} onBack={handleBackToList} />
      ) : (
        <>
          <div className="flex items-center mb-5 gap-5 justify-center">
            <div className="flex">
              <div className="mr-4">
                <label className="mr-2 font-serif text-xl">Filter by Type:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 bg-[#fafbfb]  rounded px-3 py-2 shadow"
                >
                  <option value="All">All</option>
                  <option value="Resident">Resident</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Family_Member">Family Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mr-2 font-serif text-xl">Sort by Name:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 bg-[#fafbfb]  rounded px-3 py-2 shadow"
                >
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <button
                onClick={handleOpenForm}
                className="flex items-center px-4 py-2 border-2 shadow hover:text-white border-transparent font-bold rounded-md text-[#0b4dad] border-blue-400 hover:bg-[#0b4dad]  focus:outline-none
              font-serif text-lg  ml-96 mt-6 bg-white"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add User
              </button>
            </div>
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedUsers.map((user) => (
              <div
                key={user.id}
                className="shadow-md rounded-lg p-4 cursor-pointer relative flex flex-col items-center justify-center transform transition-transform hover:scale-105
                bg-zinc-100 hover:bg-blue-100"
                onClick={() => handleUserClick(user)}
              >
                <div className="h-40 w-40 rounded-full overflow-hidden mb-4">
                  {user.image_url ? (
                    <img
                      src={user.image_url}
                      alt={`${user.first_name} ${user.last_name}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-300 text-blue-800 font-bold text-4xl uppercase">
                      {`${user.first_name.charAt(0)}${user.last_name.charAt(
                        0
                      )}`}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">{`${user.first_name} ${user.last_name}`}</h2>
                  <p className="text-gray-700 font-bold">
                    {/* MELO-REMOVED THE "-" IN FAMILY_MEMBER  */}
                    {user.userType === 'Family_Member' ? 'Family Member' : user.userType}</p>
                </div>
              </div>
            ))}
          </div>

          {isFormOpen && (
            <UserForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
          )}
        </>
      )}
    </div>
  );
};

export default People;
