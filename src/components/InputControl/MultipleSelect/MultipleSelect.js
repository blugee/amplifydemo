import React, { PureComponent } from 'react';
import { Form, Select } from "antd";

const { Option } = Select;

export default class InputSelect extends PureComponent {
    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e)
            // console.log(e.target.value)
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
                <Select
                    mode="multiple"
                    allowClear
                    placeholder={this.props.placeholder}
                    showSearch={this.props.showSearch ? true : false}
                    onChange={(e) => this.handleChange(e)}
                    defaultValue={this.props.defaultValue}
                    disabled={this.props.disabled}
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
            </Form.Item>


        )
    }
}
