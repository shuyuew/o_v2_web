import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


import Navigation from './Navigation';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import OffCanvas from './OffCanvas';


class Dashboard extends Component {
  
  render() { 
    
    const { childComponents, routeData } = this.props;
    
    return (
      <div>
        <OffCanvas />
        
        <div className="orobo-dashboard">
          <div>
              
            <Navigation 
              navData={routeData}/>
              
            <MainContent 
              headComponent={childComponents.mainTop} 
              mainComponent={childComponents.mainContent}/>
            
            <Sidebar 
              topComponent={childComponents.rightSideBarTop}
              mainComponent={childComponents.rightSidebarContent}/>
              
          </div>
        </div>
      </div>
    );
  }

}

export default Dashboard;