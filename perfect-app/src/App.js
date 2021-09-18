import logo from './logo.svg';
import './App.scss';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import SideNav from "./Navigation/SideNav";
import Login from "./Navigation/Login";
import Register from "./Navigation/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import {currentFullDate} from "./Utils/DateTimeUtils"
import { auth, logout} from "./firebase";
import InsertItem from "./ActionComponents/InsertItem";


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

function App() {
  const [user, loading, error]=useAuthState(auth);
  const userIsLogged = !!user ;
  const sideBarElements = ["Estimate", "Record", "Admin", "Staff"];
  const [dd, setDD] = useState(false);

  useEffect(()=>{
    if(!user)console.log("not yet")
    else console.log(Object.keys(user))
  },[user])
  const [current, setCurrent] = useState(sideBarElements[0]); 
  return (
    <div className="App">
      <div className="main-box">
        {(!userIsLogged) ?(
          <div className="login-redirect">
        <Router>
              <Switch>
                <Route exact path="/" component={Login}/>

                <Route exact path="/register" component={Register} />

              </Switch>
        </Router>
          </div>  
        ):(
          <div className="content-box">
          <div className="nav-bar">
            <SideNav props={sideBarElements} currentPage={setCurrent}> </SideNav>
            <div>
              <div className="plain-text">
            <h3>{user.email}</h3>
            <h3>{currentFullDate().split('&').join(' ')}</h3>
              </div>
            <Router>
              <Switch>

              <Route exact path="/register" component={Login} /> <Button className="logout-btn" onClick={logout} >LOGOUT</Button>

              </Switch>
          </Router>
            </div>
          </div>
          
          <div className="current-action-box">
            {current==="Estimate" &&
            <>
              <InsertItem/>
            </>}
          </div>
        </div>
        )}
      </div>
      

    </div>
  );
}

export default App;
