import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../helper/notification";
import moment from "moment";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as authActions from "../store/action/authAction";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { editSignUser, GetUserByID } from "../services/userServices";
import { Rings } from "react-loader-spinner";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      backgroundColor: "#212529",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};
const PaymentForm = ({ data, token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const getUserById = async () => {
    const res = await GetUserByID(id);
    setUserEmail(res?.data?.email);
  };
  useEffect(() => {
    getUserById();
  }, []);
  const goHandler = async (e) => {
    let startDate = moment(new Date());
    let endDate = "";
    e.preventDefault();
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
 

    setPaymentDetail(paymentMethod);
    if (data && data?.planName === "Monthly Membership") {
      endDate = moment().add(1, "M");
    } else if (data && data?.planName === "Annual Membership Access") {
      endDate = moment().add(12, "M");
    } else if (data && data?.planName === "Quarterly Membership Fee") {
      endDate = moment().add(3, "M");
    }
    if (!error) {
      const cardDetails = paymentMethod;
      const card = {
        cardDetails: cardDetails,
        planDeatils: data,
        subscriptionStatus: true,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      };
      const response = await editSignUser(id, card);
      if (response && response.success) {
        setLoading(false);
        createNotification("success", response && response.message);
        if (token) {
          dispatch(authActions.autoLoginUser(token, navigate));
        } else {
          const data = {
            email: userEmail,
          };
          dispatch(authActions.autoLoginUser(data, navigate));
        }
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setLoading(false);
        createNotification("error", response && response.message);
      }
    } else {
      setLoading(false);
      createNotification("error", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="layout-loaderbar">
          <div className="loaderbar">
            <Rings
              height="80"
              width="80"
              radius="10"
              color="#145340"
              wrapperStyle
              wrapperClass
            />
          </div>
        </div>
      ) : null}
      <div className="signupinfo-form plan-payment-info">
        <div className="signup-form-box payment-info">
          <div className="card-payment-box">
            <h4>
              Pay $
              {data?.priceAfterCoupon !== undefined && data?.priceAfterCoupon !== null ? data?.priceAfterCoupon : data?.price
              }
            </h4>
            <h2>Payment info</h2>

            <Form>
              <fieldset className="FormGroup">
                <div className="card-payment">
                  <CardElement options={CARD_OPTIONS} />
                </div>
              </fieldset>
              <div className="payment-information">
                <div className="allpayment">
                  <p>
                    All payment information is stored securely. Your card won’t
                    be charged unless you explicitly select a plan and confirm
                    your subscription type.
                  </p>
                </div>
                <Form.Group className="mb-3 privacypolicy">
                  <label htmlFor="customCheck">
                    <input
                      type="checkbox"
                      id="customCheck"
                      checked={termsAndConditions === true}
                      value={termsAndConditions}
                      onChange={(e) =>
                        setTermsAndConditions(!termsAndConditions)
                      }
                      name="example1"
                    />
                    <span>
                      {" "}
                      I agree to the terms of service and privacy policy
                    </span>
                  </label>
                </Form.Group>
              </div>
              <div className="bsbtn">
                <Button
                  type="submit"
                  disabled={!termsAndConditions}
                  onClick={goHandler}
                >
                  Go
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PaymentForm;
