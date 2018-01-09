import React, { Component } from 'react';
import BillListing from './BillListing';

let filteredBillers = [];

class ActiveBillers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    }

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onFilterChange(e) {
    filteredBillers = e.target.value ? this.props.list.filter((obj) => obj.title.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) : [];
    this.setState({ filter: e.target.value });
  }

  render() {

    const { 
      list,
      activeBiller,
      billerUpdate
    } = this.props;

    const { filter } = this.state;
    const billersList = filter.length ? filteredBillers : list;

    return (
      <div className="active-billers">
      
        {!filter && billersList.length === 0 && 
          <div className="no-billers">No active billers for selected category and state.</div>
        }

        {list.length > 0 &&
          <div className="biller-filter">
            <div className="form-group">
              <input type="text" name="filter" id="biller_filter" className="form-control" value={filter} placeholder="Filter by biller name" onChange={this.onFilterChange}/>
            </div>
          </div>
        }

        {filter.length > 0 && billersList.length === 0 && 
          <div className="no-billers">Nothing found.</div>
        }

        <div className="biller-listings">
          <BillListing 
            list={billersList} 
            selectionUpdate={billerUpdate}
            activeListing={activeBiller} />
         </div>

      </div>
    );
  }
}

export default ActiveBillers;