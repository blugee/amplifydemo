import React, { PureComponent } from 'react';
import { Form, Input, Switch } from "antd";

class AllSwitchControl extends PureComponent {
    state = {
        isDefaultChecked: '',
        checked: false,
        defaultValue: null
    }



    componentDidMount() {
        this.setState({ defaultValue: this.props.defaultValue });
    }

    handleChange = (e) => {
        this.setState({ defaultValue: e });
        if (this.props.onChange) {
            this.props.onChange(this.props.name, e)
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
                initialValue={this.props.defaultValue}
            >

                <Switch checked={this.props.defaultValue || false} onChange={this.handleChange} />

            </Form.Item>


        )
    }
}


export default AllSwitchControl







