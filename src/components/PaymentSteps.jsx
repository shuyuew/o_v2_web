import React from 'react';
import { connect } from 'react-redux';

const SendPaymentProgress = ({title, steps}) => (
  <div>
    <div className="payment-steps-title">{title}</div>
      <div className="payment-steps">
        {steps.map((step) => {
          let stepClass = '';
          stepClass += step.isActive ? 'active' : '';
          stepClass += step.isProcessed ? ' processed' : '';
          return (
            <span key={step.id} className={stepClass}></span>
          )
        })}    
    </div>    
  </div>
)

const mapStateToProps = state => {
  return {
    title: state.sendMoneySteps.title,
    steps: state.sendMoneySteps.steps
  }
};

const PaymentSteps = connect(
  mapStateToProps
)(SendPaymentProgress);

export default PaymentSteps;