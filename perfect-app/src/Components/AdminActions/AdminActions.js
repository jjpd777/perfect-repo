import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import "../Design.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import PopUpAdmin from "./PopUpAdmin";
import ItemSelection from "../ItemSelection/ItemSelection";
import { createItemFunction, readItemsFunction } from "../../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col,
  Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from "shards-react";

function AdminActions({listItems}) {
  const [itemType, setItemType] = useState("treatment");
  const [itemCategory, setItemCategory] = useState("laser");
  const [itemName, setItemName] = useState("");
  const [itemPriceUnit, setPriceUnit] = useState(0);
  const [itemUnits, setItemUnits] = useState(1);
  const [rCategories, setReadCateg] = useState([]);
  const [editItems, setEditItems] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemToModal, setItemToModal] = useState({});
  console.log("EDIT", editItems);

  
  

  const resetInputs = () => {
    ; setItemName("");
    setPriceUnit(0); setItemUnits(1)
  };

  const insertItem = () => {
    const item = {
      timestamp: currentFullDate(),
      itemDelted: false,
      createdBy: "x.createdBy",
      itemType: itemType,
      itemCategory: itemCategory,
      itemName: itemName,
      itemPriceUnit: itemPriceUnit,
      itemNumSess: itemUnits,
    };
    try {
      createItemFunction(item).then(() => { resetInputs() })
    } catch (e) {
      console.log(e)
    }
  };



  return (
    <div className="admin-content">
      <PopUpAdmin editItem={itemToModal} fnModal={setEditModal} editModal={editModal}/>
      <ItemSelection listItems={listItems} staff={true} fnItems={setEditItems} />
      <div className="admin-input-box">
        <Container>
          <Row>
            <Col className="admin-input-header">
              Category
            </Col>
            <Col className="admin-input-header">
              Name
            </Col>
            <Col className="admin-input-header">
              Price
            </Col>
            <Col></Col>
          </Row>
          <Row >
            <Col>
              <FormInput
                type="text"
                className="insert-input"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                placeholder="Product Category"
              />
            </Col>
            <Col>
              <FormInput
                type="text"
                className="insert-input"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Product Name"
              />
            </Col>
            <Col>
              <FormInput
                type="number"
                className="insert-input"
                value={itemPriceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="Price / unit"
              />
            </Col>
            <Col>
              <Button onClick={() => { insertItem() }}>Save</Button>
            </Col>
          </Row>
        </Container>
      </div>
        <div className="admin-display-table">
      <Container>
        <Row>
          <Col> <h3><b>Name</b></h3></Col>
          <Col> <h3><b>Price per unit</b></h3></Col>
        </Row>
        {editItems.map(x =>
          <Row className="admin-row" onClick={()=>{setItemToModal(x);setEditModal(!editModal)}}>
            <Col><h3>{x.itemName}</h3></Col>
            <Col><h3>{moneyFormatter.format(x.itemPriceUnit)}</h3></Col>
          </Row>
        )}
      </Container>
      </div>
    </div>
  );
}
export default AdminActions;