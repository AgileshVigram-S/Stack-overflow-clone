import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/person_question");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized. Please login.");
      return;
    }

    const fetchUsersAndCurrentUser = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:5000/api/users1",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersResponse.data);

        const currentUserResponse = await axios.get(
          "http://localhost:5000/api/auth1/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUserId(currentUserResponse.data._id);
        setFollowing(currentUserResponse.data.following || []);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchUsersAndCurrentUser();
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      setFollowing((prevFollowing) => [...prevFollowing, userId]); // Optimistic UI

      const response = await axios.post(
        "http://localhost:5000/api/follow",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.following) {
        setFollowing(response.data.following);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to follow user");
      // Revert if follow fails
      setFollowing((prevFollowing) =>
        prevFollowing.filter((id) => id !== userId)
      );
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="table-title">Users You May Know</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="user-list">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) =>
            user._id !== currentUserId ? (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Profile"
                    className="profile-img"
                  />
                  <p>{user.email}</p>
                </div>

                <button
                  className={`follow-btn ${
                    following.includes(user._id) ? "following" : ""
                  }`}
                  onClick={() => handleFollow(user._id)}
                  disabled={following.includes(user._id)}
                >
                  {following.includes(user._id) ? "Following" : "Follow"}
                </button>
              </div>
            ) : null
          )
        )}
      </div>

      <button onClick={goToAbout}>Go to About Page</button>
    </div>
  );
};

export default Dashboard;
