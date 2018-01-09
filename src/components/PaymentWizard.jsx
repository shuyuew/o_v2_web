import React, { Component } from 'react';
import Beneficiaries from './Beneficiaries';
import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import NotificationSystem from 'react-notification-system';
import Loader from './Loader';

class PaymentWizard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      beneficiares: [],
      selectedBeneficiary: {},
      inProgress: true
    };

    this.onBeneficiarySelection = this.onBeneficiarySelection.bind(this);
    this.goToPreviousStep = this.goToPreviousStep.bind(this);
  }

  onBeneficiarySelection(data) {

    if (!UserAuth.getUserData().card) {
      this.toastr.addNotification({
        message: 'Missing payment method. In order to proceed you need to add credit card.',
        level: 'error'
      });
      return;
    }

    this.setState({
      step: 2,
      selectedBeneficiary: data
    });
  }

  goToPreviousStep() {
    this.setState({ step: this.state.step-1 });
  }
  
  componentDidMount() {
    
    OroboAPI.getBeneficiries().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ beneficiares: response.data.PayLoad.data.beneficiaries });
      }
      
      this.setState({ inProgress: false });
    }, (error) => {
      console.log('error');
      
      this.setState({ inProgress: false });
    });
    
  }

  render() {
    
    const {
      step,
      inProgress,
      beneficiares,
      selectedBeneficiary
    } = this.state;
  
    return (
      <div className="orobo-payment">

        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <Loader showWhenTrue={inProgress} />

        {step > 1 &&
          <button type="button" className="step-back" onClick={this.goToPreviousStep}>Go back to previous step</button>
        }
          
        {step === 1 &&
          <Beneficiaries 
            list={beneficiares}
            beneficiary={selectedBeneficiary}
            beneficiarySelect={this.onBeneficiarySelection} />
        }

      </div>
    );
  }

}

export default PaymentWizard;