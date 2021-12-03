import React, { PureComponent } from 'react';
import { Form, Input } from "antd";
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'
import './phone.css'
// import 'react-intl-tel-input/dist/main.css';

export default class InputPhone extends PureComponent {
  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  render() {
    return (


      <Form.Item
        name={this.props.name}
        label={this.props.label}
        style={this.props.display ? '' : { display: 'none' }}
        rules={[{
          pattern: new RegExp(/^\+(?:[0-9]?){6,14}[0-9]$/g),
          message: "ex. +911234567890",
        }, {
          required: true,
          message: 'please Input Correct Phone Number',
        }]}
        
        initialValue={this.props.defaultValue}
      >
        <Input placeholder='+911234567890' />
      </Form.Item>


    )
  }
}
