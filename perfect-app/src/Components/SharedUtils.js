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