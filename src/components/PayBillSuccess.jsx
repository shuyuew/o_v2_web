import React from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '../API/auth';


const PayBillSuccess = (props) => {
  
  const billReference = props.location.state.detail.reference;
  const UserData = UserAuth.getUserData();

  return (
    <div className="orobo-box orobo-box--success orobo-box--bill-payment">
      <div>
        
        <div className="orobo-box__check text-center">
          <a href="/">
            <img src="/images/dashboard-logo.png" alt="Orobo Logo"/>
          </a>
        </div>
        
        <div className="orobo-box__message text-uppercase text-center">
          <span>Smile {UserData.first_name}!</span>
          <span>Your payment is being verified</span>
          <span>BILL REFERENCE: {billReference}</span>
        </div>
        
        <div className="orobo-box__success-cta">
          <div>
            <Link to="/my-profile" className="text-uppercase">Home</Link>
          </div>
          <div>
            <Link to="/pay-bill" className="text-uppercase">Pay Bill</Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default PayBillSuccess;