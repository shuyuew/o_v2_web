import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const NavLinks = [
  {
    label: 'Send Money',
    slug: '/send-money'
  },
  {
    label: 'Pay Bill',
    slug: '/pay-bill'
  },
  {
    label: 'My Card',
    slug: '/my-card'
  },
  {
    label: 'My Profile',
    slug: '/my-profile'
  }
];

class Navigation extends Component {

  render() {
    
    const { navData } = this.props;
    const NavigationLinks = NavLinks.map((item, index) => (
      <Link key={index} to={item.slug} className={item.slug === navData.location.pathname ? 'active' : ''}>
        {item.label}
      </Link>
    ));
    
    return (
      <div className="orobo-navigation">
        
        <div className="orobo-header">
          <div className="text-center">
            <a href="/">
              <img src="/images/dashboard-logo.png" alt="Orobo Logo"/>
            </a>
          </div>
        </div>
        
        <div className="orobo-links">
          
          <div className="orobo-links__title">Activity</div>
          
          <nav className="orobo-links__list">
            {NavigationLinks}
          </nav>
          
        </div>
        
      </div>
    );
  }

}

export default Navigation;