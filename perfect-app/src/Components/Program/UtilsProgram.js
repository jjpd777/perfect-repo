export const complexDiscountTable = {
    "LHR":{
        "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96],[5,0.97],[6,0.96],[7,0.97],[8,0.96],[9,0.97],[10,0.96]],
    },
    "Aesthetic Medicine":{
        "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96]],
    },
    "product" : {
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "special" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "Body" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "Facial Treatments" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "PiQo4 Laser" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "StellarM22 Laser" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "IV Therapy" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
    },
    "Teeth Whitening" :{
        "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
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
    const discountPerCategory = [1,0.99,0.98,0.97,0.96];
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

