import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import SearchCustomer from "../SearchCustomer/SearchCustomer";

import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { auth, logout} from "../../UtilsFirebase/Authentication";
import {parseForFirebase} from "../../Utils/FirebaseParser";
import { currentFullDate, formatUnixDate, currentUnixDate } from "../../Utils/DateTimeUtils";
import { readCustomerEstimatesFunction, readCustomersFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader
} from "shards-react";
import { program } from "@babel/types";
import { set } from "date-fns";


function RecordEstimates({ listItems }) {
    const [currentCustomer, setCurrentCustomer]=useState({});
    const [newCustomer, setNewCustomer] = useState(false);
    const [estimatesList, setEstimates] = useState([]);


  useEffect(() => {
    const ref = readCustomerEstimatesFunction(currentCustomer.customerEmail);
    const refVal = ref.on('value', function (snapshot) {
      const snap = snapshot.val();
      console.log("BRUH", currentCustomer)
      if (!snap) return;
      const respKeys = Object.keys(snap);
      console.log(respKeys, "KEYS")
      const items = respKeys.map((k) => snap[k]);
      setEstimates(items);
    });
    return () => ref.off('value', refVal)
  }, [currentCustomer]);

  const cyclesFormatter = (x)=>{
      if(!x) return[];
      const keys = Object.keys(x.paymentsCycles);
      console.log("FAMFAMFAM", x.paymentsCycles)
      var resp = [];keys.map((k)=>resp.push(x[k]))
      return resp;
  }


  console.log(currentCustomer, "CURRENT CUSTOMER")
  console.log(estimatesList, "FETCHY")
    return(
        <div>
            <h3>This estimate</h3>
            <SearchCustomer fn={setCurrentCustomer} fnNewCustomer={setNewCustomer} optionsFlag={false} />
            <h4>Estimates and invoices</h4>
          { estimatesList.map((x)=>  
          <div className="summary-box">
                <Card className="summary-card">
                    <CardBody>
                        <CardHeader className="summary-header">{x.estimateType}  {x.timestamp.split("&").join(" ")}</CardHeader>
                        <CardTitle className="summary-title"> </CardTitle>
                        <CardTitle className="summary-title"><b>Total payment:</b> {moneyFormatter.format(x.paymentBreakdown.total)} </CardTitle>
                        <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(x.paymentBreakdown.downPayment)} </CardTitle>
                        {x.paymentsCycles.map((cycle,ix)=>
                        <>
                        <h4>Cycle # {ix+1}</h4>
                        <h5>monthly: {moneyFormatter.format(cycle.monthly)}</h5>
                        <h5>starts:{formatUnixDate(cycle.firstPayment)}</h5>
                        <h5>ends: {formatUnixDate(cycle.lastPayment)}  </h5>
                        </>)}
                    </CardBody>
                </Card>
          </div>)}
        </div>
    )
};

export default RecordEstimates;

{/* <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(paymentBreakdown.downPayment)}  <b>Total payment:</b> {moneyFormatter.format(paymentBreakdown.total)}</CardTitle>
<CardSubtitle className="summary-items-list">
    {programItems.map(item=><h5>{item.itemName} with {item.financeTerms} financing {item.financeTerms===1 ? "term":"terms"} </h5>)}
</CardSubtitle> */}