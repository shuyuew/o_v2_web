import Base64 from 'base-64';
import { aesDecrypt, aesEncrypt } from './aes';


export const keyDecode = (string) => {
  const strDecoded = Base64.decode(string);
  const strBytes = strToBytes(strDecoded);
  return strBytes;
}


const strToBytes = (string) => {
  let bytes = [];
  for (var i = 0; i < string.length; i++) {
    bytes.push(string.charCodeAt(i))  
  }
  return bytes;
}