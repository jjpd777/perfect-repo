
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


export const currentFullDate = ()=>{
    return newMHDMY();
};

export const currentUnixDate = ()=>{
  return unixTime();
};

export const formatUnixDate = (x)=>{
      const today = new Date(x*1000);
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      return mm + '-' + dd + '-' + yyyy;
};

export const perfectbUniqueID = ()=>{
  return unixTime() - 1561996801;
}

//1561996801 perfect b starting unix