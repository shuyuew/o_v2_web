import axios from 'axios';
import _ from 'underscore';
import CONFIG from '../data/config.js';
import OroboCookies from '../helpers/cookies';
import { keyDecode } from '../helpers/decode';
import { aesDecrypt, aesEncrypt, aesEncryptString } from '../helpers/aes';
import UserAuth from './auth';

let userData;
const tokenRemoveURLs = [
  'list_banks.json'
];

axios.interceptors.request.use(function (config) {
  
  // Append token to all API requests if user logged in
  if (UserAuth.isAuthenticated) {
    userData = UserAuth.getUserData();
  }
  
  if (userData && config.url.indexOf(tokenRemoveURLs[0]) === -1) {
    config.headers.token = userData.api_access_token.token;
  }
  
  // Encode all data via AES sent to server
  if (config.data && userData && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
    
    if (UserAuth.isAuthenticated) {
      userData = UserAuth.getUserData();
      config.data = aesEncrypt(config.data, userData.api_access_token.decoded.iv, userData.api_access_token.decoded.key);
    }
    
  }
  
  // Encode query params on GET methods
  if (config.headers.token && config.params) {
    let paramValue, keyValue, queryString = '', modifiedString;
    _.each(config.params, function (value, prop) { 
      paramValue = aesEncryptString(value, userData.api_access_token.decoded.iv, userData.api_access_token.decoded.key);
      keyValue = aesEncryptString(prop, userData.api_access_token.decoded.iv, userData.api_access_token.decoded.key);
      queryString += encodeURIComponent(keyValue) + '=' + encodeURIComponent(paramValue) + '&';
    });

    modifiedString = queryString.slice(0, -1);
    config.url = config.url + '?' + modifiedString;

    delete config.params;
  }
  
  return config;
}, function (error) {
  return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
  
  // User Unauthorized | token expired
  if (response.data && response.data.PayLoad && response.data.PayLoad.error && response.data.PayLoad.error[0] === 'Authorization failed. Please log in.' ) {
    UserAuth.unauthorize();
  }
  
  // Decrypt Data if needed
  if (response && response.data && !_.isObject(response.data)) {
    if (UserAuth.isAuthenticated) {
      userData = UserAuth.getUserData();
      response.data = aesDecrypt(response.data, userData.api_access_token.decoded.iv, userData.api_access_token.decoded.key);
    }
  }
  
  return response;
}, function (error) {
  return Promise.reject(error);
});



export default {
  
  getSendingCurrencies: function() {
    return axios.get(CONFIG.CURRENCIES_SENDING).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getReceivingCurrencies: function() {
    return axios.get(CONFIG.CURRENCIES_RECEIVING).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getSettlementChannels: function(currencyId) {
    return axios.get(CONFIG.SETTLEMENT_CHANNELS, { params: { currency_id: currencyId } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getBillsCategories: function(currencyId) {
    return axios.get(CONFIG.BILLER_CATEGORIES, { params: { currency_id: currencyId } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getBillsStates: function(currencyId) {
    return axios.get(CONFIG.CURRENCY_STATES, { params: { currency_id: currencyId } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getBillsBanks: function(currencyId) {
    return axios.get(CONFIG.CURRENCY_BANKS, { params: { currency_id: currencyId } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  registerUser: function(data) {
    return axios.post(CONFIG.REGISTER_USER, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  loginUser: function(data) {
    return axios.post(CONFIG.LOGIN_USER, data).then(function (response) {
      
      if (response.status === 200 && response.data.PayLoad.status) {
        
        // Decode IV and Public Key for future Use
        response.data.PayLoad.data.User.api_access_token.decoded = {
          key: keyDecode(response.data.PayLoad.data.User.api_access_token.public_key),
          iv: keyDecode(response.data.PayLoad.data.User.api_access_token.iv)
        }
        
        // TODO ADD EXPIRATION COOKIE
        OroboCookies.setCookie('User', response.data.PayLoad.data.User, {
          path: '/'
        });
        UserAuth.authorize();
        
      }
      
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getBeneficiries: function() {
    return axios.get(CONFIG.BENEFICIRIES).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  forgotPassword: function(data) {
    return axios.post(CONFIG.FORGOT_PASSWORD, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  changePassword: function(data) {
    return axios.post(CONFIG.CHANGE_PASSWORD, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  resetPassword: function(data) {
    return axios.post(CONFIG.RESET_PASSWORD, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getTransfers: function() {
    return axios.get(CONFIG.TRANSFERS).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  getBIllPayments: function() {
    return axios.get(CONFIG.BILL_PAYMENTS).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  saveStripeCard: function(data) {
    return axios.post(CONFIG.SAVE_STRIPE_CARD, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },
  
  calculateFee: function(data) {
    return axios.post(CONFIG.CALCULATE_FEE, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  addBeneficiary: function(data) {
    return axios.post(CONFIG.NEW_BENEFICIARY, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  recommendBiller: function(data) {
    return axios.post(CONFIG.SAVE_BILLER, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  getActiveBillers: function(currencyid, categoryid, stateid) {
    return axios.get(CONFIG.ACTIVE_BILLERS, { params: {
      currency_id: currencyid,
      bill_category_id: categoryid,
      state_id: stateid
    } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  getMyBillers: function() {
    return axios.get(CONFIG.MY_BILLERS).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  listBillerBills: function(billerId) {
    return axios.get(CONFIG.BILLER_BILLS, { params: { biller_id: billerId } }).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  payBill: function(data) {
    return axios.post(CONFIG.PAY_BILL, data).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  cancelPayment: function(billid) {
    return axios.post(CONFIG.CANCEL_BILL_PAYMENT, {id: billid, reason: ''}).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  },

  confirmPayment: function(billid) {
    return axios.post(CONFIG.CONFIRM_FULFILLMENT, {id: billid}).then(function (response) {
      return response;
    }).catch(function (error) {
      return error;
    });
  }
  
}
