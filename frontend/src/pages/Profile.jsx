import "./UserDashboard.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="dashboard-container">
      <h2>My Profile</h2>

      <div className="card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
        <p><strong>City:</strong> {user.city}</p>
      </div>
    </div>
  );
};

export default Profile;