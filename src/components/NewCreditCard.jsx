import React from 'react';
import { Elements } from 'react-stripe-elements';
import NewCardForm from './NewCardForm';

const NewCreditCard = () => (
  <div className="new-card">
    <Elements>
      <NewCardForm />
    </Elements>
  </div>
);

export default NewCreditCard;
