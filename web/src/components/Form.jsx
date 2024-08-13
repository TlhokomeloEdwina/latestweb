/**
 * Component for adding new user/editing
 */

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UserForm = ({ user, onSubmit, onClose }) => {
  const [userType, setUserType] = useState("Admin");
  const [gender, setGender] = useState("male");
  const [formData, setFormData] = useState({
    id: user?.id,
    id_number: user?.id_number || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "male",
    contact_number: user?.contact_number || "",
    email: user?.email || "",
    password: user?.password || "12345",
    userType: user?.userType || "Admin",
    image_url: user?.image_url || "",
    expoDeviceToken: user?.expoDeviceToken || "",
    sassa_number: user?.resident_sassa_number || "",
    room_number: user?.resident_room_number || "",
    cottage_id: user?.cottage_id || 1,
  });

  const [confirmSubmit, setConfirmSubmit] = useState(false); //To confirm using the pop-up page

  //handle change when selecting the image
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    console.log(formData);
  };

  //handle change when selecting the type of user we are adding
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({ ...formData, userType: e.target.value });
  };

  //handle change when selecting the gender
  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setFormData({ ...formData, gender: e.target.value });
  };

  //submiting the form (will send it to the api to create a user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!confirmSubmit) {
      setConfirmSubmit(true);
      return;
    }

    if (!user) {
      try {
        const response = await axios.post(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/user`,
          {
            id_number: formData.id_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            gender: formData.gender,
            contact_number: formData.contact_number,
            password: formData.password,
            email: formData.email,
            image_url: formData.image_url,
            expoDeviceToken: "",
            userType: formData.userType,
            sassa_number: formData.sassa_number,
            room_number: formData.room_number,
            cottage_id: formData.cottage_id,
          }
        );
        console.log(response.data);
        toast.success(response.data.message);

        onSubmit(formData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to save user");
      }
    } else {
      try {
        const response = await axios.put(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/user/${user.id}`,
          {
            id_number: formData.id_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            gender: formData.gender,
            contact_number: formData.contact_number,
            email: formData.email,
            image_url: formData.image_url,
            expoDeviceToken: "",
            userType: formData.userType,
          }
        );
        console.log(response.data);
        toast.success(response.data.message);
        onSubmit(user);
      } catch (error) {
        console.error(error);
        toast.error("Failed to Edit user");
      }
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl h-5/6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 ">
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter ID number"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter first name"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter last name"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {gender === "other" && (
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter gender"
                />
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Contact Number (South Africa)
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter contact number"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleUserTypeChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Admin">Admin</option>
                <option value="Resident">Resident</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Family_Member">Family Member</option>
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="image_url"
                name="image_url"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              {formData.image_url && (
                <div className="mt-4">
                  <p>Selected Image:</p>
                  <img
                    src={formData.image_url}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <p>{formData.image_url}</p>
                </div>
              )}
            </div>

            {/* additional textInput if the user is a Resident*/}
            {userType === "Resident" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="sassaNumber"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Sassa Number
                  </label>
                  <input
                    type="text"
                    id="sassaNumber"
                    name="sassa_number"
                    value={formData.sassa_number || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Sassa Number"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="cottage"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Cottage
                  </label>
                  <select
                    id="cottage"
                    name="cottage"
                    value={formData.cottage || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="cottage1">Cottage 1</option>
                    <option value="cottage2">Cottage 2</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="roomNumber"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="room_number"
                    value={formData.room_number || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Room Number"
                  />
                </div>
              </>
            )}

            {/* additional textInput if the user is a Caregiver */}
            {userType === "Caregiver" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="cottage"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Cottage
                  </label>
                  <select
                    id="cottage"
                    name="cottage"
                    value={formData.cottage || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="cottage1">Cottage 1</option>
                    <option value="cottage2">Cottage 2</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="availableStatus"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Available Status
                  </label>
                  <select
                    id="availableStatus"
                    name="availableStatus"
                    value={formData.availableStatus || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </>
            )}

            {/* additional textInput if the user is a family member */}
            {userType === "Family_Member" && (
              <div className="mb-6">
                <label
                  htmlFor="residentId"
                  className="block text-sm font-medium text-gray-700 font-serif"
                >
                  Resident ID
                </label>
                <input
                  type="text"
                  id="residentId"
                  name="residentId"
                  value={formData.residentId || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Resident ID"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-serif"
              >
                {confirmSubmit ? "Confirm save" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl h-5/6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter User Id Number"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter first name"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter last name"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {gender === "other" && (
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter gender"
                />
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Contact Number (South Africa)
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter contact number"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleUserTypeChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Admin">Admin</option>
                <option value="Resident">Resident</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Family_Member">Family Member</option>
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 font-serif"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="image_url"
                name="image_url"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              {formData.image_url && (
                <div className="mt-4">
                  <p className="font-serif">Selected Image:</p>
                  <img
                    src={formData.image_url}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  {/* <p className="font-serif text-blue-500">{formData.image_url}</p> */}
                </div>
              )}
            </div>

            {/* additional textInput if the user is a Resident*/}
            {formData.userType === "Resident" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="sassaNumber"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Sassa Number
                  </label>
                  <input
                    type="text"
                    id="sassaNumber"
                    name="sassa_number"
                    value={formData.sassa_number}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Sassa Number"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="cottage"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Cottage
                  </label>
                  <select
                    id="cottage"
                    name="cottage"
                    value={formData.cottage || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="cottage1">Cottage 1</option>
                    <option value="cottage2">Cottage 2</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="roomNumber"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="room_number"
                    value={formData.room_number || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Room Number"
                  />
                </div>
              </>
            )}

            {/* additional textInput if the user is a Caregiver */}
            {userType === "Caregiver" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="cottage"
                    className="block text-sm font-medium text-gray-700 font-serif"
                  >
                    Cottage
                  </label>
                  <select
                    id="cottage"
                    name="cottage"
                    value={formData.cottage || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="cottage1">Cottage 1</option>
                    <option value="cottage2">Cottage 2</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="availableStatus"
                    className="block text-sm font-medium text-gray-700font-serif"
                  >
                    Available Status
                  </label>
                  <select
                    id="availableStatus"
                    name="availableStatus"
                    value={formData.availableStatus || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </>
            )}

            {/* additional textInput if the user is a family member */}
            {userType === "Family_Member" && (
              <div className="mb-6">
                <label
                  htmlFor="residentId"
                  className="block text-sm font-medium text-gray-700 font-serif"
                >
                  Resident ID
                </label>
                <input
                  type="text"
                  id="residentId"
                  name="residentId"
                  value={formData.residentId || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Resident ID"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 inline-flex items-center px-4 py-2 border text-lg font-medium rounded-md  text-white bg-[#0b4dad]  hover:bg-blue-500 font-serif"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border text-lg font-medium rounded-md text-white bg-[#0b4dad]  hover:bg-blue-500 font-serif"
              >
                {confirmSubmit ? "Confirm Edit" : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default UserForm;
