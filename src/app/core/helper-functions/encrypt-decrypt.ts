import * as CryptoJS from 'crypto-js';


// put security key environment
const SECURITY_KEY = 'dcfilyebfucveqaycd6d788e36e65ev3'; // Keep this in environment files!

export function encrypt(data: any): string {
  const strData = JSON.stringify(data);
  // AES Encryption is much stronger than btoa
  return CryptoJS.AES.encrypt(strData, SECURITY_KEY).toString();
}

export function decrypt<Type>(cipherText: string): Type | null {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECURITY_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Security breach or corrupted data. Clearing cache.');
    localStorage.clear();
    window.location.reload();
    return null;
  }
}


export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}