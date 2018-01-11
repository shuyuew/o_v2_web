import React, { Component } from 'react';
import Beneficiaries from './Beneficiaries';
import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import NotificationSystem from 'react-notification-system';
import Loader from './Loader';
import { confirm } from './confirm';

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
    
    confirm('Send money to ' + data.full_name + '?').then(() => {
      this.setState({
        step: 2,
        selectedBeneficiary: data
      });      
    }, () => {
      console.log('cancel!');
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

        {step === 2 &&
          <div className="select-amount">

            <div className="select-amount__amount">
              <label htmlFor="select_amount">Amount:</label>
              <div>
                <span>$</span>
                <input type="number" className="form-control" name="select_amount" id="select_amount"/>
              </div>
            </div>

            <div className="select-amount__sending-currency">
              <span>
                IMG
              </span>
              <span>USD</span>
            </div>

            <div className="select-amount__exchange-rate">Ex. Rate: $5.00 = N389.00, Service fee $4.00</div>

          </div>
        }

      </div>
    );
  }

}

export default PaymentWizard;