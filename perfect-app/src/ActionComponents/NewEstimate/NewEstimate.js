import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import EstimateItems from "./EstimateItems";
import SearchCustomer from "../SearchCustomer/SearchCustomer";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import { createEstimateFunction, createCustomerFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
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

    const insertProgram = () => {
        const [programObject, total] = programObjectBuilder();
        const item = {
            timestamp: currentFullDate(),
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
    }

    useEffect(() => {
        const cyclesTmp = {};
        programItems.map(item => {
            if (!(cyclesTmp[item.financeTerms])) {
                cyclesTmp[item.financeTerms] = {
                    monthly: computeSubTotal(item),
                    firstPayment: currentFullDate(),
                    nextPayment: currentFullDate(),
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
                monthly:0
            }
            for(let i=kIndex; i<li;i++){
                tt.monthly+= cyclesTmp[cycleKeys[i]].monthly
            }
            cyclesCollection.push(tt);
        })
        setPaymentCycles(cyclesCollection);
    }, [programItems]);

    console.log(customerObject,"The customer");

    return (
        <div className="action-content">
            <div>
                <SearchCustomer fn={setCustomerObj} fnNewCustomer={setIsNewCustomer}/>
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
                <div className="item-name-btn">
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
            <div>
                <EstimateItems props={programItems} fn={setProgramItems} />
            </div>
            <div className="cycles-box">
                {paymentCycles.map((x,i)=>
                <>
                <h3><b>Cycle #{i+1}</b></h3>
                <h3>Monthly: {moneyFormatter.format(x.monthly)}</h3>
                </>)}
            </div>
            <div className="save-program-box">
                <Button className="cat-btn" onClick={() => { insertProgram() }}>Save estimate</Button>
            </div>
        </div>
    );
};

{/* <Button className="cat-btn" onClick={() => setItemCategory(x)}>
{x}
</Button> */}
export default NewEstimate;