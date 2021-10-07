import { auth, db, googleProvider } from "../firebase";
import { currentFullDate } from "../Utils/DateTimeUtils";

const ROOT = "perfect-prod";
const ITEMS_PATH = ROOT + "/perect-items";
const PROGRAMS_PATH = ROOT + "/perect-programs";
const CUSTOMER_PATH = ROOT + "/perfect-customers";
const ESTIMATE_PATH = ROOT + "/perfect-estimates";


const itemModel = (x) => {
    return {
        timestamp: currentFullDate(),
        itemDelted: false,
        createdBy: x.createdBy,
        itemType: x.itemType,
        itemCategory: x.itemCategory,
        itemName: x.itemName,
        itemPriceUnit: x.itemPriceUnit,
        itemNumSess: x.itemNumSess,
    };
};
const generateEntry =(data,path)=>{
    var ref = db.ref(path).push();
    var insertionData = data; insertionData.id = ref.key;
    return ref.set(insertionData);
}
export const readItemsFunction = () => {
    return db.ref(ITEMS_PATH);
};
export const readCustomersFunction = () => {
    return db.ref(CUSTOMER_PATH);
};
export const readCustomerEstimatesFunction = (uniqueID) => {
    console.log("THE PATH",ESTIMATE_PATH+"/"+uniqueID )
    return db.ref(ESTIMATE_PATH+"/"+uniqueID);
};

export const createItemFunction = (data) => {
    return generateEntry(data, ITEMS_PATH);
};

export const createProgramFunction = (data) => {
    return generateEntry(data, PROGRAMS_PATH);
};

export const createEstimateFunction = (data, customerPhone) => {
    return generateEntry(data, ESTIMATE_PATH+"/"+customerPhone+"/");
};

export const createCustomerFunction = (data)=>{
    return generateEntry(data, CUSTOMER_PATH);
};
export const updateItemFunction = (data,id)=>{
    const target = ITEMS_PATH + "/"+id;
    return db.ref(target).update(data);
};


/// Delete

export const deleteItemFunction = (data,id)=>{
    const target = ITEMS_PATH + "/"+id;
    console.log(target,"target")
    return db.ref(target).remove();
};


