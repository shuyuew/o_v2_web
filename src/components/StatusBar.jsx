import React from 'react';

const StatusBar = ({
  activeStep,
  formSteps,
  message,
  infoMessage,
  status
}) => {
  
  return (
    <div className="status-bar">
      <div className={'status-bar__message ' + status}>{message}</div>
      
      {infoMessage.length > 0 && 
        <div className="status-bar__info">{infoMessage}</div>
      }

      <div className="status-bar__steps">
        {formSteps.map((step) => {
          let stepClass = '';
          if (step.isActive) {
            stepClass += 'active ';
          }
          if (step.isValidated) {
            stepClass += 'validated'
          }
          return <span className={stepClass} key={step.id}></span>;
        })}
      </div>
    </div>
  )
};


export default StatusBar;