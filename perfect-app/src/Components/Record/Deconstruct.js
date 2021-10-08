

export const decEstimateItems = (input)=>{
    var ret = [];
    for(const itemK in input.programItems ){
        ret.push(input.programItems[itemK]);
    }
    console.log("items deconstruct", ret)
    return ret;
};

export const decCustomer = (estimate)=>{
    return estimate.customerObject;
}

