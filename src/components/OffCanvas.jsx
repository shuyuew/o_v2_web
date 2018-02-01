import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import UserAuth from '../API/auth';

let UserData;

const offsetLinks = [
  {
      label: 'Beneficiaries',
      url: '/send-money',
      icon: 'fa-address-book-o'
  },
  {
      label: 'Pay Bills',
      url: '/pay-bill',
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
      url: '/share-orobo',
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

  componentDidMount() {
    UserData = UserAuth.getUserData();
  }

  render() {
    
    const { history } = this.props;
    
    const menuLinks = offsetLinks.map((item, index) => (
      <Link onClick={() => {
          if (!item.clickAction) {
            return;
          }
          
          item.clickAction(() => { window.location.href = '/'; });
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
              <a href="/">
                <img src="/images/dashboard-logo.png" alt="Orobo Logo"/>
              </a>
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