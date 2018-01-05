import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { 
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements';
import OroboAPI from '../API/api-service';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';
import UserAuth from '../API/auth';



const createOptions = (fontSize) => {
  return {
    style: {
      base: {
        fontSize: '14px',
        color: '#525a63',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, Menlo, monospace',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  };
};


class NewCardForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inProgress: false,
      card_nickname: ''
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }
  
  updateInputValue(e) {
    this.setState({'card_nickname': e.target.value});
  }
  
  handleSubmit(ev) {
    ev.preventDefault();
    
    this.setState({ inProgress: true });
    
    this.props.stripe.createToken().then(({error, token}) => {
      
      if (error) {
        this.toastr.addNotification({
          message: error.message,
          level: 'error'
        });
        this.setState({ inProgress: false });
      }
      
      if (token) {
        const cardData = {
          stripe_token: token.id,
          payment_type: token.card.brand,
          brand: token.type,
          alias: this.state.card_nickname
        };
        
        
        OroboAPI.saveStripeCard(cardData).then((response) => {
        
          if (response.data.PayLoad.status) {
            UserAuth.updateCardData(response.data.PayLoad.data.Card);
            this.props.history.push('/my-card');  
          } else {
            this.setState({ inProgress: false });
            this.toastr.addNotification({
              message: response.data.PayLoad.error[0],
              level: 'error'
            });
          }
        }, (error) => {
          this.setState({ inProgress: false });
          this.toastr.addNotification({
            message: 'Something went wrong. Please try again later.',
            level: 'error'
          });
        });
      }
      
      
    }, (error) => {
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
      this.setState({ inProgress: false });
    });
  }

  render() {
    
    const { inProgress, card_nickname } = this.state;
    
    return (
      <div>
        
        <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        <Loader showWhenTrue={inProgress} />
        
        <form onSubmit={this.handleSubmit}>
          
          <div className="form-group">
            <label>
              Card number
              <CardNumberElement
                className="form-control"
                {...createOptions()}
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Expiration date
              <CardExpiryElement
                className="form-control"
                {...createOptions()}
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              CVC
              <CardCVCElement
                className="form-control"
                {...createOptions()}
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Card Nickname
              <input onChange={this.updateInputValue} value={card_nickname} type="text" className="form-control" placeholder="eg. John Doe"/>
            </label>
          </div>
          
          <button type="submit">Save card</button>
          
        </form>
        
      </div>
    );
  }

}

export default withRouter(injectStripe(NewCardForm));
