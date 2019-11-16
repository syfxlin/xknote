const xkEncryption = {
  encrypt: (data, key) => {
    return window.CryptoJS.AES.encrypt(
      data,
      window.CryptoJS.enc.Utf8.parse(
        window.CryptoJS.SHA1('123456')
          .toString()
          .substring(0, 32)
      ),
      {
        mode: window.CryptoJS.mode.ECB
      }
    ).toString();
  },
  decrypt: (data, key) => {
    return window.CryptoJS.AES.decrypt(
      data,
      window.CryptoJS.enc.Utf8.parse(
        window.CryptoJS.SHA1(key)
          .toString()
          .substring(0, 32)
      ),
      {
        mode: window.CryptoJS.mode.ECB
      }
    ).toString(window.CryptoJS.enc.Utf8);
  }
};

export default xkEncryption;
