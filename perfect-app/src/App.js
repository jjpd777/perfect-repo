import logo from './logo.svg';
import './App.scss';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import SideNav from "./Navigation/SideNav";
import Login from "./Navigation/Login";
import Register from "./Navigation/Register";
import { Drawer } from "antd";
import BacklogCard from './Components/Monday/BacklogCard';

import { useAuthState } from "react-firebase-hooks/auth";
import {currentFullDate} from "./Utils/DateTimeUtils"
import { auth, logout} from "./UtilsFirebase/Authentication";
import AdminActions from "./Components/AdminActions/AdminActions";
import Program from "./Components/Program/Program";
import StaffPrices from "./Components/StaffPrices";
import {readItemsFunction } from "./UtilsFirebase/Database";
import RecordEstimates from "./ActionComponents/RecortEstimates/RecordEstimates";
import Estimate from "./Components/Estimate/Estimate";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Record from "./Components/Record/Record";
import {isObjectEmpty} from "./Utils/ObjectVarious";
import WriteMonday from "./Components/Monday";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";
 import Dashboard from "./DebtCollection/Dashboard";

function App() {
  const [user, loading, error]=useAuthState(auth);
  const userIsLogged = !!user ;
  const sideBarElements = ["Basic", "Builder", "Record", "Admin", "Staff"];
  const [fetchedItems, setFetchedItems] = useState([]);
  const [current, setCurrent] = useState(sideBarElements[0]); 
  const [validCustomer, setValidCustomer] = useState({});
  const [reviewList, setReviewList] = useState({});
  // const rafael = user.email ==="rafael@perfectb.com";
  const [visible, setVisible] = useState(false);
  const [backlogEstimates, setBacklogEstimates] = useState([]);
  console.log(backlogEstimates, "These are the backlog estimates")

  const showDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

 

  console.log("Backlog record", backlogEstimates);
  useEffect(() => {
    const ref = readItemsFunction();
    const refVal = ref.on('value', function (snapshot) {
      const snap = snapshot.val();
      if (!snap) return;
      const respKeys = Object.keys(snap);
      const items = respKeys.map((k) => snap[k]);
      console.log(items)
      setFetchedItems(items);
    });
    return () => ref.off('value', refVal)
  }, []);

  return (
    <div className="App">
      <div className="main-box">
      {backlogEstimates.map( estimate =>{

         return <BacklogCard   invoiceMonday = {estimate} setBacklogEstimates={setBacklogEstimates}/>
        })}
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
            <SideNav props={sideBarElements} currentPage={setCurrent}
            fnReview={setReviewList}
            setToastVisible = {setVisible}
            backlogEstimates ={backlogEstimates}
            >  </SideNav>
            <br></br>
            <br></br>
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
          {/* <div className="item-selection-box">
            <CustomerSearch fnSetCustomer={setValidCustomer} record={false} />
            <ItemSelection listItems={fetchedItems} staff={false}/>
          </div> */}
          <div className="current-action-box">
          {current==="Basic" &&
            <>
              <Estimate 
                listItems={fetchedItems}
                reviewItems ={reviewList}
                fnReviewList={setReviewList}
                setBacklogEstimates = {setBacklogEstimates}

              />
            </>}
            {current==="Builder" &&
            <>
              <Program 
                listItems={fetchedItems}
                reviewItems = {reviewList}
                fnReviewList = {setReviewList}
                setBacklogEstimates = {setBacklogEstimates}
              />
            </>}
            {current==="Admin" &&
            <>
              <AdminActions listItems = {fetchedItems}/>
            </>}
            {current==="Staff" &&
            <>
            <StaffPrices listItems={fetchedItems}/>
            </>}
            {current==="Record" &&
            <>
              <Record fnCurrent={setCurrent} fnReviewList={setReviewList}/>
            </>}
         
            </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
