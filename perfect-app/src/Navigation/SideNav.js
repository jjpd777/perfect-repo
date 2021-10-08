import React from 'react';
import './SideNav.scss';
import logo from '../images/perfectb.png';

import {
    Button,
  } from "shards-react";
const SideNav = ({props,currentPage, fnReview}) => {
    console.log(props)
    props.map(x=>console.log(x))
return (
<div className="nav-bar">
    <img className="logo" src={logo}/>
    <div className="nav-items">
   {props.map(x=><Button className="nav-btn" onClick={()=>{
  fnReview({});
  currentPage(x)}}>{x}</Button>)}
   </div>
</div>
 );
};
export default SideNav;