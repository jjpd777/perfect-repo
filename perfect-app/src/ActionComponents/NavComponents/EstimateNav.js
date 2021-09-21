import React, { useEffect, useState } from "react";
import NewEstimate from "../NewEstimate/NewEstimate";
import {
    FormInput, Button
  } from "shards-react";

function EstimateNav({listItems}){
    return(
        <>
            <NewEstimate listItems={listItems}/>
        </>
    )
};

export default EstimateNav;