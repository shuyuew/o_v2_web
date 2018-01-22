import { combineReducers } from 'redux';


const sendMoneyInitState = {
  title: 'Select Beneficiary',
  steps: [{
    id: 1,
    isActive: true,
    isProcessed: false
  },
  {
    id: 2,
    isActive: false,
    isProcessed: false
  },
  {
    id: 3,
    isActive: false,
    isProcessed: false
  },
  {
    id: 4,
    isActive: false,
    isProcessed: false
  }]
}


const payBillInitState = {
  title: 'Select a Category',
  steps: [{
    id: 1,
    isActive: true,
    isProcessed: false
  },
  {
    id: 2,
    isActive: false,
    isProcessed: false
  },
  {
    id: 3,
    isActive: false,
    isProcessed: false
  },
  {
    id: 4,
    isActive: false,
    isProcessed: false
  }]
}



function sendMoneySteps(state = sendMoneyInitState, action) {
  let updatedList = state.steps;
  
  switch(action.type) {

    case 'SEND_PAYMENT_FORWARD':

      switch (action.stepData.activeState) {
        case 2:
          updatedList[0].isActive = false;
          updatedList[0].isProcessed = true;
          updatedList[1].isActive = true;
        break;
    
        case 3:
          updatedList[1].isActive = false;
          updatedList[1].isProcessed = true;
          updatedList[2].isActive = true;
        break;
      }

      return Object.assign({}, state, {
        title: action.stepData.title,
        steps: updatedList
      });

      
    case 'SEND_PAYMENT_BACKWARD':
    
      switch (action.stepData.activeState) {
        case 1: 
          updatedList[0].isActive = true;
          updatedList[1].isActive = false;
          updatedList[1].isProcessed = false;
        break;

        case 2:
          updatedList[1].isActive = true;
          updatedList[2].isActive = false;
        break;
      }

      return Object.assign({}, state, {
        title: action.stepData.title,
        steps: updatedList
      });

    default:
      return state;
  }
}

function payBillSteps(state = payBillInitState, action) {
  let updatedList = state.steps;
  switch(action.type) {

    case 'PAY_BILL_FORWARD':
      switch (action.stepData.activeState) {
        case 2:
          updatedList[0].isActive = false;
          updatedList[0].isProcessed = true;
          updatedList[1].isActive = true;
        break;
    
        case 3:
          updatedList[1].isActive = false;
          updatedList[1].isProcessed = true;
          updatedList[2].isActive = true;
        break;

        case 4:
          updatedList[2].isActive = false;
          updatedList[2].isProcessed = true;
          updatedList[3].isActive = true;
        break;
      }
      return Object.assign({}, state, {
        title: action.stepData.title
      });

    case 'PAY_BILL_BACKWARD':
      switch (action.stepData.activeState) {
        case 1: 
          updatedList[0].isActive = true;
          updatedList[1].isActive = false;
          updatedList[1].isProcessed = false;
        break;

        case 2:
          updatedList[1].isActive = true;
          updatedList[2].isActive = false;
          updatedList[2].isProcessed = false;
        break;

        case 3:
          updatedList[2].isActive = true;
          updatedList[3].isActive = false;
          updatedList[3].isProcessed = false;
        break;
      }
      return Object.assign({}, state, {
        title: action.stepData.title
      });

    default:
      return state;
  }
}


const oroboApp = combineReducers({
  sendMoneySteps,
  payBillSteps
})

export default oroboApp;