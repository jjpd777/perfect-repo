import { auth, db, googleProvider } from "../firebase";
import { currentFullDate } from "../Utils/DateTimeUtils";

const ROOT = "perfect-dev";
const ITEMS_PATH = ROOT + "/perect-items";
const PROGRAMS_PATH = ROOT + "/perect-programs";
const CUSTOMER_PATH = ROOT + "/perfect-customers";


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

export const createItemFunction = (data) => {
    var ref = db.ref(ITEMS_PATH).push();
    var insertionData = data; insertionData.id = ref.key;
    return ref.set(insertionData);
};

export const createProgramFunction = (data) => {
    var ref = db.ref(PROGRAMS_PATH).push();
    var insertionData = data; insertionData.id = ref.key;
    return ref.set(insertionData);
};

export const updateItemFunction = (data,id)=>{
    const target = ITEMS_PATH + id;
    return db.ref(target).update(data);
};

export const createCustomerFunction = (data)=>{
    return generateEntry(data, CUSTOMER_PATH);
}

