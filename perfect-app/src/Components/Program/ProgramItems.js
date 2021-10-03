import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import { createItemFunction, readItemsFunction } from "../../UtilsFirebase/Database";
import {
    FormInput, Button, FormRadio, Container, Row, Col,
    Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
} from "shards-react";

function ProgramItems({ props, fn }) {
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
                             <Col/>

                             <Col className="item-units-edit"/>
                             <Col className="item-units-edit"/>
                             <Col className="item-units-edit"/> 
                             <Col className="item-units-edit"/> 
                            </Row>
                        )}
                        <Row className="estimate-row">
                            <Col /><div className="program-item-text">{x.itemName}</div>
                            <Col>
                            </Col>
                            <Col /><h3>$</h3><FormInput className="item-units-edit" value={x.itemPriceUnit}
                                onChange={(e) => { lookForPriceUpdate(x, e.target.value) }} />
                            <Col /><FormInput className="item-units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForSessUpdate(x, e.target.value) }} />
                            <Col /><h4 onClick={() => { removeItem(x) }}>X</h4>
                        </Row>
                        </>
                )}
            </Container>
        </div>
    )
};

export default ProgramItems;