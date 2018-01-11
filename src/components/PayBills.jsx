import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import OroboAPI from '../API/api-service';
import Duphlux from '../API/duphlux';
import CurrenciesSelect from './CurrenciesSelect';
import BillListing from './BillListing';
import ActiveBillers from './ActiveBillers';
import UserAuth from '../API/auth';
import NotificationSystem from 'react-notification-system';
import Loader from './Loader';

let UserData, sendingAmount, exchangeRate, serviceFee, receivingAmount;

class PayBills extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      step: 1,
      inProgress: true,
      currencies: [],
      categories: [],
      states: [],
      billers: [],
      bills: [],
      selectedCurrency: {},
      selectedCategory: {},
      selectedLocation: {},
      selectedBiller: {},
      selectedBill: {},
      selectedBillOption: {},
      beneficiary_name: '',
      beneficiary_phone_number: '',
      beneficiary_email_address: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.updateReqField = this.updateReqField.bind(this);
    this.goToPreviousStep = this.goToPreviousStep.bind(this);
    this.updateBillOption = this.updateBillOption.bind(this);
    this.updateBillOptionAmount = this.updateBillOptionAmount.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const dataToSend = {
      BillPayment: {
        bill_id: this.state.selectedBill.id,
        bill_provider_id: this.state.selectedBill.bill_provider_id,
        bill_option_id: this.state.selectedBillOption.id,
        exchange_rate: exchangeRate,
        fee: serviceFee,
        sending_amount: sendingAmount,
        receiving_amount: receivingAmount,
        sending_country_currency: UserData.country_currency_id,
        receiving_country_currency: this.state.selectedCurrency.id,
        beneficiary_name: this.state.beneficiary_name,
        beneficiary_phone_number: this.state.beneficiary_phone_number,
        beneficiary_email_address: this.state.beneficiary_email_address,
        source: 'ios/and'
      },
      BillCollectedField: getBillCollectedData(this.state.selectedBill.id, this.state.selectedBill.bill_required_fields)
    }

    this.setState({ inProgress: true });

    const that = this;
    
    Duphlux(UserData.phone_number, window.location.href, () => {
      return {
        onSuccess: function (reference) {

          OroboAPI.payBill(dataToSend).then((response) => {

            if (response.data.PayLoad.status) {
              that.props.history.push({
                pathname: '/bill-payment-success',
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
            console.log(error);
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

  updateReqField(e) {
    const selectedBill = this.state.selectedBill;
    const fieldId = e.target.id.split('-')[1];
    const fieldValue = e.target.value;
    const selectedField = selectedBill.bill_required_fields.find((field) => field.id == fieldId);
    const fieldIndex = selectedBill.bill_required_fields.indexOf(selectedField);

    selectedBill.bill_required_fields[fieldIndex].value = fieldValue;
    console.log(selectedBill);
    this.setState({ selectedBill: selectedBill });
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  goToPreviousStep() {
    this.setState({
      step: this.state.step-1
    });
  }

  updateBillOption(e) {
    const billOption = this.state.selectedBill.bill_options.find((billOpt) => billOpt.id == e.target.value);
    this.setState({ selectedBillOption: billOption });
  }

  updateBillOptionAmount(e) {
    const activeBill = this.state.selectedBillOption;
    activeBill.amount = e.target.value;
    this.setState({ selectedBillOption: activeBill });
  }

  selectOption(data) {

    if (!UserAuth.getUserData().card) {
      this.toastr.addNotification({
        message: 'Missing payment method. In order to proceed you need to add credit card.',
        level: 'error'
      });
      return;
    }

    switch(this.state.step) {

      case 1: // Category
        this.setState({
          step: 2,
          selectedCategory: data
        });
      break;

      case 2: // Location
        this.setState({ inProgress: true });

        OroboAPI.getActiveBillers(
          this.state.selectedCurrency.id,
          this.state.selectedCategory.id,
          data.id
        ).then((response) => {

          if (response.data.PayLoad.status) {
            this.setState({ billers: response.data.PayLoad.data.billers });
          }

          this.setState({
            step: 3,
            selectedLocation: data,
            inProgress: false
          });
        }, (error) => {
          console.log(error);
          this.setState({ inProgress: false });
        });
      break;

      case 3: // Biller
        this.setState({ inProgress: true });

        OroboAPI.listBillerBills(data.id).then((response) => {
          if (response.data.PayLoad.status) {
            this.setState({
              step: 4,
              selectedBiller: data,
              bills: response.data.PayLoad.data.bills
            });
          }
          this.setState({ inProgress: false });
        }, (error) => {
          this.setState({ inProgress: false });
          console.log(error);
        });

      break;

      case 4: // Pay
        this.setState({
          step: 5,
          selectedBill: data,
          selectedBillOption: data.bill_options[0]
        });
      break;

      case 5:
        if (!this.state.selectedBillOption.amount || this.state.selectedBillOption.amount.length === 0) {
          this.toastr.addNotification({
            message: 'Please provide amount value.',
            level: 'error'
          });
        } else {
          this.setState({ inProgress: true });
          
          OroboAPI.calculateFee({
            sending_currency: UserData.country_currency_id,
            receiving_currency: this.state.selectedCurrency.id,
            amount: this.state.selectedBillOption.amount,
            direction: 0
          }).then((response) => {
            
            if (response.data.PayLoad.status) {
              sendingAmount = response.data.PayLoad.data.sending_amount;
              receivingAmount = response.data.PayLoad.data.receiving_amount;
              
              OroboAPI.calculateFee({
                sending_currency: UserData.country_currency_id,
                receiving_currency: this.state.selectedCurrency.id,
                amount: 5,
                direction: 1
              }).then((res) => {
                this.setState({ inProgress: false });
                console.log(res);
                if (res.data.PayLoad.status) {
                  exchangeRate = res.data.PayLoad.data.exchange_rate;
                  serviceFee = res.data.PayLoad.data.fee;
                  this.setState({ step: 6 });
                } else {
                  this.toastr.addNotification({
                    message: res.data.PayLoad.error[0],
                    level: 'error'
                  });
                }
              }, (err) => {
                this.setState({ inProgress: false });
              });

            } else {
              this.setState({ inProgress: false });
              this.toastr.addNotification({
                message: response.data.PayLoad.error[0],
                level: 'error'
              });
            }
          }, (error) => {
            this.setState({ inProgress: true });
            console.log(error);
          });

        }

      break;

    }
  }

  componentWillMount() {

    UserData = UserAuth.getUserData();
    
    // Get Receiving Currencies
    OroboAPI.getReceivingCurrencies().then((response) => {

      if (response.data.PayLoad.status) {
        this.setState({ 
          currencies: response.data.PayLoad.data.currencies,
          selectedCurrency: response.data.PayLoad.data.currencies[0]
        });
        
        // Get Categories List
        OroboAPI.getBillsCategories().then((res) => {
          if (res.data.PayLoad.status) {
            this.setState({ 
              categories: res.data.PayLoad.data.categories,
              inProgress: false
            });
          }
        }, (err) => {});

        // Get States
        OroboAPI.getBillsStates(this.state.selectedCurrency.id).then((res) => {
          if (res.data.PayLoad.status) {
            this.setState({ states: res.data.PayLoad.data.states });
          }
        }, (error) => {});

      } else {
        this.setState({ inProgress: false });
      }
    }, (error) => {
      this.setState({ inProgress: false });
    });

  }

  render() {

    const {
      step,
      inProgress,
      currencies,
      categories,
      states,
      billers,
      bills,
      selectedCurrency,
      selectedBiller,
      selectedCategory,
      selectedLocation,
      selectedBill,
      selectedBillOption,
      beneficiary_name,
      beneficiary_email_address,
      beneficiary_phone_number
    } = this.state;

    return (
      
      <div className="pay-bills">

        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        <Loader showWhenTrue={inProgress} />

        <form onSubmit={this.handleSubmit} autoComplete="off">

          {step > 1 &&
            <button type="button" onClick={this.goToPreviousStep} className="previous-step">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Go back to previous step
            </button>
          }

          {step === 1 && 
            <div>
              <CurrenciesSelect 
                list={currencies} 
                selectedCountry={selectedCurrency} />

              <h4 className="step-title">Select a Category:</h4>
              <BillListing 
                list={categories} 
                selectionUpdate={this.selectOption} 
                activeListing={selectedCategory.id} />
            </div>
          }
          
          {step === 2 && 
            <div>
              <h4 className="step-title">Select Location:</h4>
              <BillListing 
                list={states} 
                selectionUpdate={this.selectOption}
                activeListing={selectedLocation.id} />
            </div>
          }

          {step === 3 && 
            <div>
              <h4 className="step-title">Select Biller:</h4>
              <ActiveBillers
                billerUpdate={this.selectOption}
                activeBiller={selectedBiller.id}
                list={billers} />
            </div>
          }

          {step === 4 && 
            <div>
              <h4 className="step-title">Select Bill:</h4>
              <BillListing 
                list={bills} 
                selectionUpdate={this.selectOption}
                activeListing={selectedBill.id} />
            </div>
          }

          {step === 5 && 
            <div>
              <h4 className="step-title">Bill Details:</h4>

              <div className="bill-details">

                <div className="bill-details__header">
                  <span>{selectedBill.title}</span>
                  <span>{selectedBiller.title}</span>
                </div>

                <div className="bill-details__option">
                  <h5 className="bill-details__title text-uppercase">Select Option</h5>

                  <div className="form-group">
                    <label htmlFor="select_option">Select Option</label>
                    <select name="bill_option" id="select_option" value={selectedBillOption.id || selectedBill.bill_options[0].id} className="form-control" onChange={this.updateBillOption} required>
                      {selectedBill.bill_options.map((item) => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount_option">Amount ({selectedCurrency.currency_symbol})</label>
                    <input type="number" disabled={!selectedBillOption.allow_any_amount} name="bill_amount" id="amount_option" value={selectedBillOption.amount} className="form-control" onChange={this.updateBillOptionAmount} required/>
                  </div>
                </div>

                <div className="bill-details__information">
                  <h5 className="bill-details__title text-uppercase">Required Information</h5>

                  <div className="bill-details__required-fields">
                    {selectedBill.bill_required_fields.length === 0 && 'No required fileds provided for this biller.'}

                    {selectedBill.bill_required_fields.length > 0 &&
                      <ul>
                        {selectedBill.bill_required_fields.map((field) => (
                          <li key={field.id}>
                            <label htmlFor={'field-' + field.id}>{field.title.replace(/_/g, ' ')}</label>

                            {field.bill_field_type_id === 1 &&
                              <input type="text" name={field.title} id={'field-' + field.id} onChange={this.updateReqField} value={field.value || ''} required className="form-control" />
                            }

                            {field.bill_field_type_id === 2 &&
                              <select name={field.title} id={'field-' + field.id} required value={field.value || 0} onChange={this.updateReqField} className="form-control">
                                <option value="0" disabled>Select option</option>
                                {field.select_options.split(';').map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select> 
                            }

                          </li>
                        ))}
                      </ul>
                    }
                  </div>
                </div>

                <div className="bill-details__submit">
                  <button type="button" onClick={this.selectOption}>Pay Bill</button>
                </div>

              </div>
            </div>
          }

          {step === 6 && 
            <div>
              <h4 className="step-title">Confirm Payment:</h4>

              <div className="confirm-payment">

                <div className="confirm-payment__details">
                  <div>
                    <div className="details-title">Biller:</div>
                    <div className="details-info">
                      <span>{selectedBiller.title}</span>
                      <span>{selectedBiller.address}</span>
                    </div>
                  </div>

                  <div>
                    <div className="details-title">Bill:</div>
                    <div className="details-info">
                      <span>{selectedBill.title}</span>
                    </div>
                  </div>  

                  <div>
                    <div className="details-title">Option:</div>
                    <div className="details-info">
                      <span>{selectedBillOption.title}</span>
                    </div>
                  </div>

                  <div>
                    <div className="details-title">Amount:</div>
                    <div className="details-info">
                      <span>{selectedCurrency.currency_symbol + selectedBillOption.amount} ({UserData.country_currency.currency_symbol + parseFloat(sendingAmount).toFixed(2)})</span>
                    </div>
                  </div>
                </div>

                <div className="confirm-payment__exchange">Ex. Rate: {UserData.country_currency.currency_symbol}1.00 = {selectedCurrency.currency_symbol + parseFloat(exchangeRate).toFixed(2)}, Service Fee {UserData.country_currency.currency_symbol + parseFloat(serviceFee).toFixed(2)}</div>

                <div className="third-party">
                  <h5>Paying for someone? (Optional)</h5>

                  <div className="form-group">
                    <label htmlFor="full-name">Full Name:</label>
                    <input type="text" name="beneficiary_name" id="full-name" className="form-control" value={beneficiary_name} onChange={this.handleInputChange}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email-address">Email Address:</label>
                    <input type="email" name="beneficiary_email_address" id="email-address" className="form-control" value={beneficiary_email_address} onChange={this.handleInputChange}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_num">Phone Number:</label>
                    <input type="number" name="beneficiary_phone_number" id="phone_num" className="form-control" value={beneficiary_phone_number} onChange={this.handleInputChange}/>
                  </div>
                </div>

                <div className="confirm-payment__submit">
                  <button type="submit">Confirm Payment</button>
                </div>

              </div>
            </div>
          }

        </form>
      </div>

    );
  }

}


const getBillCollectedData = (billId, listing) => {
  let collectedData = [];
  for (var i = 0; i < listing.length; i++) {
    collectedData.push({
      bill_id: billId,
      bill_required_field_id: listing[i].id,
      collected_data: listing[i].value
    });
  }
  return collectedData;
}

export default withRouter(PayBills);
