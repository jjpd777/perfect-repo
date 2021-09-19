import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import "./InsertItem.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import {currentFullDate} from "../Utils/DateTimeUtils";
import {createItemFunction, readItemsFunction} from "../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col
} from "shards-react";

function InsertItem() {
  const [itemType, setItemType] = useState("treatment");
  const [itemCategory, setItemCategory] = useState("laser");
  const [itemName, setItemName] = useState("");
  const [priceUnit, setPriceUnit] = useState(0);
  const [itemUnits , setItemUnits] = useState(1);
  const [rCategories, setReadCateg] = useState([]);
  const [rItems, setReadItems] = useState([]);
  const [editItems, setEditItems] = useState([]);
  const [editItem, setEditItem] = useState({});


  useEffect(()=>{
    const ref = readItemsFunction();
    const refVal = ref.on('value', function (snapshot) {
      const snap = snapshot.val();
      if(!snap) return;
      const respKeys = Object.keys(snap);
      const items = respKeys.map((k)=>snap[k]);
      setReadItems(items);
    });
    return () => ref.off('value', refVal)
  }, []);
  useEffect(()=>{
        var tmp = [];
        var tmpEditItems = [];
        rItems.map(x=>{
            if(!(tmp.includes(x.itemCategory)) && (itemType===x.itemType)){
                tmp.push(x.itemCategory);}
            if(x.itemCategory === itemCategory){
                tmpEditItems.push(x);
            }    
        })
        setReadCateg(tmp); setEditItems(tmpEditItems)
  },[rItems, itemType,itemCategory]);

  console.log(editItems)
  const resetInputs =()=>{ 
            setItemType("treatment");setItemCategory(""); setItemName("");
            setPriceUnit(0); setItemUnits(1)
   };

  const insertItem = ()=>{
      const item = {
        timestamp: currentFullDate(),
        itemDelted: false,
        createdBy: "x.createdBy",
        itemType: itemType,
        itemCategory: itemCategory,
        itemName: itemName,
        itemPriceUnit: itemUnits,
        itemNumSess: itemUnits,
    };
    try{
        createItemFunction(item).then(()=>{resetInputs()})
    }catch(e){
        console.log(e)
    }
  };


  
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
            <div>
                {rCategories.map(x=>
                <Button className="cat-btn" onClick={()=>setItemCategory(x)}>
                {x}
                </Button>)}
            </div>
          </div>
      <div className="insert-input-box">
        <FormInput
          type="text"
          className="insert-input"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
          placeholder="Product Category"
        />
        <FormInput
          type="text"
          className="insert-input"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Product Name"
        />
        <FormInput
          type="number"
          className="insert-input"
          value={priceUnit}
          onChange={(e) => setPriceUnit(e.target.value)}
          placeholder="Price / unit"
        />
        <FormInput
          type="number"
          className="insert-input"
          value={itemUnits}
          onChange={(e) => setItemUnits(e.target.value)}
          placeholder="Units"
        />
        <Button onClick={()=>{insertItem()}}>Save</Button>
      </div>
      <Container>
            {editItems.map(x=>
                <Row>
                    <Col>{x.itemName}</Col>
                    <Col>{x.itemPriceUnit}</Col>
                    <Col>{x.itemNumSess}</Col>
                </Row>
            )}
        </Container>
    </div>
  );
}
export default InsertItem;