/**
 * Component to display user information
 */

import React, { useState } from "react";

const UserInfo = ({ user, onLinkedUserClick, onEdit, onDelete, onBack }) => {
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  return (
    <div className="p-6 bg-[#fafbfb] rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">

          <img
            src={user.image_url}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold font-serif">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600 text-lg font-serif">{user.email}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-[#0b4dad] text-white rounded mr-2
            hover:bg-blue-500 font-serif"
          >
            Edit
          </button>
          {/* <button
            onClick={onDelete}
            className="px-6 py-2 bg-red-500 text-white rounded font-serif
            hover:bg-red-700"
          >
            {confirmSubmit ? "Confirm Delete" : "Delete"}
          </button>*/}
          <button
            onClick={onBack}
            className="px-6 py-2 bg-[#0b4dad] text-white rounded font-serif
            hover:bg-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="border-t-2 pt-4">
        <h3 className="text-3xl font-bold text-gray-800 font-serif">
          User Information
        </h3>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">First Name:</strong> {user.first_name}
        </p>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">Last Name:</strong> {user.last_name}
        </p>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">Gender:</strong> {user.gender}
        </p>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">Contact Number:</strong>{" "}
          {user.contact_number}
        </p>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">Email:</strong> {user.email}
        </p>
        <p className="mt-2 text-lg">
          <strong className="font-serif ">User Type: </strong>
          {/* MELO-REMOVED THE "-" IN FAMILY_MEMBER  */}
          {user.userType === 'Family_Member' ? 'Family Member' : user.userType}
        </p>

      </div>

      {/* Additional information for Resident */}
      {user.userType === "Resident" && (
        <div className="border-t-2 pt-4 mt-4">
          <h3 className="text-3xl font-bold text-gray-800 font-serif">
            Cottage Information
          </h3>
          <p className="mt-2 text-lg">
            <strong className="font-serif ">Cottage Name:</strong>{" "}
            {user.resident_cottage_name}
          </p>
          <p className="mt-2 text-lg">
            <strong className="font-serif ">Room Number:</strong>{" "}
            {user.resident_room_number}
          </p>
          {/* <div className="border-t-2 pt-4 mt-4">
            <h3 className="text-3xl font-bold text-gray-800 font-serif">
              Linked Information
            </h3>
            <p className="mt-2 text-lg">
              <strong className="font-serif ">Linked to Family Member:</strong>
              <button
                onClick={() => onLinkedUserClick(user.linkedFamilyMemberId)}
                className="text-blue-500 ml-2"
              >
                <img
                  src={user.linkedFamilyMemberImage}
                  alt="Linked Family Member"
                  className="w-8 h-8 rounded-full mr-2 inline"
                />
                {user.linkedFamilyMember}
              </button>
            </p>
          </div> */}
        </div>
      )}

      {/* Additional information for Family Member */}
      {/* {user.userType === "Family_Member" && (
        <div className="border-t-2 pt-4 mt-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Linked Resident Information
          </h3>
          <p className="mt-2 text-lg">
            <strong className="font-serif ">Linked to Resident:</strong>
            <button
              onClick={() => onLinkedUserClick(user.linkedResidentId)}
              className="text-blue-500 ml-2"
            >
              <img
                src={user.linkedResidentImage}
                alt="Linked Resident"
                className="w-8 h-8 rounded-full mr-2 inline"
              />
              {user.linkedResident}
            </button>
          </p>
        </div>
      )} */}

      {/* Additional information for caregiver */}
      {user.userType === "Caregiver" && (
        <div className="border-t-2 pt-4 mt-4">
          <h3 className="text-3xl font-bold text-gray-800 font-serif">
            Cottage Information
          </h3>
          <p className="mt-2 text-lg">
            <strong className="font-serif ">Cottage Name:</strong> masiso
          </p>
          <p className="mt-2 text-lg">
            <strong className="font-serif ">Available Status:</strong> online
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
