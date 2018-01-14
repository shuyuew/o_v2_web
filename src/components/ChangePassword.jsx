import React, { Component } from 'react';

import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import HomepageInput from './HomepageInput';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';



class ChangePassword extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      password: '',
      cpassword: '',
      inProgress: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    if (this.state.password !== this.state.cpassword) {
      this.toastr.addNotification({
        message: 'Password fields do not match.',
        level: 'error'
      });
      return;
    }
    
    this.setState({ inProgress: true });
    
    OroboAPI.changePassword(this.state).then((response) => {
      console.log(response);
      if (response.data.PayLoad.status) {
        this.toastr.addNotification({
          message: 'You will be logged out in order to log in with new password.',
          level: 'success'
        });
        
        setTimeout(() => { UserAuth.unauthorize() }, 4000);
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
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }

  render() {
    
    const { password, cpassword, inProgress } = this.state;
    
    return (
      <div className="change-password">
        
        <Loader showWhenTrue={inProgress} />
        
        <NotificationSystem className="toast-top-center" ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
        
        <form onSubmit={this.handleSubmit} autoComplete="off">
          
          <HomepageInput 
            type="password"
            name="password"
            value={password}
            id="change-password"
            placeholder="Password*"
            label="Password"
            focus={true}
            onInputUpdate={this.updateInputValue}
            required={true} />
          
          <HomepageInput 
            type="password"
            name="cpassword"
            value={cpassword}
            id="change-cpassword"
            placeholder="Confirm Password*"
            label="Confirm Password"
            onInputUpdate={this.updateInputValue}
            required={true} />
          
          <button type="submit">Change Password</button>
          
        </form>
      </div>
    );
  }

}

export default ChangePassword;