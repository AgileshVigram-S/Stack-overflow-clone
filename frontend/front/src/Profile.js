import { useState, useEffect } from "react";
import { requestNotificationPermission } from "./utils/notifications";
import axios from "axios";

const Profile = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const userId = "user123"; // Replace with dynamic user ID

    // Fetch user notification status
    const fetchNotificationStatus = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/user/notifications?userId=${userId}`
        );
        setNotificationsEnabled(data.enabled);
      } catch (error) {
        console.error("Error fetching notification status:", error);
      }
    };
    
    // Toggle user notification status
    const toggleNotifications = async () => {
      try {
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted && !notificationsEnabled) return;
    
        const { data } = await axios.post(
          "http://localhost:5000/api/user/notifications",
          {
            userId,
            enabled: !notificationsEnabled,
          }
        );  
        setNotificationsEnabled(data.enabled);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    };
  
    // const toggleNotifications = async () => {
    //   try {
    //     const response = await axios.post(
    //       "http://localhost:5000/api/user/notifications",
    //       { enabled: !notificationsEnabled }
    //     );
    //     console.log(response.data);
    //     setNotificationsEnabled(!notificationsEnabled);
    //   } catch (error) {
    //     console.error("Error updating notifications:", error);
    //   }
    // };
  
    return (
      <div>
        <h2>Profile Settings</h2>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
          Enable Notifications
        </label>
      </div>
    );
  };
  
  export default Profile;
