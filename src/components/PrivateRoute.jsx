import React from 'react';
import UserAuth from '../API/auth';
import {
  Route,
  Redirect
} from 'react-router-dom';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    UserAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);


export default PrivateRoute;