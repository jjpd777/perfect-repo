import React from "react";
import ReactToPrint from "react-to-print";
import perfectIcon from "../../../perf-b-icon.png";
import {moneyFormatter, inverseMoney} from "../../../Utils/MoneyFormat";
import {currentFullDate, currentUnixDate,formatUnixDate} from "../../../Utils/DateTimeUtils";
import {computeBalanceTotal} from "../UtilsEstimate";
import "./PrintEstimate.scss";
import { Container, Row, Col, Button } from "shards-react";
import CustomerSearch from "../../CustomerSearch/CustomerSearch";



class ComponentToPrint extends React.Component {
  render() {
    const pItems = this.props.checkoutItems;
    console.log(pItems, "This are the items")
    const pBdown = this.props.paybreakdown;
    const pCycle = this.props.paycycle["0"];
    const displayK = Object.keys(this.props.paycycle);
    const cycles = displayK.map(k=> this.props.paycycle[k])
    // const terms = pCycle.financeTerms;
    const cust = this.props.customer;
    console.log(this.props.paycycle, "inside print");
    const returnSubTotal = (x)=>{
      const [dPay, remaining, locTot] = computeBalanceTotal(x);
      return moneyFormatter.format(locTot);
    }
  
    const validUntil =Number(currentUnixDate())+ 86400*7;
    const returnDisplayDisc = (x)=>{
          const discOb = x.discObject 
        return discOb.discountType ==="percent" ? "%"+discOb.discountPercent : "$"+discOb.discountAmount
    };

    const discFlag = !!pItems.find(x=> inverseMoney(x.discObject.discountAmount)!=="0" || inverseMoney(x.discObject.discountPercent)!=="0");
    const termsFlag = !!pItems.find(x=> x.financeTerms !==0);

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
              <div> Patient Name </div> <div>{cust.customerName +" "+ cust.customerLast}</div>
            </div>
            <div className="customer-details-item">
              <div> Effective Date </div> <div>{currentFullDate().split("&")[1]}</div>
            </div>
            <div className="customer-details-item">
              <div> Valid Until </div> <div>{formatUnixDate(validUntil)}</div>
            </div>
            <div className="customer-details-item">
              <div className="italic"> Number </div> <div>{this.props.perfID}</div>
            </div>
          </div>
        </div>
        <h1 className="program-title">{cust.customerName}'s Estimate</h1>
        <div className="recommendations">
          <p>
            The following recommendations are created by Perfect B in order to
            achieve patient's desired goals in the most efficient manner. All
            recommendations are made considering the best technology available
            in the market and following local, state and federal health
            regulations.
          </p>
        </div>
        <div className="center-table">
          <div className="sub-table">
            <Row className="sub-table-row">
              <Col className="item-name">
                <h4>Treatments/Products</h4>
              </Col>
              <Col>
                <h4>Price/Session</h4>
              </Col>
              <Col>
                <h4>Quanity</h4>
              </Col>
            
              {termsFlag && <Col>
                <h4>Terms</h4>
              </Col>}
              {discFlag && <Col>
                <h4>Sub Total</h4>
              </Col>}
              {discFlag && <Col>
                <h4>Discount</h4>
              </Col>}
   
              <Col>
                <h4>Total</h4>
              </Col>
            </Row>
            {pItems.map(
              (x) =>
                  <Row className="sub-table-row">
                    <Col className="item-name">
                      <h5>{x.itemName}</h5>
                    </Col>
                    <Col>
                      <h5>{moneyFormatter.format(x.itemPriceUnit)}</h5>
                    </Col>
                    <Col>
                      <h5>{x.itemNumSess}</h5>
                    </Col>
                    {termsFlag && <Col>
                      <h5>{x.financeTerms}</h5>
                    </Col>}
                    
                    {discFlag &&<Col>
                      <h5>{(moneyFormatter.format(Number(x.itemPriceUnit* x.itemNumSess)))}</h5>
                    </Col>}
                    {discFlag &&<Col>
                      <h5>{returnDisplayDisc(x)}</h5>
                    </Col>}
                    
                     <Col>
                      <h5>{returnSubTotal(x)}</h5>
                    </Col>
                  </Row>
            )}
          </div>
          
       
        </div>
        <div className="totals">
          <div className="totals-column">
            <div className="totals-item bold">
              <div> Pay Today </div>
              <div className="dark-gray">{moneyFormatter.format(pBdown.downPayment)} </div>
            </div>
            <div className="totals-item bold">
              <div> Finance Interests</div>
              <div className="light-gray">{"0%"} </div>
            </div>
          </div>
          {cycles.map((cycle,i)=> String(cycle.monthly) !=="0" &&
          <div className="totals-column">
          <div className="totals-item">
              <div> Cycle {i+1} </div>
              <div className="light-gray bold">{moneyFormatter.format(cycle.monthly)} </div>
            </div>
            <div className="totals-item">
              <div> First Payment </div>
              <div className="dark-gray bold">{formatUnixDate(cycle.firstPayment)} </div>
            </div>
            <div className="totals-item ">
              <div> Last Payment</div>
              <div className="light-gray bold">{formatUnixDate(cycle.lastPayment)} </div>
            </div>
          </div>)}
        </div>
        

        <div className="additional-notes">
          <strong>Additional terms:</strong>
          <p>{this.props.remarks}</p>
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
        { this.props.alreadyInserted && <div className="print-btn">
          <ReactToPrint
            trigger={() => <Button className="finish-btn" >Print this out!</Button>}
            content={() => this.componentRef}
          />
        </div>}
      </div>
    );
  }
}

export default Example;
