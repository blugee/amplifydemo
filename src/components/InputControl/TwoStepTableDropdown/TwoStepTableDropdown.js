import React, { PureComponent } from 'react';
import { Form, Select } from "antd";

const { Option } = Select;

export default class TwoStepTableDropdown extends PureComponent {
    constructor() {
        super()
        const allUserRecord = []
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
                {this.state.options &&
                    <Select
                        name='Select'
                        style={{ width: 300 }}
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
                }
            </Form.Item>


        )
    }
}
