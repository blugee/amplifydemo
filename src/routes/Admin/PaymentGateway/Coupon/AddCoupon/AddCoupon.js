import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputDate from '../../../../../components/InputControl/InputDate/InputDate';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import InputNumber from '../../../../../components/InputControl/InputNumber/InputNumber';
import { PLAN_TYPE_OPTIONS } from '../../../../../config/aws-config';


class AddCoupon extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            durationOptions: [
                { name: 'once', id: 'once' },
                { name: 'repeating', id: 'repeating' },
                { name: 'forever', id: 'forever' },
            ],
            couponTypes: [
                { name: 'Percentage off', id: 'percentageOff' },
                { name: 'Amount off', id: 'amountOff' },
            ],
            couponAttachTo: [
                { name: 'Subscription', id: 'subscription' },
                { name: 'Reports', id: 'reports' },
                { name: 'Both', id: 'both' }
            ],
            currancyList: [
                { name: 'usd', id: 'usd' },
            ],
            booleanOptions: [
                { name: 'True', id: 'true' },
                { name: 'False', id: 'false' },
            ],
            isRepetation: false,
            couponType: 'percentageOff',
            isEdit: false

        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined && this.props.location.state.data) {
            this.setData()
        }
        this.props.spinLoading()
    }

    setData = () => {
        // if (this.props.data) {
        //     if (this.props.data.duration === 'repeating') {
        //         this.setState({ isRepetation: true })
        //     }
        // }
    }

    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputId
                            field={this.props.form}
                            label='form.label.id'
                            name="id"
                            display={false}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Coupon Type'
                            name='couponType'
                            validationMessage='Please input correct coupon type'
                            requiredMessage='Please input coupon type'
                            display={true}
                            required={true}
                            list={this.state.couponTypes}
                            onChange={(e) => { this.props.handleTypeChange(e) }}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Name'
                            name='name'
                            validationMessage='Please input correct name'
                            requiredMessage='Please input name'
                            display={true}
                            required={true}
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
                {this.props.couponType === 'percentageOff' &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputNumber
                                field={this.props.form}
                                label='Percentage off'
                                name='percentageOff'
                                validationMessage='please enter only digits'
                                requiredMessage='please enter value'
                                pattern={new RegExp(/^[0-9]*$/g)}
                                display={true}
                                required={true}
                            />
                        </Col>
                    </Row>
                }
                {this.props.couponType === 'amountOff' &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputNumber
                                field={this.props.form}
                                label='Amount off'
                                name='amountOff'
                                validationMessage='please enter only digits'
                                requiredMessage='please enter value'
                                pattern={new RegExp(/^[0-9]*$/g)}
                                display={true}
                                required={true}
                            />
                        </Col>
                    </Row>
                }
                {this.props.couponType === 'amountOff' &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSelect
                                field={this.props.form}
                                label='Currency'
                                name='currency'
                                validationMessage='Please input correct currency'
                                requiredMessage='Please input currency'
                                display={true}
                                required={true}
                                list={this.state.currancyList}
                            />
                        </Col>
                    </Row>
                }

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputDate
                            field={this.props.form}
                            label='Redeem by'
                            name='redeemBy'
                            requiredMessage='Please input redeem by'
                            validationMessage='Please input correct redeem by'
                            required={true}
                            display={true}
                        />
                    </Col>
                </Row>


                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            field={this.props.form}
                            label='Duration'
                            name='duration'
                            validationMessage='Please input correct duration'
                            requiredMessage='Please input duration'
                            display={true}
                            required={true}
                            list={this.state.durationOptions}
                            onChange={(e) => { this.props.handleDurationChange(e) }}
                        />
                    </Col>
                </Row>

                {this.props.isRepetation === 'repeating' &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputNumber
                                field={this.props.form}
                                label='Duration (in month)'
                                name='durationInMonth'
                                validationMessage='please enter only digits'
                                requiredMessage='Please input duration in months'
                                pattern={new RegExp(/^[0-9]*$/g)}
                                display={true}
                                required={true}
                            />
                        </Col>
                    </Row>
                }

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            field={this.props.form}
                            label='Coupon Apply For'
                            name='couponApplyFor'
                            validationMessage='Please input correct currency'
                            requiredMessage='Please input currency'
                            display={true}
                            required={false}
                            list={PLAN_TYPE_OPTIONS}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Coupon Attach To'
                            name='couponAttachTo'
                            validationMessage='Please input correct coupon attach to'
                            requiredMessage='Please input coupon attach to'
                            display={true}
                            required={true}
                            list={this.state.couponAttachTo}
                            onChange={(e) => { this.props.handleAttachToChange(e) }}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Active'
                            name='active'
                            validationMessage='Please input correct type'
                            requiredMessage='Please input active type'
                            display={true}
                            required={true}
                            list={this.state.booleanOptions}
                        />
                    </Col>
                </Row>



            </React.Fragment>
        );
    }
}

export default withRouter(AddCoupon);
