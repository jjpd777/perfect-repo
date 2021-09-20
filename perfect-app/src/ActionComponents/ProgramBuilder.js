import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../Utils/MoneyFormat";
import ProgramItems from "../ActionComponents/ProgramItems";
import "./InsertItem.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../Utils/DateTimeUtils";
import { createItemFunction, readItemsFunction } from "../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from "shards-react";
import { program } from "@babel/types";

function ProgramBuilder({ listItems }) {
  const [itemType, setItemType] = useState("treatment");
  const [itemCategory, setItemCategory] = useState("laser");
  const [itemName, setItemName] = useState("");
  const [itemPriceUnit, setPriceUnit] = useState(0);
  const [itemUnits, setItemUnits] = useState(1);
  const [rCategories, setReadCateg] = useState([]);
  const [editItems, setEditItems] = useState([]);
  const [programItems, setProgramItems] = useState([]);
  const [toggle, setToggle] = useState(false);

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

  console.log(programItems)

  return (
    <div className="action-content">
      <div className="input-radio-btn">
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
        <div className="item-name-btn">
          {editItems.map(x=><Button className="cat-btn"
            onClick={()=>{setProgramItems([
              ...programItems,
              ...[{itemId:x.id, itemName:x.itemName, itemNumSess: x.itemNumSess}]
            ])}}
          >{x.itemName}</Button>)}
        </div>
      </div>
          <ProgramItems props={programItems} fn={setProgramItems}/>
    </div>
  );
};

{/* <Button className="cat-btn" onClick={() => setItemCategory(x)}>
{x}
</Button> */}
export default ProgramBuilder;