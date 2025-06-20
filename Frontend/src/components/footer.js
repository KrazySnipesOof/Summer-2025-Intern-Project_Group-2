import React, { useState } from "react";
import { Container } from "react-bootstrap";
const Footer = () => {
  return (
    <>
      <div className="footer-wrapper">
        <Container>
          <div className="copyright">
            Copyright © 2023 BISI. All rights reserved.
          </div>
        </Container>
      </div>
    </>
  );
};

export default Footer;
