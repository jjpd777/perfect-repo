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
import { auth, logout} from "./UtilsFirebase/Authentication";
import InsertItem from "./ActionComponents/InsertItem";
import { createItemFunction, readItemsFunction } from "./UtilsFirebase/Database";


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
  const sideBarElements = ["Estimate", "Program", "Admin", "Staff"];
  const [fetchedItems, setFetchedItems] = useState([]);
  const [current, setCurrent] = useState(sideBarElements[0]); 


  useEffect(()=>{
    if(!user)console.log("not yet")
    else console.log(Object.keys(user))
  },[user])
  useEffect(() => {
    const ref = readItemsFunction();
    const refVal = ref.on('value', function (snapshot) {
      const snap = snapshot.val();
      if (!snap) return;
      const respKeys = Object.keys(snap);
      const items = respKeys.map((k) => snap[k]);
      setFetchedItems(items);
    });
    return () => ref.off('value', refVal)
  }, []);
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
              <h3>Listooo</h3>
            </>}
            {current==="Admin" &&
            <>
              <InsertItem listItems = {fetchedItems}/>
            </>}
            {current==="Program" &&
            <>
            </>}
          </div>
        </div>
        )}
      </div>
      

    </div>
  );
}

export default App;
