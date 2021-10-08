

export const decEstimateItems = (programItems)=>{
    var ret = [];
    for(const itemK in programItems ){
        ret.push(programItems[itemK]);
    }
    return ret;
}

