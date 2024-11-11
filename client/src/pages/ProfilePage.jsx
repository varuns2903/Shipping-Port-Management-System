import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers,
        });        
        setUserData(response.data.data);        
        setEditedData({
          username: response.data.data.username,
          email: response.data.data.email,
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error("Error fetching profile:", error.response || error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: token };

    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        { username: editedData.username, email: editedData.email },
        { headers }
      );

      toast.success("Profile updated successfully");
      setUserData({ ...userData, ...editedData });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error.response || error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Profile</h2>

      {userData ? (
        <div className="card p-3">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">
                User ID
              </label>
              <input
                type="text"
                className="form-control"
                id="userId"
                value={userData.user_id}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={isEditing ? editedData.username : userData.username}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={isEditing ? editedData.email : userData.email}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={userData.role}
                readOnly
              />
            </div>

            <div className="mt-4">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-dark me-2"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn btn-dark" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfilePage;
