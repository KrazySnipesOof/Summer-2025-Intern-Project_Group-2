import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../helper/notification";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const CheckoutForm = ({
  userId,
  service,
  paymentData,
  handlePyment,
  selectedBenificialCountry,
  selectedCountry,
  phone,
  paymentType,
  numberOfSeats,
  totalPrice,
  cartProducts,
}) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const cardElementStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#2c1b4c",
      },
    },
    invalid: {
      color: "#000",
    },
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);
    
    const res = await stripe.createToken(elements.getElement(CardElement));

    //Added: Log the response for debuggingAdd commentMore actions
    console.log("Stripe createToken response:", res);

    //Added: Check if an error occurred. If so, send error message and stop processing
    if (res.error) {
      createNotification("warning", res.error.message || "Card details are invalid");
      setIsLoading(false);  //set to false
      return;               //exit to stop further execution
    }

    //Added: Check if Stripe generated a token, if not send notification and stop execution
    if (!res.token) {
      console.error("Stripe token was not returned:", res); //log the condition for debugging
      createNotification("warning", "Card could not be tokenized. Please check your information and try again.");
      setIsLoading(false);  //set to false
      return;               //exit to stop further execution
    }
    
    const token = res?.token?.id;
    const cardId = res?.token?.card?.id;
    const month = res?.token?.card?.exp_month;
    const year = res?.token?.card?.exp_year;
    const last4Digits = res?.token?.card?.last4;

    try {
      const response = await axios.post(`${apiUrl}/frontend/user/addCard`, {
        tokenCard: token,
        userId: userId,
        cardId: cardId,
        month: month,
        year: year,
        email: paymentData?.email,
        last4Digits: last4Digits,
      });

      if (response.status === "200") {
        let bookingPayment;
        if (service?.length > 0) {
          bookingPayment = await axios.post(
            `${apiUrl}/frontend/user/bookingPayment`,
            {
              paymentType: paymentType,
              selectedBenificialCountry: selectedBenificialCountry,
              selectedCountry: selectedCountry,
              phone: phone,
              userId: userId,
              service: service
                .map((item) => (item?.type === "Services" ? item._id : null))
                .filter((item) => item !== null),
              classes: service
                .map((item) => (item?.type === "Classes" ? item._id : null))
                .filter((item) => item !== null),
              numberOfSeats: numberOfSeats,
              name: paymentData?.name,
              email: paymentData?.email,
              paymentMethodId: response?.data?.paymentMethodId,
              customerId: response?.data?.customerId,
              totalPrice: totalPrice,
            }
          );
        } else if (cartProducts?.length > 0) {
          bookingPayment = await axios.post(
            `${apiUrl}/frontend/user/productPayment`,
            {
              userId: userId,
              products: cartProducts.map((item) => item?.product?._id),
              name: paymentData?.name,
              email: paymentData?.email,
              paymentMethodId: response?.data?.paymentMethodId,
              customerId: response?.data?.customerId,
              totalPrice: totalPrice,
            }
          );
        } else {
          createNotification(
            "warning",
            "Please select a service or product to proceed with payment"
          );
        }

        if (
          bookingPayment.status === 200 &&
          bookingPayment?.data?.clientSecret
        ) {
          if (bookingPayment?.data?.success === true) {
            handlePyment(bookingPayment?.data?.price);
            navigate("/payment-success");
          } else {
            navigate("/payment-failed");
          }
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      createNotification("warning", "Card details are invalid");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <div
        className="mb-3"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
          backgroundColor: "transparent",
        }}
      >
        <CardElement options={{ style: cardElementStyle }} />
      </div>
      <button
        style={{
          color: "#fff",
          backgroundColor: "#005941",
          border: "0",
          padding: "7px 20px",
          borderRadius: "4px",
        }}
        disabled={isLoading}
      >
        {isLoading ? "Paying...." : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
