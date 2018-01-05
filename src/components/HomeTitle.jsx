import React, { Component } from 'react';

class HomeTitle extends Component {

  render() {
    
    const { title, subtitle } = this.props;
    
    return (
      <div className="home-title">
        <div className="text-uppercase"><strong>{title}</strong></div>
        <div className="text-uppercase">{subtitle}</div>
      </div>
    );
  }

}

export default HomeTitle;