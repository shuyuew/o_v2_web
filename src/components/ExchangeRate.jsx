import React, { Component } from 'react';
import OroboAPI from '../API/api-service';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';
import Config from '../data/config';


class ExchangeRate extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      receivingCurrencies: [],
      sendingCurrencies: [],
      receivingCurrency: {},
      sendingCurrency: {},
      amount: 0,
      exchange_rate: null,
      fee: null,
      direction: 1,
      receiving_amount: null,
      inProgress: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.currencyUpdate = this.currencyUpdate.bind(this);
    this.amountUpdate = this.amountUpdate.bind(this);
  }
  
  handleSubmit(event) {
    event.preventDefault();

    let dataToSend = {
      sending_currency: this.state.sendingCurrency.id,
      receiving_currency: this.state.receivingCurrency.id,
      amount: parseInt(this.state.amount),
      direction: this.state.direction
    }    
    
    this.setState({ inProgress: true });
    
    OroboAPI.calculateFee(dataToSend).then((response) => {
      
      if (response.data.PayLoad.status) {
        this.setState({
          exchange_rate: response.data.PayLoad.data.exchange_rate,
          fee: response.data.PayLoad.data.fee,
          receiving_amount: response.data.PayLoad.data.receiving_amount,
          amount: response.data.PayLoad.data.sending_amount.toFixed(2)
        });
      } else {
        this.toastr.addNotification({
          message: response.data.PayLoad.error[0],
          level: 'error'
        });
      }
      
      this.setState({ inProgress: false });
    }, (error) => {
      this.toastr.addNotification({
        message: 'Something went wrong.',
        level: 'error'
      });
      this.setState({ inProgress: false });
    });
    
  }
  
  
  currencyUpdate(e) {
    let currencyToUpdate;
    
    if (e.target.name === 'sending_currency') {
      currencyToUpdate = this.state.sendingCurrencies.find((curr) => curr.id == e.target.value);
      this.setState({ sendingCurrency: currencyToUpdate });
    } else {
      currencyToUpdate = this.state.receivingCurrencies.find((curr) => curr.id == e.target.value);
      this.setState({ receivingCurrency: currencyToUpdate });
    }    
  }
  
  
  amountUpdate(e) {
    this.setState({ amount: e.target.value });
  }
  
  
  componentDidMount() {
    
    this.setState({ inProgress: true });
    
    OroboAPI.getSendingCurrencies().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ 
          sendingCurrencies: response.data.PayLoad.data.currencies,
          sendingCurrency: response.data.PayLoad.data.currencies[0]
        });
      }
      
      this.setState({ inProgress: false });
    }, (error) => {
      this.setState({ inProgress: false });
    });
    
    
    OroboAPI.getReceivingCurrencies().then((response) => {
      
      if (response.data.PayLoad.status) {
        this.setState({
          receivingCurrencies: response.data.PayLoad.data.currencies,
          receivingCurrency: response.data.PayLoad.data.currencies[0]
        });
      }
      
      this.setState({ inProgress: false });
    }, (error) => {
      this.setState({ inProgress: false });
    });
    
  }
  

  render() {
    
    const {
      inProgress,
      amount,
      receivingCurrencies,
      sendingCurrencies,
      receivingCurrency,
      sendingCurrency,
      exchange_rate,
      receiving_amount,
      fee
    } = this.state;
    
    return (
      <div className="exchange-rate">
        
        <Loader showWhenTrue={inProgress} />
        <NotificationSystem className="toast-top-center" ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <div className="exchange-rate__wrapper">
          <form name="exchangeForm" onSubmit={this.handleSubmit}>
            
            {
              // <div className="exchange-rate__switch">
              //   <button type="button">
              //     Switch Currencies 
              //     <i className="fa fa-arrows-h" aria-hidden="true"></i>
              //   </button>
              // </div>
            }
          
            <div className="exchange-rate__currencies">
              <div>
                <label htmlFor="currency_sending">Sending Currency</label>
                <div>
                  <select className="form-control" value={sendingCurrency.id} name="sending_currency" id="currency_sending" onChange={this.currencyUpdate}>
                    {sendingCurrencies.map((curr, index) => (
                      <option key={curr.id} value={curr.id}>{curr.currency_code}</option>
                    ))}
                  </select>
                  <span>
                    {sendingCurrency.flag && 
                      <img src={Config.IMAGE_URL + sendingCurrency.flag} alt={sendingCurrency.currency_code} />
                    }
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="currency_receiving">Receiving Currency</label>
                <div>
                  <select className="form-control" value={receivingCurrency.id} name="sending_currency" id="currency_receiving" onChange={this.currencyUpdate}>
                    {receivingCurrencies.map((curr, index) => (
                      <option key={curr.id} value={curr.id}>{curr.currency_code}</option>
                    ))}
                  </select>
                  <span>
                    {receivingCurrency.flag &&
                      <img src={Config.IMAGE_URL + receivingCurrency.flag} alt={receivingCurrency.currency_code} />
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="exchange-rate__amount">
              <label htmlFor="exchange_amount">Amount:</label>
              <input type="number" className="form-control" name="amount_exchange" id="exchange_amount" onChange={this.amountUpdate} value={amount}/>
            </div>
            
            {exchange_rate &&
              <div className="exchange-rate__result text-center">
                <div>
                  <span>Exchange Rate:</span>
                  <span>{sendingCurrency.currency_symbol + parseFloat(1).toFixed(2) + ' = ' + receivingCurrency.currency_symbol + parseFloat(exchange_rate).toFixed(2)}</span>
                </div>
                <div>
                  <span>Fee:</span>
                  <span>{sendingCurrency.currency_symbol + parseFloat(fee).toFixed(2)}</span>
                </div>
                <div>
                  <span>You Send:</span>
                  <span>{sendingCurrency.currency_symbol + parseFloat(amount).toFixed(2)}</span>
                </div>
                <div>
                  <span>They Get:</span>
                  <span>{receivingCurrency.currency_symbol + parseFloat(receiving_amount).toFixed(2)}</span>
                </div>
              </div>
            }
            
            <div className="exchange-rate__submit">
              <button type="submit">Calculate</button>
            </div>
          
          </form>
        </div>
        
      </div>
    );
  }

}

export default ExchangeRate;