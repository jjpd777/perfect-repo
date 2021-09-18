import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import "./InsertItem.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import {
  FormInput, Button
} from "shards-react";

function InsertItem() {
  const [itemCategory, setItemCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemUnits , setItemUnits] = useState(1);

  
  return (
    <div className="action-content">
      <div className="insert-input-box">
        <FormInput
          type="text"
          className="insert-input"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
          placeholder="Product Category"
        />
        <FormInput
          type="text"
          className="insert-input"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Product Name"
        />
        <FormInput
          type="number"
          className="insert-input"
          value={itemUnits}
          onChange={(e) => setItemUnits(e.target.value)}
          placeholder="Units"
        />
        <Button>Save</Button>
      </div>
    </div>
  );
}
export default InsertItem;