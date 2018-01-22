import React from 'react';
import CONFIG from '../data/config';

const Smiley = ({
  activeStep,
  stepStatus
}) => {

  let title,
    description,
    imageType = stepStatus === 'valid' ? 'success' : 'error';

  switch (activeStep) {
    case 1:
      title = CONFIG.formInfo.email.title;
    break;

    case 2:
      title = CONFIG.formInfo.phone.title;
    break;

    case 3:
      title = CONFIG.formInfo.password.title;
    break;

    case 4:
      title = CONFIG.formInfo.user.title;
    break;
  }

  return (
    <div className="smiley">
      <img src="./images/general/smiley.png" alt="Smiley"/>
      <div className="smiley__title">{title}</div>

      {stepStatus !== null &&
        <div className="smiley__info">
          <img src={'./images/welcome/' + imageType + '.png'} alt="Status"/>
        </div>
      }
    </div>
  );

}

export default Smiley;