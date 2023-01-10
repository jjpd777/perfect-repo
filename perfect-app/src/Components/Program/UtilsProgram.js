const lhr = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        if(i<3){x.push([i,1])}
        else if(i<6)  {x.push([i,0.95])}
        else if(i<9)  {x.push([i,0.90])}
        else if(i<13)  {x.push([i,0.85])}
        else {
            x.push([i,0.8])
        };
    };
    return x;
};

const aestheticMedicine = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        if(i<2){x.push([i,1])}
        else if(i<3)  {x.push([i,0.95])}
        else if(i<4)  {x.push([i,0.94])}
        else if(i<5)  {x.push([i,0.93])}
        else if(i<6) {x.push([i,0.93])}
        else {
            x.push([i,0.9])
        };
    };
    return x;

};

const productFn = ()=>{
    var x =[[0,0]];
    for (var i=1;i<1000; i++){
        if(i<3){x.push([i,1])}
        else if(i<6){x.push([i,1])}
        else {
            x.push([i,1])
        };
    };
    return x;

};

const body = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        if(i<2){x.push([i,1])}
        else if(i<6)  {x.push([i,0.95])}
        else if(i<9)  {x.push([i,0.90])}
        else if(i<12)  {x.push([i,0.85])}
        else if(i<18) {x.push([i,0.8])}
        else {
            x.push([i,0.75])
        };
    };
    return x;

};

const piQo4 = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        if(i<3){x.push([i,1])}
        else if(i<4)  {x.push([i,0.90])}
        else if(i<6)  {x.push([i,0.875])}
        else if(i<9)  {x.push([i,0.85])}
        else if(i<12) {x.push([i,0.8])}
        else {
            x.push([i,0.75])
        };
    };
    return x;

};

const ivTeeth = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        if(i<3){x.push([i,1])}
        else if(i<6)  {x.push([i,0.90])}
        else if(i<9)  {x.push([i,0.85])}
        else {
            x.push([i,0.8])
        };
    };
    return x;
};

const special = ()=>{
    var x =[];
    for (var i=1;i<1000; i++){
        x.push([i,0.98])
    };
    return x;

}



export const complexDiscountTable = {
    "LHR":{
        "range" :lhr(),
    },
    "Aesthetic Medicine":{
        "range" :aestheticMedicine(),
    },
    "product" : {
        "range" : productFn(),
    },
    "special" :{
        "range" : special(),
    },
    "Body" :{
        "range" : body(),
    },
    "Facial Treatments" :{
        "range" : piQo4(),
    },
    "PiQo4 Laser" :{
        "range" : piQo4(),
    },
    "StellarM22 Laser" :{
        "range" : piQo4(),
    },
    "IV Therapy" :{
        "range" : ivTeeth(),
    },
    "Teeth Whitening" :{
        "range" : ivTeeth(),
    },
    "Lab Tests" :{
        "range" : piQo4(),
    },
    "Morpheus8" : {
        "range" : piQo4()
    },
    "Treatment Programs" : {
        "range" : piQo4()
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
    const discountPerCategory = [1,0.99,0.98,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,];
    const nCat = new Set(programItems.map(x=> x.itemCategory));
    return discountPerCategory[nCat.size];
};

const countCategoriesDiscount = (programItems)=>{
    var d ={}; 
    programItems.map(x=> {
        const u = Number(x.itemNumSess);
        const c = x.itemType ==="product";
        if(c){
            d["product"] ? d["product"]+= u : d["product"]=u;

        }else{
        d[x.itemCategory] ? d[x.itemCategory]+= u : d[x.itemCategory]=u};
    });
    console.log(d, "WHATEVER HERE")
    return d;
};


export const chooseComplexDiscount =(s, programItems)=>{
    const countedCategories = countCategoriesDiscount(programItems);
    console.log(s,"Program Items", programItems)

    console.log("Key String",s, s.length, typeof(s));
    console.log("Hard coded", countedCategories["product"]);
    console.log("Counted categories", countedCategories);

    const quickFix = s==="product" ? "product" : s;
    const units = Number(countedCategories[quickFix]);
    const which_discount = complexDiscountTable[s] ? complexDiscountTable[s].range.find(x=> x[0]===units)[1] :  complexDiscountTable["Aesthetic Medicine"].range.find(x=> x[0]===units)[1];
    return which_discount;
};

export const computeItemsSubTotal = (programItems)=>{
    var subTotal = 0;
    programItems.map(x=>{
        const discAdjust = (x.itemType === 'product' || x.itemType === "Jan Marini") ? 'product' : x.itemCategory;
        const complexDiscount = chooseComplexDiscount(discAdjust, programItems);
        subTotal += Number(x.itemPriceUnit) * Number(x.itemNumSess) * complexDiscount;

    })
    return subTotal;
};

export const computeTotal = (partialSubTotal, discountObject)=>{
    console.log(partialSubTotal,discountObject,"OHYEA")
    if(discountObject.discountType==="percent"){
        return partialSubTotal * (1-(Number(discountObject.discountPercent)/100));
    }else{
        return partialSubTotal - Number(discountObject.discountAmount);
    }
}

