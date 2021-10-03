import React, { useEffect, useState } from "react";
import { Form, FormInput, FormGroup, 
     Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter } from "shards-react";
import {moneyFormatter} from "../../Utils/MoneyFormat";

import "../Design.scss";


function PopUpAdmin({ editItem, fnModal, editModal }) {
    const initialState = {
        itemType: '',
        itemCategory: '',
        itemName: '',
        itemPriceUnit: '',
        itemNumSess: '',
    }
    const [editVariables, setEditVariables] = useState(initialState);
    const inverseMoney = (x)=>{
        return x.split("$").join("").split(",").join("");
    }
    const setMoneyFormat = (v)=>{
        const val = inverseMoney(v);
        const valFix = moneyFormatter.format(val).includes("NaN") ? "0" : val;
        setEditVariables({ ...editVariables, itemPriceUnit: valFix});
    }

    useEffect(()=>{
        setEditVariables(editItem);
    },[editItem]);
    return (
        <div className="admin-modal-box">
            <Modal className="admin-modal-card" size="lg" open={editModal} toggle={() => fnModal(!editModal)}>
                <ModalHeader>Item to edit</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                        <h3>{editVariables.itemName}</h3>
                        <br></br>
                            <FormInput className="popup-text" placeholder={editVariables.itemName} value={editVariables.itemName}
                        onChange={(e) => { setEditVariables({ ...editVariables, itemName: e.target.value }) }} />
                        </FormGroup>
                    </Form>
                    <Form>
                        <FormGroup>
                            <FormInput className="popup-text" placeholder="Username" value={moneyFormatter.format(editVariables.itemPriceUnit)}
                        onChange={(e) => { setMoneyFormat(e.target.value) }} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={()=>{fnModal(!editModal)}} theme="danger"> Cancel</Button>
                    <Button  theme="success"> Save</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
};

export default PopUpAdmin;