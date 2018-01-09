import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Beneficiary from './Beneficiary';

class Beneficiaries extends Component {

  render() {
    
    const {
      list,
      beneficiarySelect,
      beneficiary
    } = this.props;
    
    return (
      <div className="orobo-beneficiaries">
        <h1 className="orobo-title">My Beneficiaries</h1> 

        {list.length > 0 && 
          list.map((item) => (
            <Beneficiary
              key={item.id}
              info={item}
              selected={beneficiary}
              selectBeneficiary={beneficiarySelect}/>
          ))
        }
    
        {list.length === 0 &&
          <div className="no-beneficiaries">No beneficiares added.</div>
        }
        
        
        <div className="add-new-beneficiary text-right">
          <Link to="/add-beneficiary">
            Add new beneficiary <i className="fa fa-plus" aria-hidden="true"/>
          </Link>
        </div>
      
      </div>
    );
  }

}

export default Beneficiaries;