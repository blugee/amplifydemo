import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import InputSwitch from '../../../../../components/InputControl/InputSwitch/InputSwitch';
import { PLAN_TYPE_OPTIONS } from '../../../../../config/aws-config'


    class AddFeatures extends PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                booleanOptions: [
                    { name: 'True', id: true },
                    { name: 'False', id: false },
                ],
                isCheckedAll: null,
                defaultValue: true,
            }
        }

        componentDidMount() {
            this.props.spinLoading()

        }

        setAll = (e) => {
            this.setState({ isCheckedAll: true })
            this.props.setAll(e)
        }


        isCheckedAll = () => {
            return this.state.isCheckedAll
        }

      


        details() {

            const { defaultValues } = this.props
            if (!defaultValues) {
                return;
            }
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
                                label='Subcription Plan'
                                name='subscriptionPlanId'
                                validationMessage='Please input correct plan'
                                requiredMessage='Please input plan '
                                display={true}
                                required={true}
                                list={PLAN_TYPE_OPTIONS}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Name Search'
                                name='isAllowNameSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                defaultValue={defaultValues['isAllowNameSearch']}
                                required={false}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Number Search'
                                name='isAllowLicenseNumberSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseNumberSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Category Search'
                                name='isAllowLicenseCategorySearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseCategorySearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='City Search'
                                name='isAllowCitySearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowCitySearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='State Search'
                                name='isAllowStateSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowStateSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Country Search'
                                name='isAllowCountrySearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowCountrySearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Type Search'
                                name='isAllowLicenseTypeSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseTypeSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Status Search'
                                name='isAllowLicenseStatusSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseStatusSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Owner Search'
                                name='isAllowLicenseOwnerSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseOwnerSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Issue Date Search'
                                name='isAllowLicenseIssueDateSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseIssueDateSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='License Expire Date Search'
                                name='isAllowLicenseExpireDateSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLicenseExpireDateSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='DBA Search'
                                name='isAllowDBASearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowDBASearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='County Search'
                                name='isAllowCountySearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowCountySearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Postal Code Search'
                                name='isAllowPostalCodeSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowPostalCodeSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Phone Number Search'
                                name='isAllowPhoneNumberSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowPhoneNumberSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Email Search'
                                name='isAllowEmailSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowEmailSearch']}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSwitch
                                field={this.props.form}
                                label='Last Updated Date Search'
                                name='isAllowLastUpdatedDateSearch'
                                validationMessage='Please input correct name'
                                requiredMessage='Please input name'
                                display={true}
                                required={false}
                                defaultValue={defaultValues['isAllowLastUpdatedDateSearch']}
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

        render() {


            return <div>{this.details()}</div>;
        }
    }

export default withRouter(AddFeatures);
