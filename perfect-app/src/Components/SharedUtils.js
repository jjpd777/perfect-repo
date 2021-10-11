import {parseForFirebase} from "../Utils/FirebaseParser";

export const programObjectBuilder = (programItems) => {
    var rsp = {};
    programItems.map((item, ix) => {
        rsp["item-" + String(ix + 1)] = item;
    });
    return rsp;
};

export const structureCustomer = (currentCustomer)=>{
    return{
        customerName: currentCustomer.customerName,
        customerLast: currentCustomer.customerLast,
        customerEmail: parseForFirebase(currentCustomer.customerEmail),
        customerPhone: parseForFirebase(currentCustomer.customerPhone),
    };
};

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

