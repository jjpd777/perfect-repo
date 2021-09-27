import React from "react";
import ReactToPrint from "react-to-print";
import "./PrintComponent.scss";
import {
  FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
  DropdownMenu, DropdownItem, Card, CardBody, CardTitle, CardSubtitle, CardHeader
} from "shards-react";

const thStyle = {
  fontFamily: "Anton",
  fontWeight: "normal",
  fontStyle: "normal"
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="print-big-box">
        <div className="perfect-b-header">
          <h3> Perfect B Med Spa</h3>
          <h5>perfectb.com</h5>
        </div>
        <Container>
          <Row>
            <Col/> This is 
            <Col/> A motherfucking vibe
          </Row>
        </Container>

      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div>
        <ComponentToPrint ref={(el) => (this.componentRef = el)} />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="print-btn">
        <ReactToPrint
          trigger={() => <button>Print this out!</button>}
          content={() => this.componentRef}
        />
        </div>
      </div>
    );
  }
}

export default Example;
