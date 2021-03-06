import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import { createItemFunction, readItemsFunction } from "../../UtilsFirebase/Database";
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
            <Container >
                {props.map((x,ix )=>
                        <>
                        {ix ===0 &&(
                            <Row className="estimate-row">
                             <Col>
                                Treatment
                             </Col>
                             <Col>
                                Terms
                             </Col>
                             <Col>
                                Price/Session
                             </Col>
                             <Col>
                                Discount
                             </Col>
                            </Row>
                        )}
                        <Row className="estimate-row">
                            <Col>{x.itemName}</Col>
                            <Col>
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
                            <Col /><h3>$</h3><FormInput className="item-units-edit" value={x.itemPriceUnit}
                                onChange={(e) => { lookForPriceUpdate(x, e.target.value) }} />
                            <Col /><FormInput className="item-units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForSessUpdate(x, e.target.value) }} />
                            <Col /><h3>% </h3><FormInput className="item-units-edit" value={x.discount}
                                onChange={(e) => { lookForDiscountUpdate(x, e.target.value) }} />
                            <Col /><h4 onClick={() => { removeItem(x) }}>X</h4>
                        </Row>
                        </>
                )}
            </Container>
        </div>
    )
};

export default EstimateItems;