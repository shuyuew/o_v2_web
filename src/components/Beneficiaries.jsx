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
        <h1 className="orobo-title orobo-title--has-btn">
          My Beneficiaries

          <div className="add-new-beneficiary">
            <Link to="/add-beneficiary">
              <i className="fa fa-plus" aria-hidden="true"/>
            </Link>
          </div>
        </h1> 

        {list.length > 0 && 
          <div className="orobo-beneficiaries__list">
            {
              list.map((item) => (
                <Beneficiary
                  key={item.id}
                  info={item}
                  selected={beneficiary}
                  selectBeneficiary={beneficiarySelect}/>
              ))
            }
          </div>
        }
    
        {list.length === 0 &&
          <div className="no-beneficiaries">No beneficiares added.</div>
        }
      
      </div>
    );
  }

}

export default Beneficiaries;