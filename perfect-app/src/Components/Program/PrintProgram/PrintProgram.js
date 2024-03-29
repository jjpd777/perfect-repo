import React from "react";
import ReactToPrint from "react-to-print";
import perfectIcon from "../../../perf-b-icon.png";
import {moneyFormatter} from "../../../Utils/MoneyFormat";
import {currentFullDate, currentUnixDate,formatUnixDate} from "../../../Utils/DateTimeUtils";
import QR1 from "../../../images/reqr.jpeg";
import QR2 from "../../../images/qr2.jpeg";
import QR3 from "../../../images/qr3.jpeg";


import "./PrintProgram.scss";
import { Container, Row, Col, Button } from "shards-react";



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
            <strong> Perfect B Aesthetic Medicine</strong>
            <p>perfectb.com</p>
            <p>(786)502-2260</p>
            <p>IG: @perfectbmed</p>
          </div>
          <div className="customer-details">
            <div className="customer-details-item">
              <div> Patient</div> <div>{cust.customerName}{" "+cust.customerLast}</div>
            </div>
            <div className="customer-details-item">
              <div> Effective Date</div> <div>{currentFullDate().split("&")[1]}</div>
            </div>
            <div className="customer-details-item">
              <div> Valid Until</div> <div>{formatUnixDate(validUntil)}</div>
            </div>
            <div className="customer-details-item">
              <div className="italic"> Number </div> <div>{this.props.perfID}</div>
            </div>
          </div>
        </div>
        <h1 className="program-title">{cust.customerName}'s Treatment</h1>
        <div className="recommendations">
          <p>
          The following treatment is created by Perfect B to achieve patient's desired goals and improve conditions most efficiently.
         All treatments are performed using the best technology available in the market and following local, state, and federal health regulations.
          </p>
        </div>
        <div className="center-table-prog">
          <div className="sub-table-prog">
            <Row className="sub-table-row-prog">
              <Col className="item-name-prog">
                <h4>At Perfect B</h4>
              </Col>
              <Col>
                <h4>Quantity</h4>
              </Col>
            </Row>
            {pItems.map(
              (x) =>
                x.itemType === "treatment" && (
                  <Row className="sub-table-row-prog">
                    <Col className="item-name-prog">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                  </Row>
                )
            )}
          </div>
          <div className="sub-table-prog">
            <Row className="sub-table-row-prog">
              <Col className="item-name-prog">
                <h4>At Home</h4>
              </Col>
              <Col>
                <h4>Quantity</h4>
              </Col>
            </Row>
            {pItems.map(
              (x) =>
                x.itemType === "product" && (
                  <Row className="sub-table-row-prog">
                    <Col className="item-name-prog">
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
              <div> Down Payment</div>
              <div>
                <strong className="italic"> {moneyFormatter.format(pBdown.downPayment)} </strong>
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
              <div> Monthly Payments</div>
              <div className="dark-gray">{moneyFormatter.format(pCycle.monthly)} </div>
            </div>
            <div className="totals-item bold">
              <div> Terms</div>
              <div className="light-gray">{terms} </div>
            </div>
          </div>
          <div className="totals-column">
            <div className="totals-item">
              <div> Next Payment </div>
              <div className="light-gray bold">{formatUnixDate(pCycle.firstPayment)} </div>
            </div>
            <div className="totals-item ">
              <div> Last Payment</div>
              <div className="dark-gray bold">{formatUnixDate(pCycle.lastPayment)} </div>
            </div>
          </div>
        </div>

        <div className="additional-notes">
          <strong>Additional terms:</strong>
          <p>{this.props.remarks}</p>
        </div>
        <div className="download-app-left">
        <div>
            <img
              src={QR2}
              alt="qr-code"
            ></img>
          </div>
          <p className="italic"> Evaluate payment options</p>
        </div>
        <div className="download-app-center">
        <div>
            <img
              src={QR3}
              alt="qr-code"
            ></img>
          </div>
          <p className="italic"> Replenish your products</p>
       
        </div>
        <div className="download-app">
          <p className="italic"> Rewards Lottery</p>
          <div>
            <img
              src={QR1}
              alt="qr-code"
            ></img>
          </div>
        </div>
      </div>
    );
  }
}
//

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
            remarks = {this.props.remarks}
            perfID = {this.props.perfID}
          />
        </div>
        {this.props.alreadyInserted && 
        <div className="print-btn">
          <ReactToPrint
            trigger={() => <Button className="finish-btn" >Print</Button>}
            content={() => this.componentRef}
          />
        </div>}
      </div>
    );
  }
}

export default Example;
