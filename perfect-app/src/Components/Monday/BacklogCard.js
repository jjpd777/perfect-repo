import React, { useState } from "react";
import { Card, Typography, Row, Col, Select, Button } from "antd";
import {insertMonday} from '../../Components/Monday/index';
const { Text } = Typography;
const { Option } = Select;

function getCurrentTimeAndDateForMondayAPI() {
    const now = new Date();
    const date = now.toISOString().substring(0, 10);
    const time = now.toTimeString().substring(0, 5);
  
    return `${date}`;
  }
  

const InvoiceCard = ({ invoiceMonday, setBacklogEstimates }) => {
  const [status, setStatus] = useState("Follow-up");
  const customer = invoiceMonday.customerObject;
  const timestamp = invoiceMonday.timestamp;
  const tt = getCurrentTimeAndDateForMondayAPI();
  const full_name = `${customer.customerName} ${customer.customerLast}`;



  const handleChange = (value) => {
    setStatus(value);
  };

  const handleClick = () => {
    console.log("hi");
    insertMonday(full_name, status, invoiceMonday.programTotal, tt);
    setBacklogEstimates( backlog => backlog.filter( i => i.id!== invoiceMonday.id))
  };

  return (
    <Card style={{ width: 300 }}>
      <Row gutter={16}>
        <Col span={24}>
          <Text strong>Name: </Text>
          <Text>{customer.customerName}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
     
        <Col span={24}>
          <Text strong>Time: {invoiceMonday.timestamp.split('&').join(' ')}</Text>
          <Text></Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Text strong>Total Amount:</Text>
          <Text>${invoiceMonday.programTotal}</Text>
        </Col>
      </Row>
      <Row style={{marginTop:"15px"}} gutter={16}>
        <Col span={24}>
          <Text strong>Status: </Text>
          <Select defaultValue={status} onChange={handleChange}>
            <Option value="Processed">Processed</Option>
            <Option value="Follow-up">Follow-Up</Option>
            <Option value="Discard">Discard</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Button style={{marginTop:"15px"}} onClick={handleClick}>Submit</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default InvoiceCard;
