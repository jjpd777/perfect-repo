import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import EstimateItems from "./EstimateItems";


import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import ItemSelection from "../ItemSelection/ItemSelection";
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


function Estimate({ listItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("laser");
    const [rCategories, setReadCateg] = useState([]);

    const [programItems, setProgramItems] = useState([]);

    const typesEstimate = ["Financing Estimate", "Normal Estimate"];
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [customerObject, setCustomerObj] = useState({});
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState({});
    const [invoiceEstimate, setInvoiceEstimate] = useState("estimate");
    const [user, loading, error]=useAuthState(auth);


    useEffect(() => {
        var tmp = [];
        listItems.map(x => {
            if (!(tmp.includes(x.itemCategory)) && (itemType === x.itemType)) {
                tmp.push(x.itemCategory);
            }
        })
        setReadCateg(tmp); 
    }, [listItems, itemType, itemCategory]);

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
        };
        try {
           
            createEstimateFunction(item, parseForFirebase(customerObject.customerPhone)).then(()=>{setProgramItems([]);})
            if(isNewCustomer)createCustomerFunction(customerFirebase).then(()=>{
                setCustomerObj({});
            })
        } catch (e) {
            console.log(e)
        }
    };

    const computeBalanceTotal = (x)=>{
        const ft = x.financeTerms ===0 ? 1 : Number(x.financeTerms);
        const ds = x.discount ===0 ? 1 : 1-(Number(x.discount)/100);
        const tot = Number(x.itemPriceUnit) * Number(x.itemNumSess) * ds;
        const conversionFactor = x.financeTerms=== 0 ? 1 :(x.financeTerms===1? 0.5 :(x.financeTerms===2? 0.33 : 0.3));
        const downP = tot * conversionFactor; const remBal = tot *(1-conversionFactor);
        const monthly = remBal/ Number(ft);
        return [downP, monthly, tot];
    };



    console.log(programItems, "oh yea")
   
    useEffect(() => {
        const cyclesTmp = {};
        var downPayGlobal = 0; var remainingBalGlobal =0;
        var totalSale = 0;

        programItems.map((item) => {
            const [downPayment, remainingBalance, localTotal] = computeBalanceTotal(item);
            downPayGlobal+=downPayment; remainingBalGlobal+=remainingBalance;
            totalSale += localTotal;
            if (!(cyclesTmp[item.financeTerms])) {
                cyclesTmp[item.financeTerms] = {
                    monthly: remainingBalance,
                    firstPayment: currentFullDate(),
                    nextPayment: currentFullDate()
                };
            } else {
                const t = cyclesTmp[item.financeTerms];
                cyclesTmp[item.financeTerms] = {
                    monthly: t.monthly + remainingBalance,
                    firstPayment: currentFullDate(),
                    nextPayment: currentFullDate(),
                };
            }
        });

        setPaymentBreakdown({
            downPayment: downPayGlobal, 
            remainingBalance:remainingBalGlobal
            , total: totalSale});
        const cycleKeys = Object.keys(cyclesTmp);
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
                tt.monthly+= cyclesTmp[cycleKeys[i]].monthly;
            };
            cyclesCollection.push(tt);
        })
        setPaymentCycles(cyclesCollection);
    }, [programItems]);

    return (
        <div className="action-content">
            
            <ItemSelection listItems={listItems} staff={false} fnItems={setProgramItems}/>
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            
            <div className="estimates-box">
                {!saveBool ?(<EstimateItems props={programItems} fn={setProgramItems} />):(<></>)}
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
                    checked={invoiceEstimate === "estimate"}
                    onChange={() => {
                        setInvoiceEstimate("estimate");
                    }}
                >
                    <h3>estimate</h3>
                </FormRadio>
                <FormRadio
                    inline
                    className="radio-choices"
                    checked={invoiceEstimate === "invoice"}
                    onChange={() => {
                        setInvoiceEstimate("invoice");
                    }}
                >
                    <h3>invoice</h3>
                </FormRadio>
            </div>
            <div className="save-program-box">
                <Button className="cat-btn" onClick={() => { insertProgramEstimate() }}>Save a & Print</Button>             
            </div>
           </>}
        </div>
    );
};


export default Estimate;