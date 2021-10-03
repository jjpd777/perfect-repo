import React, { useEffect, useState } from "react";
import { Form, FormInput, FormGroup, 
     Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter } from "shards-react";



function PopUpEdit({ editItem, fnModal, editModal }) {
    const initialState = {
        itemType: '',
        itemCategory: '',
        itemName: '',
        itemPriceUnit: '',
        itemNumSess: '',
    }
    const [editVariables, setEditVariables] = useState(initialState);

    useEffect(()=>{
        setEditVariables(editItem);
    },[editItem]);
    return (
        <div className="modal-box">
            <Modal className="modal-card" size="lg" open={editModal} toggle={() => fnModal(!editModal)}>
                <ModalHeader>Header</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                        <h3>Username</h3>
                            <FormInput id="#username" placeholder="Username" value={editVariables.itemName}
                        onChange={(e) => { setEditVariables({ ...editVariables, itemName: e.target.value }) }} />
                        </FormGroup>
                    </Form>
                    <Form>
                        <FormGroup>
                        <label htmlFor="#username">Username</label>
                            <FormInput id="#username" placeholder="Username" value={editVariables.itemPriceUnit}
                        onChange={(e) => { setEditVariables({ ...editVariables, itemPriceUnit: e.target.value }) }} />
                        </FormGroup>
                    </Form>
                    <Form>
                        <FormGroup>
                        <label htmlFor="#username">Username</label>
                            <FormInput id="#username" placeholder="Username" value={editVariables.itemNumSess}
                        onChange={(e) => { setEditVariables({ ...editVariables, itemNumSess: e.target.value }) }} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button theme="danger"> Cancel</Button>
                    <Button theme="success"> Save</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
};

export default PopUpEdit;