import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import ProgramEstimateItems from "./ProgramEstimateItems";
import SearchCustomer from "../SearchCustomer/SearchCustomer";
import PrintMain from "./PrintComponent/PrintMain";
import {discountTable} from "../DiscountConditions";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { auth, logout} from "../../UtilsFirebase/Authentication";
import {parseForFirebase} from "../../Utils/FirebaseParser";
import { currentFullDate, formatUnixDate, currentUnixDate } from "../../Utils/DateTimeUtils";
import { createEstimateFunction, createCustomerFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader
} from "shards-react";
import { program } from "@babel/types";
import { set } from "date-fns";


function NewProgramEstimate({ listItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("laser");
    const [rCategories, setReadCateg] = useState([]);
    const [editItems, setEditItems] = useState([]);
    const [programItems, setProgramItems] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [customerObject, setCustomerObj] = useState({});
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState({});
    const [invoiceEstimate, setInvoiceEstimate] = useState("program estimate");
    const [user, loading, error]=useAuthState(auth);

    const initialState = {
        downPayment: "30",
        discount: 0,
        terms:6,
    };

    const [programVariables, setProgramVariables] = useState(initialState);


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
            customerName: customerObject.customerName,
            customerEmail: parseForFirebase(customerObject.customerEmail),
            customerPhone: parseForFirebase(customerObject.customerPhone),
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
           
            createEstimateFunction(item, parseForFirebase(customerObject.customerPhone)).then(()=>{setProgramItems([]);})
            if(isNewCustomer)createCustomerFunction(customerFirebase).then(()=>{});
            setCustomerObj({});
        } catch (e) {
            console.log(e)
        }
    };

    const complexDiscountTable = {
        "laser":{
            "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96]],
        },
        "facial":{
            "range" :[[1,0.99],[2,0.98],[3,0.97],[4,0.96]],
        },
        "product" : {
            "range" : [[1,0.98],[2,0.98],[3,0.98],[4,0.98],[5,0.98],[6,0.98],[7,0.98],[8,0.98],[9,0.98],[10,0.98]],
        }
    };

    const discountPerCategory = [1,0.99,0.98,0.97,0.96];

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


    const computeBalanceTotal = (x)=>{
        const discAdjust = x.itemType === 'product' ? "product" : x.itemCategory;
        const complexDiscount = chooseComplexDiscount(discAdjust)[1];

        const financialterms = x.financeTerms ===0 ? 1 : Number(programVariables.terms);
        const discount = programVariables.terms ==="0" ? 1 : 1-(Number(programVariables.discount)/100);

        const tot = Number(x.itemPriceUnit) * Number(x.itemNumSess) * discount * complexDiscount;

        const dPayment = programVariables.downPayment ==="0" ? 1 : Number(programVariables.downPayment)/100;
        const downP = tot * dPayment; const remBal = tot *(1-dPayment);
        const monthly = remBal/ Number(financialterms);
        return [downP, monthly, tot];
    };
   
    useEffect(() => {
        var downPayGlobal = 0; var remainingBalGlobal =0;
        var totalSale = 0;
        var cycleInfo = {};
        cycleInfo[programVariables.terms] = {
            monthly: 0,
        };
        console.log("8444", cycleInfo)

        programItems.map((item) => {
            const [downPayment, remainingBalance, localTotal] = computeBalanceTotal(item);
            downPayGlobal+=downPayment; remainingBalGlobal+=remainingBalance;
            totalSale += localTotal;
            cycleInfo[programVariables.terms] = {
                monthly: cycleInfo[programVariables.terms].monthly + remainingBalance,
            }
        });

        setPaymentBreakdown({
            downPayment: downPayGlobal*chooseCategoriesDiscount(), 
            remainingBalance:remainingBalGlobal*chooseCategoriesDiscount(),
            total: totalSale*chooseCategoriesDiscount()});
        const cycleKeys = Object.keys(cycleInfo);
        var cyclesCollection =[];
        var li = cycleKeys.length;

        cycleKeys.map((k,kIndex)=>{
            var tt={
                numberTerms:k,
                monthly:0,
                firstPayment: kIndex ===0 ? currentUnixDate()+ ( k==="0"? 0:2592000 ): currentUnixDate()+ 2592000*(Number(cycleKeys[kIndex-1])+1),
                lastPayment: currentUnixDate()+( k==="0"? 0:2592000 )*(Number(cycleKeys[kIndex]))
            };
            for(let i=kIndex; i<li;i++){
                tt.monthly+= cycleInfo[cycleKeys[i]].monthly;
            };
            cyclesCollection.push(tt);
        })
        setPaymentCycles(cyclesCollection);
    }, [programItems]);

    console.log(programVariables)

    return (
        <div className="action-content">
               <div>
                <SearchCustomer fn={setCustomerObj} fnNewCustomer={setIsNewCustomer} optionsFlag={true} />
            </div>
           { !saveBool && 
           <>
           <div className="dd-option">
                    <h2>Program Estimate</h2>
                </div>
           <div className="input-radio-box">
                <FormRadio
                    inline
                    className="radio-choices"
                    checked={itemType === "treatment"}
                    onChange={() => {
                        setItemType("treatment");
                    }}
                >
                    <h3>treatment</h3>
                </FormRadio>
                <FormRadio
                    inline
                    className="radio-choices"
                    checked={itemType === "product"}
                    onChange={() => {
                        setItemType("product");
                    }}
                >
                    <h3>product</h3>
                </FormRadio>
                <div className="dd-option">
                    <Dropdown open={toggle} toggle={() => setToggle(!toggle)}>
                        <DropdownToggle split className="dd-btn" >{itemCategory}  </DropdownToggle>
                        <DropdownMenu >
                            {rCategories.map(x =>
                                <DropdownItem
                                    onClick={() => { setItemCategory(x) }}
                                >{x}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="item-name-box">
                    {editItems.map(x => <Button className="cat-btn"
                        onClick={() => {
                            if (programItems.find(c => x.itemName === c.itemName)) {
                                setProgramItems(programItems.filter(c => c.itemName !== x.itemName));
                            } else {
                                setProgramItems([
                                    ...programItems,
                                    ...[{
                                        itemId: x.id, itemName: x.itemName,
                                        itemNumSess: x.itemNumSess, itemType: x.itemType,
                                        itemCategory: x.itemCategory, itemPriceUnit: x.itemPriceUnit,
                                        financeTerms: programVariables.terms, discount: programVariables.discount, currentToggle: false
                                    }]
                                ])
                            }
                        }}
                    >{x.itemName}</Button>)}
                    <br></br>
                    <br></br>
                </div>
                <div className="program-variables-box">
                    <h3>Down payment</h3>
                    <FormInput className="program-variables-input" value={programVariables.downPayment}
                        onChange={(e) => { setProgramVariables({...programVariables, downPayment:e.target.value}) }} />
                    <h3>Discount</h3>
                    <FormInput className="program-variables-input" 
                               value={programVariables.discount}
                               onChange={(e) => { setProgramVariables({...programVariables, discount:e.target.value}) }} />
                    <h3>Terms</h3>
                    <FormInput className="program-variables-input" value={programVariables.terms}
                        onChange={(e) => { setProgramVariables({...programVariables, terms:e.target.value}) }} />
                </div>
            </div>
        </>
        }
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            
            <div className="estimates-box">
                {!saveBool ?(<ProgramEstimateItems props={programItems} fn={setProgramItems} />):(<></>)}
            </div>
            { saveBool &&
            <>
            <div className="summary-box">
                <Card className="summary-card">
                    <CardBody>
                        <CardHeader className="summary-header">{customerObject.customerName}</CardHeader>
                        <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(paymentBreakdown.downPayment)}  <b>Total payment:</b> {moneyFormatter.format(paymentBreakdown.total)}</CardTitle>
                        <CardSubtitle className="summary-items-list">
                            {programItems.map(item=><h5>{item.itemName} with {item.financeTerms} financing {item.financeTerms===1 ? "term":"terms"} </h5>)}
                        </CardSubtitle>
                    </CardBody>
                </Card>
            </div>
            <div className="cycles-box">
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
            <div className="program-print-box">
                <PrintMain/>
            </div>
           </>}
        </div>
    );
};

export default NewProgramEstimate;