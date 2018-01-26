import React, { Component } from 'react';
import { Link } from 'react-router-dom';


const RegistrationSuccess = (props) => {
  return (
    <div className="orobo-box orobo-box--success">
      <div>
        
        <div className="orobo-box__check text-center">
          <img src="http://fakeimg.pl/170x200/ededed/27a6df" alt="Check Smiley"/>
        </div>
        
        <div className="orobo-box__message text-uppercase text-center">
          <span>Smile!</span>
          <span>Your registration is</span>
          <span>Successful</span>
        </div>
        
        <div className="orobo-box__success-cta">
          <div>
            <Link to="/pay-bill" className="text-uppercase">Pay bill</Link>
          </div>
          <div>
            <Link to="/send-money" className="text-uppercase">Send money</Link>
          </div>
        </div>
        
        <div className="orobo-box__info-cta text-center">
          <Link to="/my-profile" className="text-uppercase">Not now</Link>
        </div>
        
      </div>
    </div>
  )
}

export default RegistrationSuccess;