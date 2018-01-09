import React from 'react';
import Config from '../data/config';

const BillListing = ({list, selectionUpdate, activeListing}) => (
  list.map((listing) => (
    <div key={listing.id} className={activeListing === listing.id ? 'list-holder active-listing' : 'list-holder'} onClick={() => { selectionUpdate(listing) }}>
      {listing.icon && 
        <span>
          <img src={Config.BASE_URL + listing.icon} alt={listing.title}/>
        </span>
      }
      <span>{listing.title}</span>
      <span>
        <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
      </span>
    </div>
  ))
);


export default BillListing;