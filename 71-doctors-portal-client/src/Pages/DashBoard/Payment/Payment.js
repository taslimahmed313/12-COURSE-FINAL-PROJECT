import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import CheckoutForm from './ChekoutForm';


const stripePromise = loadStripe(
  "pk_test_51M7DtHCgCkCjPn88mkSrxO3cPwwwSGfaN4vUilUwTxg8CCTRWQHpZkZgSDi94Pa6SJt2yh0HxuAMBDwUldq51bOP00863gWP59"
);
// console.log(stripePromise)

const Payment = () => {

    const booking = useLoaderData();

    return (
      <div>
        <h1 className="text-3xl">Payment For {booking.treatment}</h1>
        <h1 className="text-xl">
          Please Pay <strong>${booking.price}</strong> for your appointment on{" "}
          {booking.appointmentDate} at {booking.slot};
        </h1>

        <div className="w-96 my-12">
          <Elements stripe={stripePromise}>
            <CheckoutForm booking={booking} />
          </Elements>
        </div>
      </div>
    );
};

export default Payment;