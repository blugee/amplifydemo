import React, { PureComponent } from 'react';
import { Form, DatePicker } from "antd";
import './InputDate.css'
import moment from 'moment'

class InputDate extends PureComponent {
    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e)

        }
    }

    render() {
        const dateFormatList = ['MM/DD/YYYY', 'MM/DD/YY'];
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
                <DatePicker defaultValue={moment(this.props.defaultValue, this.props.dateFormat)} placeholder={this.props.placeholder} format={dateFormatList} disabled={this.props.disabled} />
            </Form.Item>


        )
    }
}


export default InputDate