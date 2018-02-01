import React from 'react';
import OroboCookies from '../helpers/cookies';


const UserAuth = {
  
  isAuthenticated: OroboCookies.getCookie('isAuthorized'),
  
  authorize() {
    OroboCookies.setCookie('isAuthorized', true);
    this.isAuthenticated = true;
  },
  
  unauthorize() {
    OroboCookies.removeCookie('isAuthorized');
    this.isAuthenticated = false;
    window.location.href = '/login';
  },
  
  logOut(cb) {
    OroboCookies.removeCookie('User');
    OroboCookies.removeCookie('isAuthorized');
    OroboCookies.removeCookie('Action');
    this.isAuthenticated = false;
    if (cb) {
      cb();
    }
  },
  
  getUserData() {
    return OroboCookies.getCookie('User');
  },

  updateCardData(data) {
    const UserData = OroboCookies.getCookie('User');
    UserData.card = data;
    OroboCookies.setCookie('User', UserData);
  }
  
}

export default UserAuth;
