
export function compare(a,b){
    if(a.itemName < b.itemName){
        return -1;
    }
    if(a.itemName > b.itemName){
        return 1;
    }
    return 0;
}