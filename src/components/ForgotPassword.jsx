import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import HomepageInput from './HomepageInput';
import OroboAPI from '../API/api-service';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';



class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email_address: '',
      inProgress: false
    };
    
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ inProgress: true }); 
    
    OroboAPI.forgotPassword(this.state).then((response) => {
    
      if (response.data.PayLoad.status) {
        this.toastr.addNotification({
          message: 'Check your email for reset code.',
          level: 'success'
        });
        
        setTimeout(() => {
          this.props.routeData.history.push('/reset-password');
        }, 4000);
      } else {
        if (response.data.PayLoad.error && response.data.PayLoad.error.length) {
          for (var i = 0; i < response.data.PayLoad.error.length; i++) {
            this.toastr.addNotification({
              message: response.data.PayLoad.error[i],
              level: 'error'
            });
          }
        }
      }
    
      this.setState({ inProgress: false }); 
    }, (error) => {
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
      this.setState({ inProgress: false }); 
    });
      
  }

  render() {
    
    const { email_address, inProgress } = this.state;
    
    return (
      <div className="orobo-box orobo-box--titlebox">
        <div>
          
          <NotificationSystem className="toast-top-center" ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
          
          <Loader showWhenTrue={inProgress} />
          
          <div className="orobo-box__head text-center">Forgot Password</div>
          
          <div className="orobo-box__form">
            <form onSubmit={this.handleSubmit} autoComplete="off">
              
              <HomepageInput 
                type="email"
                name="email_address"
                value={email_address}
                id="register-email"
                placeholder="Email*"
                label="Email"
                required={true}
                focus={true}
                onInputUpdate={this.updateInputValue} />
              
              <button type="submit" className="btn">Recover Password</button>
              
            </form>
          </div>
          
          <div className="orobo-box__cta">
            <div>
              <Link to="/login">Sign in</Link>
            </div>
            <div>
              <Link to="/sign-up">New User</Link>
            </div>
          </div>
          
        </div>  
      </div>
    );
  }

}

export default ForgotPassword;