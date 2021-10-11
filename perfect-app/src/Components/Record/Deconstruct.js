

export const deconstructItems = (input)=>{
    var ret = [];
    for(const itemK in input.programItems ){
        ret.push(input.programItems[itemK]);
    }
    return ret;
};


export const deconstructProducts = (x)=>{
    var returnList = [];
    for(const k in x){
        returnList.push(x[k])
    }
    return returnList;
};

