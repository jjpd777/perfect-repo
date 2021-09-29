const wordParser =(w,c)=> w.split(c).join("");
const specialCharacters =[ "." , "$" , "#" , "[" , "]" , "/"]
export const parseForFirebase =(x)=>{
    if(!x) return;
    var t=wordParser(x, specialCharacters[0]);
    for(var i=1;i <specialCharacters.length; i++){
        t=wordParser(t, specialCharacters[i])
    };
    return t.toLowerCase();
};
