import React from "react";
import ReactToPrint from "react-to-print";
import {formatUnixDate } from "../../../Utils/DateTimeUtils";
import {moneyFormatter } from "../../../Utils/MoneyFormat";
import perfectIcon from "../../../perf-b-icon.png";

import "./PrintProgram.scss";
import {
  FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader
} from "shards-react";

const thStyle = {
  fontFamily: "Anton",
  fontWeight: "normal",
  fontStyle: "normal"
};
const listThings = ["one","two","three","four"];
const programItems = [
  { itemType:"treatment", itemCategory: "laser",
    itemName: "Xeomin: Glabellar, Forehead & Crow's Feet (Add on)",
    itemPriceUnit: "500",
    itemNumSess: "3",
    financeTerms: "1",
    discount: "0",
  },
  { itemType:"treatment", itemCategory: "laser",
    itemName: "argentinian laser",
    itemPriceUnit: "750",
    itemNumSess: "2",
    financeTerms: "1",
    discount: "0",

  },
  { itemType:"product", itemCategory: "dental care",
  itemName: "whitening toothbrush",
  itemPriceUnit: "150",
  itemNumSess: "1",
  financeTerms: "1",
  discount: "0",
  },
  { itemType:"product", itemCategory: "dental care",
  itemName: "dental floss",
  itemPriceUnit: "50",
  itemNumSess: "1",
  financeTerms: "1",
  discount: "0",
  },
  { itemType:"product", itemCategory: "dental care",
  itemName: "qTip",
  itemPriceUnit: "30",
  itemNumSess: "1",
  financeTerms: "1",
  discount: "0",
  },
];

const paymentBreakdown = {
    downPayment: 757,
    remainingBalance: 243,
    total: 1000
};

const paymentCycles = {
  "0":{
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 361.6666666666667,
  },
  "1":{
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 361.6666666666667,
  },
  "2":{
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 261.6666666666667,
  }
};

const cyclesList = (x)=>{
  if(!x) return[];
  const keys = Object.keys(x);
  return keys.map(k=> x[k]);

}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="print-big-box">
        <div className="perfect-b-header">
          <img src={perfectIcon}/>
          <div className="header-detail">
          <h3> Perfect B Med Spa</h3>
          <h5>perfectb.com</h5>
          </div>
        </div>
        <div>
          <h3>The following recommendations are created by Perfect B in order to Achieve
            client's desired goals in the most efficient manner.
          </h3>
        </div>
        <div className="center-table">
        <Container className="sub-table">
          <Row>
          <Col className="item-name"><h4>Treatments</h4></Col>
          <Col><h4>Sessions</h4></Col>
          <Col><h4>$ / sess</h4></Col>
          <Col><h4>Discount</h4></Col>
          <Col><h4>Final Price</h4></Col>
          <Col><h4>Down Payment</h4></Col>
          <Col><h4>Monthly Payment</h4></Col>
          <Col><h4>Terms</h4></Col>
          </Row>
          {programItems.map(x=> x.itemType==="treatment" &&
          <Row>
             <Col className="item-name">
               <h5>{x.itemName}</h5>
             </Col>
            <Col><h5>{x.itemNumSess}</h5></Col>
            <Col><h5>{x.itemPriceUnit}</h5></Col>
            <Col><h5>{x.discount}</h5></Col>
            <Col><h5>{x.financeTerms}</h5></Col>
            <Col><h5>{x.itemPriceUnit}</h5></Col>
            <Col><h5>{x.discount}</h5></Col>
            <Col><h5>{x.financeTerms}</h5></Col>
          </Row>)}
        </Container>
        <Container className="sub-table">
        <Row>
        <Col className="item-name"><h4>Products</h4></Col>
          <Col><h4>Sessions</h4></Col>
          <Col><h4>$ / sess</h4></Col>
          <Col><h4>Discount</h4></Col>
          <Col><h4>Final Price</h4></Col>
          <Col><h4>Down Payment</h4></Col>
          <Col><h4>Monthly Payment</h4></Col>
          <Col><h4>Terms</h4></Col>
          </Row>
          {programItems.map(x=> x.itemType==="product" &&
          <Row>
             <Col className="item-name">
               <h5>{x.itemName}</h5>
             </Col>
            <Col><h5>{x.itemNumSess}</h5></Col>
            <Col><h5>{x.itemPriceUnit}</h5></Col>
            <Col><h5>{x.discount}</h5></Col>
            <Col><h5>{x.financeTerms}</h5></Col>
            <Col><h5>{x.itemPriceUnit}</h5></Col>
            <Col><h5>{x.discount}</h5></Col>
            <Col><h5>{x.financeTerms}</h5></Col>
          </Row>)}
        </Container>
        </div>
        <div className="cycles-container">
        <div className="cycles-box">
                <h2>Pay today</h2>
               <h4>Amount: {moneyFormatter.format(paymentBreakdown.downPayment)}</h4>
            </div>
          {cyclesList(paymentCycles).map((x,i)=>
            <div className="cycles-box">
                <h2>Cycle {i+1}</h2>
               <h4>Monthly payment: {moneyFormatter.format(x.monthly)}</h4>
               <h3>{formatUnixDate(x.firstPayment)}</h3>
            </div>
            )}
        </div>
      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div className="big-container">
      <div className="print-container">
        <ComponentToPrint ref={(el) => (this.componentRef = el)} />
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <div className="print-btn">
        <ReactToPrint
          trigger={() => <button>Print this out!</button>}
          content={() => this.componentRef}
        />
        </div>
      </div>
      
    );
  }
}

export default Example;
