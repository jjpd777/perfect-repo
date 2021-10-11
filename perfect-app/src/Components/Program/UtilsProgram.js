export const complexDiscountTable = {
    "LHR":{
        "range" :[[1,1],[2,1],[3,0.95],[4,0.95],[5,0.95],[6,0.90],[7,0.9],[8,0.9],[9,0.85],[10,0.85],[11,0.85],[12,0.85],[13,0.8],[14,0.8]],
    },
    "Aesthetic Medicine":{
        "range" :[[1,1.00],[2,0.95],[3,0.94],[4,0.93], [5,0.92],[6,0.9],[7,0.9],[8,0.9],[9,0.9],[10,0.9]],
    },
    "product" : {
        "range" : [[1,0.95],[2,0.95],[3,0.90],[4,0.9],[5,0.9],[6,0.85],[7,0.85],[8,0.85],[9,0.85],[10,0.85],[11,0.85],[12,0.85],[13,0.85],[14,0.85],[15,0.85],[16,0.85]],
    },
    "special" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "Body" :{
        "range" : [[1,1],[2,0.95],[3,0.95],[4,0.95],[5,0.95],[6,0.90],[7,0.90],[8,0.90],[9,0.85],[10,0.85],[11,0.85],[12,0.8],[13,0.8],[14,0.8],[15,0.8],[16,0.8],[17,0.8],[18,0.75],[19,0.75],[20,0.75]],
    },
    "Facial Treatments" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "PiQo4 Laser" :{
        "range" : [[1,1],[2,1],[3,0.9],[4,0.875],[5,0.875],[6,0.85],[7,0.85],[8,0.85],[9,0.8],[10,0.8],[11,0.85],[12,0.8],[13,0.8]],
    },
    "StellarM22 Laser" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "IV Therapy" :{
        "range" : [[1,1],[2,1],[3,0.90],[4,0.9],[5,0.9],[6,0.85],[7,0.85],[8,0.85],[9,0.8],[10,0.8],[11,0.8],[12,0.8]],
    },
    "Teeth Whitening" :{
        "range" : [[1,1],[2,1],[3,0.90],[4,0.9],[5,0.9],[6,0.85],[7,0.85],[8,0.85],[9,0.8],[10,0.8],[11,0.8],[12,0.8]],
    },
    "Lab Tests" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
};

export const updateDiscountCorrect = (val, percent)=>{
    const perc = {
        discountType: 'percent',
        discountPercent: val,
        discountAmount: 0,
     };

    const dollar = {
        discountType: 'amount',
        discountPercent: 0,
        discountAmount: val,
    };
    return percent ? perc : dollar
};


export const chooseCategoriesDiscount =(programItems)=>{ 
    const discountPerCategory = [1,0.99,0.98,0.95,1,1,1,1,1,1];
    const nCat = new Set(programItems.map(x=> x.itemCategory));
    return discountPerCategory[nCat.size];
};

const countCategoriesDiscount = (programItems)=>{
    var d ={}; 
    programItems.map(x=> {
        if(x.itemType ==="product"){
            d[x.itemType] =1;
    }else{
       d[x.itemCategory] ? d[x.itemCategory]+=1 : d[x.itemCategory]=1;
    }
})
    return d;
};


export const chooseComplexDiscount =(s, programItems)=>{
    const countedCategories = countCategoriesDiscount(programItems);
    const units = countedCategories[s];
    return complexDiscountTable[s].range.find(x=> x[0]===units)[1];
};

export const computeItemsSubTotal = (programItems)=>{
    var subTotal = 0;
    programItems.map(x=>{
        const discAdjust = x.itemType === 'product' ? "product" : x.itemCategory;
        const complexDiscount = chooseComplexDiscount(discAdjust, programItems);
        subTotal += Number(x.itemPriceUnit) * Number(x.itemNumSess) * complexDiscount;
    })
    return subTotal;
};

export const computeTotal = (partialSubTotal, discountObject)=>{
    console.log(partialSubTotal,"YEE")
    if(discountObject.type==="percent"){
        return partialSubTotal * (1-(Number(discountObject.discountPercent)/100));
    }else{
        return partialSubTotal - Number(discountObject.discountAmount);
    }
}

