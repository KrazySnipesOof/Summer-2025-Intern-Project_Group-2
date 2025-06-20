import React, { useState, useEffect } from "react";
import Logo from "../assets/img/bisi_logo.png";
import { Button, Image } from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PaymentSucces() {
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    let authData = useSelector((state) => state.auth.user);
    useEffect(() => {
        setUserId(authData?._id);
    }, [authData]);
    const handleSubmit = () => {
        navigate(
            `/customerbooking/b80b355d0b3b4fcf8ce765bfde7024c924253801fb7527bb57?userId=${userId}`
        );
    };
    return (
        <div className="payment_wrapper payment_failed_wrapper">
            <div className="payment_header">
                <Image src={Logo} alt="logo" />
            </div>
            <div className="payment_main_box">
                <div className="payment_content_box mx-auto">
                    <div className="payment_content_inner">
                        <div className="payment_icon">
                            <IoIosCloseCircleOutline />
                        </div>
                        <div className="payment_content">
                            <h6 className="mb-0">Payment failed !!</h6>
                            <p>Your payment has failed. Please go back and try again.</p>
                            <Button className="payment_btn" onClick={handleSubmit}>Try again</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="payment_footer">
                <Footer />
            </div>
        </div>
    )
}