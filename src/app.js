// Main Stylesheet
import './sass/main.scss';

// Essential Modules
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { StripeProvider } from 'react-stripe-elements';


// Components
import Login from './components/Login';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SuccessfulRegistration from './components/RegistrationSuccess';
import HomeBackground from './components/HomeBackground';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import PaymentSteps from './components/PaymentSteps';
import PaymentWizard from './components/PaymentWizard';
import PayBills from './components/PayBills';
import MyCards from './components/MyCards';
import MyProfile from './components/MyProfile';
import NewBeneficiary from './components/NewBeneficiary';
import ExchangeRate from './components/ExchangeRate';
import ChangePassword from './components/ChangePassword';
import NewCreditCard from './components/NewCreditCard';
import BillersTitle from './components/BillersTitle';
import MyBillers from './components/MyBillers';
import NewBiller from './components/NewBiller';
import TransactionsHistory from './components/History';
import PrivateRoute from './components/PrivateRoute';


const HeaderTitle = (props) => <h4 className="text-center text-uppercase">{props.title}</h4>;

const DashboardRoutes = [
  {
    path: '/send-money',
    name: 'Send Money',
    authorized: true,
    exact: true,
    children: {
      mainTop: <PaymentSteps />,
      mainContent: <PaymentWizard />,
      rightSideBarTop: <HeaderTitle title="Exchange Rate" />,
      rightSidebarContent: <ExchangeRate />
    }
  },
  {
    path: '/pay-bills',
    name: 'Pay Bills',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="Pay Bills Title" />,
      mainContent: <PayBills />,
      rightSideBarTop: <BillersTitle />,
      rightSidebarContent: <MyBillers />
    }
  },
  {
    path: '/my-card',
    name: 'My Card',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="My Card" />,
      mainContent: <MyCards />,
      rightSideBarTop: <HeaderTitle title="My card sidebar title" />,
      rightSidebarContent: ''
    }
  },
  {
    path: '/my-profile',
    name: 'My Profile',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="My Profile" />,
      mainContent: <MyProfile />,
      rightSideBarTop: <HeaderTitle title="Sidebar title" />,
      rightSidebarContent: ''
    }
  },
  {
    path: '/add-beneficiary',
    name: 'Add Beneficiary',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="Add beneficiary" />,
      mainContent: <NewBeneficiary />,
      rightSideBarTop: <HeaderTitle title="Sidebar title" />,
      rightSidebarContent: ''
    }
  },
  {
    path: '/change-password',
    name: 'Change Password',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="Change Password" />,
      mainContent: <ChangePassword />,
      rightSideBarTop: <HeaderTitle title="My Profile sidebar title" />,
      rightSidebarContent: ''
    }
  },
  {
    path: '/new-card',
    name: 'Add New Card',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="Add New Card" />,
      mainContent: <NewCreditCard />,
      rightSideBarTop: <HeaderTitle title="My Profile sidebar title" />,
      rightSidebarContent: ''
    }
  },
  {
    path: '/new-biller',
    name: 'Add New Biller',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="Add Your Biller" />,
      mainContent: <NewBiller />,
      rightSideBarTop: <BillersTitle />,
      rightSidebarContent: <MyBillers />
    }
  },
  {
    path: '/history',
    name: 'History',
    authorized: true,
    exact: true,
    children: {
      mainTop: <HeaderTitle title="My Transactions" />,
      mainContent: <TransactionsHistory />,
      rightSideBarTop: <HeaderTitle title="History sidebar title" />,
      rightSidebarContent: ''
    }
  }
];


class App extends Component {

  render() {      
    return (
      <Router>
        <StripeProvider apiKey="pk_test_QULFerT2MWbJyQqWZ0jNhsxn">
      
          <HomeBackground>
            <Switch>
              
              <Route exact path="/" component={Login}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/sign-up" component={Registration}/>
              <Route exact path="/forgot-password" component={(props) => <ForgotPassword routeData={props} />}/>
              <Route exact path="/reset-password" component={ResetPassword}/>
              
              <PrivateRoute path="/success" component={SuccessfulRegistration}/>
              
              {DashboardRoutes.map((route, index) => (
                route.authorized ? (
                  <PrivateRoute 
                    key={index}
                    exact={route.exact}
                    path={route.path}
                    component={(props) => <Dashboard routeData={props} childComponents={route.children} />}/>
                ) : (
                  <Route 
                    key={index}
                    exact={route.exact}
                    path={route.path}
                    component={(props) => <Dashboard routeData={props} childComponents={route.children} />}/>
                )
              ))}
              
              <Route component={NotFound}/>
            </Switch>
          </HomeBackground>
          
        </StripeProvider>
      </Router>
    )
  }

}


ReactDOM.render(
  <App />,
  document.getElementById('root')
)
