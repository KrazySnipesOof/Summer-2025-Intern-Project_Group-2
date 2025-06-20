import React, { useState, useEffect } from "react";
import PaymentFormUpgrade from "./upgradePaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripeTestPromise = loadStripe(STRIPE_PUBLIC_KEY);

const UpgradeSubscription = ({ data }) => {    
    return (
        <div>
            <Elements stripe={stripeTestPromise}>
                <PaymentFormUpgrade data={data} />
            </Elements>
        </div>
    );
};

export default UpgradeSubscription;
