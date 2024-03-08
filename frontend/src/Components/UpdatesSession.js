import React, { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";

const UpdateSession = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/auditLog");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAuditLogs(data);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="update-container">
      <ScrollPanel style={{ width: "100%", height: "15rem" }}>
        <p>
          <strong>Latest Update</strong>
        </p>
        {auditLogs.slice().reverse().slice(0, 10).map((log) => (
          <div key={log._id} className="update-row">
            <div className="home-profile-pic">
              {log.admin && log.admin.profilePic && (
                <img
                  src={`http://localhost:3001/${log.admin.profilePic.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Admin Profile"
                />
              )}
            </div>
            <div className="update-details">
              <p style={{fontSize:"15px"}}>
                Admin {log.admin.staffId} {log.details}
              </p>
            </div>
          </div>
        ))}
      </ScrollPanel>
    </div>
  );
};

export default UpdateSession;
