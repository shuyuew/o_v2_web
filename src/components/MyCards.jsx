import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserAuth from '../API/auth';
import moment from 'moment';

let cardData;

class MyCards extends Component {

  componentWillMount() {
    cardData = UserAuth.getUserData().card;
  }

  render() {
    return (
      <div className="user-card">

        {cardData && 
          <div>
            <div className="user-card__info">
              <div>Brand:</div>
              <div>{cardData.brand}</div>
            </div>

            <div className="user-card__info">
              <div>Type:</div>
              <div>{cardData.payment_type}</div>
            </div>
          
            <div className="user-card__info">
              <div>Title:</div>
              <div>{cardData.title}</div>
            </div>

            {/* <div className="user-card__info">
              <div>Country:</div>
              <div>{cardData.country !== null ? cardData.country : 'Country info is missing.' }</div>
            </div> */}

            <div className="user-card__info">
              <div>Created:</div>
              <div>{moment(cardData.created).format('MMMM Do YYYY')}</div>
            </div>
          </div>
        }

        {!cardData && 
          <div>No credit card added</div>
        }

        <div className="form-group user-card__cta">
          <Link to="/new-card" className="text-uppercase">Add new</Link>
        </div>

      </div>
    );
  }

}

export default MyCards;
