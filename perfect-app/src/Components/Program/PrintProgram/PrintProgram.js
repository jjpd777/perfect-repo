import React from "react";
import ReactToPrint from "react-to-print";
import perfectIcon from "../../../perf-b-icon.png";
import {moneyFormatter} from "../../../Utils/MoneyFormat";
import {currentFullDate, currentUnixDate,formatUnixDate} from "../../../Utils/DateTimeUtils";

import "./PrintProgram.scss";
import { Container, Row, Col, Button } from "shards-react";

const thStyle = {
  fontFamily: "Anton",
  fontWeight: "normal",
  fontStyle: "normal",
};
const listThings = ["one", "two", "three", "four"];
const programItems = [
  {
    itemType: "treatment",
    itemCategory: "laser",
    itemName: "Xeomin: Glabellar, Forehead & Crow's Feet",
    itemPriceUnit: "500",
    itemNumSess: "3",
    financeTerms: "1",
    discount: "0",
  },
  {
    itemType: "treatment",
    itemCategory: "laser",
    itemName: "argentinian laser",
    itemPriceUnit: "750",
    itemNumSess: "2",
    financeTerms: "1",
    discount: "0",
  },
  {
    itemType: "product",
    itemCategory: "dental care",
    itemName: "whitening toothbrush",
    itemPriceUnit: "150",
    itemNumSess: "1",
    financeTerms: "1",
    discount: "0",
  },
  {
    itemType: "product",
    itemCategory: "dental care",
    itemName: "dental floss",
    itemPriceUnit: "50",
    itemNumSess: "1",
    financeTerms: "1",
    discount: "0",
  },
  {
    itemType: "product",
    itemCategory: "dental care",
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
  total: 1000,
};

const paymentCycles = {
  0: {
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 361.6666666666667,
  },
  1: {
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 361.6666666666667,
  },
  2: {
    firstPayment: 1638138359,
    lastPayment: 1640730359,
    monthly: 261.6666666666667,
  },
};

const cyclesList = (x) => {
  if (!x) return [];
  const keys = Object.keys(x);
  return keys.map((k) => x[k]);
};

const totalCost = "1075.00";

const nextPayment = "11/3/21";
const lastPayment = "1/3/22";

class ComponentToPrint extends React.Component {
  render() {
    const pItems = this.props.checkoutItems;
    const pBdown = this.props.paybreakdown;
    const pCycle = this.props.paycycle["0"];
    const terms = pCycle.numberTerms;
    const cust = this.props.customer;
    // console.log(pCycle, "inside print")
    const validUntil =Number(currentUnixDate())+ 86400*7;
    return (
      <div className="print-big-box">
        <div className="perfect-b-header">
          <img src={perfectIcon} />
          <div className="header-detail">
            <strong> Perfect B Med Spa</strong>
            <p>perfectb.com</p>
            <p>(786)502-2260</p>
            <p>IG: @perfectbmedspa</p>
          </div>
          <div className="customer-details">
            <div className="customer-details-item">
              <div> Client: </div> <div>{cust.customerName}</div>
            </div>
            <div className="customer-details-item">
              <div> Effective Date: </div> <div>{currentFullDate().split("&")[1]}</div>
            </div>
            <div className="customer-details-item">
              <div> Valid Until: </div> <div>{formatUnixDate(validUntil)}</div>
            </div>
            <div className="customer-details-item">
              <div className="italic"> Number: </div> <div>363340</div>
            </div>
          </div>
        </div>
        <h1 className="program-title">Juan's Program</h1>
        <div className="recommendations">
          <p>
            The following recommendations are created by Perfect B in order to
            Achieve client's desired goals in the most efficient manner. All
            recommendations are made considering the best technology available
            in the market and following local, state and federal health
            regulations.
          </p>
        </div>
        <div className="center-table">
          <div className="sub-table">
            <Row className="sub-table-row">
              <Col className="item-name">
                <h4>Treatments</h4>
              </Col>
              <Col>
                <h4>Quanity</h4>
              </Col>
            </Row>
            {pItems.map(
              (x) =>
                x.itemType === "treatment" && (
                  <Row className="sub-table-row">
                    <Col className="item-name">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                  </Row>
                )
            )}
          </div>
          <div className="sub-table">
            <Row className="sub-table-row">
              <Col className="item-name">
                <h4>Products</h4>
              </Col>
              <Col>
                <h4>Quanity</h4>
              </Col>
            </Row>
            {pItems.map(
              (x) =>
                x.itemType === "product" && (
                  <Row className="sub-table-row">
                    <Col className="item-name">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                  </Row>
                )
            )}
          </div>
        </div>
        <div className="totals">
          <div className="totals-column">
            <div className="totals-item">
              <div> Total Cost</div>
              <div>
                <strong className="italic"> {moneyFormatter.format(pBdown.total)} </strong>
              </div>
            </div>
            <div className="totals-item">
              <div> Terms </div>
              <div>
                <strong> {terms} </strong>
              </div>
            </div>
          </div>
          <div className="totals-column">
            <div className="totals-item bold">
              <div> Pay Today </div>
              <div className="dark-gray">{moneyFormatter.format(pBdown.downPayment)} </div>
            </div>
            <div className="totals-item bold">
              <div> Monthly Payment</div>
              <div className="light-gray">{moneyFormatter.format(pCycle.monthly)} </div>
            </div>
          </div>
          <div className="totals-column">
            <div className="totals-item">
              <div> Next Payment </div>
              <div className="dark-gray bold">{formatUnixDate(pCycle.firstPayment)} </div>
            </div>
            <div className="totals-item ">
              <div> Last Payment</div>
              <div className="light-gray bold">{formatUnixDate(pCycle.lastPayment)} </div>
            </div>
          </div>
        </div>

        <div className="additional-notes">
          <strong>Additional terms:</strong>
          <p>This is a field for the additional terms for this estimate.</p>
        </div>
        <div className="download-app">
          <p className="italic"> Download the Perfect B App</p>
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu9GF9ONvZnHXLa6Qt4VLxZkbmyvNT0NomZg&usqp=CAU"
              alt="qr-code"
            ></img>
          </div>
        </div>
      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    // console.log(this.props.example);
    // console.log("Playaa",this.props.checkoutItems)
    // console.log("cycles", this.props.paycycle)


    return (
      <div className="big-container">
        <div className="print-container">
          <ComponentToPrint ref={(el) => (this.componentRef = el)} 
            example={this.props.example}
            checkoutItems={this.props.checkoutItems}
            paybreakdown = {this.props.paybreakdown}
            paycycle = {this.props.paycycle}
            customer = {this.props.customer}
          />
        </div>
        <div className="print-btn">
          <ReactToPrint
            trigger={() => <Button theme="success">Print this out!</Button>}
            content={() => this.componentRef}
          />
        </div>
      </div>
    );
  }
}

export default Example;
