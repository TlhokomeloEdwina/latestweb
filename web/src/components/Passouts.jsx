import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Passouts = ({
    passouts,
    filterDate,
    filterStatus,
    setFilterStatus,
    setFilterDate,
}) => {
    const [reason, setReason] = useState("");
    const [showReasonInput, setShowReasonInput] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    // Filter passouts based on selected date and status
    const filteredPassouts = passouts.filter((passout) => {
        const passoutDate = new Date(passout.start_date).toDateString();
        return (
            (!filterDate || passoutDate === new Date(filterDate).toDateString()) &&
            (filterStatus === "all" || passout.status === filterStatus)
        );
    });

    const handleStatusChange = async (id, status) => {
        console.log("Status handle: ", id);
        try {
            if (status === "Declined") {
                setCurrentId(id);
                setShowReasonInput(true);
            } else {
                const response = await axios.put(
                    `http://${process.env.REACT_APP_IP_ADDRESS}:3000/passouts/${id}/${status}`
                );
                toast.success(response.data.message);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to change status");
        }
    };

    const handleDeclineConfirm = async (id) => {
        console.log("Declined id: ", id);
        try {
            const response = await axios.put(
                `http://${process.env.REACT_APP_IP_ADDRESS}:3000/passouts/${id}/Declined`
            );
            toast.success(response.data.message);

            setReason("");
            setShowReasonInput(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to change status");
        }
    };

    const formatDate = (dateString) => {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Intl.DateTimeFormat("en-GB", options).format(
            new Date(dateString)
        );
    };


    return (
        <div>
            <div className="flex items-center mb-4  justify-center">
                <div className="mr-4">
                    <label className="mr-2 font-serif text-xl">Filter by Status:</label>
                    <select
                        className="border border-gray-300 bg-[#fafbfb]  rounded px-3 py-2"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                    </select>

                </div>
            </div>
            <ToastContainer />
            <h1 className="text-2xl font-bold font-serif mt-6 mb-4 ml-2">Passouts</h1>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredPassouts.map((passout) => (
                    <div
                        key={passout.id}
                        className="p-4 border border-gray-300 bg-[#fafbfb]  rounded-lg shadow-md text-lg"
                    >
                        <p>
                            <strong className="font-serif"> Name:</strong> {passout.first_name}  {passout.last_name}
                        </p>
                        <p>
                            <strong className="font-serif">Reason:</strong> {passout.reason}
                        </p>
                        <p>
                            <strong className="font-serif">Date:</strong>{" "}
                            {formatDate(new Date(passout.start_date).toLocaleString())}
                        </p>
                        {passout.status === "Pending" && (
                            <div className="mt-2">
                                <button
                                    onClick={() => handleStatusChange(passout.id, "Approved")}
                                    className="bg-[#0b4dad] text-white px-2 py-1 rounded-lg mr-2"
                                >
                                    <FontAwesomeIcon icon={faCheck} /> Approve
                                </button>
                                <button
                                    onClick={() => handleStatusChange(passout.id, "Declined")}
                                    className="bg-[#0b4dad] text-white px-2 py-1 rounded-lg"
                                >
                                    <FontAwesomeIcon icon={faTimes} /> Decline
                                </button>
                            </div>
                        )}
                        {passout.status === "Approved" && (
                            <p className="text-green-500 font-bold text-xl mt-2">Approved</p>
                        )}
                        {passout.status === "Declined" && (
                            <p className="text-red-500 font-bold text-xl mt-2  ">Declined</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Reason input popup */}
            {showReasonInput && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-[#fafbfb] p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4 font-serif">Reason for Decline:</h2>
                        <textarea
                            className="border border-gray-300 rounded w-full p-2 mb-4"
                            placeholder="Enter reason for decline..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowReasonInput(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-1 rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeclineConfirm(currentId)}
                                className="bg-red-500 text-white px-4 py-1 rounded-lg"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Passouts;
