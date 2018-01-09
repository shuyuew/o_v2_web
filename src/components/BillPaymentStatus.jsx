import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';
import { confirm } from './confirm';
import OroboAPI from '../API/api-service';

let availableInfo;

class BillPaymentStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inProgress: false
    }

    this.confirmPayment = this.confirmPayment.bind(this);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.openDispute = this.openDispute.bind(this);
    this.contactSupport = this.contactSupport.bind(this);
  }

  confirmPayment() {
    confirm('Are you sure you want to confirm this payment as fulfilled?').then(() => {
      this.setState({ inProgress: true });

      OroboAPI.confirmPayment(availableInfo.bill_payment_stages[0].bill_payment_id).then((response) => {
        this.setState({ inProgress: false });

        if (response.data.PayLoad.status) {
          this.toastr.addNotification({
            message: response.data.PayLoad.data.message,
            level: 'success'
          });

          setTimeout(() => {
            this.props.history.push('/history');
          }, 3500);
        } else {
          this.toastr.addNotification({
            message: response.data.PayLoad.error[0],
            level: 'error'
          });
        }

      }, (error) => {
        this.setState({ inProgress: false });
      });

    }, () => {
      console.log('cancel!');
    });
  }

  cancelPayment() {
    confirm('Are you sure you want to cancel this payment?').then(() => {
      
      this.setState({ inProgress: true });

      OroboAPI.cancelPayment(availableInfo.bill_payment_stages[0].bill_payment_id).then((response) => {
        this.setState({ inProgress: false });

        if (response.data.PayLoad.status) {
          this.toastr.addNotification({
            message: response.data.PayLoad.data.message,
            level: 'success'
          });

          setTimeout(() => {
            this.props.history.push('/history');
          }, 3500);
        } else {
          this.toastr.addNotification({
            message: response.data.PayLoad.error[0],
            level: 'error'
          });
        }

        
      }, (error) => {
        this.setState({ inProgress: false });
      });

    }, () => {
      console.log('cancel!');
    });
  }

  openDispute() {
    console.log('open dispute');
  }

  contactSupport() {
    console.log('contact support');
  }

  render() {

    const { inProgress } = this.state;
    availableInfo = this.props.location.state ? this.props.location.state.detail : undefined;

    return (
      <div className="bill-payment-status">

        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />  
        <Loader showWhenTrue={inProgress} />
      
        {!availableInfo && <h1>Nothing found.</h1>}

        {availableInfo &&
          <div className="bill-info">
            
            <div className="bill-info__header text-center">
              <div>Bill Reference (OBR)</div>
              <div>{availableInfo.reference}</div>
              <div>{moment(availableInfo.created).format('MMMM DD, HH:mm')}</div>
              <div>{availableInfo.status.title}</div>
            </div>

            <div className="bill-info__content">
              <div>
                <span>Biller:</span>
                <span>{availableInfo.bill_provider.title}</span>
                <span>{availableInfo.bill_provider.address}</span>
              </div>

              <div>
                <span>Bill:</span>
                <span>{availableInfo.bill.title}</span>
              </div>

              <div>
                <span>Option:</span>
                <span>{availableInfo.bill_option.title}</span>
              </div>

              <div>
                <span>Amount:</span>
                <span>{availableInfo.receiving_currency.currency_symbol + availableInfo.receiving_amount + ' (' + availableInfo.sending_currency.currency_symbol + availableInfo.sending_amount + ')'}</span>
              </div>
            </div>

            <div className="bill-info__exchange-rate text-center">
              {'Ex. Rate: ' + availableInfo.sending_currency.currency_symbol + '1.00 = ' + availableInfo.receiving_currency.currency_symbol + parseFloat(availableInfo.exchange_rate).toFixed(2) + ', Service fee: ' + availableInfo.sending_currency.currency_symbol + parseFloat(availableInfo.fee).toFixed(2)}
            </div>

            <div className="bill-info__tracking">
              <h4>Tracking:</h4>
              <ul>
                {availableInfo.bill_payment_stages.map((stage) => (
                  <li key={stage.id}>
                    <div>
                      <span className="stage-status"></span>
                    </div>
                    <div>
                      <span>{stage.stage.title}</span>
                      <span>{stage.remarks}</span>
                      <span>{moment(stage.created).format('MMMM DD, HH:mm')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bill-info__actions">
                <h4>Support Actions:</h4>

                <div>
                  <button type="button" onClick={this.confirmPayment}>Confirm Payment</button>
                  <button type="button" onClick={this.cancelPayment}>Cancel Bill</button>
                  <button type="button" onClick={this.openDispute}>Open Dispute</button>
                  <a href="mailto:">Contact Support</a>
                </div>
            </div>

          </div>
        }

      </div>
    );
  }
}

export default withRouter(BillPaymentStatus);