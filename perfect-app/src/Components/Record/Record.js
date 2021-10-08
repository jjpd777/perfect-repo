import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import CustomerSearch from "../CustomerSearch/CustomerSearch";
import RecordCard from "./RecordCard";

import "../Design.scss";
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


function Record({ listItems }) {
    const [currentCustomer, setCurrentCustomer]=useState({});
    const [estimatesList, setEstimates] = useState([]);


  useEffect(() => {
    const ref = readCustomerEstimatesFunction(currentCustomer.customerPhone);
    const refVal = ref.on('value', function (snapshot) {
      const snap = snapshot.val();
      if (!snap) return;
      const respKeys = Object.keys(snap);
      const items = respKeys.map((k) => snap[k]);
      setEstimates(items);
    });
    return () => ref.off('value', refVal)
  }, [currentCustomer]);


  console.log(currentCustomer, "CURRENT CUSTOMER")
  console.log(estimatesList, "FETCHY")
    return(
        <div className="record-main-box">
            <h3>Customer search</h3>
            <CustomerSearch fnSetCustomer={setCurrentCustomer} record={true} />
            <h4>Estimates and invoices</h4>
          { estimatesList.map((x)=>  
          <div className="summary-box">
               <RecordCard estimate={x}/>
          </div>)}
        </div>
    )
};

export default Record;

{/* <CardTitle className="summary-title"><b>Down payment:</b> {moneyFormatter.format(paymentBreakdown.downPayment)}  <b>Total payment:</b> {moneyFormatter.format(paymentBreakdown.total)}</CardTitle>
<CardSubtitle className="summary-items-list">
    {programItems.map(item=><h5>{item.itemName} with {item.financeTerms} financing {item.financeTerms===1 ? "term":"terms"} </h5>)}
</CardSubtitle> */}