import React, { Component } from 'react';

let BillersList = [];

class MyBillers extends Component {
  
  componentDidMount() {
    
  }
  
  render() {
    return (
      <div className="orobo-billers">
        <ul className="list-group">
          {BillersList.map((name, index) => (
            <li key={index} className="list-group-item">{name}</li>
          ))}
        </ul>
      </div>
    );
  }

}

export default MyBillers;