import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../../Utils/MoneyFormat";
import ProgramItems from "./ProgramItems";
import "../NewItemProgram.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../../Utils/DateTimeUtils";
import { createProgramFunction } from "../../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from "shards-react";


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
  const [programName, setProgramName] = useState("")

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

  const programObjectBuilder =()=>{
    var rsp = {}; var total=0;
    programItems.map((item,ix)=>{
      rsp["item-"+String(ix+1)] = item;
      total+= Number(item.itemNumSess*item.itemPriceUnit);
    });
    return [rsp, total];
  }

  const insertProgram = () => {
    const [programObject, total] = programObjectBuilder();
    const item = {
      timestamp: currentFullDate(),
      itemDelted: false,
      createdBy: "x.createdBy",
      programName: programName,
      programItems: programObject,
      programTotal: total,
    };
    try {
      createProgramFunction(item).then(() => { resetInputs() })
    } catch (e) {
      console.log(e)
    }
  };

  console.log(programObjectBuilder())

  return (
    <div className="action-content">
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
            onClick={()=>{
              if(programItems.find(c=> x.itemName===c.itemName)){
                setProgramItems(programItems.filter(c=> c.itemName!==x.itemName));
              }else{
              setProgramItems([
              ...programItems,
              ...[{itemId:x.id, itemName:x.itemName, 
                  itemNumSess: x.itemNumSess, itemType: x.itemType,
                  itemCategory:x.itemCategory, itemPriceUnit:x.itemPriceUnit}]
            ])}
          }}
          >{x.itemName}</Button>)}
          <br></br>
          <br></br>
          <h3>Program name</h3>
          <FormInput
            className="program-name"
            value={programName}
            onChange={(e)=>{setProgramName(e.target.value)}}
          />
        </div>
      </div>
      <div>
          <ProgramItems props={programItems} fn={setProgramItems}/>
          </div>
          <div className="save-program-box">
            <Button className="cat-btn" onClick={()=>{insertProgram()}}>Save program</Button>
          </div>
    </div>
  );
};

{/* <Button className="cat-btn" onClick={() => setItemCategory(x)}>
{x}
</Button> */}
export default ProgramBuilder;