import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import CustomerSearch from "../CustomerSearch/CustomerSearch";
import EstimateItems from "./EstimateItems";
import PrintEstimate from "./PrintEstimate/PrintEstimate";
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

import {computeBalanceTotal, programObjectBuilder, structureCustomer} from "./UtilsEstimate";

function Estimate({ listItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("LHR");
    const [rCategories, setReadCateg] = useState([]);

    const [programItems, setProgramItems] = useState([]);

    const voidState = {};

    const programOrEstimate = "simple";
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState(voidState);
    const [invoiceEstimate, setInvoiceEstimate] = useState("estimate");
    const [user, loading, error]=useAuthState(auth);
    const [currentCustomer, setcurrentCustomer] = useState(voidState);
    const [insertedDB, setInsertedDB] = useState(false);
    const remarksInitial = {
        footerNotes: "",
        validUntil: ""
    }
    const [additionalRemarks,setAdditionalRem] = useState(remarksInitial);
    const resetAllVariables = ()=>{
        setPaymentBreakdown(voidState);
        setcurrentCustomer(voidState);
        setInsertedDB(false);
        setProgramItems([]);
        setSaveBool(false);
    };
  

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


    const insertProgramEstimate = () => {
        const customerFirebase = structureCustomer(currentCustomer);
        
        const item = {
            timestamp: currentFullDate(),
            unix: currentUnixDate(),
            itemDelted: false,
            createdBy: user.email,
            programItems: programObjectBuilder(programItems),
            programTotal: paymentBreakdown.total,
            customerObject: customerFirebase,
            paymentsCycles: paymentCycles,
            paymentBreakdown: paymentBreakdown,
            estimateType: invoiceEstimate,
            remarks: additionalRemarks,
            voided: false,
            saveDetail: programOrEstimate,
        };


        try {
            console.log("THIS IS THE USER OBJECT", currentCustomer)

            createEstimateFunction(item, parseForFirebase(currentCustomer.customerPhone))
            .then(()=> {setInsertedDB(true); 
                if(currentCustomer.isNewCustomer)createCustomerFunction(customerFirebase);});
            
        } catch (e) {
            console.log(e)
        }
    };


    const customerValidFormat = !!(currentCustomer.customerName && currentCustomer.customerPhone && currentCustomer.customerLast);

   
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
            , total: totalSale
        });

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
            <CustomerSearch fnSetCustomer={setcurrentCustomer} record={false} />
            <ItemSelection listItems={listItems} staff={false} fnItems={setProgramItems}/>
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            <div className="estimates-box">
                {!saveBool ?(<EstimateItems props={programItems} fn={setProgramItems} />):(<></>)}
            </div>
            
            { saveBool &&
            <>
            <div className="invoice-radio-box">
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
                <div className="additional-remarks">
                <h3>Additional remarks</h3>
                <FormInput
                type="text"
                className="remark-text"
                value={additionalRemarks.footerNotes}
                onChange={(e) => setAdditionalRem({...additionalRemarks, footerNotes: e.target.value})}
                placeholder="Insert remarks..."
              />
              </div>
                {/* <div className="save-program-box">
                <Button className="cat-btn" onClick={() => { insertProgramEstimate() }}>Save a & Print</Button>             
            </div> */}
            <PrintEstimate 
            example={["one", "two"]}
            checkoutItems = {programItems}
            paybreakdown = {paymentBreakdown}
            paycycle = {paymentCycles}
            customer= {currentCustomer}
            alreadyInserted = {insertedDB}
            remarks ={additionalRemarks.footerNotes}
            />
            </div>
            <div className="save-db-box">
                <br></br>
           { insertedDB ? (<Button 
            onClick={()=>{resetAllVariables()}}
            className="save-to-db">
                New Estimate
            </Button>):(
                <>
                                  {!customerValidFormat &&<h2>{ "Please enter user"}</h2>}
                    <br></br>
                  <Button 
                  onClick={()=>{
                      insertProgramEstimate();
                  }}
                  className="save-to-db">
                      Save {invoiceEstimate}
                  </Button>
                  </>
            )}
            <br></br>
            <br></br>
            </div>
           </>}
        </div>
    );
};


export default Estimate;