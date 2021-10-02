import React, { useEffect, useState } from "react";

import "../Design.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody,ModalFooter, Badge
} from "shards-react";


function ItemSelection({ listItems, staff }) {
    const [itemType, setItemType] = useState("treatment");
    const [itemCategory, setItemCategory] = useState("laser");
    const [rCategories, setReadCateg] = useState([]);
    const [editItems, setEditItems] = useState([]);
    const [programItems, setProgramItems] = useState([]);
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
        })
        setReadCateg(tempCategories); setEditItems(tmpEditItems);

    }, [listItems,itemType, itemCategory]);
    
    useEffect(()=>{
        if(!listItems.length) return;
        setItemCategory(listItems.find(x=> x.itemType===itemType).itemCategory);
    },[itemType]);

    console.log(programItems, "PROGRAM");

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
                </div>
                <div className="select-dropdown-box">
                    {editItems.map(x => <Button className="item-select-btn"
                        onClick={() => {
                            if (programItems.find(c => x.itemName === c.itemName)) {
                                setProgramItems(programItems.filter(c => c.itemName !== x.itemName));
                            } else {
                                setProgramItems([
                                    ...programItems,
                                    ...[{
                                        itemId: x.id, itemName: x.itemName,
                                        itemNumSess: x.itemNumSess, itemType: x.itemType,
                                        itemCategory: x.itemCategory, itemPriceUnit: x.itemPriceUnit,
                                        financeTerms: x.financeTerms, discount: x.discount, currentToggle: false
                                    }]
                                ])
                            }
                        }}
                    >{x.itemName}</Button>)}
                    <br></br>
                    <br></br>
                </div>
        </div>
    )
}

export default ItemSelection;