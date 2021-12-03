import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../components/InputControl/InputText/InputText';
import InputPhone from '../../../../components/InputControl/InputPhone/InputPhone';


class AddUser extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.spinLoading()
    }


    render() {

        return (
            <React.Fragment>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Firstname'
                            name='given_name'
                            validationMessage='Please input correct name'
                            requiredMessage='Please input name'
                            placeholder='name'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Lastname'
                            name='family_name'
                            validationMessage='Please input correct name'
                            requiredMessage='Please input name'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputPhone
                            field={this.props.form}
                            label='Phone Number'
                            name='phone_number'
                            requiredMessage='Please input phone number'
                            validationMessage='Please input correct phone number'
                            required={true}
                            display={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Email'
                            name='email'
                            validationMessage='Please input correct email'
                            requiredMessage='Please input email'
                            disabled={false}
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Company'
                            name='custom:company-name'
                            validationMessage='Please input correct company'
                            requiredMessage='Please input company'
                            placeholder='company'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>



            </React.Fragment>
        );
    }
}

export default withRouter(AddUser);
