import React, { Component } from 'react';


class MainComponent extends Component {
  render() {
    
    const {
      headComponent,
      mainComponent
    } = this.props;
    
    return (
      <div className="orobo-main">
        
        <div className="orobo-header">
          {headComponent}
        </div>
        
        <div className="orobo-main__wrapper">
          {mainComponent}
        </div>
        
      </div>
    );
  }

}

export default MainComponent;