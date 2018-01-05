import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

import OroboAPI from '../API/api-service';
import HomepageInput from './HomepageInput';
import Loader from './Loader';



class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      reset_code: '',
      password: '',
      confirm_password: '',
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
    
    if (this.state.password !== this.state.confirm_password) {
      this.toastr.addNotification({
        message: 'Password fields do not match.',
        level: 'error'
      });
      return;
    }
    
    this.setState({inProgress: true});
    
    OroboAPI.resetPassword(this.state).then((response) => {
      
      if (response.data.PayLoad.status) {
        this.toastr.addNotification({
          message: 'Reset password successful.',
          level: 'success'
        });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
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
      
      this.setState({inProgress: false});
    }, (error) => {
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
      this.setState({inProgress: false});
      console.log(error);
    });
      
  }

  render() {
    
    const {
      reset_code,
      password,
      confirm_password,
      inProgress
    } = this.state;
    
    return (
      <div className="orobo-box orobo-box--titlebox">
        <div>
          
          <NotificationSystem ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
          
          <Loader showWhenTrue={inProgress} />
          
          <div className="orobo-box__head text-center">Reset Password</div>
          
          <div className="orobo-box__form">
            <form onSubmit={this.handleSubmit} autoComplete="off">
              
              <HomepageInput 
                type="text"
                name="reset_code"
                value={reset_code}
                id="password-hash"
                placeholder="Reset code*"
                label="Reset code"
                required={true}
                focus={true}
                onInputUpdate={this.updateInputValue} />
              
              <HomepageInput 
                type="password"
                name="password"
                value={password}
                id="reset-password"
                placeholder="Password*"
                label="Password"
                required={true}
                onInputUpdate={this.updateInputValue} />
                
                <HomepageInput 
                  type="password"
                  name="confirm_password"
                  value={confirm_password}
                  id="reset-password-confirm"
                  placeholder="Repeat password*"
                  label="Repeat Password"
                  required={true}
                  onInputUpdate={this.updateInputValue} />
              
              <button type="submit" className="btn">Reset Password</button>
              
            </form>
          </div>
          
        </div>  
      </div>
    );
  }

}

export default ResetPassword;