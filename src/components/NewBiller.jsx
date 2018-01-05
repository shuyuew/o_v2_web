import React, { Component } from 'react';
import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';

import CurrenciesSelect from './CurrenciesSelect';
import HomepageInput from './HomepageInput';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';



class NewBiller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      bill_category_id: '',
      country_currency_id: '',
      state_id: '',
      biller_categories: [],
      biller_states: [],
      biller_banks: [],
      title: '',
      email_address: '',
      phone_number: '',
      address: '',
      bank_id: '',
      bank_account_name: '',
      bank_account_number: '',
      first_name: '',
      last_name: '',
      amount: '',
      bill_name: '',
      inProgress: true
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.updateDropdownState = this.updateDropdownState.bind(this);
    
  }

  updateDropdownState(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();

    const UserData = UserAuth.getUserData();
    const dataToSend = {
      bill_category_id: this.state.bill_category_id,
      country_currency_id: this.state.selectedCurrency.id,
      state_id: this.state.state_id,
      title: this.state.title,
      email_address: this.state.email_address,
      phone_number: this.state.phone_number,
      address: this.state.address,
      bank_id: this.state.bank_id,
      bank_account_name: this.state.bank_account_name,
      bank_account_number: this.state.bank_account_number,
      contact_person: UserData.first_name,
      contact_person_email_address: UserData.email_address,
      contact_person_phone_number: UserData.phone_number,
      contact_person_address: UserData.address,
      bills: [
        {
          title: this.state.bill_name,
          bill_category_id: this.state.bill_category_id,
          bill_options: [
            {
              title: this.state.bill_name,
              amount: this.state.amount,
              allow_any_amount: true
            }
          ]
        }
      ]
    }

    this.setState({ inProgress: true });
    OroboAPI.recommendBiller(dataToSend).then((response) => {
      console.log(response);
      if (response.data.PayLoad.status) {
        this.toastr.addNotification({
          message: response.data.PayLoad.data.message,
          level: 'success',
          autoDismiss: 0
        });
      } else {


      }

      this.setState({ inProgress: false });
    }, (error) => {
      this.setState({ inProgress: false });
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
    });

  }
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }
  
  componentDidMount() {
    
    OroboAPI.getBillsCategories().then((response) => {
      
      if (response.status === 200) {
        
      }
      
    }, (error) => {
      console.log(error);
    });
    
    OroboAPI.getReceivingCurrencies().then((response) => {
      if (response.status === 200) {
        this.setState({
          currencies: response.data.PayLoad.data.currencies,
          selectedCurrency: response.data.PayLoad.data.currencies[0],
          inProgress: false
        });


        // Get Country Banks
        OroboAPI.getBillsBanks(this.state.selectedCurrency.id).then((res) => {
          if (res.data.PayLoad.status) {
            this.setState({ biller_banks: res.data.PayLoad.data.banks });
          }
        }, (err) => {
    
        });


        // List Biller Categories
        OroboAPI.getBillsCategories().then((res) => {
          if (res.data.PayLoad.status) {
            this.setState({ biller_categories: res.data.PayLoad.data.categories });
          }
        }, (err) => {
          console.log(err);
        });


        // Get List of States
        OroboAPI.getBillsStates(this.state.selectedCurrency.id).then((res) => {
          if (res.data.PayLoad.status) {
            this.setState({ biller_states: res.data.PayLoad.data.states });
          }
        }, (err) => {
          console.log(err);
        });
        
      }
    }, (error) => {
      console.log(error);
    });
    
  }

  render() {
    
    const {
      currencies,
      selectedCurrency,
      title,
      biller_categories,
      biller_states,
      biller_banks,
      email_address,
      phone_number,
      address,
      bank_account_name,
      bank_account_number,
      first_name,
      last_name,
      amount,
      bill_name,
      inProgress
    } = this.state;
    
    return (
      <div className="new-biller">
        
        <Loader showWhenTrue={inProgress} />
        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <form onSubmit={this.handleSubmit} autoComplete="off">
          
          {currencies.length > 0 &&
            <div>
              <h4 className="form-group-title">Select your biller's country</h4>
              <CurrenciesSelect list={currencies} selectedCountry={selectedCurrency} />
              <br/>
            </div>
          }
          
          <h4 className="form-group-title">Biller's Info</h4>
          
          <HomepageInput 
            type="text"
            name="title"
            id="biller-name"
            placeholder="Biller Name*"
            label="Biller Name"
            value={title}
            required={true}
            onInputUpdate={this.updateInputValue}
            focus="true" />

          {biller_categories.length > 0 &&
            <div className="form-group">
              <select name="bill_category_id" id="biller_category" className="form-control" defaultValue={0} onChange={this.updateDropdownState} required>
                <option value="0" disabled>Select billers category*</option>
                {biller_categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option> 
                ))}
              </select>
            </div>
          }
          
          <HomepageInput 
            type="text"
            name="first_name"
            id="biller-first-name"
            placeholder="First Name*"
            label="First Name"
            value={first_name}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="text"
            name="last_name"
            id="biller-last-name"
            placeholder="Last Name*"
            label="Last Name"
            value={last_name}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="email"
            name="email_address"
            id="biller-email"
            placeholder="Email*"
            label="Email"
            value={email_address}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="number"
            name="phone_number"
            id="biller-phone"
            placeholder="Phone Number*"
            label="Phone Number"
            value={phone_number}
            required={true}
            onInputUpdate={this.updateInputValue} />

          {biller_states.length > 0 && 
            <div className="form-group">
              <select name="state_id" id="biller_state" className="form-control" defaultValue={0} onChange={this.updateDropdownState} required>
                <option value="0" disabled>Select location*</option>
                {biller_states.map((state) => (
                  <option key={state.id} value={state.id}>{state.title}</option> 
                ))}
              </select>
            </div>
          }

          {biller_banks.length > 0 &&
            <div className="form-group">
              <select name="bank_id" id="biller_bank" className="form-control" defaultValue={0} onChange={this.updateDropdownState} required>
                <option value="0" disabled>Select a bank*</option>
                {biller_banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>{bank.title}</option> 
                ))}
              </select>
            </div>
          }
          
          <HomepageInput 
            type="text"
            name="address"
            id="biller-address"
            placeholder="Physical Address*"
            label="Physical Address"
            value={address}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="text"
            name="bank_account_name"
            id="biller-bank_account_name"
            placeholder="Account Name*"
            label="Account Name"
            value={bank_account_name}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="number"
            name="bank_account_number"
            id="biller-account-number"
            placeholder="Account Number*"
            label="Account Number"
            value={bank_account_number}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <br/>
          <h4 className="form-group-title">What would you like to pay for?</h4>
          
          <HomepageInput 
            type="text"
            name="bill_name"
            id="biller-title"
            placeholder="Bill Name*"
            label="Bill Name"
            value={bill_name}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <HomepageInput 
            type="number"
            name="amount"
            id="biller-amount"
            placeholder="Bill Amount*"
            label="Bill Amount"
            value={amount}
            required={true}
            onInputUpdate={this.updateInputValue} />
          
          <button type="submit" className="btn">Save</button>
          
          
        </form>
      </div>
    );
  }

}

export default NewBiller;
