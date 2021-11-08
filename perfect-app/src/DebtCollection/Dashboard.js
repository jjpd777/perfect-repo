import React, { useEffect, useState } from "react";
import {
    Form, FormInput, FormGroup,
    Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader,
    Modal, ModalHeader, ModalBody, ModalFooter, Badge, CardFooter
} from "shards-react";
import "./Palette.scss";
// import {moneyFormatter} from "../Utils/MoneyFormat";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, logout} from "../../UtilsFirebase/Authentication";
// import { updateToInvoice } from "../../UtilsFirebase/Database";

// import {deconstructItems, deconstructProducts} from "../Components/SharedUtils";

const customers = [
    {"customerName": "Juan José", "total": "50.00", "dueAmount":"$25.85", "dueDate": "10/22/2021", "debtCat" : "today"}, 
    {"customerName": "Rafael", "total": "1,500.00", "dueAmount":"$245.85","dueDate": "10/18/2021","debtCat" : "7" }, 
    {"customerName": "Eryka","total": "600.00","dueAmount":"$144.17", "dueDate": "09/14/2021","debtCat" : "30+"}, 
    {"customerName": "Eduardo", "total": "1250.00","dueAmount":"$189.99", "dueDate": "09/14/2021","debtCat" : "30+"}, 
];


const Dashboard = ({estimate, fnHandleEdit}) => {
    const [searchUser, setSearchUser] = useState("");
    const prepareCards = ()=>{
        var r = [[],[],[]];
        customers.map(x=>{
            if(x.debtCat==="today") r[0].push(x)
            else if(x.debtCat ==="7") r[1].push(x);
            else r[2].push(x); 
        })
        console.log(r, "list")
        return r;
    }
    return(
    <div className="dashboard-main">
        <div className="dash-col-1">
        <Card className="dash-card">
            <CardHeader className="dash-card">Search Patient</CardHeader>
            <CardBody>
            <FormInput
                type="text"
                className="insert-input"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Product Category"
              />
            </CardBody>
        </Card>
        </div>
        <div className="dash-col-2">
        {prepareCards().map(card=>
             <Card className="dash-card">
            <CardHeader className="dash-card-header">{card[0].debtCat + " Due"}</CardHeader>
            <CardBody>
                {card.map(c=>
                <Container>
                    <Row>
                        <Col>
                        <h3>{c.customerName} owes ${c.total} total</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        Due payment: ${c.dueAmount} 
                        </Col>
                        <Col>
                        Due Date: {c.dueDate}
                        </Col>
                    </Row>
                    <br></br>
                </Container>
              )}
            </CardBody>
        </Card>
        )}
        </div>
      

    </div>)
};

export default Dashboard;