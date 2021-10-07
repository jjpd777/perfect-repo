import React, { useEffect, useState } from "react";
import { Form, FormInput, FormGroup, 
     Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter } from "shards-react";
import {moneyFormatter, inverseMoney} from "../../Utils/MoneyFormat";
import {updateItemFunction, deleteItemFunction} from "../../UtilsFirebase/Database";

import "../Design.scss";


function PopUpAdmin({ editItem, fnModal, editModal, categ }) {
    console.log(categ, "categories")
    const [editVariables, setEditVariables] = useState({});
    const [categoryDrop, setCategoryDrop] = useState(false);
    
    const cat = categ ? categ :[];
    const setMoneyFormat = (v)=>{
        const val = inverseMoney(v);
        const valFix = moneyFormatter.format(val).includes("NaN") ? "0" : val;
        setEditVariables({ ...editVariables, itemPriceUnit: valFix});
    };

    useEffect(()=>{
        setEditVariables(editItem);
    },[editItem]);

    const updateItem = (x)=>{
        console.log(x, "UPDATED THINGY")
        return updateItemFunction(x, x.id).then(()=>{fnModal(!editModal)})
    };

    const deleteItem = (x)=>{
        deleteItemFunction(x, x.id).then(()=>{fnModal(!fnModal)})
    }

    return (
        <div className="admin-modal-box">
            <Modal className="admin-modal-card" size="lg" open={editModal} toggle={() => fnModal(!editModal)}>
                <ModalHeader>
                Edit Item
                <Button className="delete-btn"
                onClick={()=>{deleteItem(editVariables)}}
                >
                    Delete
                </Button>
                </ModalHeader>
                <ModalBody>
                    
                    <Form>
                        <FormGroup>
                        <h3>{editVariables.itemName}</h3>
                        <br></br>
                        <div className="popup-cat-dropdown">
                    <Dropdown open={categoryDrop} toggle={() => setCategoryDrop(!categoryDrop)}>
                        <DropdownToggle split className="popup-dd-button" >{editVariables.itemCategory}  </DropdownToggle>
                        <DropdownMenu className="popup-dd-list">
                            {cat.map(x =>
                                <DropdownItem 
                                    onClick={() => { setEditVariables({...editVariables, itemCategory:x}) }}
                                >{x}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                        <h5>Item name</h5>
                            <FormInput className="popup-text" placeholder={editVariables.itemName} value={editVariables.itemName}
                        onChange={(e) => { setEditVariables({ ...editVariables, itemName: e.target.value }) }} />
                        </FormGroup>
                    </Form>
                    
                    <Form>
                    <h5>Item price ($)</h5>
                        <FormGroup>
                            <FormInput className="popup-text" placeholder="Username" value={moneyFormatter.format(editVariables.itemPriceUnit)}
                        onChange={(e) => { setMoneyFormat(e.target.value) }} />
                        </FormGroup>
                    </Form>
                    <Form>
                        <h5>Item units</h5>
                        <FormGroup>
                            <FormInput className="popup-text" placeholder="units" value={editVariables.itemNumSess}
                        onChange={(e) => { setEditVariables({...editVariables,itemNumSess:e.target.value}) }} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={()=>{fnModal(!editModal)}} theme="danger"> Cancel</Button>
                    <Button  theme="success"
                        onClick={()=>{
                            updateItem(editVariables);
                        }} 
                    > Save</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
};

export default PopUpAdmin;