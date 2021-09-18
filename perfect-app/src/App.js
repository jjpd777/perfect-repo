import logo from './logo.svg';
import './App.scss';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import SideNav from "./Navigation/SideNav";
import Login from "./Navigation/Login";
import Register from "./Navigation/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout} from "./firebase";


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
  console.log("user console",user)
  const userIsLogged = !!user ;
  const sideBarElements = ["Estimate", "Record", "Admin", "Staff"];
  const [dd, setDD] = useState(false);

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
          </div>
  
          <div className="current-action-box">
          <Router>
              <Switch>

              <Route exact path="/register" component={Login} /> <Button onClick={logout} >LOGOUT BTN</Button>

              </Switch>
        </Router>

                <p>{current}</p>
                <p>another action</p>
          </div>
        )}
        </div>
        )}
      </div>
      

    </div>
  );
}

export default App;
