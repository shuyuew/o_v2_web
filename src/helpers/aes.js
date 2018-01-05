import Base64 from 'base-64';
import aesjs from 'aes-js';


export const aesDecrypt = (rawBase64, ivBytes, keyBytes) => {
  const rawBaseDecoded = Base64.decode(rawBase64);
  const rawBaseBytes = strToBytes(rawBaseDecoded);
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  const decryptedBytes = aesCbc.decrypt(rawBaseBytes);
  const decryptedText = bytesToString(decryptedBytes, true);

  return JSON.parse(decryptedText);
}


export const aesEncrypt = (json, ivBytes, keyBytes) => {
  const dataString = JSON.stringify(json);
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  const dataBytes = strToBytes(dataString, true);
  const encryptedBytes = aesCbc.encrypt(dataBytes);
  const encryptedString = bytesToString(encryptedBytes);
  const encodedBase64 = Base64.encode(encryptedString);
    
  return encodedBase64;
}


export const aesEncryptString = (string, ivBytes, keyBytes) => {
  const dataString = string += '';
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  const dataBytes = strToBytes(dataString, true);
  const encryptedBytes = aesCbc.encrypt(dataBytes);
  const encryptedString = bytesToString(encryptedBytes);
  const encodedBase64 = Base64.encode(encryptedString);
    
  return encodedBase64;
}



const calculatePadding = (bytesArray) => 16 - (bytesArray.length % 16);

const bytesToString = (bytes, includeCondition) => {
  let string = '';  
  for (var i = 0; i < bytes.length; i++) {
    if (includeCondition) {
      if (bytes[i] >= 32 || bytes[i] == 10 || bytes[i] == 13) {
        string += String.fromCharCode(bytes[i]);  
      }
    } else {
      string += String.fromCharCode(bytes[i]);  
    }
  }
  return string;
}

const strToBytes = (string, includeCondition) => {
  let bytes = [];
  for (var i = 0; i < string.length; i++) {
    bytes.push(string.charCodeAt(i));
  }
  
  if (includeCondition) {
    let paddingAmount = calculatePadding(bytes);
    paddingAmount = paddingAmount === 0 ? 16 : paddingAmount;
    for (var x = 0; x < paddingAmount; x++) {
      bytes.push(paddingAmount);
    }
  }

  return bytes;
}