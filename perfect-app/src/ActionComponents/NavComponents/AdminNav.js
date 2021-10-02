import React, { useEffect, useState } from "react";
import InsertItem from "./InsertItem";
import NewProgramBuilder from "./NewProgramBuilder";
import {
    FormInput, Button
  } from "shards-react";

function AdminNav({listItems}){
    const [itemProgram, setItemProgram] = useState(true);
    return(
        <>
        <div>
            <Button onClick={()=>{setItemProgram(!itemProgram)}}>
                {itemProgram ? "New Item" : "New Program"}
            </Button>
        </div>
        {(itemProgram) &&
            <>
              <InsertItem listItems = {listItems}/>
            </>}
        </>
    )
};

export default AdminNav;