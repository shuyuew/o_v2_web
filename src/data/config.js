const API_BASE_URL = 'https://staging.orobo.com/webservice/';
const BASE_URL = 'https://staging.orobo.com/';

export default {
  API_BASE_URL: API_BASE_URL,
  BASE_URL: BASE_URL,
  IMAGE_URL: BASE_URL + 'img/flags/',
  STRIPE_KEY: 'pk_test_QULFerT2MWbJyQqWZ0jNhsxn',
  DUPHLUX_TOKEN: '29b9fb59e6c697ac5c5aa45bcdd028ae7ce1521d',
  
  // GET
  CURRENCIES_SENDING: API_BASE_URL + 'currencies/list_currencies/sending.json',
  CURRENCIES_RECEIVING: API_BASE_URL + 'currencies/list_currencies/receiving.json',
  SETTLEMENT_CHANNELS: API_BASE_URL + 'currencies/settlement_channels.json',
  BILLER_CATEGORIES: API_BASE_URL + 'bills/list_categories.json',
  CURRENCY_STATES: API_BASE_URL + 'bills/list_states.json',
  CURRENCY_BANKS: API_BASE_URL + 'currencies/list_banks.json',
  BENEFICIRIES: API_BASE_URL + 'beneficiaries.json',
  TRANSFERS: API_BASE_URL + 'transfer_requests.json',
  BILL_PAYMENTS: API_BASE_URL + 'bills/list_bill_payments.json',
  ACTIVE_BILLERS: API_BASE_URL + 'bills/list_billers.json',
  MY_BILLERS: API_BASE_URL + 'bills/my_billers.json',
  BILLER_BILLS: API_BASE_URL + 'bills/list_bills_by_biller.json',
  
  // POST/PUT
  REGISTER_USER: API_BASE_URL + 'users/add.json',
  LOGIN_USER: API_BASE_URL + 'users/login.json',
  SAVE_BILLER: API_BASE_URL + 'bills/recommend_biller.json',
  FORGOT_PASSWORD: API_BASE_URL + 'users/forgot_password.json',
  CHANGE_PASSWORD: API_BASE_URL + 'users/change_password.json',
  RESET_PASSWORD: API_BASE_URL + 'users/reset_password.json',
  SAVE_STRIPE_CARD: API_BASE_URL + 'users/save_stripe_card_customer.json',
  CALCULATE_FEE: API_BASE_URL + 'currencies/calculate_fee.json',
  NEW_BENEFICIARY: API_BASE_URL + 'beneficiaries/create.json',
  PAY_BILL: API_BASE_URL + 'bills/pay.json',
  CANCEL_BILL_PAYMENT: API_BASE_URL +  'bills/cancel.json',
  CONFIRM_FULFILLMENT: API_BASE_URL + 'bills/confirm_fulfillment.json',
  CREATE_TRANSFER: API_BASE_URL + 'transfer_requests/create.json',

  // REGISTRATION FORM DATA
  formInfo: {
    email: {
      title: 'email',
      message: 'Provide a valid email address.'
    },
    phone: {
      title: 'phone',
      message: 'Enter your mobile number.'
    },
    password: {
      title: 'password',
      message: 'Enter your selected password.',
      info: '(7 characters upper and lower case + 1 special character)'
    },
    user: {
      title: 'you',
      message: 'Enter your personal details.'
    }
  },
  
  // REGEXES
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8}$/
}
