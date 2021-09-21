import React, { useEffect, useState } from "react";
import InsertItem from "../NewItemProgram/InsertItem";
import ProgramBuilder from "../NewItemProgram/ProgramBuilder";
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
            {(!itemProgram )&&
            <>
            <ProgramBuilder listItems={listItems}/>
            </>}
        </>
    )
};

export default AdminNav;