import {parseForFirebase} from "../../Utils/FirebaseParser";

const simplifySubTotal = (x)=>{
    const disc = x.discObject;
    if(disc.discountType ==="percent"){
        const ds = disc.discountPercent ===0 ? 1 : 1-(Number(disc.discountPercent)/100);
        const tot = Number(x.itemPriceUnit) * Number(x.itemNumSess) * ds;
        return tot;
    }else{
        const tot = (Number(x.itemPriceUnit)-Number(disc.discountAmount))* Number(x.itemNumSess);
        return tot;
    }
}

export const computeBalanceTotal = (x)=>{
    const ft = x.financeTerms ===0 ? 1 : Number(x.financeTerms);
    const tot = simplifySubTotal(x);
    const conversionFactor = x.financeTerms=== 0 ? 1 :(x.financeTerms===1? 0.5 : (x.financeTerms===2? 0.33 : 0.3));
    const downP = tot * conversionFactor; const remBal = tot *(1-conversionFactor);
    const monthly = remBal/ Number(ft);
    return [downP, monthly, tot];
};
