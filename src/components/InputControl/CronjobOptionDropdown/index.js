import React, { PureComponent } from 'react';
import { Form, Select } from "antd";

const { Option } = Select;

export default class CronJobDropdown extends PureComponent {
    constructor() {
        super()
        const allUserRecord = [{
            name: 'All',
            id: 'ALL'
        }]
        this.state = {
            allUserRecord,
        }
    }

    handleChange = (e) => {
        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.list !== this.props.list) {
            let options = [];
            options = this.state.allUserRecord.concat(this.props.list);
            this.setState({ options: options });
        }
    }


    render() {
        return (

            <Form.Item >
                <Select
                    name='cronjobSelect'
                    style={{ width: 300 }}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    showSearch={this.props.showSearch ? true : false}
                    onSelect={(e) => this.handleChange(e)}
                    onDeselect={(e) => this.handleChange(e)}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().startsWith(input.toLowerCase())
                    }
                >
                    {
                        this.state.options && this.state.options.map(data =>
                            <Option value={data.id} key={data.id}>{data.name}</Option>
                        )
                    }

                </Select>
            </Form.Item>


        )
    }
}
