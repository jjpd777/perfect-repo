const DateUtil = () => {
    const unixTime = ()=>{
      return Math.round((new Date()).getTime() / 1000);
    };
    const newMHDMY = () => {
      var today = new Date();
      var min = String(today.getMinutes()).padStart(2, '0');
      var hr = String(today.getHours()).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      return hr + ":" + min + "&" + dd + '-' + mm + '-' + yyyy;
    };
  
    return { newMHDMY, unixTime }
  }


export const currentFullDate = ()=>{
    const {newMHDMY} = DateUtil();
    return newMHDMY();

}