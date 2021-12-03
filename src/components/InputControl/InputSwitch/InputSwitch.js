import React, { PureComponent } from 'react';
import { Form, Switch } from "antd";
import './InputSwitch.css'

class InputSwitch extends PureComponent {
    state = {
        isDefaultChecked: '',
        checked: false,
        defaultValue: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.defaultValue !== prevState.checked)) {
            const newState = {
                ...prevState,
                checked: nextProps.defaultValue
            }
            return newState;
        }
        else return null;
    }

    componentDidMount() {
        this.setState({ checked: this.props.defaultValue });
    }

    getCheckBoxColor() {
        if (this.props.color === 'red') {
            return "cbxRedLabel";
        }
        else {
            return "cbxBlueLabel";
        }
    }


    handleChange = (e) => {
        // this.setState({ checked: e.target.checked });
        if (this.props.onChange) {
            // let data = this.props.data
            // data[this.props.name] = e
            this.props.onChange(this.props.name, e)
        }
    }

    render() {

        return (
            (this.props.defaultValue === 'true' || this.props.defaultValue === 'false') &&
            <Form.Item
                name={this.props.name}
                label={this.props.label}
                style={this.props.display ? '' : { display: 'none' }}
                rules={[{
                    required: this.props.required ? true : false,
                    message: this.props.requiredMessage
                }]}
            >
                <Switch defaultChecked={this.props.defaultValue === 'true' ? true : false} onChange={this.handleChange} />
            </Form.Item>


        )
    }
}


export default InputSwitch







