import React from "react";
import { Card } from "react-bootstrap";

const CardTemplate = ({ title, text1, icon }) => {
  return (
    <div>
      <Card
        style={{
          width: "18rem",
          backgroundColor: "white",
          margin: "1rem",
          border: "none",
        }}
      >
        <Card.Body>
          <div className="row">
            <div className="col-3 d-flex justify-content-center align-items-center card-icon">
              {icon}
            </div>
            <div className="col-9">
              <Card.Title>{title}</Card.Title>
              <Card.Text className="card-text">{text1}</Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardTemplate;
