import React, { Component } from 'react';
import OroboAPI from '../API/api-service';
import Loader from './Loader';
import CONFIG from '../data/config';
import Smiley from './Smiley';
import StatusBar from './StatusBar';
import PhoneInput from './PhoneInput';
import Duphlux from '../API/duphlux';
import NotificationSystem from 'react-notification-system';

class Registration extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      first_name: '',
      middle_name: '',
      last_name: '',
      extension: '',
      phone: '',
      password: '',
      confirm_password: '',
      physical_address: '',
      email_address: '',
      phone_number: '',
      country_currency_id: '',
      sendingCurrencies: [],
      selectedCurrency: null,
      referral_code: '',
      statusMessage: CONFIG.formInfo.email.message,
      statusInfoMessage: '',
      formStatus: null,
      steps: [{
        id: 1,
        name: 'email',
        isActive: true,
        isValidated: false
      }, {
        id: 2,
        name: 'phone',
        isActive: false,
        isValidated: false
      }, {
        id: 3,
        name: 'password',
        isActive: false,
        isValidated: false
      }, {
        id: 4,
        name: 'user',
        isActive: false,
        isValidated: false
      }],
      step: 1,
      inProgress: false,
      isDropdownOpen: false
    };
    
    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.onPhoneUpdate = this.onPhoneUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.dropdownOnFocus = this.dropdownOnFocus.bind(this);
    this.dropdownOnBlur = this.dropdownOnBlur.bind(this);
    this.updateSelectedCurrency = this.updateSelectedCurrency.bind(this);
    this.goToPreviousStep = this.goToPreviousStep.bind(this);
    
  }

  goToPreviousStep() {
    const prevStep = this.state.step-1;
    let stepsToUpdate = this.state.steps;

    switch (this.state.step) {
      case 4:
        stepsToUpdate[2].isActive = true;
        stepsToUpdate[3].isActive = false;
      break;

      case 3:
        stepsToUpdate[1].isActive = true;
        stepsToUpdate[2].isActive = false;
      break;

      case 2:
        stepsToUpdate[0].isActive = true;
        stepsToUpdate[1].isActive = false;
      break;
    }

    this.setState({
      phone_number: prevStep === 2 ? '' : this.state.phone_number,
      step: prevStep,
      steps: stepsToUpdate
    });
  }

  updateSelectedCurrency(data) {
    this.setState({
      selectedCurrency: data,
      isDropdownOpen: false
    });
  }

  dropdownOnFocus(e) {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  dropdownOnBlur(e) {
    this.setState({ isDropdownOpen: false });
  }

  validateInput(dataToValidate) {
    let validationInfo = {
      isValid: true,
      step: dataToValidate.step,
      value: dataToValidate.input,
      stepsToUpdate: dataToValidate.steps
    };
    
    switch (dataToValidate.step) {

      case 1:
        if (dataToValidate.input.length === 0) {
          validationInfo.isValid = false;
          validationInfo.error = 'Email address field is required.';
          return validationInfo;
        }

        if (!CONFIG.EMAIL_REGEX.test(dataToValidate.input)) {
          validationInfo.isValid = false;
          validationInfo.error = 'That email address was invalid, try again :)';
          return validationInfo;
        }

        validationInfo.stepsToUpdate[0].isActive = false;
        validationInfo.stepsToUpdate[0].isValidated = true;
        validationInfo.stepsToUpdate[1].isActive = true;
        
        validationInfo.success = 'Email address verified :)';
        validationInfo.stepMessage = CONFIG.formInfo.phone.message;
      break;

      case 3:
        if (dataToValidate.input.length === 0) {
          validationInfo.isValid = false;
          validationInfo.error = 'Password field is required.';
          return validationInfo;
        }

        if (CONFIG.PASSWORD_REGEX.test(dataToValidate.input) === false) {
          validationInfo.isValid = false;
          validationInfo.error = 'Invalid password format, try again :)';
          return validationInfo;
        }

        if (dataToValidate.input !== dataToValidate.confirmation) {
          validationInfo.isValid = false;
          validationInfo.error = 'Passwords don\'t match, try again :)';
          return validationInfo;
        }

        validationInfo.stepsToUpdate[2].isActive = false;
        validationInfo.stepsToUpdate[2].isValidated = true;
        validationInfo.stepsToUpdate[3].isActive = true;
        
        validationInfo.success = 'Your password has been verified :)';
        validationInfo.stepMessage = CONFIG.formInfo.user.message;

      break;

      case 4:
      break;

    }

    return validationInfo;

  }

  handleSubmit(event) {
    event.preventDefault();
    let validationData;

    switch (this.state.step) {

      case 1:
        validationData = this.validateInput({
          step: this.state.step,
          input: this.state.email_address,
          name: 'email_address',
          steps: this.state.steps
        });

        if (!validationData.isValid) {
          this.setState({
            statusMessage: validationData.error,
            formStatus: 'error'
          });
        } else {
    
          validationData.step += 1;
          this.setState({
            step: validationData.step,
            formStatus: null,
            statusMessage: validationData.stepMessage,
            steps: validationData.stepsToUpdate
          });
    
        }
      break;

      case 2:
        if (this.state.phone_number.length === 0) {
          this.setState({
            statusMessage: 'Phone Number field is required.',
            formStatus: 'error'
          });
        } else {

          const that = this;
          Duphlux(this.state.phone_number, window.location.href, () => {
            return {
              onSuccess: function (reference) {
                let stepsToUpdate = that.state.steps;
  
                stepsToUpdate[1].isActive = false;
                stepsToUpdate[1].isValidated = true;
                stepsToUpdate[2].isActive = true;
  
                that.setState({
                  step: 3,
                  formStatus: null,
                  statusMessage: CONFIG.formInfo.password.message,
                  steps: stepsToUpdate,
                  statusInfoMessage: CONFIG.formInfo.password.info
                });
              },
              
              onFailure: function (reference) {
                console.log('onFailure', reference);
              },
              
              onError: function (errorMessage) {
                console.log('onError', errorMessage);
              }
            }
          });

        }
      break;

      case 3:
        validationData = this.validateInput({
          step: this.state.step,
          input: this.state.password,
          confirmation: this.state.confirm_password,
          name: 'password',
          steps: this.state.steps
        });

        if (!validationData.isValid) {
          this.setState({
            statusMessage: validationData.error,
            formStatus: 'error'
          });
        } else {
    
          validationData.step += 1;
          this.setState({
            step: validationData.step,
            formStatus: null,
            statusMessage: validationData.stepMessage,
            steps: validationData.stepsToUpdate,
            statusInfoMessage: validationData.statusInfoMessage || ''
          });
    
        }
      break;

      case 4:

        if (this.state.first_name.length === 0) {
          this.setState({
            statusMessage: 'First name field is required',
            formStatus: 'error'
          });
          return;
        }

        if (this.state.last_name.length === 0) {
          this.setState({
            statusMessage: 'Surname field is required',
            formStatus: 'error'
          });
          return;
        }

        
        const dataToSend = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email_address: this.state.email_address,
          phone_number: this.state.phone_number,
          country_currency_id: this.state.country_currency_id,
          password: this.state.password,
          referral_code: this.state.referral_code
        }

        this.setState({ inProgress: true });
        
        OroboAPI.registerUser(dataToSend).then((response) => {
          if (response.status === 200 && response.data.PayLoad.status) {
            OroboAPI.loginUser(dataToSend).then((responseData) => {
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
                
                this.setState({ inProgress: false });
              }
            }, (error) => {
              this.setState({ inProgress: false });
              this.toastr.addNotification({
                message: 'Something went wrong. Please try again later.',
                level: 'error'
              });  
            });
          } else {
            this.setState({ inProgress: false });
            
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
          this.setState({ inProgress: false });
          this.toastr.addNotification({
            message: 'Something went wrong. Please try again later.',
            level: 'error'
          });
        });

      break;

    }

  }

  onInputUpdate(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onPhoneUpdate(e) {
    const phoneNumber = e.target.value ? '+' + this.state.selectedCurrency.country_code + e.target.value : '';
    this.setState({ phone_number: phoneNumber });
  }

  componentDidMount() {

    const referralCode = getParameterByName('ref');

    OroboAPI.getSendingCurrencies().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({
          sendingCurrencies: response.data.PayLoad.data.currencies,
          selectedCurrency: response.data.PayLoad.data.currencies[0],
          country_currency_id: response.data.PayLoad.data.currencies[0].id,
          referral_code: referralCode
        });
      }
    });
  }

  render() {
    
    const {
      first_name,
      middle_name,
      last_name,
      password,
      confirm_password,
      physical_address,
      email_address,
      referral_code,
      inProgress,
      step,
      steps,
      formStatus,
      statusMessage,
      statusInfoMessage,
      selectedCurrency,
      sendingCurrencies,
      isDropdownOpen
    } = this.state;
    
    return (
      <div className="orobo-registration">

        <NotificationSystem className="toast-top-center" ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        <Loader showWhenTrue={inProgress} />

        <div>

          <Smiley activeStep={step} stepStatus={formStatus} />

          <StatusBar 
            activeStep={step}
            formSteps={steps}
            message={statusMessage}
            infoMessage={statusInfoMessage}
            status={formStatus} />


          <form name="registration_form" onSubmit={this.handleSubmit} noValidate="true" autoComplete="off">


            {step === 1 && 
              <div className="form-group has-border">
                <input 
                  required
                  type="email" 
                  name="email_address"
                  placeholder="your email address here."
                  onChange={this.onInputUpdate} 
                  value={email_address}/>
              </div>
            }

            {step === 2 && 
              <div className="form-group">
                <PhoneInput
                  currency={selectedCurrency}
                  list={sendingCurrencies}
                  isOpen={isDropdownOpen}
                  onDropBlur={this.dropdownOnBlur}
                  onDropFocus={this.dropdownOnFocus}
                  updateCurrency={this.updateSelectedCurrency}
                  updatePhone={this.onPhoneUpdate} />
              </div>
            }

            {step === 3 && 
              <div>
                <div className="form-group has-border">
                  <input 
                    required
                    type="password" 
                    name="password"
                    placeholder="your password here."
                    onChange={this.onInputUpdate} 
                    value={password}/>
                </div>

                <div className="form-group has-border">
                  <input 
                    required
                    type="password" 
                    name="confirm_password"
                    placeholder="re-enter your password here."
                    onChange={this.onInputUpdate} 
                    value={confirm_password}/>
                </div>
              </div>
            }

            {step === 4 &&
              <div>
                <div className="form-group has-border">
                  <input 
                    required
                    type="text" 
                    name="first_name"
                    placeholder="Your first name(s) here."
                    onChange={this.onInputUpdate} 
                    value={first_name}/>
                </div>

                <div className="form-group has-border">
                  <input 
                    required
                    type="text" 
                    name="last_name"
                    placeholder="Your surname here."
                    onChange={this.onInputUpdate} 
                    value={last_name}/>
                </div>

                <div className="form-group has-border">
                  <input 
                    type="text" 
                    name="referral_code"
                    placeholder="Referral code goes here"
                    onChange={this.onInputUpdate} 
                    value={referral_code}/>
                </div>
              </div>
            }
            
            
            <div className="form-group registration-cta">
              {step > 1 &&
                <button onClick={this.goToPreviousStep} type="button">Go Back</button>
              }
              <button type="submit" className="form-submit">{step === 4 ? 'Create Account' : 'Next'}</button>
            </div>

          </form>

        </div>
      </div>
    );
  }

}

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export default Registration;