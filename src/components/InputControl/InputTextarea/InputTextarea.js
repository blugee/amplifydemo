import React, { PureComponent } from 'react';
import { Form, Input } from "antd";

const { TextArea } = Input;

class InputTextarea extends PureComponent {

    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e.target.value)

        }
    }

    render() {
        return (

            <Form.Item
                name={this.props.name}
                label={this.props.label}
                style={this.props.display ? '' : { display: 'none' }}
                rules={[{
                    required: this.props.required ? true : false,
                    message: this.props.requiredMessage
                }]}
            >
                <TextArea rows={this.props.rows} placeholder={this.props.placeholder} onChange={(e)=>{this.handleChange(e)}} disabled={this.props.disabled} />
            </Form.Item>


        )
    }
}


export default InputTextarea