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

function ProgramItems({ props, fn }) {

    const lookForUpdate = (x, val) => {
        fn(prevState => (
            prevState.map(prevX =>
                prevX.itemId === x.itemId ? { ...prevX, itemNumSess: val } : prevX)));
    };
    const removeItem = (x) => {
        fn(prevState => (prevState.filter(c => c.itemId !== x.itemId)));
    }
    return (
        <>
            <Container>
                {props.map(x =>
                    <div className="program-item-box">
                        <Row>
                            <Col /><div className="program-item-text">{x.itemName}</div>
                            <Col /><FormInput className="item-units-edit" value={x.itemNumSess}
                                onChange={(e) => { lookForUpdate(x, e.target.value) }} />
                            <Col /><h4 onClick={() => { removeItem(x) }}>X</h4>
                        </Row>
                    </div>
                )}
            </Container>
        </>
    )
};

export default ProgramItems;