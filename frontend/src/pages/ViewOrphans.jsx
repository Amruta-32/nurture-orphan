import { useEffect, useState } from "react";
import "./UserDashboard.css";

const ViewOrphans = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orphans")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>All Orphans</h2>

      {data.length === 0 ? (
        <p>No Orphans Found</p>
      ) : (
        data.map((o) => (
          <div className="card" key={o._id}>
            
            <img
              src={o.image ? `http://localhost:5000/uploads/${o.image}` : ""}
              alt=""
              className="orphan-img"
            />

            <h3>{o.name}</h3>
            <p>Age: {o.age}</p>
            <p>Gender: {o.gender}</p>
            <p>City: {o.city}</p>
            <p>Mobile: {o.mobile}</p>
            <p>Health: {o.healthStatus}</p>
            <p>Address: {o.address}</p>

          </div>
        ))
      )}
    </div>
  );
};

export default ViewOrphans;