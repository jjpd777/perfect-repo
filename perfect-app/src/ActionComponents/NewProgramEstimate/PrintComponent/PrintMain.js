import React from "react";
import ReactToPrint from "react-to-print";
import { formatUnixDate } from "../../../Utils/DateTimeUtils";
import { moneyFormatter } from "../../../Utils/MoneyFormat";
import perfectIcon from "../../../perf-b-icon.png";

import "./PrintProgram.scss";
import { Container, Row, Col } from "shards-react";

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

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="print-big-box">
        <div className="perfect-b-header">
          <img src={perfectIcon} />
          <div className="header-detail">
            <h3> Perfect B Med Spa</h3>
            <h5>perfectb.com</h5>
            <h5>(786)502-2260</h5>
            <h5>IG: @perfectbmedspa</h5>
          </div>
          <div className="customer-details">
            <h5>Client: Juan Jose</h5>
            <h5>Effective date: May 29, 2021</h5>
            <h5>Valid until: Jun 5, 2022</h5>
          </div>
        </div>
        <h1 className="program-title">Jaun's Program</h1>
        <div className="recommendations">
          <h3>
            The following recommendations are created by Perfect B in order to
            Achieve client's desired goals in the most efficient manner. All
            recommendations are made considering the best technology available
            in the market and following local, state and federal health
            regulations.
          </h3>
        </div>
        <div className="center-table">
          <Container className="sub-table">
            <Row>
              <Col className="item-name">
                <h4>Treatments</h4>
              </Col>
              <Col>
                <h4>Price/Session</h4>
              </Col>
              <Col>
                <h4>Quanity</h4>
              </Col>
              <Col>
                <h4>Discount</h4>
              </Col>
              <Col>
                <h4>Final Price</h4>
              </Col>
              <Col>
                <h4>Terms</h4>
              </Col>
            </Row>
            {programItems.map(
              (x) =>
                x.itemType === "treatment" && (
                  <Row>
                    <Col className="item-name">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemPriceUnit}</h5>
                    </Col>
                    <Col>
                      <h5>{x.discount}</h5>
                    </Col>
                    <Col>
                      <h5>{x.discount}</h5>
                    </Col>
                    <Col>
                      <h5>{x.financeTerms}</h5>
                    </Col>
                  </Row>
                )
            )}
          </Container>
          <Container className="sub-table">
            <Row>
              <Col className="item-name">
                <h4>Product</h4>
              </Col>
              <Col>
                <h4>Price/Session</h4>
              </Col>
              <Col>
                <h4>Quanity</h4>
              </Col>
              <Col>
                <h4>Discount</h4>
              </Col>
              <Col>
                <h4>Final Price</h4>
              </Col>
              <Col>
                <h4>Terms</h4>
              </Col>
            </Row>
            {programItems.map(
              (x) =>
                x.itemType === "product" && (
                  <Row>
                    <Col className="item-name">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemPriceUnit}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemPriceUnit}</h5>
                    </Col>
                    <Col>
                      <h5>{x.discount}</h5>
                    </Col>
                    <Col>
                      <h5>{x.financeTerms}</h5>
                    </Col>
                  </Row>
                )
            )}
          </Container>
        </div>
        <div className="cycles-container">
          <div className="cycles-box">
            <h4>Down payment</h4>
            <h5>
              Amount: {moneyFormatter.format(paymentBreakdown.downPayment)}
            </h5>
          </div>
          {cyclesList(paymentCycles).map((x, i) => (
            <div className="cycles-box">
              <h4>Cycle {i + 1}</h4>
              <h5>Monthly payment: {moneyFormatter.format(x.monthly)}</h5>
              <h5>First payment: {formatUnixDate(x.firstPayment)}</h5>
              <h5>Last payment: {formatUnixDate(x.firstPayment)}</h5>
            </div>
          ))}
        </div>
        <div className="additional-notes">
          <h4>Additional terms:</h4>
          <h3>This is a field for the additional terms for this estimate./</h3>
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
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
