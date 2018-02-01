import React from 'react';
import { Link } from 'react-router-dom';


const Welcome = (props) => {

  return (
    <div className="orobo-box orobo-box--success orobo-box--bill-payment">
      <div>
        
        <div className="orobo-box__check text-center">
          <a href="/">
            <img src="/images/dashboard-logo.png" alt="Orobo Logo"/>
          </a>
        </div>
        
        <div className="orobo-box__message text-uppercase text-center">
          <span className="white-welcome">Bill payments across Africa</span>
        </div>
        
        <div className="orobo-box__success-cta">
          <div>
            <Link to="/pay-bill" className="text-uppercase">Pay Bill</Link>
          </div>
          <div>
            <Link to="/send-money" className="text-uppercase">Send Money</Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Welcome;