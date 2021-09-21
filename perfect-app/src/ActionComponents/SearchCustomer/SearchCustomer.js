import React, { useEffect, useState } from "react";
import {
    FormInput, Button
} from "shards-react";
import {createCustomerFunction} from "../../UtilsFirebase/Database";
import "./SearchUser.scss";

function SearchUser({props}){
    const [user, setUser] = useState("");
    const [userExists, setUserExists] = useState(false);
    return(
    <>
    <div className="search-user-box">
        <div className="search-user-1">
            <FormInput className="search-user-input"
                onChange={(e)=>setUser(e.target.value)}
                value={user}
            />
            <FormInput className="search-user-input" />
            <FormInput className="search-user-input"/>
            <Button className="save-user-btn" onClick={()=>{createCustomerFunction({usr:user})}}> Save</Button>
        </div>
        <div className="search-user-2">
            <FormInput className="search-user-db" />
            <Button className="save-user-btn"> Save</Button>
        </div>
    </div>
    </>)
};

export default SearchUser;