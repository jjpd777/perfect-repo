const DateUtil = () => {
    const unixTime = ()=>{
      return Math.floor(Date.now() / 1000)
    };
    const newMHDMY = () => {
      var today = new Date();
      var min = String(today.getMinutes()).padStart(2, '0');
      var hr = String(today.getHours()).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      return hr + ":" + min + "&" + mm+ '-' + dd + '-' + yyyy;
    };
    return { newMHDMY, unixTime }
  }


export const currentFullDate = ()=>{
    const {newMHDMY} = DateUtil();
    return newMHDMY();
};

export const currentUnixDate = ()=>{
  const {unixTime} = DateUtil();
  return unixTime();
};

export const formatUnixDate = (x)=>{
      const today = new Date(x*1000);
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      return mm + '-' + dd + '-' + yyyy;
}