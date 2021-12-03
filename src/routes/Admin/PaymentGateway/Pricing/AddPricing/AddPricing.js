import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import InputNumber from '../../../../../components/InputControl/InputNumber/InputNumber';
import InputText from '../../../../../components/InputControl/InputText/InputText';


class AddPricing extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: 'true' },
                { name: 'False', id: 'false' },
            ],
            currancyList: [
                { name: 'usd', id: 'usd' },
            ],
            intervalList: [
                { name: 'Day', id: 'day' },
                { name: 'Week', id: 'week' },
                { name: 'Month', id: 'month' },
                { name: 'Year', id: 'year' }
            ],
            usageTypeList: [
                { name: 'Licensed', id: 'licensed' },
                { name: 'Metered', id: 'metered' },
            ],
            isLicensed: true
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
                        <InputNumber
                            field={this.props.form}
                            label='Unit Amount'
                            name='pricePerUnit'
                            validationMessage='please enter only digits'
                            requiredMessage='please enter amount'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
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
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Usage Type'
                            name='usageType'
                            validationMessage='Please input correct usage type'
                            requiredMessage='Please input usage type'
                            display={true}
                            required={true}
                            list={this.state.usageTypeList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Interval'
                            name='intervalTime'
                            validationMessage='Please input correct interval'
                            requiredMessage='Please input interval'
                            display={true}
                            required={true}
                            list={this.state.intervalList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Product'
                            name='productId'
                            validationMessage='Please input correct product'
                            requiredMessage='Please input active product'
                            display={true}
                            required={true}
                            list={this.props.productList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Description'
                            name='description'
                            validationMessage='Please input correct description'
                            requiredMessage='Please input description'
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

export default withRouter(AddPricing);
