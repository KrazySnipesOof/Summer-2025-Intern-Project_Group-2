import React, { useState, useEffect } from "react";
import PaymentForm from "./paymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const PUBLIC_KEY = `${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`;

const stripeTestPromise = loadStripe(PUBLIC_KEY);
const Subscription = ({ data, token }) => {
  return (
    <div>
      <Elements stripe={stripeTestPromise}>
        <PaymentForm data={data} token={token} />
      </Elements>
    </div>
  );
};

export default Subscription;
