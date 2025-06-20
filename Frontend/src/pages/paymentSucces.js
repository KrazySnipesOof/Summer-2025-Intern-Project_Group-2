import React, { useEffect, useState } from "react";
import Logo from "../assets/img/bisi_logo.png";
import { Button, Image } from "react-bootstrap";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PaymentSucces() {
  const [userId, setUserId] = useState("");
  const dataId = localStorage.getItem("Id")
  const navigate = useNavigate();
  let authData = useSelector((state) => state.auth.user);
  useEffect(() => {
    setUserId(authData?._id);
  }, [authData]);
  const handleSubmit = () => {
    navigate(
    `/customerbooking/b80b355d0b3b4fcf8ce765bfde7024c924253801fb7527bb57?userId=${dataId}`
    );
  };
  return (
    <div className="payment_wrapper">
      <div className="payment_header">
        <Image src={Logo} alt="logo" />
      </div>
      <div className="payment_main_box">
        <div className="payment_content_box mx-auto">
          <div className="payment_content_inner">
            <div className="payment_icon">
              <IoIosCheckmarkCircleOutline />
            </div>
            <div className="payment_content">
              <h6 className="mb-0">Payment Successful !!</h6>
              <p>Your payment has been successfully done.</p>
              <Button className="payment_btn" onClick={handleSubmit}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="payment_footer">
        <Footer />
      </div>
    </div>
  );
}
