import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { moneyFormatter } from "../Utils/MoneyFormat";
import {
    FormInput, Button, FormRadio, Container, Row, Col,
    Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
} from "shards-react";
function StaffPrices({ listItems }) {

    const [catProcessed, setCatProcessed] = useState([]);
    const [staffItems, setStaffItems] = useState([]);



    useEffect(() => {
        var categories = [];
        var tmpStaffItems = [];
        listItems.map(x => {
            if (x.itemType === "staff") {
                tmpStaffItems.push(x);
                if (!(categories.includes(x.itemCategory))) { categories.push(x.itemCategory) };
            }
        })
        setCatProcessed(categories); setStaffItems(tmpStaffItems);
    }, []);


    return (
        <>
            <h3>Staff price list</h3>
            <br></br>
            <Container>
                {
                    catProcessed.map(categ =>
                        <>
                            <Row>
                                <Col /><h2>{categ}</h2>
                                <Col />
                            </Row>
                            {staffItems.map(x =>
                                x.itemCategory===categ &&<>
                                    <Row>
                                        <Col>
                                            {x.itemName}
                                        </Col>
                                        <Col>
                                            {moneyFormatter.format(x.itemPriceUnit)}
                                        </Col>
                                    </Row>

                                </>

                            )}
                        </>
                    )
                }

            </Container>
        </>
    )

}
export default StaffPrices;