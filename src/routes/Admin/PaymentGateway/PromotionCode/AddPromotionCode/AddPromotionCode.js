import React, { PureComponent } from 'react';
import { Col, Row, } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputDate from '../../../../../components/InputControl/InputDate/InputDate';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import InputNumber from '../../../../../components/InputControl/InputNumber/InputNumber';


class AddPromotionCode extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: true },
                { name: 'False', id: false },
            ],
            isPercentageOff: true,
            isEdit: false
        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined && this.props.location.state.data) {
            this.setState({ isEdit: true })
        }
        this.props.spinLoading()
    }


    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            field={this.props.form}
                            label='Coupon'
                            name='coupon'
                            validationMessage='Please input correct coupon'
                            requiredMessage='Please select coupon'
                            display={true}
                            required={true}
                            list={this.props.couponList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Code'
                            name='code'
                            validationMessage='Please input correct code'
                            requiredMessage='Please input code'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            field={this.props.form}
                            label='Active'
                            name='active'
                            validationMessage='Please input correct condition'
                            requiredMessage='Please select Active'
                            display={true}
                            required={true}
                            list={this.state.booleanOptions}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputDate
                            field={this.props.form}
                            label='Expire at'
                            name='expires_at'
                            requiredMessage='Please input expire date'
                            validationMessage='Please input correct expire date'
                            required={true}
                            display={true}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputNumber
                            field={this.props.form}
                            label='Max redemptions'
                            name="max_redemptions"
                            validationMessage='please enter only degits'
                            requiredMessage='please enter value'
                            pattern={new RegExp(/^[0-9]*$/g)}
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>

            </React.Fragment>
        );
    }
}

export default withRouter(AddPromotionCode);
