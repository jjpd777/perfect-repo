import React, { useEffect, useState } from "react";
import { moneyFormatter } from "../../Utils/MoneyFormat";

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

    const inverseMoney = (x)=>{
        const valFix = x.split("$").join("").split(",").join("");
        return moneyFormatter.format(valFix).includes("NaN") ? "0" : valFix;
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
                             <b> Price/Session</b>
                             </Col>
                             <Col className="estimate-col">
                             <b> Units</b>
                             </Col>
                             <Col className="estimate-col">
                              <b></b>
                             </Col>
                            </Row>
                {props.map((x,ix )=>
                        <>
                        <Row className="estimate-row">
                        <Col className="estimate-col-name">{x.itemName}</Col>
                            <Col className="col-name">
                                <FormInput className="units-edit-mon"  value={moneyFormatter.format(x.itemPriceUnit)}
                                onChange={(e) => { lookForPriceUpdate(x, e.target.value) }} />
                            </Col>
                            <Col className="col-name">
                                <FormInput type="number" className="units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForSessUpdate(x, e.target.value) }} />
                            </Col>
                            <Col><h4 onClick={() => { removeItem(x) }}>X</h4></Col>
                        </Row>
                        </>
                )}
            </Container>
        </div>
    )
};

export default ProgramItems;