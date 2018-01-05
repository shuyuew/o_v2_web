import React, { Component } from 'react';

class PaymentSteps extends Component {

  render() {
    return (
      <div>
        <div className="payment-steps-title">Select Beneficiary</div>
        <div className="payment-steps">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

}

export default PaymentSteps;