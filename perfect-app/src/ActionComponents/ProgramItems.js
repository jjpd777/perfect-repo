import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../Utils/MoneyFormat";
import "./InsertItem.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { currentFullDate } from "../Utils/DateTimeUtils";
import { createItemFunction, readItemsFunction } from "../UtilsFirebase/Database";
import {
  FormInput, Button, FormRadio, Container, Row, Col,
  Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from "shards-react";

function ProgramItems({props,fn}){
    
    const lookForUpdate = (x,val)=>{
        fn(prevState=>(
            prevState.map(prevX => 
                prevX.itemId===x.itemId ? {...prevX, itemNumSess: val}: prevX)))
    }
    return(
        <>
        {props.map(x=>
        <div>
            <h4>{x.itemName}</h4>
            <FormInput value={x.itemNumSess}
                onChange={(e)=>{lookForUpdate(x, e.target.value)}}
            />
        </div>)}
        <Button onClick={()=>fn([])}>Yes</Button>
        </>
    )
};

export default ProgramItems;