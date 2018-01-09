import React, { Component } from 'react';
import {
  Tab,
  Tabs, 
  TabList,
  TabPanel
 } from 'react-tabs';
 import { withRouter } from 'react-router-dom';
 import OroboAPI from '../API/api-service';
 import moment from 'moment';
 

class TransactionsHistory extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      transfers: [],
      bill_payments: []
    };

    this.previewBillPayment = this.previewBillPayment.bind(this);
  }

  previewBillPayment(data) {
    this.props.history.push({
      pathname: '/bill-payment-status',
      state: { detail: data }
    });
  }
  
  componentDidMount() {
    
    // Get User Transfers
    OroboAPI.getTransfers().then((response) => {
      if (response.data.PayLoad.status) {
        console.log(response.data);
        this.setState({ transfers: response.data.PayLoad.data.transfer_requests });
      }
    }, (error) => {
      console.log(error);
    });
    
    // Get User Bill Payments
    OroboAPI.getBIllPayments().then((response) => {
      if (response.data.PayLoad.status) {
        console.log(response.data);
        this.setState({ bill_payments: response.data.PayLoad.data.bill_payments });
      }
    }, (error) => {
      console.log(error);
    });
    
  }

  render() {
    
    const { transfers, bill_payments } = this.state;
    
    const renderList = (listItems) => {
      return listItems.map((item, index) => (
        <div key={index} className="list-item" onClick={() => { this.previewBillPayment(item) }}>
          <span className={'list-item__status ' + item.status.title}>{item.status.title === 'PROCESSING' || item.status.title === 'SENT' || item.status.title === 'FINISHED' ? '!' : '?'}</span>
          
          <div>
            <div className="list-item__top">
              <span>{item.bill_provider.title}</span>
              <span>{item.receiving_currency.currency_code + ' ' + item.receiving_amount}</span>
            </div>
            <div className="list-item__bottom">
              <span>{moment(item.created).format('MMMM DD, hh:mm')}</span>
              <span>{item.sending_currency.currency_code + ' ' + item.sending_amount}</span>
            </div>
          </div>
        </div>
      ));
    }
    
    return (
      <div className="orobo-history">
        
        <Tabs>
            
          <TabList className="orobo-history__nav">
            <Tab>Transfers</Tab>
            <Tab>Bill payments</Tab>
          </TabList>

          <TabPanel className="orobo-history__content orobo-history__content--transfers">
            {transfers.length > 0 && renderList(transfers)}
            
            {transfers.length === 0 &&
              <p>No transfers yet.</p>
            }
          </TabPanel>
          
          <TabPanel className="orobo-history__content orobo-history__content--payments">
            {bill_payments.length > 0 && renderList(bill_payments)}
            
            {bill_payments.length === 0 &&
              <p>No bill payments yet.</p>
            }
          </TabPanel>
          
        </Tabs>
        
      </div>
    );
  }

}

export default withRouter(TransactionsHistory);