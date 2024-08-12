import React, { useEffect, useState } from "react";
import Tabs from "./tabs";
import Alert from "./alert";
import UserInfo from "./userInfo";
import UserForm from "./Form";
import { ToastContainer } from "react-toastify";
import axios from "axios";
//2024-07-15
import Moodlist from "./moodlist";
import Checkin from "./checkin";
import SelectDate from "./dateselector";
//end
const UserDetailPage = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState("Alerts");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  //2024-07-15
  const [checkins, setCheckins] = useState([]);
  const [selectedCheckin, setselectedCheckin] = useState(null);
  //end
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [review, setReview] = useState(null);
  //2024-07-15
  const [checkinreview, setCheckinreview] = useState([]);
  const [checkinmoods, setCheckinmoods] = useState([]);
  const [filteredCheckins, setFilteredCheckins] = useState
    (checkins);
  //end
  //function to handle when clicking the alert
  const handleAlertClick = async (alert) => {
    const alertId = alert.id || alert.alert_id;

    if (
      selectedAlert &&
      (selectedAlert.id || selectedAlert.alert_id) === alertId
    ) {
      setSelectedAlert(null);
      setReview(null);
    } else {
      setSelectedAlert(alert);

      //get the alerts review(if it exists)
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_IP_ADDRESS}:3000/alertReview/${alertId}`
        );

        if (response.data.review) {
          setReview(response.data.review);
        } else {
          setReview(null);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }
  };

  const handleCheckinClick = async (checkin) => {
    const checkinId = checkin.checkin_id;
    //sets clicked checkin
    if (selectedCheckin && selectedCheckin.checkin_id === checkinId) {
      setselectedCheckin(null);
      setCheckinreview([]);
    } else {
      setselectedCheckin(checkin);

      //fetches reviewed checkin
      try {

        const Moodresponse = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:3000/checkinmoods/${checkinId}`
        );
        const Reviewresponse = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:3000/checkinreview/${checkinId}`
        );
        console.log("checkin review", Reviewresponse.data);
        if (Reviewresponse.data) {
          setCheckinreview(Reviewresponse.data.review);
        }
        console.log("mood scores:", Moodresponse.data);
        if (Moodresponse.data) {
          setCheckinmoods(Moodresponse.data.scores);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }
  }
  //end
  const handleLinkedUserClick = (userId) => {
    console.log("Hello");
  };

  const handleDelete = () => {
    alert("Delete user...");
  };

  const handleSubmit = () => {
    setIsFormOpen(false);
    window.location.reload(); //to refresh the page
  };

  //function to get alerts made by the resident
  const getResidentAlerts = async (user) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/residentAlerts/${user.id}`
      );
      if (response.data.alerts) {
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
  //2024-07-15
  // get checkins made by the resident 
  const getResidentCheckins = async (user) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:3000/residentCheckins/${user.id}`
      );
      console.log(response.data);
      if (response.data) {
        setCheckins(response.data.checkins);
      }
    } catch (error) {
      console.error("Error fetching checkins:", error);
    }
  }
  //end
  //function to get alerts made to the caregivers
  const getCaregiverAlerts = async (user) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/caregiverAlerts/${user.id}`
      );

      console.log("Caregiver response: ", response.data);

      if (response.data.alerts) {
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
  //2024/07/15
  //gets checkins reviewed by caregiver
  const getCaregiverCheckins = async (user) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/caregiverCheckins/${user.id}`
      );
      console.log(response.data);
      if (response.data) {
        setCheckins(response.data.checkins);
      }
    } catch (error) {
      console.error("Error fetching checkins:", error);
    }
  }
  //end

  useEffect(() => {
    if (user.userType === "Resident") {
      getResidentAlerts(user);
      //2024-07-15
      getResidentCheckins(user);
      //end
    } else if (user.userType === "Caregiver") {
      getCaregiverAlerts(user);
      //2024-07-15
      getCaregiverCheckins(user);
      //end
    }
  }, [user]);

  //function to calculate response time
  const calculateResponseTime = (alertTime, reviewTime) => {
    const alertDate = new Date(alertTime);
    const reviewDate = new Date(reviewTime);
    const responseTime = Math.abs(reviewDate - alertDate);
    const hours = Math.floor(responseTime / 36e5);
    const minutes = Math.floor((responseTime % 36e5) / 60000);
    return `${hours}h ${minutes}m`;
  };

  //function to format date(into South African style)
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

  const handledateRange = (startdate, enddate) => {
    const filter = checkins.filter(checkin => formatDate(checkin.date) >= formatDate(startdate) && formatDate(checkin.date) <= formatDate(enddate));
    if (checkins) {
      setFilteredCheckins(filter);
    }
    console.log("these are checkins ", checkins);

  }

  return (
    <div className="p-8">
      <ToastContainer />
      <div className="mb-8">
        <UserInfo
          user={user}
          onLinkedUserClick={handleLinkedUserClick}
          onEdit={() => setIsFormOpen(true)}
          onDelete={handleDelete}
          onBack={onBack}
        />
      </div>

      {user.userType === "Resident" && (
        <>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6 bg-white rounded-b-lg shadow-md">
            {activeTab === "Alerts" && (
              <>
                {alerts.map((alert) => (
                  <div key={alert.id} className="mb-4">
                    <Alert
                      type={alert.alert_Type}
                      message={alert.alert_Type}
                      onClick={() => handleAlertClick(alert)}
                    />
                    {selectedAlert && selectedAlert.id === alert.id && (
                      <div className="p-4 mt-1 ml-4 bg-gray-100 rounded shadow">
                        {review ? (
                          <>
                            <p>
                              <strong>Description:</strong> {review.description}
                            </p>
                            <p>
                              <strong>Response Time:</strong>{" "}
                              {calculateResponseTime(alert.Time, review.time)}
                            </p>
                            <p>
                              <strong>Caregiver ID:</strong>{" "}
                              {review.caregiver_id}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold">There is no review.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {activeTab === "Check-ins" && (
              <>
                <SelectDate dateRange={handledateRange} />
                {filteredCheckins.map((checkin) => (
                  <div key={checkin.id} className="mb-4">
                    <div>
                      <Checkin score={checkin.totalscore}
                        onClick={() => handleCheckinClick(checkin)}
                      />
                      <p> <strong>Date submited:</strong> {formatDate(checkin.date)}</p>
                    </div>
                    {selectedCheckin && selectedCheckin.id === checkin.id && (
                      <div className="p-4 mt-1 ml-4 bg-gray-100 rounded shadow">
                        {checkinreview && checkinmoods ? (
                          <>
                            <Moodlist checkinmoods={checkinmoods} />
                            <p>
                              <strong>Caregiver:</strong>{checkinreview.first_name}
                            </p>
                            <p>
                              <strong>Description:</strong>{checkinreview.review}
                            </p>
                          </>
                        ) : (<p className="font-bold">There is no review.</p>)}
                      </div>
                    )}
                  </div>
                ))}
              </>)}
            {activeTab === "Daily-Activity" && (
              <div>Daily Activities content...</div>
            )}
          </div>
        </>
      )}

      {user.userType === "Caregiver" && (
        <>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-4 bg-[#fafbfb] rounded-b-lg shadow-md">
            {activeTab === "Alerts" && (
              <>
                {alerts.map((alert) => (
                  <div key={alert.alert_id} className="mb-4">
                    <Alert
                      type={alert.alert_Type}
                      message={alert.alert_Type}
                      onClick={() => handleAlertClick(alert)}
                    />
                    {selectedAlert &&
                      selectedAlert.alert_id === alert.alert_id && (
                        <div className="p-4 mt-1 ml-4 bg-gray-100 rounded shadow">
                          <p>
                            <strong>Resident:</strong> {alert.first_name}{" "}
                            {alert.last_name}
                          </p>
                          <p>
                            <strong>Alert Time:</strong>{" "}
                            {formatDate(alert.Time)}
                          </p>
                          <img
                            src={alert.image_url}
                            alt="Resident"
                            className="w-16 h-16 mt-2 rounded-full"
                          />
                          {review ? (
                            <>
                              <p>
                                <strong>Description:</strong>{" "}
                                {review.description}
                              </p>
                              <p>
                                <strong>Response Time:</strong>{" "}
                                {calculateResponseTime(alert.Time, review.time)}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold font-serif">There is no review.</p>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </>
            )}
            {activeTab === "Check-ins" && (
              <div className="flex-row">
                <SelectDate dateRange={handledateRange} />
                <div>
                  {filteredCheckins.map((checkin) => (
                    <div key={checkin.id} className="mb-4">
                      <div className="mb-2">
                        <div className="flex">
                          <div className="mb-2 flex-row">
                            <img
                              src={checkin.image_url}
                              alt="Resident"
                              className="w-24 h-24 mt-2 mr-2 rounded-full"
                            />
                            <p className="mr-2" ><strong>{checkin.first_name} {checkin.last_name}</strong></p>

                            <p> <strong>Date submited:</strong> {formatDate(checkin.date)}</p>
                          </div>
                          <div className="w-80">
                            <Checkin score={checkin.totalscore}
                              onClick={() => handleCheckinClick(checkin)}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedCheckin && selectedCheckin.id === checkin.id && (
                        <div>
                          <p>not sure what to put here</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "Daily-Activity" && (
              <div>Activites they are responsible for</div>
            )}
          </div>
        </>
      )}

      {isFormOpen && (
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailPage;