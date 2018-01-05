import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OroboAPI from '../API/api-service';
import HomepageInput from './HomepageInput';
import PhoneInput from './PhoneInput';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';

class Registration extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      first_name: '',
      middle_name: '',
      last_name: '',
      extension: '',
      password: '',
      confirm_password: '',
      physical_address: '',
      email_address: '',
      phone_number: '',
      country_currency_id: '',
      referral_code: '',
      inProgress: false
    };
    
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCurrencyData = this.updateCurrencyData.bind(this);
    this.toggleLoader = this.toggleLoader.bind(this);
    
  }
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }
  
  toggleLoader(data) {
    this.setState({ inProgress: data });
  }

  handleSubmit(event) {
    event.preventDefault();
    
    if (this.state.password !== this.state.confirm_password) {
      this.toastr.addNotification({
        message: 'Password fields do not match.',
        level: 'error'
      });
      return;
    }
    
    this.toggleLoader(true);
    OroboAPI.registerUser(this.state).then((response) => {
      if (response.status === 200 && response.data.PayLoad.status) {
        OroboAPI.loginUser(this.state).then((responseData) => {
          if (responseData.status === 200 && responseData.data.PayLoad.status) {
            this.props.history.push('/success');
          } else {
            if (responseData.data.PayLoad.error && responseData.data.PayLoad.error.length) {
              for (var i = 0; i < response.data.PayLoad.error.length; i++) {
                this.toastr.addNotification({
                  message: response.data.PayLoad.error[i],
                  level: 'error'
                });
              }
            }
            
            this.toggleLoader(false);
          }
        }, (error) => {
          this.toggleLoader(false);
          this.toastr.addNotification({
            message: 'Something went wrong. Please try again later.',
            level: 'error'
          });  
        });
      } else {
        this.toggleLoader(false);
        
        if (response.data.PayLoad.error && response.data.PayLoad.error.length) {
          for (var i = 0; i < response.data.PayLoad.error.length; i++) {
            this.toastr.addNotification({
              message: response.data.PayLoad.error[i],
              level: 'error'
            });
          }
        }
      }
      
    }, (error) => {
      this.toggleLoader(false);
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
    });
    
  }
  
  updateCurrencyData(data) {
    this.setState({
      country_currency_id: data.id,
      extension: data.extension
    });
  }

  render() {
    
    const {
      first_name,
      middle_name,
      last_name,
      extension,
      password,
      confirm_password,
      physical_address,
      email_address,
      phone_number,
      referral_code,
      country_currency_id,
      inProgress
    } = this.state;
    
    return (
      <div className="orobo-box orobo-box--titlebox">
        <div>
          
          <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
          
          <Loader showWhenTrue={inProgress} />
          
          <div className="orobo-box__head text-center">Create your account</div>
          
          <div className="orobo-box__form">
            <form onSubmit={this.handleSubmit} autoComplete="off">
              
              <HomepageInput 
                type="text"
                name="first_name"
                value={first_name}
                id="register-firstname"
                placeholder="First Name*"
                label="First Name"
                required={true}
                focus="true"
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="text"
                name="middle_name"
                value={middle_name}
                id="register-middlename"
                placeholder="Middle Name"
                label="Middle Name"
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="text"
                name="last_name"
                value={last_name}
                id="register-lastname"
                placeholder="Last Name*"
                label="Last Name"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <PhoneInput
                placeholder="Phone Number*"
                name="phone_number"
                required={true}
                onDropdownUpdate={this.toggleLoader}
                updateCurrencyID={this.updateCurrencyData}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="email"
                name="email_address"
                value={email_address}
                id="register-email"
                placeholder="Email*"
                label="Email"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="text"
                name="physical_address"
                value={physical_address}
                id="register-address"
                placeholder="Physical Address"
                label="Physical Address"
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="password"
                name="password"
                value={password}
                id="register-password"
                placeholder="Create your password*"
                label="Password"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="password"
                name="confirm_password"
                value={confirm_password}
                id="register-password-confirm"
                placeholder="Confirm your password*"
                label="Confirm Password"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="text"
                name="referral_code"
                value={referral_code}
                id="register-referral-code"
                placeholder="Referral Code"
                label="Referral Code"
                onInputUpdate={this.updateInputValue} />
              
              <button type="submit" className="btn">Sign Up</button>
              
            </form>
          </div>
          
          <div className="orobo-box__cta">
            <div>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

}

export default Registration;