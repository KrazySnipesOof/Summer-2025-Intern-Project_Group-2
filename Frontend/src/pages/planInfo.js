import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button 
} from "react-bootstrap";

import * as Yup from "yup";
import { getStripePlans , GetUserByID } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import Paymentinfo from "./subscription";
import { useSelector } from "react-redux";
const PlanInfo = ({ step, setStep, formData, setformData }) => {
  let authData = useSelector((state) => state.auth.user);
  const [userId, setUserId] = useState(authData._id);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState(" ");
  const [planName, setPlanName] = useState("");
  const [priceId, setPriceId] = useState("");
  const [price, setPrice] = useState(0);
  const [data, setData] = useState({});
  const [paymentInfoStatus, setPaymentInfoStatus] = useState(false);
  const [activateAccount, setActivateaccount] = useState(false);

  const getUserById = async () => {
    if (authData?._id !== undefined && authData?._id !== null) {
      const response = await GetUserByID(authData?._id);
      if (response?.data?.status == 0) {
        setActivateaccount(true);
      } else if(response?.data?.status == 1){
        setActivateaccount(false);
      }
    }
  };


  useEffect(() => {
    getUserById();
  }, [userId]);
  const getPlans = async () => {
    const response = await getStripePlans();
    if (response && response.plansPrices) {
      const plan = response.plansPrices.map((planData, index) => {
        setProductId(planData.id);
        setPriceId(
          planData.price && planData.price.id ? planData.price.id : ""
        );
        setPlanName(planData.name);
        setPrice(
          planData.price && planData.price.unit_amount
            ? planData.price.unit_amount / 100
            : 0
        );
        setDescription(planData.description);
        // }
        return {
          name: planData.name,
          price:
            planData.price && planData.price.unit_amount
              ? planData.price.unit_amount / 100
              : 0,
          priceId: planData.price && planData.price.id ? planData.price.id : "",
          description: planData.description,
          status: planData.active,
          productId: planData.id,
          isChecked: false,
          isEnabled: false,
          paymentStatus: 0,
          interval:
            planData.price &&
            planData.price.recurring &&
            planData.price.recurring.interval
              ? planData.price.recurring.interval
              : "Not defined",
          imgUrl:
            planData.images && planData.images.length > 0
              ? planData.images[0]
              : "",
          _id: undefined,
        };
      });
      setPlans(plan);
    } else {
   
      console.log("Something went Wrong");
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const validationSchema = Yup.object().shape({
    productId: Yup.string().required("please select plan"),
  });

  const handleSubmit = () => {
    setPaymentInfoStatus(true);
    setData({
      productId: productId,
      priceId: priceId,
      planName: planName,
      price: price,
      description: description,
    });
  };
  const handleChoose = (productId, priceId, name, price, description) => {
    setProductId(productId);
    setPriceId(priceId);
    setPlanName(name);
    setPrice(price);
    setDescription(description);
  };
  const handleplansData= () => {
    const plansData =
    plans &&
    plans.length > 0 &&
    plans.map((data) => {
                    return (
                      <>
                      <div
                        className="card__content"
                        onClick={() =>
                          handleChoose(
                            data.productId,
                            data.priceId,
                            data.name,
                            data.price,
                            data.description
                          )
                        }
                      >
                        <div
                          className="card__pricing"
                          style={{ backgroundColor: "grey" }}
                        >
                          <div className="card__pricing-number">
                            <span className="card__pricing-symbol">$</span>
                            {data.price}
                          </div>
                          <span className="card__pricing-month">
                            /{data.interval}
                          </span>
                        </div>
                        <header className="card__header">
                          <div className="card__header-circle">
                            <img
                              src={data.imgUrl}
                              alt="img"
                              className="card__header-img"
                            />
                          </div>
                          <h1 className="card__header-title">{data.name}</h1>
                        </header>
                        <ul className="card__list">
                          <li className="card__list-item">
                            <p className="card__list-description">
                              {data.description}
                            </p>
                          </li>
                        </ul>
                      </div>
                      </>
                    );
                })
    return plansData;
  };
  return (
    <div>
      <div className="signupinfo-form">
        <h1 className="heading">Create your BISI account</h1>
        <div className="signup-form-box business-info planinfo">
          <h2>Plans info</h2>
          <>
            <Row>
              <section className="plancard">
                <div className="plan-card-wrapper">
                  {handleplansData()} 
                </div>
              </section>
            </Row>
            <div className="bsbtn">
              <Row>
                <Col xs={6}>
                  <div className="submitbtn">
                    <Button onClick={handleSubmit} type="submit">
                      Continue
                    </Button>
                    <p>
                      This site is protected by reCAPTCHA and the Google Privacy
                      Policy.
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        </div>
      </div>
      {paymentInfoStatus ? <Paymentinfo data={data} /> : ""}
    </div>
  );
};

export default PlanInfo;
