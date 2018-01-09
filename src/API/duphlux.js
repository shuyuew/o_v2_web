import CONFIG from '../data/config.js';

const Duphlux = window.DuphluxPop;

export default (phoneNumber, redirectUrl, cb) => {
  Duphlux.init({
    token: CONFIG.DUPHLUX_TOKEN, // This is found under your app in your dashboard.
    timeout: 900, // timeout in seconds
    // phone_number: '+387603363220',
    redirect_url: 'https://www.google.ba',
    phone_number: phoneNumber,
    // redirect_url: redirectUrl,
    transaction_reference: '' + Math.floor((Math.random() * 1000000000) + 1), // A unique transaction reference to identity this authentication request
    callback: cb
  });

  // Now launch the Duphlux authentication process
  Duphlux.launch();
}