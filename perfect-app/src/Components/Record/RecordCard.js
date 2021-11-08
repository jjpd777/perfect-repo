import React, { useEffect, useState } from "react";
import {
    Form, FormInput, FormGroup,
    Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody, ModalFooter, Badge, CardFooter
} from "shards-react";
import "../Design.scss";
import {moneyFormatter} from "../../Utils/MoneyFormat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout} from "../../UtilsFirebase/Authentication";
import { updateToInvoice } from "../../UtilsFirebase/Database";
import PrintEstimate from "../Estimate/PrintEstimate/PrintEstimate";
import PrintProgram from "../Program/PrintProgram/PrintProgram";
import {deconstructItems, deconstructProducts} from "../SharedUtils";




const RecordCard = ({estimate, fnHandleEdit}) => {
    const [user, loading, error]=useAuthState(auth);
    const [cardOpen, setCardOpen] = useState(false);
    const [printView, setPrintView] = useState(false);
    const programItems = deconstructProducts(estimate.programItems);
    const paymentBreakdown = estimate.paymentBreakdown;
    const paymentCycles = estimate.paymentsCycles;
    const currentCustomer = estimate.customerObject;
    const remarks = estimate.footerNotes;
    const perfectID = estimate.perfectID;
    const invoiceFlag = estimate.estimateType ==="invoice";
    const programFlag = estimate.saveDetail !== "simple";
    const rafael = true;
    

    console.log(paymentCycles, "apasdfasdf")

    useEffect(()=>{
        !cardOpen ? setPrintView(false) : setPrintView(printView);
    }, [cardOpen])
    const typeOfProgram = (x)=>{
        const isProgram = !programFlag  ? "Financing" : "Program";
        return isProgram + " "+ x.estimateType;
    };
    const customerName = (x)=>{
        return x.customerObject.customerName + " " + x.customerObject.customerLast;
    };

    const payCycleLen = (x)=>{
        const payK = Object.keys(x.paymentsCycles);
        return payK.length;
    };

    const setInvoice = (x)=>{
        try{
            updateToInvoice(x.id, x.customerObject.customerPhone);
        }
        catch(e){
            console.log(e)
        }
    }
 
    return (

        <div className="record-card-box">
          <Card>
              <div onClick={()=>setCardOpen(!cardOpen)}>                
                  <CardHeader>
                    <Badge className="perfect-id" theme="light">
                        {estimate.perfectID}
                    </Badge>
                    <h3 className="rec-date">
                    {estimate.timestamp.split("&")[1]}
                    </h3>
                    {customerName(estimate)}

                </CardHeader>
                <CardTitle>
                <Badge className="typeof-rec" theme={estimate.estimateType==="invoice" ? "danger" : "secondary"} >
                       {typeOfProgram(estimate)}
                    </Badge>
                    
                </CardTitle>

                <CardBody>
                {cardOpen && 
            <div className="record-card-options">
                {!invoiceFlag && rafael && <Button 
                onClick={()=>{setInvoice(estimate)}}
                theme="warning" className="record-options-btn">
                    Invoice
                </Button>}
               {!invoiceFlag && <Button theme="danger" className="record-options-btn"
                    onClick={()=>{fnHandleEdit(estimate)}}
                >
                    Edit
                </Button>}
            </div>}
                </CardBody>
                </div>
                <CardFooter>
            <Button theme="success" className="record-options-btn"
                    onClick={()=>{setPrintView(!printView)}}
                >
                    {printView ? "Close view" : "View"}
                </Button>
            </CardFooter>
            </Card>
            <div className="action-content-rev">
           {printView && !programFlag&&
            <PrintEstimate 
                example={["one", "two"]}
                checkoutItems = {programItems}
                paybreakdown = {paymentBreakdown}
                paycycle = {paymentCycles}
                customer= {currentCustomer}
                alreadyInserted = {true}
                remarks ={remarks}
                perfID={perfectID}
            />
            }
            {printView && programFlag &&
            <PrintProgram
                example={["one", "two"]}
                checkoutItems = {programItems}
                paybreakdown = {paymentBreakdown}
                paycycle = {paymentCycles}
                customer= {currentCustomer}
                alreadyInserted = {true}
                remarks ={remarks}
                perfID={perfectID}
            />
            }
            </div>

        </div>
    )
};

export default RecordCard;
