import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BillersTitle extends Component {

  render() {
    return (
      <div className="billers-head">
        <div className="text-uppercase">My Billers</div>
        <div>
          <Link to="/new-biller">
            <i className="fa fa-plus" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    );
  }

}

export default BillersTitle;