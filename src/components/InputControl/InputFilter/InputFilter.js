import React, { PureComponent } from 'react';
import { Form, Select, Input } from "antd";
import './InputFilter.css'
const { Option } = Select;

export default class InputFilter extends PureComponent {
    handleChange = (value, name) => {
        if (this.props.onChange) {
            this.props.onChange(value, name)
        }
    }


    render() {
        return (

            <Form.Item
                name={this.props.name}
                label={this.props.label}
                style={this.props.display ? '' : { display: 'inline' }}
                rules={[{
                    required: this.props.required ? true : false,
                    message: this.props.requiredMessage
                }]}
            >
                <Select
                    placeholder={this.props.placeholder}
                    showSearch={this.props.showSearch ? true : false}
                    onSelect={(e) => this.handleChange(e, 'filtertype')}
                    onDeselect={(e) => this.handleChange(e, 'filtertype')}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().startsWith(input.toLowerCase())
                    }
                >
                    {
                        this.props.list && this.props.list.map(data =>
                            <Option value={data.id} key={data.id}>{data.name}</Option>
                        )
                    }

                </Select>
                <Input placeholder={this.props.placeholder} onChange={(e) => { this.handleChange(e.target.value, 'filtervalue') }} disabled={this.props.disabled} />
            </Form.Item>


        )
    }
}
