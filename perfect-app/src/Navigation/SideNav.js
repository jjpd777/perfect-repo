import React from 'react';
import './SideNav.scss';
import logo from '../images/caremonda.png';

import {
    Button,
  } from "shards-react";
const SideNav = ({props,currentPage, fnReview,setToastVisible, backlogEstimates }) => {
    console.log(props)
    props.map(x=>console.log(x))
return (
<div className="nav-bar">
    <img className="logo" src={logo}/>
    <div className="nav-items">
   {props.map(x=>
   <Button className="nav-btn" onClick={()=>{
    fnReview({});
    if(x==="Pending"){
      setToastVisible(true);
    }else{
      currentPage(x)
    }
   }}>{x } {backlogEstimates.length>0 && x==="Pending" && `(${backlogEstimates.length})`} 
   </Button>)}
   </div>
</div>
 );
};
export default SideNav;