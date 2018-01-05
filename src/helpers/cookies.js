import Cookies from 'universal-cookie';

const cookies = new Cookies();
const cookiePrefix = 'Orobo-';
const OroboCookies = {
  
  getAll(options) {
    return cookies.getAll(options);
  },
  
  getCookie(name, options) {
    return cookies.get(cookiePrefix + name, options);
  },
  
  setCookie(name, value, options) {
    const stringifyVal = JSON.stringify(value);
    cookies.set(cookiePrefix + name, stringifyVal, options);
  },
  
  removeCookie(name, options) {
    cookies.remove(cookiePrefix + name, options);
  }
  
}


export default OroboCookies;