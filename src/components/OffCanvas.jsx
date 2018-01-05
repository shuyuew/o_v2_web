import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import UserAuth from '../API/auth';

const offsetLinks = [
  {
      label: 'Beneficiaries',
      url: '/send-money',
      icon: 'fa-address-book-o'
  },
  {
      label: 'Pay Bills',
      url: '/pay-bills',
      icon: 'fa-list-alt'
  },
  {
      label: 'History',
      url: '/history',
      icon: 'fa-list'
  },
  {
      label: 'Profile',
      url: '/my-profile',
      icon: 'fa-user-circle'
  },
  {
      label: 'Share Orobo',
      url: '#',
      icon: 'fa-share-alt'
  },
  {
      label: 'Logout',
      url: '#',
      icon: 'fa-sign-out',
      clickAction: UserAuth.logOut
  }
];

class OffCanvas extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showHideSidenav: ""
    };
    
    this.openSideNav = this.openSideNav.bind(this);
    this.hideSideNav = this.hideSideNav.bind(this);
    
  }
  
  openSideNav(e) {
    this.setState({ showHideSidenav: 'active' });
  }
  
  hideSideNav(e) {
    if (e.target.classList.contains('active')) {
      this.setState({ showHideSidenav: '' });
    }
  }

  render() {
    
    const { history } = this.props;
    
    const menuLinks = offsetLinks.map((item, index) => (
      <Link onClick={() => {
          if (!item.clickAction) {
            return;
          }
          
          item.clickAction(() => history.push('/'));
        }} key={index} to={item.url}>
        <span>
          <i className={'fa ' + item.icon} aria-hidden="true"></i>
        </span>
        <span>{item.label}</span>
      </Link>
    ));
    
    
    return (
      <div className={'orobo-menu ' + this.state.showHideSidenav} onClick={this.hideSideNav}>
        
        <div className="orobo-menu__burger" onClick={this.openSideNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="orobo-menu__wrapper">
          <div>
            
            <div className="orobo-menu__logo">
              <img src="http://fakeimg.pl/390x145/ededed/27a6df" width="390" height="145" alt="Logo"/>
            </div>
            
            <div className="orobo-menu__links">
              <nav>
                {menuLinks}
              </nav>
            </div>
            
          </div>
        </div>
        
      </div>
    );
  }

}

export default withRouter(OffCanvas);