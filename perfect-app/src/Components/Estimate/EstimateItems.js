import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../Design.scss";
import {moneyFormatter, inverseMoney} from "../../Utils/MoneyFormat";
import {
    FormInput, Button, FormRadio, Container, Row, Col,
    Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
} from "shards-react";

function EstimateItems({ props, fn }) {
    const terms = [0, 1, 2, 3, 6, 9, 12];

    const estIt = !!props ? props : [];
    


    const lookForNameUpdate = (x, val) =>{
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemName: val } : prevX)));
    }

    const lookForSessUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemNumSess: val } : prevX)));
    };
    const lookForPriceUpdate = (x, v) => {
        const val = inverseMoney(v);

        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemPriceUnit: val } : prevX)));
    };
    const lookForTermsUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, financeTerms: val } : prevX)));
    };

    const updateDiscount = (val, percent)=>{
        const perc = {
            discountType: 'percent',
            discountPercent: val,
            discountAmount: 0,
         };

        const dollar = {
            discountType: 'amount',
            discountPercent: 0,
            discountAmount: inverseMoney(val),
        };
        return percent ? perc : dollar;
       
    };


    const lookDynamicDiscount = (x, val, percentFlag)=>{
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, discObject: updateDiscount(val, percentFlag) } : prevX)));
    }

    const lookForDiscountUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, discount: val } : prevX)));
    }

    const lookForToggle = (x) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, currentToggle: !prevX.currentToggle } : prevX)));
    };

    const removeItem = (x) => {
        fn(prevState => (prevState.filter(c => c.itemId !== x.itemId)));
    };

    return (
        <div className="estimate-items-box">
            <Container className="estimate-container" >
            <Row className="estimate-row">
                             <Col className="estimate-col-name">
                             <b>Treatment</b>
                             </Col>
                             <Col className="estimate-col">
                                <b>Terms</b>
                             </Col >
                             <Col className="estimate-col">
                             <b> Price/Session</b>
                             </Col>
                             <Col className="estimate-col">
                             <b> Units</b>
                             </Col>
                             <Col className="estimate-col">
                             <b>% Disc. </b>
                             </Col>
                             <Col className="estimate-col">
                             <b>$ Disc. </b>
                             </Col>
                             <Col className="estimate-col">
                              <b></b>
                             </Col>
                            </Row>
                {estIt.map((x)=>
                        <div className="estimate-row">
                        <Row >
                            { x.itemCategory==="special"? (
                            <Col className="estimate-col-name" >
                                <FormInput className="units-edit-open" value={x.itemName}
                            onChange={(e) => { lookForNameUpdate(x, e.target.value) }} />
                            </Col>
                            ):(<Col className="estimate-col-name">{x.itemName}</Col>)
                            
                            }
                            <Col className="col-name">
                                <div className="dd-option">
                                    <Dropdown open={x.currentToggle} toggle={() => lookForToggle(x)}>
                                        <DropdownToggle split className="dd-estimate-btn" >{x.financeTerms }   </DropdownToggle>
                                        <DropdownMenu >
                                            {terms.map(t =>
                                                <DropdownItem
                                                    onClick={() => { lookForTermsUpdate(x, t) }}
                                                >{t} {" terms"}</DropdownItem>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </Col>
                            <Col className="col-name-money" >
                                <FormInput className="units-edit" plainText={true} value={moneyFormatter.format(x.itemPriceUnit)}
                                onChange={(e) => { lookForPriceUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name"><FormInput className="units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForSessUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name" ><FormInput className="units-edit" value={x.discObject.discountPercent}
                                onChange={(e) => { lookDynamicDiscount(x, e.target.value, true) }} />
                            </Col>
                            <Col className="col-name" ><FormInput className="units-edit-mon" value={moneyFormatter.format(x.discObject.discountAmount)}
                                onChange={(e) => { lookDynamicDiscount(x, e.target.value, false) }} />
                            </Col>
                            <Col className="col-name"><h4 onClick={() => { removeItem(x) }}>
                            ✖️</h4>
                            </Col>
                        </Row>
                        </div>
                )}
            </Container>
        </div>
    )
};

export default EstimateItems;