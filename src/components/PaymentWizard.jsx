import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Beneficiaries from './Beneficiaries';
import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import Duphlux from '../API/duphlux';
import NotificationSystem from 'react-notification-system';
import Loader from './Loader';
import Config from '../data/config';
import { confirm } from './confirm';

let UserData, serviceFee = 0.00, exchangeAmount = 0.00, exchangeRate = 0.00;

class PaymentWizard extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      beneficiares: [],
      selectedBeneficiary: {},
      inProgress: true,
      beneficiary_send: 0,
      beneficiary_get: 0
    };

    this.onBeneficiarySelection = this.onBeneficiarySelection.bind(this);
    this.goToPreviousStep = this.goToPreviousStep.bind(this);
    this.onAmountUpdate = this.onAmountUpdate.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onStepUpdate = this.onStepUpdate.bind(this);
    this.sendMoney = this.sendMoney.bind(this);
  }

  sendMoney() {
    this.setState({ inProgress: true });

    const that = this;
    Duphlux(UserData.phone_number, window.location.href, () => {
      return {
        onSuccess: function (reference) {

          OroboAPI.sendMoney({
            TransferRequest: {
              sending_country_currency: UserData.country_currency.id,
              receiving_country_currency: that.state.selectedBeneficiary.country_currency.id,
              sending_amount: that.state.beneficiary_send,
              receiving_amount: that.state.beneficiary_get,
              fee: serviceFee,
              exchange_rate: exchangeRate,
              beneficiary_id: that.state.selectedBeneficiary.id,
              source: 'web'
            }
          }).then((response) => {
            if (response.data.PayLoad.status) {
              that.props.history.push({
                pathname: '/payment-success',
                state: { detail: response.data.PayLoad.data }
              });
            } else {
              that.toastr.addNotification({
                message: response.data.PayLoad.error[0],
                level: 'error'
              });
              that.setState({ inProgress: false });
            }
          }, (error) => {
            that.setState({ inProgress: false });
          });
          
        },
        
        onFailure: function (reference) {
          console.log('onFailure', reference);
          that.setState({ inProgress: false });
        },
        
        onError: function (errorMessage) {
          that.setState({ inProgress: false });
          console.log('onError', errorMessage);
        }
      }
    });

  }

  onStepUpdate() {
    if (!this.state.beneficiary_send) {
      this.toastr.addNotification({
        message: 'Set an amount to send.',
        level: 'error'
      });
    } else {
      this.setState({ step: 3 });
    }
  }

  onInputBlur(e) {

    const isSendingField = e.target.name === 'beneficiary_send';
    const direction = isSendingField ? 1 : 0;

    if (e.target.value) {

      this.setState({ inProgress: true });

      OroboAPI.calculateFee({
        sending_currency: UserData.country_currency.id,
        receiving_currency: this.state.selectedBeneficiary.country_currency.id,
        amount: isSendingField ? this.state.beneficiary_send : this.state.beneficiary_get,
        direction: direction
      }).then((response) => {
        
        if (response.data.PayLoad.status) {
          exchangeRate = response.data.PayLoad.data.exchange_rate;
          serviceFee = response.data.PayLoad.data.fee;
          exchangeAmount = 1.00;

          this.setState({
            beneficiary_send: response.data.PayLoad.data.sending_amount.toFixed(2),
            beneficiary_get: response.data.PayLoad.data.receiving_amount.toFixed(2)
          });

        } else {
          this.toastr.addNotification({
            message: response.data.PayLoad.error[0],
            level: 'error'
          });
        }

        this.setState({ inProgress: false });
      }, (error) => {
        this.setState({ inProgress: false });
      });
    } else {
      exchangeRate = 0.00;
      serviceFee = 0.00;
      exchangeAmount = 0.00;
      this.setState({ beneficiary_get: 0, beneficiary_send: 0 });
    }
  }

  onAmountUpdate(e) {
    this.setState({ [e.target.name]: e.target.value });
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

    UserData = UserAuth.getUserData();
    
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
      selectedBeneficiary,
      beneficiary_send,
      beneficiary_get
    } = this.state;
    
    return (
      <div className="orobo-payment">

        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <Loader showWhenTrue={inProgress} />

        {step > 1 &&
          <button type="button" className="step-back" onClick={this.goToPreviousStep}>
            <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Go back to previous step
          </button>
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
                <span>{UserData.country_currency.currency_symbol}</span>
                <span>{beneficiary_send.length != 0 ? beneficiary_send : parseInt('0').toFixed(2)}</span>
              </div>
            </div>

            <div className="select-amount__sending-currency">
              <span>
                <img src={Config.IMAGE_URL + UserData.country_currency.flag} alt={UserData.country_currency.country_name}/>
              </span>
              <span>{UserData.country_currency.currency_code}</span>
            </div>

            <div className="select-amount__exchange-rate">Ex. Rate: {UserData.country_currency.currency_symbol + parseInt(exchangeAmount).toFixed(2)} = {selectedBeneficiary.country_currency.currency_symbol + parseInt(exchangeRate).toFixed(2)}, Service fee {UserData.country_currency.currency_symbol + parseInt(serviceFee).toFixed(2)}</div>

            <div className="select-amount__beneficiary">
              <div className="beneficiary-info">
                <div>
                  <img src={Config.IMAGE_URL + selectedBeneficiary.country_currency.flag} alt={selectedBeneficiary.country_currency.country_name}/>
                </div>
                <div>{selectedBeneficiary.full_name}</div>
                <div>{selectedBeneficiary.settlement_channel.title}</div>
              </div>

              <div className="beneficiary-amount-info">
                <div>You send: </div>
                <div>
                  <span>{UserData.country_currency.currency_symbol}</span>
                  <span>
                    <input type="number" name="beneficiary_send" className="form-control" placeholder="Amount to send" value={beneficiary_send} onChange={this.onAmountUpdate} onBlur={this.onInputBlur}/>
                  </span>
                </div>
              </div>

              <div className="beneficiary-amount-info">
                <div>Beneficiary gets: </div>
                <div>
                  <span>{selectedBeneficiary.country_currency.currency_symbol}</span>
                  <span>
                    <input type="number" name="beneficiary_get" className="form-control" placeholder="Amount to get" value={beneficiary_get} onChange={this.onAmountUpdate} onBlur={this.onInputBlur}/>
                  </span>
                </div>
              </div>

            </div>

            <div className="select-amount__cta">
              <button onClick={this.onStepUpdate} type="button">Continue</button>
            </div>

          </div>
        }

        {step === 3 && 
          <div className="confirmation-info">
            <h4>Confirm transfer</h4>

            <ul>
              <li>
                <div>
                  <img src="http://fakeimg.pl/35x35/ededed/27a6df" alt="Image Icon"/>
                </div>
                <div>
                  <span>{UserData.card.title}</span>
                </div>
              </li>

              <li>
                <div>
                  <img src="http://fakeimg.pl/35x35/ededed/27a6df" alt="Image Icon"/>
                </div>
                <div>
                  <span>{UserData.country_currency.currency_symbol + beneficiary_send}</span>
                  <span>Free Inclusive</span>
                </div>
              </li>

              <li>
                <div>
                  <img src="http://fakeimg.pl/35x35/ededed/27a6df" alt="Image Icon"/>
                </div>
                <div>
                  <span>{selectedBeneficiary.full_name}</span>
                  <span>{selectedBeneficiary.settlement_channel.title}</span>
                </div>
              </li>
            </ul>

            <div className="select-amount__exchange-rate">Ex. Rate: {UserData.country_currency.currency_symbol + parseInt(exchangeAmount).toFixed(2)} = {selectedBeneficiary.country_currency.currency_symbol + parseInt(exchangeRate).toFixed(2)}, Service fee {UserData.country_currency.currency_symbol + parseInt(serviceFee).toFixed(2)}</div>

            <div className="select-amount__cta">
              <button type="button" onClick={this.sendMoney}>Send Money</button>
            </div>
          </div>
        }

      </div>
    );
  }

}

export default withRouter(PaymentWizard);