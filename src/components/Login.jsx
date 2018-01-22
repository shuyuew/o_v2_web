import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import HomepageInput from './HomepageInput';
import Loader from './Loader';
import NotificationSystem from 'react-notification-system';

let loggedInUser;



class Login extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      email_address: '',
      password: '',
      inProgress: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    
  }

  handleSubmit(event) {
    event.preventDefault();
    
    this.setState({ inProgress: true });
    OroboAPI.loginUser(this.state).then((response) => {
      
      if (response.status === 200 && response.data.PayLoad.status) {
        this.toastr.addNotification({
          message: 'Login successful.',
          level: 'success'
        });
        
        UserAuth.authorize();
        
        setTimeout(() => {
          this.props.history.push('/send-money');
        }, 1000);
      } else {
        this.toastr.addNotification({
          message: response.data.PayLoad.error[0],
          level: 'error'
        });
      }
      
      this.setState({ inProgress: false });
      
    }, (error) => {
      this.setState({ inProgress: false });
      this.toastr.addNotification({
        message: 'Something went wrong. Please try again later.',
        level: 'error'
      });
    });
    
  }
  
  updateInputValue(data) {
    this.setState({[data.name]: data.value});
  }
  
  componentWillMount() {
    loggedInUser = UserAuth.getUserData();
    
    if (loggedInUser) {
      this.setState({email_address: loggedInUser.email_address});
    }
  }

  render() {
    
    const { email_address, password, inProgress } = this.state;
    
    return (
      <div className="orobo-box">
        
        <div>
          
          <NotificationSystem className="toast-top-center" ref={(NotificationSystem) => { this.toastr = NotificationSystem; }} />
          
          <Loader showWhenTrue={inProgress} />
          
          <div className="orobo-box__smiley text-center">
            <img src="/images/welcome/welcome.png" alt="Smiley"/>
          </div>
          
          {loggedInUser !== undefined && 
            <div className="orobo-box__welcome text-center">
              <span>Welcome back</span>
              <span>{loggedInUser.first_name}!</span>
            </div>  
          }
          
          <div className="orobo-box__form">
            <form onSubmit={this.handleSubmit} autoComplete="off">
              
              {!loggedInUser && 
                <HomepageInput 
                  type="email"
                  name="email_address"
                  id="login-email"
                  placeholder="Username*"
                  label="Username"
                  value={email_address}
                  required={true}
                  onInputUpdate={this.updateInputValue}
                  focus="true" />
              }
              
              <HomepageInput 
                type="password"
                name="password"
                id="login-password"
                value={password}
                placeholder="Password*"
                label="Password"
                onInputUpdate={this.updateInputValue}
                required={true} />
              
            
              <button type="submit" className="btn">Login</button>
              
            </form>
          </div>
          
          <div className="orobo-box__cta">
            <div>
              <Link to="/forgot-password">Forgot Password?</Link>
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

export default Login;