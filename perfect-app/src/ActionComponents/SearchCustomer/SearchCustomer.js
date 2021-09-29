import React, { useEffect, useState } from "react";
import {
    FormInput, Button
} from "shards-react";
import {createCustomerFunction, readCustomersFunction} from "../../UtilsFirebase/Database";
import "./SearchUser.scss";

function SearchUser({fn, fnNewCustomer, optionsFlag}){
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("--");
    const [phone, setPhoneNum] = useState("--");
    const [searchInput, setSearchInput] = useState("");
    const [newCustomer, setNewCustomer] = useState(true);
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({});

    useEffect(() => {
        const ref = readCustomersFunction();
        const refVal = ref.on('value', function (snapshot) {
          const snap = snapshot.val();
          if (!snap) return;
          const respKeys = Object.keys(snap);
          const items = respKeys.map((k) => snap[k]);
          setFetchedUsers(items);
        });
        return () => ref.off('value', refVal)
      }, []);

    var searched = searchInput === "" ?[]:fetchedUsers.filter(u=>{
        return u.customerName.toLowerCase().includes(searchInput.toLocaleLowerCase());
    });

    useEffect(()=>{
        fnNewCustomer(newCustomer)
        if(newCustomer){
            fn({customerName:user, customerEmail:email, customerPhone: phone})
        }else{
            fn(currentCustomer);
        };
        if(!optionsFlag) fn(currentCustomer);
    },[newCustomer,user,email,phone, currentCustomer])



    return(
    <>
    <div className="search-user-box">
       {( newCustomer && optionsFlag )? (<div className="search-user-2">
           <h3>Name *</h3>
            <FormInput className="search-user-input"
                onChange={(e)=>setUser(e.target.value)}
                value={user}
            />
                      <h3>Phone *</h3>
            <FormInput className="search-user-input"
                 onChange={(e)=>setPhoneNum(e.target.value)}
                 value={phone}
            />
            <h3>Email</h3>
            <FormInput className="search-user-input" 
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
            />
             
                    <Button className="switch-user-btn" onClick={()=>{setNewCustomer(!newCustomer)}}>{newCustomer ? "Find user" : "New user"}</Button>
        </div>)
        :(<>
        <div className="search-user-2">
            <FormInput className="search-user-db" 
                value={searchInput}
                onChange={(c)=>{
                    setSearchInput(c.target.value);
                }} />

        <div className="current-customer-box">
            <div className="current-customer-input">{currentCustomer.customerName}</div>
            <div className="current-customer-input">{currentCustomer.customerEmail}</div>
            <div className="current-customer-input">{currentCustomer.customerPhone}</div>
            </div>
                {optionsFlag && <Button className="switch-user-btn" onClick={()=>{setNewCustomer(!newCustomer)}}>{newCustomer ? "Find user" : "New user"}</Button>}
        </div>
        
        <div className="searched-options">
            {searched.map((c)=><>
            <Button className="customer-options" onClick={()=>{setCurrentCustomer(c)}}>{c.customerName}</Button>
            </>)}
            </div>
            </>)}
    </div>
    </>)
};

export default SearchUser;