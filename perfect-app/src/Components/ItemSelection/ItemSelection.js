import React, { useEffect, useState } from "react";

import "../Design.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import {compare} from "../../Utils/Sorting";

import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter, Badge
} from "shards-react";


function ItemSelection({ listItems, staff, fnItems }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("LHR");
    const [rCategories, setReadCateg] = useState([]);
    const [editItems, setEditItems] = useState([]);
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        var tempCategories = [];
        var tmpEditItems = [];
        listItems.map(x => {
            if (!(tempCategories.includes(x.itemCategory)) && (x.itemType === itemType)) {
                tempCategories.push(x.itemCategory);
            }
            if (x.itemCategory === itemCategory && x.itemType === itemType) {
                tmpEditItems.push(x);
            }
        });
        if(staff) fnItems(tmpEditItems);
        setReadCateg(tempCategories); setEditItems(tmpEditItems.sort(compare));

    }, [listItems,itemType, itemCategory]);

    const insertOpenItem = ()=>{
        var unixKeyID = String(Date.now());
        console.log("unique key examined", unixKeyID)
        fnItems(prevState => ([...prevState, ...[
            {
                itemId: unixKeyID, itemName: "",
                itemNumSess: "1", itemType: itemType,
                itemCategory: "special", itemPriceUnit: "0",
                financeTerms: 0, currentToggle: false,
                discObject:{
                    discountType: 'percent',
                    discountPercent: 0,
                    discountAmount: 0,
                }
            }
        ]]))
    }
    
    useEffect(()=>{
        if(!listItems.length) return;
        if(!(listItems.find(x=> x.itemType===itemType))){
            setItemCategory("");
        }else{
        setItemCategory(listItems.find(x=> x.itemType===itemType).itemCategory);}
    },[itemType]);


    const updateItemsFunction = (x)=>{
        if(staff) return;
        var unixKeyID = String(Date.now());

        fnItems(prevState => ([...prevState, ...[
                {
                    itemId: unixKeyID, itemName: x.itemName,
                    itemNumSess: x.itemNumSess, itemType: x.itemType,
                    itemCategory: x.itemCategory, itemPriceUnit: x.itemPriceUnit,
                    financeTerms: 0, currentToggle: false,
                    discObject:{
                        discountType: 'percent',
                        discountPercent: 0,
                        discountAmount: 0,
                    }
                }
        ]]))
    }

    return(
        <div className="item-selection-div">
            <div className="select-type-category">
            <div className="select-type-radio">
                <FormRadio
                    inline
                    className="radio-text"
                    checked={itemType === "treatment"}
                    onChange={() => {
                        setItemType("treatment");
                    }}
                >
                    <h3>treatment</h3>
                </FormRadio>
                <FormRadio
                    inline
                    className="radio-text"
                    checked={itemType === "product"}
                    onChange={() => {
                        setItemType("product");
                    }}
                >
                    <h3>product</h3>
                </FormRadio>
                {staff &&
                 <FormRadio
                 inline
                 className="radio-text"
                 checked={itemType === "staff"}
                 onChange={() => {
                     setItemType("staff");
                 }}
             >
                 <h3>staff</h3>
             </FormRadio>
                }
                </div>
                <div className="category-dropdown">
                    <Dropdown open={toggle} toggle={() => setToggle(!toggle)}>
                        <DropdownToggle split className="dd-button" >{itemCategory}  </DropdownToggle>
                        <DropdownMenu >
                            {rCategories.map(x =>
                                <DropdownItem
                                    onClick={() => { setItemCategory(x) }}
                                >{x}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="category-dropdown">
                {!staff &&<Button 
                onClick={()=>{insertOpenItem(); console.log("clicked")}}
                className="open-item-button">
                    Open Item
                </Button>}
               </div>
                </div>
                {!staff && <div className="select-dropdown-box">
                    {editItems.map(x => <Button className="item-select-btn"
                        onClick={() => { updateItemsFunction(x)}}
                    >{x.itemName}</Button>)}
                    <br></br>
                    <br></br>
                </div>}
        </div>
    )
}

export default ItemSelection;