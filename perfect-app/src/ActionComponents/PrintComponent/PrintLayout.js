import React from "react";
import ReactToPrint from "react-to-print";
import "./Print.scss";
import {
    FormInput, Button, FormRadio, Container, Row, Col, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem
} from "shards-react";

const thStyle = {
  fontFamily: "Anton",
  fontWeight: "normal",
  fontStyle: "normal"
};

class ComponentToPrint extends React.Component {
  render() {
    return (
    <div className="main-print-box">
        <Button>Yesyss lool</Button>
        <Button>LOOLyeyssf</Button>
      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <button>Print this out!</button>}
          content={() => this.componentRef}
        />
        <ComponentToPrint ref={(el) => (this.componentRef = el)} />
      </div>
    );
  }
}

export default Example;
