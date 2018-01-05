import React, { Component } from 'react';
import {
  Tab,
  Tabs, 
  TabList,
  TabPanel
 } from 'react-tabs';
 import OroboAPI from '../API/api-service';
 
 
// const paymentsList = [
//   {
//     name: 'Darlene M. Scarborough',
//     ngncode: 'NGN 25000',
//     status: 'orange',
//     date: 'October 22, 18:48',
//     amount: 'USD 42.56'
//   },
//   {
//     name: 'Nelson J. Mai',
//     ngncode: 'NGN 5000',
//     status: 'blue',
//     date: 'November 22, 18:48',
//     amount: 'USD 150.56'
//   },
//   {
//     name: 'Jamie S. Serrano',
//     ngncode: 'NGN 25000',
//     status: 'orange',
//     date: 'January 22, 18:48',
//     amount: 'USD 2500'
//   },
//   {
//     name: 'Linda K. Forest',
//     ngncode: 'NGN 30000',
//     status: 'blue',
//     date: 'March 22, 18:48',
//     amount: 'USD 92.56'
//   }
// ];
// const transfersList = [
//   {
//     name: 'Miles R. Gentile',
//     ngncode: 'NGN 25000',
//     status: 'blue',
//     date: 'October 22, 18:48',
//     amount: 'USD 42.56'
//   },
//   {
//     name: 'Margaret B. Blackshear',
//     ngncode: 'NGN 5000',
//     status: 'orange',
//     date: 'November 22, 18:48',
//     amount: 'USD 150.56'
//   },
//   {
//     name: 'Don R. Hoover',
//     ngncode: 'NGN 25000',
//     status: 'blue',
//     date: 'January 22, 18:48',
//     amount: 'USD 2500'
//   },
//   {
//     name: 'Jane R. Sanchez',
//     ngncode: 'NGN 30000',
//     status: 'orange',
//     date: 'March 22, 18:48',
//     amount: 'USD 92.56'
//   }
// ];
 

class TransactionsHistory extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      transfers: [],
      bill_payments: []
    };
  }
  
  componentDidMount() {
    
    // Get User Transfers
    OroboAPI.getTransfers().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ transfers: response.data.PayLoad.data.transfer_requests });
      }
    }, (error) => {
      console.log(error);
    });
    
    // Get User Bill Payments
    OroboAPI.getBIllPayments().then((response) => {
      if (response.data.PayLoad.status) {
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
        <div key={index} className="list-item">
          <span className={'list-item__status ' + item.status}>{item.status === 'blue' ? '?' : '!'}</span>
          
          <div>
            <div className="list-item__top">
              <span>{item.name}</span>
              <span>{item.ngncode}</span>
            </div>
            <div className="list-item__bottom">
              <span>{item.date}</span>
              <span>{item.amount}</span>
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

export default TransactionsHistory;