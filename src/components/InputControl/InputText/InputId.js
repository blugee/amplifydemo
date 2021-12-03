import React, { PureComponent } from 'react';
import { Form, Input } from "antd";


class InputId extends PureComponent {

    render() {
        return (


            <Form.Item 
                name={this.props.name}
                label={this.props.label} 
                style={this.props.display ? '' : { display: 'none' }}
                rules= {[ {
                    required: false,
                }]}
            ><Input />
            </Form.Item>


        )
    }
}

export default InputId