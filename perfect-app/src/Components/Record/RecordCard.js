import React, { useEffect, useState } from "react";
import {
    Form, FormInput, FormGroup,
    Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody, ModalFooter, Badge
} from "shards-react";
import "../Design.scss";
import {moneyFormatter} from "../../Utils/MoneyFormat";



const RecordCard = ({estimate}) => {
    const [cardOpen, setCardOpen] = useState(false);

    const typeOfProgram = (x)=>{
        const isProgram = x.saveDetail ==="simple" ? "Financing" : "Program";
        return isProgram + " "+ x.estimateType;
    };
    const customerName = (x)=>{
        return x.customerObject.customerName + " " + x.customerObject.customerLast;
    };

    const paymentCycles = (x)=>{
        const payK = Object.keys(x.paymentsCycles);
        return payK.length;
    };

    const deconstructProducts = (x)=>{
        var returnList = [];
        for(const k in x){
            returnList.push(x[k])
        }
        return returnList;
    }
    return (

        <div className="record-card-box">
          <Card onClick={()=>setCardOpen(!cardOpen)}>
                <CardHeader>
                    <Badge theme={estimate.estimateType==="invoice" ? "danger" : "light"} 
                    className="invoice-or-est">
                        {typeOfProgram(estimate)}
                    </Badge>
                    <Badge className="perfect-id" theme="dark">
                        {estimate.perfectID}
                    </Badge>
                </CardHeader>
                <CardHeader>{customerName(estimate)}
                </CardHeader>
                <CardTitle>
                    Estimate date: 10/10/2021
                </CardTitle>
                <CardBody>
                    <CardSubtitle>
                        <Container>
                            <Row>
                                <Col>
                                <p>Total payment: {moneyFormatter.format(estimate.programTotal)}</p>
                                </Col>
                                <Col>
                                   Payment Cycles: {paymentCycles(estimate)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <p>Down payment: ${moneyFormatter.format(estimate.paymentBreakdown.downPayment)}</p>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Container>
                    </CardSubtitle>
                </CardBody>
                <CardBody>
                <Container>
                    <Row>
                        <Col>
                        Name
                        </Col>
                        <Col>
                        Units
                        </Col>
                    </Row>
                    {deconstructProducts(estimate.programItems).map((item,ix)=> ix<3 &&
                                 <Row>
                                     <Col>
                                     <h5>{item.itemName}</h5>
                                     </Col>
                                     <Col>
                                     <h5>{item.itemNumSess}</h5>
                                     </Col>
                                     <Col>
                                     <h5>{moneyFormatter.format(item.itemPriceUnit)}</h5>
                                     </Col>
                                 </Row>
                        )}
           
                </Container>
                </CardBody>
            </Card>
            {cardOpen && 
            <div className="record-card-options">
                <Button theme="warning" className="record-options-btn">
                    Invoice
                </Button>
                <Button theme="success" className="record-options-btn">
                    Print Again
                </Button>
                <Button theme="danger" className="record-options-btn">
                    Edit
                </Button>
            </div>}

        </div>
    )
};

export default RecordCard;
