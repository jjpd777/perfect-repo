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
import {isObjectEmpty} from "../../Utils/ObjectVarious";

import { auth, logout} from "../../UtilsFirebase/Authentication";
import {parseForFirebase} from "../../Utils/FirebaseParser";
import { currentFullDate, currentUnixDate,perfectbUniqueID } from "../../Utils/DateTimeUtils";
import { createEstimateFunction, updateEstimateFunction, createCustomerFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter
} from "shards-react";
import { program } from "@babel/types";
import { set } from "date-fns";
import { structureCustomer, programObjectBuilder} from "../SharedUtils";
import {complexDiscountTable, updateDiscountCorrect, 
     chooseCategoriesDiscount, computeItemsSubTotal,
     computeTotal} from "./UtilsProgram";


const remarksInitial = {
    footerNotes: "",
    validUntil: ""
};
const initialState = {
    downPayment: "30",
    terms:6,
    disc:{
        type: "percent",
        discountPercent: 0,
        discountAmount:0,
    },
    perfID: ""
};


function Program({ listItems,reviewItems, fnReviewList }) {
    const revFlag = isObjectEmpty(reviewItems);

    const [programItems, setProgramItems] = useState([]);
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState({});
    const [invoiceEstimate, setInvoiceEstimate] = useState("estimate");
    const [user, loading, error]=useAuthState(auth);
    const [insertedDB, setInsertedDB] = useState(false);
    const [resetCustomer, setResetCustomer] = useState(true);
    const [programVariables, setProgramVariables] = useState(initialState);
    const voidState = {};
    const [additionalRemarks,setAdditionalRem] = useState(remarksInitial);

    useEffect(()=>{
        const perfID = perfectbUniqueID();
        setProgramVariables({...programVariables, perfID: perfID});
    },[saveBool]);

    
    useEffect(()=>{
        if(revFlag) return;
        console.log(reviewItems, "Program from Record");
        setProgramItems(reviewItems.estimateItems);
        setCurrentCustomer(reviewItems.customerInfo);
        setAdditionalRem(reviewItems.remarks);
        setProgramVariables(reviewItems.programVariables);
    },[reviewItems])



    const programOrEstimate = "program";


    

    const resetAllVariables = ()=>{
        setResetCustomer(false);
        setPaymentBreakdown(voidState);
        setCurrentCustomer(voidState);
        setInsertedDB(false);
        setProgramItems([]);
        setSaveBool(false);
        setProgramVariables(initialState);
        setAdditionalRem(remarksInitial);
        fnReviewList({});
    };


    useEffect(()=>{
        setResetCustomer(true);
    },[resetCustomer]);
  
    console.log(currentCustomer, "customer obj 7777788");


    const insertProgramEstimate = () => {
        const customerFirebase = structureCustomer(currentCustomer);

        const item = {
            perfectID: programVariables.perfID,
            timestamp: currentFullDate(),
            unix: currentUnixDate(),
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
            programVariables: programVariables,
            validUntil: currentUnixDate()+ (7*86400)
        };
        console.log(item, "item obj");

        try {
            
            console.log("THIS IS THE USER OBJECT", currentCustomer)
            if(!revFlag){
                const pathToItem = customerFirebase.customerPhone +"/"+ reviewItems.updateKey;
                updateEstimateFunction(item,pathToItem).then(()=>{
                    setInsertedDB(true)
                })
                console.log(pathToItem, "PATH TO ESTIMATE")
            }else{
                createEstimateFunction(item, customerFirebase.customerPhone)
                .then(()=> {setInsertedDB(true); 
                    if(currentCustomer.isNewCustomer)createCustomerFunction(customerFirebase);});
            }

        } catch (e) {
            console.log(e)
        }
    };

   
    useEffect(() => {
       
        const itemsSubTotal = computeItemsSubTotal(programItems);
        const categoriesDisc = chooseCategoriesDiscount(programItems);
        const partialSubTotal = itemsSubTotal * categoriesDisc;
        const finalTotal = computeTotal(partialSubTotal, programVariables.disc);

        const downPercentage = Number(programVariables.downPayment) /100
        const downPayment = finalTotal * downPercentage;
        const remainingBalance = finalTotal * (1-downPercentage);

        const financeTerms = programVariables.terms;
        const monthly = remainingBalance / Number(programVariables.terms);

        setPaymentBreakdown({
            downPayment: downPayment, 
            remainingBalance: remainingBalance,
            total: finalTotal,
            salesTax:0,
        });

        const cyclesCollection = {
            "0" :{
                "firstPayment": currentUnixDate()+ 2592000,
                "lastPayment": currentUnixDate()+ 2592000*(Number(financeTerms)),
                "monthly": monthly,
                "numberTerms": financeTerms
            }
        }

        setPaymentCycles(cyclesCollection);
    }, [programItems, programVariables]);


    const customerValidFormat = !!(currentCustomer.customerName && currentCustomer.customerPhone && currentCustomer.customerLast);


    return (
        <div className="action-content">
                 {resetCustomer && revFlag&& <CustomerSearch fnSetCustomer={setCurrentCustomer} record={false} />}
            {resetCustomer && <ItemSelection listItems={listItems} staff={false} fnItems={setProgramItems}/>}
              <div className="program-header">
                    <h2>Program Estimate for {currentCustomer.customerName}</h2>
                </div>
              <div className="program-variables-box">
                    <Container>
                        <Row>
                            <Col>
                                <h3>Down P %</h3>
                            </Col>
                            <Col>
                                <h3>Disc. %</h3>
                            </Col>
                            <Col>
                                <h3>Disc. $</h3>
                            </Col>
                            <Col>
                                <h3>Terms</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <FormInput type="number" className="program-variables-input" value={programVariables.downPayment}
                        onChange={(e) => { setProgramVariables({...programVariables, downPayment:e.target.value})}} />
                            </Col>
                            <Col>
                            <FormInput className="program-variables-input" 
                               value={programVariables.disc.discountPercent}
                               type="number"
                               onChange={(e) => { setProgramVariables({...programVariables, disc: updateDiscountCorrect(e.target.value, true)}) }} />
                            </Col>
                            <Col>
                            <FormInput className="program-variables-input" 
                               value={programVariables.disc.discountAmount}
                               type="number"
                               onChange={(e) => { setProgramVariables({...programVariables, disc: updateDiscountCorrect(e.target.value, false)}) }} />
                            </Col>
                            <Col>
                            <FormInput className="program-variables-input" value={programVariables.terms}
                                type="number"
                                onChange={(e) => { setProgramVariables({...programVariables, terms:e.target.value}) }} />
                            </Col>
                        </Row>
                    </Container>
                   
                </div>
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            
            <div className="estimates-box">
                {!saveBool ?(<ProgramItems props={programItems} fn={setProgramItems} />):(<></>)}
            </div>
            { saveBool &&
            <>
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
            <br></br>
            <br></br>
            <div className="prog-print-box">
                <PrintProgram example={["one", "two"]}
                    checkoutItems = {programItems}
                    paybreakdown = {paymentBreakdown}
                    paycycle = {paymentCycles}
                    customer= {currentCustomer}
                    remarks ={additionalRemarks.footerNotes}
                    alreadyInserted = {insertedDB}
                    perfID ={programVariables.perfID}
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
                                  {!customerValidFormat ? <h2>{ "Enter Valid Patient"}</h2> :
                  <Button 
                  onClick={()=>{
                      insertProgramEstimate();
                  }}
                  className="save-to-db">
                      {!revFlag ? "Update" :  "Save"} {invoiceEstimate}
                  </Button>
                                  }
                  </>
            )}
            <br></br>
            <br></br>
            </div>
           </>}
        </div>
    );
};

export default Program;