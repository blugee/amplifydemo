import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../components/InputControl/InputSelect/InputSelect';


class AddLicense extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: 'true' },
                { name: 'False', id: 'false' },
            ],
            licenseFilterList: null,
            licenseCategoryList: null,
            licenseStatusList: null,
            countryList: null,
            stateList: null,
            cityList: null
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
                        <InputText
                            field={this.props.form}
                            label='License Number'
                            name='licenseNumber'
                            validationMessage='Please input correct number'
                            requiredMessage='Please input number'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='License Category'
                            name='licenseCategory'
                            validationMessage='Please input correct license category'
                            requiredMessage='Please input license category'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='License Type'
                            name='licenseType'
                            validationMessage='Please input correct license type'
                            requiredMessage='Please input license type'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='License Status'
                            name='licenseStatus'
                            validationMessage='Please input correct status'
                            requiredMessage='Please input status'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='License Issue Date'
                            name='licenseIssueDate'
                            requiredMessage='Please input license issue date'
                            validationMessage='Please input correct license issue date'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Licesne Expire Date'
                            name='licenseExpireDate'
                            requiredMessage='Please input license expire date'
                            validationMessage='Please input correct license expire date'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='License Owner'
                            name='licenseOwner'
                            validationMessage='Please input correct license owner'
                            requiredMessage='Please input license owner'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Retail'
                            name='retail'
                            validationMessage='Please input correct retail'
                            requiredMessage='Please input retail'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Medical'
                            name='medical'
                            validationMessage='Please input correct medical'
                            requiredMessage='Please input medical'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Legal Name'
                            name='businessLegalName'
                            validationMessage='Please input correct business legal name'
                            requiredMessage='Please input business legal name'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Doing Business As'
                            name='businessDoingBusinessAs'
                            validationMessage='Please input correct name'
                            requiredMessage='Please input filter name'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Address 1'
                            name='businessAddress1'
                            validationMessage='Please input correct address'
                            requiredMessage='Please input adress'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Address 2'
                            name='businessAddress2'
                            validationMessage='Please input correct address'
                            requiredMessage='Please input address'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business City'
                            name='businessCity'
                            validationMessage='Please input correct city'
                            requiredMessage='Please input  city'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business County'
                            name='businessCounty'
                            validationMessage='Please input correct county'
                            requiredMessage='Please input county'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>


                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business State'
                            name='businessState'
                            validationMessage='Please input correct state'
                            requiredMessage='Please input state'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Zipcode'
                            name='businessZipcode'
                            validationMessage='Please input correct zipcode'
                            requiredMessage='Please input zipcode'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Country'
                            name='businessCountry'
                            validationMessage='Please input correct country'
                            requiredMessage='Please input country'
                            display={true}
                            required={true}
                            list={this.state.stateList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Phone Number'
                            name='businessPhoneNumber'
                            validationMessage='Please input correct phone number'
                            requiredMessage='Please input phone number'
                            display={true}
                            required={true}
                            list={this.state.countryList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Email Address'
                            name='businessEmailAddress'
                            validationMessage='Please input correct email'
                            requiredMessage='Please input  email'
                            display={true}
                            required={true}
                            list={this.state.countryList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Business Structure'
                            name='businessStructure'
                            validationMessage='Please input correct structure'
                            requiredMessage='Please input structure'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Created At'
                            name='created_at'
                            requiredMessage='Please input created at'
                            validationMessage='Please input correct created at'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Updated At'
                            name='updated_at'
                            requiredMessage='Please input updated at'
                            validationMessage='Please input correct updated at'
                            display={true}
                            required={true}
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

export default withRouter(AddLicense);
