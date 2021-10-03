import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../Design.scss";
import {moneyFormatter} from "../../Utils/MoneyFormat";
import {
    FormInput, Button, FormRadio, Container, Row, Col,
    Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
} from "shards-react";

function EstimateItems({ props, fn }) {
    const terms = [0, 1, 2, 3, 6, 9, 12];

    const lookForSessUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemNumSess: val } : prevX)));
    };
    const lookForPriceUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemPriceUnit: val } : prevX)));
    };
    const lookForTermsUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, financeTerms: val } : prevX)));
    };

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
                             <Col>
                                <b>Terms</b>
                             </Col>
                             <Col>
                             <b> Price/Session</b>
                             </Col>
                             <Col>
                             <b> Units</b>
                             </Col>
                             <Col>
                             <b> Discount</b>
                             </Col>
                             <Col>
                             <b>cancel</b>
                             </Col>
                            </Row>
                {props.map((x)=>
                        <div className="estimate-row">
                        <Row >
                            <Col className="estimate-col-name">{x.itemName}</Col>
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
                            <Col className="col-name" >
                                <FormInput className="units-edit" value={moneyFormatter.format(x.itemPriceUnit)}
                                onChange={(e) => { lookForPriceUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name"><FormInput className="units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForSessUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name" ><FormInput className="units-edit" value={x.discount}
                                onChange={(e) => { lookForDiscountUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name"><h4 onClick={() => { removeItem(x) }}>
                                X</h4>
                            </Col>
                        </Row>
                        </div>
                )}
            </Container>
        </div>
    )
};

export default EstimateItems;