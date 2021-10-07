import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import PopUpEdit from "./PopUpEdit";
import { createItemFunction, readItemsFunction } from "../../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col,
  Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from "shards-react";

function InsertItem({listItems}) {
  const [itemType, setItemType] = useState("treatment");
  const [itemCategory, setItemCategory] = useState("LHR");
  const [itemName, setItemName] = useState("");
  const [itemPriceUnit, setPriceUnit] = useState(0);
  const [itemUnits, setItemUnits] = useState(1);
  const [rCategories, setReadCateg] = useState([]);
  const [editItems, setEditItems] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemToModal, setItemToModal] = useState({});


  
  useEffect(() => {
    var tmp = [];
    var tmpEditItems = [];
    listItems.map(x => {
      if (!(tmp.includes(x.itemCategory)) && (itemType === x.itemType)) {
        tmp.push(x.itemCategory);
      }
      if (x.itemCategory === itemCategory && x.itemType === itemType) {
        tmpEditItems.push(x);
      }
    })
    setReadCateg(tmp); setEditItems(tmpEditItems);
  }, [listItems, itemType, itemCategory]);

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
    <div className="action-content">
      <PopUpEdit editItem={itemToModal} fnModal={setEditModal} editModal={editModal}/>
      <Button onClick={()=>{setEditModal(!editModal)}}> here</Button>
      <div className="input-radio-box">
        <FormRadio
          inline
          className="radio-choices"
          checked={itemType === "treatment"}
          onChange={() => {
            setItemType("treatment");
          }}
        >
          <h3>treatment</h3>
        </FormRadio>
        <FormRadio
          inline
          className="radio-choices"
          checked={itemType === "product"}
          onChange={() => {
            setItemType("product");
          }}
        >
          <h3>product</h3>
        </FormRadio>
        <FormRadio
          inline
          className="radio-choices"
          checked={itemType === "staff"}
          onChange={() => {
            setItemType("staff");
          }}
        >
          <h3>staff</h3>
        </FormRadio>
        <div className="dd-option">
          <Dropdown open={toggle} toggle={()=>setToggle(!toggle)}>
            <DropdownToggle split className="dd-btn" >{itemCategory}  </DropdownToggle>
            <DropdownMenu >
              {rCategories.map(x =>
                <DropdownItem
                onClick={()=>{setItemCategory(x)}}
                >{x}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="insert-input-box">
        <Container>
          <Row>
            <Col>
              Category
            </Col>
            <Col /> Name
            <Col /> Price per unit
            <Col /> Units
            <Col />
            <Col />

          </Row>
          <Row>
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
              <FormInput
                type="number"
                className="insert-input"
                value={itemUnits}
                onChange={(e) => setItemUnits(e.target.value)}
                placeholder="Units"
              />
            </Col>
            <Col>
              <Button onClick={() => { insertItem() }}>Save</Button>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col> <b>Name</b></Col>
          <Col> <b>Price per unit</b></Col>
          <Col> <b>Units</b></Col>
        </Row>
        {editItems.map(x =>
          <Row onClick={()=>{setItemToModal(x);setEditModal(!editModal)}}>
            <Col>{x.itemName}</Col>
            <Col>{moneyFormatter.format(x.itemPriceUnit)}</Col>
            <Col>{x.itemNumSess}</Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
export default InsertItem;