import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import OroboAPI from '../API/api-service';

import HomepageInput from './HomepageInput';
import CurrenciesSelect from './CurrenciesSelect';
import MethodOfCollection from './MethodOfCollection';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';


class NewBeneficiary extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      step: 1,
      first_name: '',
      last_name: '',
      email_address: '',
      phone_number: '',
      address: '',
      currencies: [],
      selectedCountry: {},
      channels: [],
      selectedChannel: {},
      selectedChannelParameters: [],
      inProgress: true
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChannelUpdate = this.onChannelUpdate.bind(this);
    this.onChannelParameterUpdate = this.onChannelParameterUpdate.bind(this);
    this.goBack = this.goBack.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }
  
  goBack(e) {
    this.setState({
      step: 1
    })
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    if (this.state.step === 1) {
      this.setState({
        step: 2
      });
    } else { // Submit data
      const dataToSend = {
        Beneficiary: {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email_address: this.state.email_address,
          phone_number: this.state.phone_number,
          address: this.state.address,
          country_currency_id: this.state.selectedCountry.id,
          settlement_channel_id: this.state.selectedChannel.id
        },
        BeneficiarySettlementChannelData: formatSettlementChannelData(this.state.selectedChannelParameters, this.state.selectedChannel.id)
      }
      
      this.setState({ inProgress: true });
      
      OroboAPI.addBeneficiary(dataToSend).then((response) => {
        if (response.data.PayLoad.status) {
          this.toastr.addNotification({
            message: 'Beneficiary successfully added.',
            level: 'success'
          });

          setTimeout(() => {
            this.props.history.push('/send-money');  
          }, 2000);
        } else {
          this.setState({ inProgress: false });
        }
        
      }, (error) => {
        this.setState({ inProgress: false });
        this.toastr.addNotification({
          message: 'Something went wrong. Please try again later.',
          level: 'error'
        });
      });

    }
    
  }
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }
  
  onChannelUpdate(data) {
    this.setState({
      selectedChannel: data,
      selectedChannelParameters: data.settlement_channel_parameters
    });
  }

  onChannelParameterUpdate(data) {
    const updatedParams = this.state.selectedChannelParameters;
    
    for (var i = 0; i < updatedParams.length; i++) {
      if (data.name === updatedParams[i].parameter) {
        updatedParams[i].value = data.val;
      }
    }

    this.setState({
      selectedChannelParameters: updatedParams
    }); 
  }
  
  componentDidMount() {
    
    OroboAPI.getReceivingCurrencies().then((response) => {
      if (response.data.PayLoad.status) {
        
        this.setState({
          currencies: response.data.PayLoad.data.currencies,
          selectedCountry: response.data.PayLoad.data.currencies[0]
        });
        
        OroboAPI.getSettlementChannels(this.state.selectedCountry.id).then((resData) => {
          
          if (resData.data.PayLoad.status) {
            this.setState({
              channels: resData.data.PayLoad.data.channels,
              selectedChannel: resData.data.PayLoad.data.channels[0]
            });
          }
          
          this.setState({ inProgress: false });
        }, (errData) => {
          this.setState({ inProgress: false });
        });
        
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
      first_name,
      last_name,
      email_address,
      phone_number,
      address,
      currencies,
      selectedCountry,
      inProgress,
      channels,
      selectedChannel
    } = this.state;
    
    return (
      <div className="add-beneficiary">
        
        <Loader showWhenTrue={inProgress} />

        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <form onSubmit={this.handleSubmit} autoComplete="off">
          
          {step === 1 &&
            <div>
              
              <CurrenciesSelect
                list={currencies}
                selectedCountry={selectedCountry} />
              
              <HomepageInput 
                type="text"
                name="first_name"
                id="first-name"
                value={first_name}
                placeholder="First Name*"
                label="First Name"
                required={true}
                onInputUpdate={this.updateInputValue}
                focus="true" />
              
              <HomepageInput 
                type="text"
                name="last_name"
                id="last-name"
                value={last_name}
                placeholder="Last Name*"
                label="Last Name"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="email"
                name="email_address"
                id="email-address"
                value={email_address}
                placeholder="Email Address*"
                label="Email Address"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="number"
                name="phone_number"
                id="phone-number"
                value={phone_number}
                placeholder="Phone Number*"
                label="Phone Number"
                required={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="text"
                name="address"
                id="beneficiary-address"
                value={address}
                placeholder="Physical Address*"
                label="Physical Address"
                required={true}
                onInputUpdate={this.updateInputValue} />
            </div>
          }
          
          
          {step === 2 &&
            <div>
              <MethodOfCollection
                currency={selectedCountry}
                channels={channels}
                selectedChannel={selectedChannel}
                updateSelectedChannel={this.onChannelUpdate}
                updateChannelParameter={this.onChannelParameterUpdate}/>
            </div>
          }
          
          
          <div className="process-cta">
            {step === 2 &&
              <button type="button" onClick={this.goBack} className="btn">Go Back</button>
            }
            <button type="submit" className="btn">{step === 1 ? 'Next' : 'Save'}</button>
          </div>
            
        </form>
        
      </div>
    );
  }

}



const formatSettlementChannelData = (list, id) => {
  let settlementChannelParams = [];

  for (var i = 0; i < list.length; i++) {
    settlementChannelParams.push({
      settlement_channel_id: id,
      settlement_channel_parameter_id: list[i].id,
      collected_data: list[i].value + ''
    });
  }
  
  return settlementChannelParams;
}


export default withRouter(NewBeneficiary);
