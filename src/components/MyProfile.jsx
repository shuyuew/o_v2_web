import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '../API/auth';

import Config from '../data/config';

let UserData;

class MyProfile extends Component {
  
  componentWillMount() {
    UserData = UserAuth.getUserData();
  }
  
  render() {
    
    return (
      <div className="orobo-user">
        
        <div className="orobo-user__password-change">
          <Link to="/change-password">Change password</Link>
        </div>
        
        <div className="orobo-user__full">
          <span>
            <img src={Config.IMAGE_URL + UserData.country_currency.flag} alt={UserData.country_currency.country_name}/>
          </span>
          <span>{UserData.full_name}</span>
        </div>
        
        <div className="orobo-user__list">
          <ul>
            
            <li className="list-item">
              <div>
                <div className="user-label">Mobile</div>
                <div className="user-info">{UserData.phone_number}</div>
              </div>
            </li>
            
            <li className="list-item">
              <div>
                <div className="user-label">Email</div>
                <div className="user-info">{UserData.email_address}</div>
              </div>
            </li>
            
            <li className="list-item">
              <div>
                <div className="user-label">Address</div>
                <div className="user-info">{UserData.address ? UserData.address : 'Address not provided'}</div>
              </div>
            </li>  
            
            <li className="list-item">
              <div>
                <div className="user-label">Credit Card</div>
                <div className="user-info">{UserData.card.payment_type ? UserData.card.payment_type : 'No card added'}</div>
              </div>
              
              <div className="add-card">
                <Link to="/new-card" className="text-uppercase">Add new</Link>
              </div>
            </li>
            
            <li className="list-item">
              <div>
                <div className="user-label">Account Tier</div>
                <div className="user-info">{UserData.tier.title}</div>
              </div>
            </li>
            
          </ul>
        </div>
        
      </div>
    );
  }
}

export default MyProfile;
