import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { FaClockRotateLeft } from "react-icons/fa6";

import Footer from "../components/footer";
const LinkExpired = () => {
 
  return (
    <>
      <div className="login-page-wrapper expire-container">
        <div className="Login-wrapper">
          <Container>
            <div className="login-form">
                <FaClockRotateLeft/>
              <h2 className="title">Uh oh. This Booking Link Has Expired</h2>
              <div className="form-wrapper">
               
              </div>
              
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LinkExpired;
