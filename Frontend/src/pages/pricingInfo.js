import React, { useState, useEffect } from "react";
import { Container, Breadcrumb, Button } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import { MdHome } from "react-icons/md";
import { getStripePlans, getStripeCouponList ,GetUserByID} from "../services/userServices";
import Subscription from "./subscription";
import { ToastContainer } from "react-toastify";
import { Rings } from "react-loader-spinner";
import { createNotification } from "../helper/notification";
import { useLocation, useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

const PricingInfo = ({ notificationCount, setNotificationCount }) => {
  const location = useLocation();
  const id = useParams();
  const [plans, setPlans] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState(" ");
  const [planName, setPlanName] = useState("");
  const [priceId, setPriceId] = useState("");
  const [price, setPrice] = useState(0);
  const [data, setData] = useState({});
  const [couponM, setCouponM] = useState("");
  const [couponY, setCouponY] = useState("");
  const [couponQ, setCouponQ] = useState("");
  const [couponId, setCouponId] = useState("");
  const [couponName, setCouponName] = useState("");
  const [priceAfterCoupon, setPriceAfterCoupon] = useState("");
  const [paymentInfoStatus, setPaymentInfoStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyPopup, setHistoryPopup] = useState(true);

  const getPlans = async () => {
    const response = await getStripePlans();
    if (response && response) {
      setLoading(false);
      const plan = response.map((planData, index) => {
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
  useEffect(() => {
    userNameFun();
  }, [id]);

  const userNameFun = async () => {
    if (id) {
      const res = await GetUserByID(id?.id);
      if (res?.data) {
        setHistoryPopup(res?.data?.HistoryActivateStatus == false)
      } else {
        console.log("something went wrong");
      }
    }

  };
  const token = location.state;

  const handleChoose = async (productId, priceId, name, price, description) => {
    const dataCoupon = await getStripeCouponList();
    let selectedCoupon = couponM ? couponM : couponQ ? couponQ : couponY ? couponY : ""
    const dataCouponArray = dataCoupon.useCoupon.data
    const matchedCoupon = dataCouponArray.find(coupon => coupon.name === selectedCoupon.trim());
    let isMatch;
    if (matchedCoupon?.metadata) {
      isMatch = Object.values(matchedCoupon?.metadata).includes(productId);
    }
    const matchedCouponDetail = isMatch ? matchedCoupon : null;
    if (matchedCouponDetail) {
      let couponData = {};
      let couponName = "";
      const response = await getStripeCouponList();
      response?.useCoupon?.data.map((val) => {
        if (
          val.name === couponM.trim() ||
          val.name === couponY.trim() ||
          val.name === couponQ.trim()
        ) {
          couponData = val;
          couponName = val.name;
        }
      });
      if (couponName) {
        if (couponData.percent_off) {
          let deductedAmt = (price * couponData.percent_off) / 100;
          let newPrice = price - deductedAmt;
          setCouponId(couponId);
          setCouponName(couponName);
          setProductId(productId);
          setPriceId(priceId);
          setPlanName(name);
          setPrice(price);
          setPriceAfterCoupon(newPrice);
          setDescription(description);
          setPaymentInfoStatus(true);
          setData({
            productId: productId,
            priceId: priceId,
            planName: name,
            price: price,
            priceAfterCoupon: newPrice,
            description: description,
            couponId: couponId,
            couponName: couponName,
          });
        } else {
          let deductedAmt = couponData.amount_off / 100;
          let newPrice = price - deductedAmt;
          setCouponId(couponId);
          setCouponName(couponName);
          setProductId(productId);
          setPriceId(priceId);
          setPlanName(name);
          setPrice(price);
          setPriceAfterCoupon(newPrice);
          setDescription(description);
          setPaymentInfoStatus(true);
          setData({
            productId: productId,
            priceId: priceId,
            planName: name,
            price: price,
            priceAfterCoupon: newPrice,
            description: description,
            couponId: couponId,
            couponName: couponName,
          });
        }
      } else {
        createNotification("error", "Coupon is not valid");
      }

    } else if (couponY === "" && couponM === "" && couponQ === "") {
      setCouponId(couponId);
      setCouponName(couponName);
      setProductId(productId);
      setPriceId(priceId);
      setPlanName(name);
      setPrice(price);
      setDescription(description);
      setPaymentInfoStatus(true);
      setData({
        productId: productId,
        priceId: priceId,
        planName: name,
        price: price,
        description: description,
        couponId: couponId,
        couponName: couponName,
      });
    } else {
      setCouponM("")
      setCouponQ("")
      setCouponY("")
      createNotification("error", "Coupon is not valid");
    }
  };
  const handleplansData = () => {
    const plansData =
      plans &&
      plans.length > 0 &&
      plans.map((data) => {
        return (
          <>
            {
              data.name === "Monthly Membership" ? (
                <>
                  <div className="pricing-list">
                    <div className="pr-heading">
                      <h2>{data.name}</h2>
                    </div>
                    <div className="pricing-box">
                      <div className="pricing">
                        <h2>
                          <sup>$</sup>
                          {data.price}
                        </h2>
                        <p>
                          <b>USD</b> / month
                        </p>
                      </div>
                    </div>
                    <div className="pricing-option-list">
                    </div>
                    <div className="Coupon-option">
                      <h5>If you have coupon</h5>
                      <input
                        name="coupon"
                        placeholder="Coupon Name"
                        type="text"
                        value={couponM}
                        onChange={(e) => setCouponM(e.target.value)}
                      ></input>
                    </div>
                    <Button
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
                      Select Plan
                    </Button>
                  </div>
                </>
              ) : data.name === "Quarterly Membership Fee" ? (
                <div className="pricing-list annual-pricing-list">
                  <div className="recm-title">
                    <h1>Our Recommendation</h1>
                  </div>
                  <div className="pr-heading">
                    <h2>{data.name}</h2>

                  </div>
                  <div className="pricing-box">
                    <div className="pricing">
                      <h2>
                        <sup>$</sup>
                        {data.price}
                      </h2>
                      <p>
                        <b>USD</b> / per unit / year
                      </p>
                    </div>
                  </div>
                  <div className="pricing-option-list">

                  </div>
                  <div className="Coupon-option">
                    <h5>If you have coupon</h5>
                    <input
                      name="coupon"
                      placeholder="Coupon Name"
                      type="text"
                      value={couponQ}
                      onChange={(e) => setCouponQ(e.target.value)}
                    ></input>
                  </div>
                  <Button
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
                    Select Plan
                  </Button>
                </div>
              ) : data.name === "Annual Membership Access" ?
                <>
                  <div className="pricing-list">
                    <div className="pr-heading">
                      <h2>{data.name}</h2>
                    </div>
                    <div className="pricing-box">
                      <div className="pricing">
                        <h2>
                          <sup>$</sup>
                          {data.price}
                        </h2>
                        <p>
                          <b>USD</b> / month
                        </p>
                      </div>
                    </div>
                    <div className="pricing-option-list">

                    </div>
                    <div className="Coupon-option">
                      <h5>If you have coupon</h5>
                      <input
                        name="coupon"
                        placeholder="Coupon Name"
                        type="text"
                        value={couponY}
                        onChange={(e) => setCouponY(e.target.value)}
                      ></input>
                    </div>
                    <Button
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
                      Select Plan
                    </Button>
                  </div>
                </> : ""
            }
          </>
        );
      })
    return plansData;
  };
 






  return (
    <div>
      <HeaderTop
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
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


        {historyPopup ? (
        <Modal
        size="lg"
        show={true}
        // onHide={() => setSmShow(true)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Body>
          <div className="account_modal">
          <div className="verifydesc mt-0 py-3">
         
               <b>
               You want your data back or not  -{" "}
              </b>
              
              {/* <div className="logout-btn"> */}
              <div className="submitbtn">
                <Button
                  type="submit"
                  // disabled={loader || activateAccount}
                  className="nextbtn clsave-btn"
                >
                  Store all
                </Button>
              </div>
              <div className="submitbtn">
              <Button
                  type="submit"
                  // disabled={loader || activateAccount}
                  className="nextbtn clsave-btn"
                >
                  Create new account
                </Button>
              </div>
        </div>
          </div>
        </Modal.Body>
      </Modal>  

        ) :
      paymentInfoStatus ? (
        <Subscription data={data} token={token} />
      ) : (
        <div className="plan-wrapper">
          <Container>
            <div className="pricing-wrapper layout-wrapper">
              <div className="breadcurm-bar">
                <h2>Plan for business</h2>
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Pricing</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="pricing-detail-wrap">
                <div className="plan-heading">
                  <h1>Choose your plan</h1>
                  <p>
                    Select the plan that will work best for your company’s budget.
                    Our introductory pricing is already applied to the subscription levels.  Your discounted rate is locked in for the lifetime of your subscription.  If your account is canceled and you decide to resubscribe, it will be charged at the regularly stated subscription rate.
                  </p>
                </div>
                <div className="pricing-detail">
                  {handleplansData()}
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default PricingInfo;
