import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import ProgramItems from "./ProgramItems";
import CustomerSearch from "../CustomerSearch/CustomerSearch";
import PrintProgram from "./PrintProgram/PrintProgram";
import ItemSelection from "../ItemSelection/ItemSelection";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../Design.scss";

import { auth, logout} from "../../UtilsFirebase/Authentication";
import {parseForFirebase} from "../../Utils/FirebaseParser";
import { currentFullDate, formatUnixDate, currentUnixDate } from "../../Utils/DateTimeUtils";
import { createEstimateFunction, createCustomerFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter
} from "shards-react";
import { program } from "@babel/types";
import { set } from "date-fns";


function Program({ listItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("laser");
    const [rCategories, setReadCateg] = useState([]);
    const [editItems, setEditItems] = useState([]);
    const [programItems, setProgramItems] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState({});
    const [invoiceEstimate, setInvoiceEstimate] = useState("program estimate");
    const [user, loading, error]=useAuthState(auth);
    const [modalB, setModalB] = useState(false);
    
    const inverseMoney = (x)=>{
        const valFix = x.split("$").join("").split(",").join("");
        return moneyFormatter.format(valFix).includes("NaN") ? "0" : valFix;
    };

    const initialState = {
        downPayment: "50",
        discount: 0,
        terms:6,
        disc:{
            type: "percent",
            discPercent: 0,
            discAmount:0,
        }
    };

    const [programVariables, setProgramVariables] = useState(initialState);

    console.log("PROGRAM V", programVariables)


    useEffect(() => {
        var tmp = [];
        var tmpEditItems = [];
       
        listItems.map(x => {
            if (!(tmp.includes(x.itemCategory)) && (itemType === x.itemType)) {
                tmp.push(x.itemCategory);
            }
            if (x.itemCategory === itemCategory && x.itemType === itemType) {
                tmpEditItems.push(x);
            }
        })
        setReadCateg(tmp); setEditItems(tmpEditItems);

    }, [listItems,itemType, itemCategory]);

    useEffect(()=>{
        if(!listItems.length) return;
        setItemCategory(listItems.find(x=> x.itemType===itemType).itemCategory);
    },[itemType]);

    const programObjectBuilder = () => {
        var rsp = {};
        programItems.map((item, ix) => {
            rsp["item-" + String(ix + 1)] = item;
        });
        return rsp;
    }

    const insertProgramEstimate = () => {
        const customerFirebase = {
            customerName: currentCustomer.customerName,
            customerEmail: parseForFirebase(currentCustomer.customerEmail),
            customerPhone: parseForFirebase(currentCustomer.customerPhone),
        };

        const item = {
            timestamp: currentFullDate(),
            unix: currentUnixDate(),
            itemDelted: false,
            createdBy: user.email,
            programItems: programObjectBuilder(),
            programTotal: paymentBreakdown.total,
            customerObject: customerFirebase,
            paymentsCycles: paymentCycles,
            paymentBreakdown: paymentBreakdown,
            estimateType: invoiceEstimate,
            voided: false,
            programV: programVariables
        };
        try {
           
            createEstimateFunction(item, parseForFirebase(currentCustomer.customerPhone)).then(()=>{setProgramItems([]);})
            if(isNewCustomer)createCustomerFunction(customerFirebase).then(()=>{});
            setCurrentCustomer({});
        } catch (e) {
            console.log(e)
        }
    };

    const complexDiscountTable = {
        "laser":{
            "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96],[5,0.97],[6,0.96],[7,0.97],[8,0.96],[9,0.97],[10,0.96]],
        },
        "facial":{
            "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96]],
        },
        "product" : {
            "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
        },
        "special" :{
            "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
        },
    };

    const discountPerCategory = [1,0.99,0.98,0.97,0.96];


    const updateDiscountCorrect = (val, percent)=>{
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
    }

    const chooseCategoriesDiscount =()=>{ 
        const nCat = new Set(programItems.map(x=> x.itemCategory));
        return discountPerCategory[nCat.size];
    };
    const countCategoriesDiscount = ()=>{
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

    const chooseComplexDiscount =(s)=>{
        const countedCategories = countCategoriesDiscount();
        const units = countedCategories[s];
        return complexDiscountTable[s].range.find(x=> x[0]===units);

    }
    console.log(paymentBreakdown, "pBreakdown")

    const computeBalanceTotal = (x)=>{
        const discAdjust = x.itemType === 'product' ? "product" : x.itemCategory;
        const complexDiscount = chooseComplexDiscount(discAdjust)[1];

        const financialterms = x.financeTerms ==="0" ? 1 : Number(programVariables.terms);
        const discount = (programVariables.terms ==="0" || programVariables.disc.discountType==="amount" )? 1 : 1-(Number(programVariables.discount)/100);

        const tot = Number(x.itemPriceUnit) * Number(x.itemNumSess) * discount * complexDiscount;

        const dPayment = programVariables.downPayment ==="0" ? 1 : Number(programVariables.downPayment)/100;
        const remBal = tot *(1-dPayment);
        console.log(remBal, "remaining", financialterms)
        const monthly = remBal/ Number(financialterms);
        console.log("Verify element:", [ monthly, tot] )
        return [monthly, tot];
    };
   
    useEffect(() => {
        var remainingBalGlobal =0;
        var totalSale = 0;
        var cycleInfo = {};
        cycleInfo[programVariables.terms] = {
            monthly: 0,
        };
        console.log("8444", cycleInfo)

        programItems.map((item) => {
            const [monthlyRemaining, localTotal] = computeBalanceTotal(item);
            remainingBalGlobal+=monthlyRemaining;
            totalSale += localTotal;
            cycleInfo[programVariables.terms] = {
                monthly: cycleInfo[programVariables.terms].monthly + monthlyRemaining,
            }
        });
        console.log("PROGRAM FUCKING VARIABLES", programVariables)
        const totSalAmounAdjust = programVariables.disc.discountType==='amount' ? Number(programVariables.disc.discountAmount) : 0;
        const totSummary = totalSale - totSalAmounAdjust;
        console.log(totSalAmounAdjust, "adjustment")

        const dPayment = programVariables.downPayment ==="0" ? 1 : Number(programVariables.downPayment)/100;
        const finalDownPaymet = totSummary* dPayment*chooseCategoriesDiscount();
        const finalReamining = (remainingBalGlobal-totSalAmounAdjust)*chooseCategoriesDiscount();
        const finalSaleTotal = totSummary* chooseCategoriesDiscount();
        setPaymentBreakdown({
            downPayment: finalDownPaymet, 
            remainingBalance: finalReamining,
            total: finalSaleTotal});
        const cycleKeys = Object.keys(cycleInfo);
        var cyclesCollection =[];
        var li = cycleKeys.length;

        cycleKeys.map((k,kIndex)=>{
            var tt={
                numberTerms:k,
                monthly:0,
                firstPayment: currentUnixDate()+ 2592000,
                lastPayment: currentUnixDate()+ (2592000 *(Number(cycleKeys[kIndex])))
            };
            for(let i=kIndex; i<li;i++){
                tt.monthly+= cycleInfo[cycleKeys[i]].monthly;
            };
            console.log(formatUnixDate(tt.firstPayment), "cycle");
            console.log(formatUnixDate(tt.lastPayment), "cycle");

            cyclesCollection.push(tt);
        })
        setPaymentCycles(cyclesCollection);
    }, [programItems, programVariables]);




    return (
        <div className="action-content">
                
              <>
              <CustomerSearch fnSetCustomer={setCurrentCustomer} record={false} />
              <ItemSelection listItems={listItems} staff={false} fnItems={setProgramItems}/>
              </>
              <div className="program-header">
                    <h2>Program Estimate for {currentCustomer.customerName}</h2>
                </div>
              <div className="program-variables-box">
                    <h3>Down payment %</h3>
                    <FormInput className="program-variables-input" value={programVariables.downPayment}
                        onChange={(e) => { setProgramVariables({...programVariables, downPayment:e.target.value})}} />
                    
                    <h3>Disc. %</h3>
                    <FormInput className="program-variables-input" 
                               value={programVariables.disc.discountPercent}
                               type="number"
                               onChange={(e) => { setProgramVariables({...programVariables, disc: updateDiscountCorrect(e.target.value, true)}) }} />
                    
                    <h3>Disc. $</h3>
                    <FormInput className="program-variables-input" 
                               value={programVariables.disc.discountAmount}
                               type="number"
                               onChange={(e) => { setProgramVariables({...programVariables, disc: updateDiscountCorrect(e.target.value, false)}) }} />


                    <h3>Terms</h3>
                    <FormInput className="program-variables-input" value={programVariables.terms}
                        type="number"
                        onChange={(e) => { setProgramVariables({...programVariables, terms:e.target.value}) }} />
                </div>
           { !saveBool && 
           <>
           
        </>
        }
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            
            <div className="estimates-box">
                {!saveBool ?(<ProgramItems props={programItems} fn={setProgramItems} />):(<></>)}
            </div>
            { saveBool &&
            <>
            {/* <div className="summary-box">
                <Card className="summary-card">
                    <CardBody>
                        <CardHeader className="summary-header">{currentCustomer.customerName}</CardHeader>
                        <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(paymentBreakdown.downPayment)}  <b>Total payment:</b> {moneyFormatter.format(paymentBreakdown.total)}</CardTitle>
                        <CardSubtitle className="summary-items-list">
                            {programItems.map(item=><h5>{item.itemName} with {item.financeTerms} financing {item.financeTerms===1 ? "term":"terms"} </h5>)}
                        </CardSubtitle>
                    </CardBody>
                </Card>
            </div> */}
            {/* <div className="cycles-box">
                {paymentCycles.map((x,i)=>
                <>
                <Card className="cycles-card">
                    <CardBody>
                        <CardHeader className="cycles-header">Cycle #{i+1}</CardHeader>
                        <CardTitle className="cycles-title">Monthly: {moneyFormatter.format(x.monthly)}</CardTitle>
                        <CardSubtitle className="cycles-subtitle">
                        <h3>First payment: {formatUnixDate(x.firstPayment)}</h3>
                        <h3>Last payment: {formatUnixDate(x.lastPayment)} </h3>
                        </CardSubtitle>
                    </CardBody>
                </Card>
                </>)}
            </div> */}
            <br></br>
            <br></br>
            <div className="program-print-box">
                <PrintProgram example={["one", "two"]}
                    checkoutItems = {programItems}
                    paybreakdown = {paymentBreakdown}
                    paycycle = {paymentCycles}
                    customer= {currentCustomer}
                />
            </div>
            <div className="input-radio-box">
             <FormRadio
                    inline
                    className="radio-choices"
                    checked={invoiceEstimate === "program estimate"}
                    onChange={() => {
                        setInvoiceEstimate("program estimate");
                    }}
                >
                    <h3>program estimate</h3>
                </FormRadio>
                <FormRadio
                    inline
                    className="radio-choices"
                    checked={invoiceEstimate === "program invoice"}
                    onChange={() => {
                        setInvoiceEstimate("program invoice");
                    }}
                >
                    <h3>program invoice</h3>
                </FormRadio>
            </div>
            <div className="save-program-box">
                <Button className="cat-btn" onClick={() => { insertProgramEstimate() }}>Save & Print</Button>             
            </div>
       
           </>}
        </div>
    );
};

export default Program;