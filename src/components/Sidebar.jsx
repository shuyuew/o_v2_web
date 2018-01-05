import React, { Component } from 'react';

class Sidebar extends Component {

  render() {
    
    const {
      topComponent,
      mainComponent
    } = this.props;
    
    return (
      <div className="orobo-exchange">
        
        <div className="orobo-header">
          {topComponent}
        </div>
        
        <div className="orobo-exchange__wrapper">
          {mainComponent}
        </div>
        
      </div>
    );
  }

}

export default Sidebar;