import React, { useState, useEffect } from "react";
import {  useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../helper/notification";
import moment from "moment";
import { getTokens } from "../helper/firebase";
import { Form, Button } from "react-bootstrap";
import { editSignUser,editSignFreeUser } from "../services/userServices";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { addUpgradePlan } from "../services/upgradeServices";
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

const PaymentFormUpgrade = ({ data}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState("");
  const [fcmToken, setFCMToken] = useState("");
  const [tokenFound, setTokenFound] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const goHandlerFree = async (e) => {
    let startDate = moment(new Date());
    let endDate = "";
    e.preventDefault();
    setLoading(true);

    if (data && data?.planName === "Monthly Membership") {
      endDate = moment().add(1, "M");
    } else if (data && data?.planName === "Annual Membership Access") {
      endDate = moment().add(12, "M");
    } else if (data && data?.planName === "Quarterly Membership Fee") {
      endDate = moment().add(3, "M");
    }
    const freePLan = {
      planName: data.planName,
      price: data.price,
      priceAfterCoupon:data.priceAfterCoupon,
      priceId: data.priceId
    }
    const cardDetails = {};
    const planDeatils = freePLan;
    const card = {
      cardDetails: cardDetails,
      planDeatils: planDeatils,
      subscriptionStatus: true,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      fcmToken: fcmToken
    };

    const response = await addUpgradePlan(card);

    const userObj = {
      cardDetails: cardDetails,
      planDeatils: planDeatils,
      upgradeStatus: true,
      upgradeId: response.data._id,
    };

    if (response && response.success) {
      const res = await editSignFreeUser(id, userObj);
      if (res && res?.user) {
        setLoading(false);
        localStorage.setItem(
            "permissionDashboard",
            JSON.stringify(res?.user)
        );
        createNotification("success", response && response.message);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    }


  };

  const goHandler = async (e) => {
    let startDate = moment(new Date());
    let endDate = "";
    e.preventDefault();
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log("hey:::::::::::::::::jey:::::::::::::::::::::", error);

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
      const planDeatils = data;
      const card = {
        cardDetails: cardDetails,
        planDeatils: planDeatils,
        subscriptionStatus: true,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
        fcmToken: fcmToken
      };

      const response = await addUpgradePlan(card);
      const userObj = {
        cardDetails: cardDetails,
        planDeatils: planDeatils,
        upgradeStatus: true,
        subscriptionStatus: true,
        upgradeId: response.data._id,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      };

      if (response && response.success) {
        const res = await editSignUser(id, userObj);
        if (res && res?.user) {
          setLoading(false);
          localStorage.setItem(
              "permissionDashboard",
              JSON.stringify(res?.user)
          );
          createNotification("success", response && response.message);

          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      }
    } else {
      setLoading(false);
      createNotification("error", error);
    }
  };

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getTokens(setTokenFound);
      if (data) {
        setFCMToken(data);
      }
      return data;
    }
    tokenFunc();
  }, [setTokenFound]);


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
            {
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
                      {
                       
                        data.priceAfterCoupon === 0 && data.coupon !== undefined && data.coupon !== null ? 
                        <p>
                          All payment information is stored securely. 
                          The card on file won't be charged until your {data.coupon.duration_in_months} months free trials ends.
                        </p>
                        : <p>
                            All payment information is stored securely. Your card won’t
                            be charged unless you explicitly select a plan and confirm
                            your subscription type.
                          </p>
                        }
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
            }
          </div>
        </div>
        <ToastContainer />
      </div>
  );
};

export default PaymentFormUpgrade;
