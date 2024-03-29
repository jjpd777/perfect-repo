import React, { useEffect, useState } from "react";
import {
    FormInput, Button, Container, Row, Col
} from "shards-react";
import { createCustomerFunction, readCustomersFunction } from "../../UtilsFirebase/Database";
import "../Design.scss";
//

function CustomerSearch({ fnSetCustomer, record }) {
    const [searchInput, setSearchInput] = useState("");
    const [newCustomer, setNewCustomer] = useState(true);
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const initialCustomer = {
        customerName: '',
        customerLast: '',
        customerEmail: '',
        customerPhone: "+1",
        isNewCustomer: true,
    };
    const [currentCustomer, setCurrentCustomer] = useState(initialCustomer);


    function validatePhone(phone) {
        var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return regex.test(phone);
    }

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


    var searched = searchInput === "" ? [] : fetchedUsers.filter(u => {
        return (u.customerName.toLowerCase()
                .includes(searchInput.toLocaleLowerCase()) 
                || u.customerPhone.includes(searchInput));
    });

    useEffect(() => {
        if(conditions) fnSetCustomer(currentCustomer);
    }, [newCustomer, currentCustomer]);

    const switchSearchExisting=()=>{
        setNewCustomer(!newCustomer);
        setCurrentCustomer(initialCustomer);
        fnSetCustomer(initialCustomer);
    };
    const conditions = validatePhone(currentCustomer.customerPhone) && currentCustomer.customerName !== '' && currentCustomer.customerLast !== '';

    const phoneIsValid = validatePhone(currentCustomer.customerPhone);





    return (
        <div className="customer-box">
            <div className="switch-box">
           {true && !record &&<Button className="switch-to-search" onClick={() => { switchSearchExisting() }}>{newCustomer ? "Find user" : "New user"}</Button>}
            </div>
            {true &&<div className="search-customer-box">
                {(!newCustomer || record) ? (
                <>
                <div className="search-user-2">
                    <Container>
                        <Row>
                            <Col>
                            <h3>Search patient: </h3>
                            </Col>
                            <Col>
                            <FormInput className="search-user-input"
                        value={searchInput}
                        onChange={(c) => {
                            setSearchInput(c.target.value);
                        }} />
                            </Col>
                        </Row>
                    </Container>
                   
                </div>

                <div style={{width: '1200px', maxHeight: '200px', overflowY: 'auto'}} className="searched-options">
                    {searched.map((c) => <>
                        <Button className="customer-options" onClick={() => { setCurrentCustomer(c);  }}>{c.customerName +" "+ c.customerLast}</Button>
                    </>)}
                </div>
            </>
                )
                    : (
                        <div className="search-user-2">
                        <Container>
                            <Row>
                                <Col>
                                <h3>Name *</h3>
                                </Col>
                                <Col>
                                <h3>Last Name *</h3>
                                </Col>
                                <Col>
                                <h3>Phone *</h3>
                                </Col>
                                <Col>
                                <h3>Email *</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <FormInput className="search-user-input"
                            invalid={!currentCustomer.customerName.length}
                            onChange={(e) => setCurrentCustomer({ ...currentCustomer, customerName: e.target.value })}
                            value={currentCustomer.customerName}
                        />
                                </Col>
                                <Col>
                                <FormInput className="search-user-input"
                            invalid={!currentCustomer.customerName.length}
                            onChange={(e) => setCurrentCustomer({ ...currentCustomer, customerLast: e.target.value })}
                            value={currentCustomer.customerLast}
                        />
                                </Col>
                                <Col>
                                <FormInput className="search-user-input"
                            type="text"
                            onChange={(e) => setCurrentCustomer({ ...currentCustomer, customerPhone: e.target.value })}
                            valid={phoneIsValid}
                            invalid={!phoneIsValid}
                            value={currentCustomer.customerPhone}
                        />
                                </Col>
                                <Col>
                                <FormInput className="search-user-input"
                            onChange={(e) => setCurrentCustomer({ ...currentCustomer, customerEmail: e.target.value })}
                            value={currentCustomer.customerEmail}
                        />
                                </Col>
                            </Row>

                        </Container>
                        
                    </div>
                    )}
            </div>}
            <div className="customer-current-box">
                <h4><b>Name: </b>{currentCustomer.customerName}</h4>
                <h4><b>Last Name: </b>{currentCustomer.customerLast}</h4>
                <h4><b>Email: </b>{currentCustomer.customerEmail}</h4>
                <h4><b>Phone: </b>{currentCustomer.customerPhone}</h4>
            </div>
        </div>)
};

export default CustomerSearch;