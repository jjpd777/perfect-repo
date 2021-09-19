import { auth, db, googleProvider } from "../firebase";
import { currentFullDate } from "../Utils/DateTimeUtils";

const ROOT = "perfect-dev";
const ITEMS_PATH = ROOT + "/perect-items";


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
    }
}

export const readItemsFunction = () => {
    return db.ref(ITEMS_PATH);
};

export const createItemFunction = (data) => {
    var ref = db.ref(ITEMS_PATH).push();
    var insertionData = data; insertionData.id = ref.key;
    return ref.set(insertionData);
};

