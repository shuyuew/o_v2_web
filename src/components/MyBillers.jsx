import React, { Component } from 'react';
import OroboAPI from '../API/api-service';
import Loader from './Loader';

class MyBillers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inProgress: true,
      billers: []
    }
  }
  
  componentWillMount() {
    OroboAPI.getMyBillers().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ billers: response.data.PayLoad.data.billers });
      }
      this.setState({ inProgress: false });
    }, (error) => {
      console.log(error);
    });
  }
  
  render() {

    const {
      inProgress,
      billers
    } = this.state;

    return (
      <div className="orobo-billers">

        <Loader showWhenTrue={inProgress} />

        {billers.length === 0 &&
          <div className="no-billers">You don't have any billers added yet.</div>  
        }

        {billers.length > 0 &&
          <ul className="list-group">
          {billers.map((biller) => (
            <li key={biller.id} className="biller-listing">
              <div><strong>Name:</strong> {biller.bill_provider.title}</div>
              <div><strong>Email:</strong> {biller.bill_provider.email_address}</div>
              <div><strong>From:</strong> {biller.bill_provider.country_currency.country_name}</div>
              <div><strong>Category:</strong> {biller.bill_provider.bill_category.title}</div>
            </li>
          ))}
        </ul>
        }
      </div>
    );
  }

}

export default MyBillers;