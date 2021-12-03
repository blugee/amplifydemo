import React, { PureComponent } from 'react';
import { Form, Input } from "antd";


class InputNumber extends PureComponent {
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
                    pattern: this.props.pattern,
                    message: this.props.validationMessage
                }, {
                    required: this.props.required ? true : false,
                    message: this.props.requiredMessage
                },
                {
                    validator: this.props.validation,
                },]}
            >
                <Input placeholder={this.props.placeholder} disabled={this.props.disabled} />
            </Form.Item>


        )
    }
}


export default InputNumber