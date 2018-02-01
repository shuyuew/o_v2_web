import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import HomeTitle from './HomeTitle';

class HomeBackground extends Component {

  render() {
    
    const TitleRoutes = ['/login', '/forgot-password', '/success'];
    const { location } = this.props;
    let wrapStyle = {};
    
    switch (location.pathname) {
      
      case '/':
        // wrapStyle.backgroundImage = 'url(http://fakeimg.pl/1400x900/ededed/27a6df)';
      break;
      
      case '/login':
        wrapStyle.backgroundImage = 'url(http://fakeimg.pl/1400x900/ededed/222222)';
      break;
      
      case '/success':
        wrapStyle.backgroundImage = 'url(http://fakeimg.pl/1400x900/ededed/222222)';
      break;
      
      case '/forgot-password':
      case '/reset-password':
        wrapStyle.backgroundImage = 'url(http://fakeimg.pl/1400x900/ededed/3abdef)';
      break;
      
    }
    
    return (
      <div className="orobo-home" style={wrapStyle}>
        
        {TitleRoutes.indexOf(location.pathname) > -1 && 
          <HomeTitle title="Be there" subtitle="Even when you can't." />
        }
        
        {this.props.children}
      </div>
    );
  }

}

export default withRouter(HomeBackground);