import React from 'react';
import UserAuth from '../API/auth';
import {
  Route,
  Redirect
} from 'react-router-dom';

const HomepageRoute = ({ ...rest }) => (
  <Route {...rest} render={props => (
    UserAuth.isAuthenticated ? (
      <Redirect to={{
        pathname: '/send-money',
        state: {
          from: props.location
        }
      }}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }}/>
    )
  )}/>
);


export default HomepageRoute;