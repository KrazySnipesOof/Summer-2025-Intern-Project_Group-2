import React  from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import logo from "../assets/img/bisi_logo.png";

const ResetHeaderBar = () => {

  return (
    <>
      <div className="headertop-wrapper">
        <Container>
          <div className="headerbar d-md-flex justify-content-between align-items-center">
            <div className="logobar">
              <Link to="/dashboard" className="mb-4 mb-md-0">
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ResetHeaderBar;
