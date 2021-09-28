import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import EstimateItems from "./EstimateItems";
import SearchCustomer from "../SearchCustomer/SearchCustomer";
import PrintMain from "./PrintComponent/PrintMain";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate, formatUnixDate, currentUnixDate } from "../../Utils/DateTimeUtils";
import { createEstimateFunction, createCustomerFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader
} from "shards-react";
import { program } from "@babel/types";


function NewEstimate({ listItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("laser");
    const [rCategories, setReadCateg] = useState([]);
    const [editItems, setEditItems] = useState([]);
    const [programItems, setProgramItems] = useState([]);
    const [toggle, setToggle] = useState(false);
    const typesEstimate = ["Financing Estimate", "Normal Estimate", "Open Estimate"];
    const [typeE, setTypeE] = useState(typesEstimate[0]);
    const [estimateToggle, setEsToggle] = useState(false);
    const [paymentCycles, setPaymentCycles] = useState([]);
    const [customerObject, setCustomerObj] = useState({});
    const [isNewCustomer, setIsNewCustomer] = useState(true);
    const [saveBool, setSaveBool]= useState(false);
    const [paymentBreakdown, setPaymentBreakdown] = useState({});


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
    }, [listItems, itemType, itemCategory]);

    const programObjectBuilder = () => {
        var rsp = {}; var total = 0;
        programItems.map((item, ix) => {
            rsp["item-" + String(ix + 1)] = item;
            total += Number(item.itemNumSess * item.itemPriceUnit);
        });
        return [rsp, total];
    }

    const insertProgramEstimate = () => {
        const [programObject, total] = programObjectBuilder();
        const item = {
            timestamp: currentFullDate(),
            unix: currentUnixDate(),
            itemDelted: false,
            createdBy: "x.createdBy",
            programItems: programObject,
            programTotal: total,
            customerObject: customerObject,
            paymentsCycles: paymentCycles
        };
        try {
            createEstimateFunction(item).then(()=>{
                setProgramItems([]);
            });
            createCustomerFunction(customerObject).then(()=>{
                setCustomerObj({});
            })
        } catch (e) {
            console.log(e)
        }
    };

    const computeSubTotal = (x)=>{
        const ft = x.financeTerms ===0 ? 1 : Number(x.financeTerms);
        const ds = x.discount ===0 ? 1 : 1-Number(x.discount)/100;
        return (Number(x.itemPriceUnit) * Number(x.itemNumSess) * ds)/ Number(ft);
    };


    const computePaymentBreakdown = (item)=>{
        var downPayment = 0; var remainingBalance = 0;
            if(item.financeTerms ==="0"){
                downPayment+= computeSubTotal(item);
                remainingBalance+= computeSubTotal(item);
            }else if(item.financeTerms ==="1"){
                downPayment+= computeSubTotal(item)*0.5;
                remainingBalance+= computeSubTotal(item) *0.5;
            }
            else if(item.financeTerms ==="2"){
                downPayment+= computeSubTotal(item)*0.33;
                remainingBalance+= computeSubTotal(item) *0.67;
            }else{
                downPayment+= computeSubTotal(item)*0.3;
                remainingBalance+= computeSubTotal(item) *0.7;
            };
        return [downPayment, remainingBalance];
    }

   
    useEffect(() => {
        const cyclesTmp = {};
        var downPayment = 0; var remainingBalance =0;
        programItems.map((item,index) => {
            if (!(cyclesTmp[item.financeTerms])) {
                cyclesTmp[item.financeTerms] = {
                    monthly: computeSubTotal(item),
                    firstPayment: currentFullDate(),
                    nextPayment: currentFullDate()
                };
            } else {
                const t = cyclesTmp[item.financeTerms];
                cyclesTmp[item.financeTerms] = {
                    monthly: t.monthly + computeSubTotal(item),
                    firstPayment: currentFullDate(),
                    nextPayment: currentFullDate(),
                };
            }
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




    console.log(customerObject,"The customer");

    return (
        <div className="action-content">
               <div>
                <SearchCustomer fn={setCustomerObj} fnNewCustomer={setIsNewCustomer}/>
            </div>
           { !saveBool && 
           <>
           <div className="dd-option">
                    <Dropdown open={estimateToggle} toggle={() => setEsToggle(!estimateToggle)}>
                        <DropdownToggle split className="dd-btn" >{typeE}  </DropdownToggle>
                        <DropdownMenu >
                            {typesEstimate.map(x =>
                                <DropdownItem
                                    onClick={() => { setTypeE(x) }}
                                >{x}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
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
                                        financeTerms: 0, discount: 0, currentToggle: false
                                    }]
                                ])
                            }
                        }}
                    >{x.itemName}</Button>)}
                    <br></br>
                    <br></br>
                </div>
            </div>
        </>
        }
            <div className="temp-save-box">
                <Button className="temporary-save" onClick={()=>setSaveBool(!saveBool)}>{ !saveBool ? "Save selection" : "Edit Selection"}</Button>
            </div>
            <div className="estimates-box">
                {!saveBool ?(<EstimateItems props={programItems} fn={setProgramItems} />):(<></>)}
            </div>
            <div className="summary-box">
                <Card className="summary-card">
                    <CardBody>
                        <CardHeader className="summary-header">{customerObject.customerName}</CardHeader>
                        <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(0.3*programObjectBuilder()[1])}  <b>Total payment:</b> {moneyFormatter.format(programObjectBuilder()[1])}</CardTitle>
                        <CardSubtitle className="summary-items-list">
                            {programItems.map(item=><h5>{item.itemName} with {item.financeTerms} financing terms </h5>)}
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
                <h3><b></b></h3>
                <h3></h3>
                             
                </>)}
            </div>
            {saveBool && <div className="save-program-box">
                <Button className="cat-btn" onClick={() => { insertProgramEstimate() }}>Print estimate</Button>
                <Button className="cat-btn" onClick={() => { }}>Save as Invoice & Print</Button>               
            </div>}
            {/* <div className="print-box-bb">
            <PrintMain/>
            </div> */}
        </div>
    );
};

{/* <Button className="cat-btn" onClick={() => setItemCategory(x)}>
{x}
</Button> */}
export default NewEstimate;