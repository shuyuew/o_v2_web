import React, { Component } from 'react';
import Beneficiaries from './Beneficiaries';
import OroboAPI from '../API/api-service';
import Loader from './Loader';

class PaymentWizard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      beneficiares: [],
      inProgress: true
    };
  }
  
  componentDidMount() {
    
    OroboAPI.getBeneficiries().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ beneficiares: response.data.PayLoad.data.beneficiaries });
      }
      
      this.setState({ inProgress: false });
    }, (error) => {
      console.log('error');
      
      this.setState({ inProgress: false });
    });
    
  }

  render() {
    
    const { beneficiares, inProgress } = this.state;
  
    return (
      <div className="orobo-payment">
        
        <Loader showWhenTrue={inProgress} />
          
        <Beneficiaries list={beneficiares} />
      </div>
    );
  }

}

export default PaymentWizard;