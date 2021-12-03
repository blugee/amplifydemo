import React, { PureComponent } from 'react';
import { Col, Row, } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import Perameter from './Perameter';
import { PLAN_TYPE_OPTIONS } from '../../../../../config/aws-config';


class AddPlan extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: true },
                { name: 'False', id: false },
            ],
            demoArray: [{
                key: 1,
                plandetails: '',
            },],
            intervalList: [
                { name: 'Month', id: 'month' },
                // { name: 'Year', id: 'year' },
                // { name: 'Both', id: 'both' },
            ],
            interval: 'month',
        }
    }

    componentDidMount() {
        this.setState({ interval: this.props.interval })
        this.props.spinLoading()
    }

    addPerameter() {
        var lastItem = this.props.filteredArray.slice(-1)[0]

        let newObj = {
            key: lastItem.key + 1,
            plandetails: '',
        }
        var newArray = this.props.filteredArray
        var Array = newArray.concat(newObj);
        this.props.handleFilter(Array)
    }

    deletePerameter(e) {
        const items = this.props.filteredArray.filter(item => item.key !== e);
        this.props.handleFilter(items)
    }

    handlePerameterChange = async (key, name, value) => {
        let demoArray = this.props.filteredArray
        let newArray = [...this.props.filteredArray]
        let objIndex = demoArray.findIndex((obj => obj.key === key));
        newArray[objIndex] = { ...newArray[objIndex], [name]: value }
        this.props.handleFilter(newArray)
    }

    intervalChange = (e) => {
        this.props.changeInterval(e)
    }




    render() {
        const { interval } = this.props
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
                            label='Plan Order'
                            name='planOrder'
                            validationMessage='Please input correct order'
                            requiredMessage='Please input order'
                            display={true}
                            required={true}
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
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Plan Type'
                            name='planType'
                            validationMessage='Please input correct type'
                            requiredMessage='Please input type'
                            display={true}
                            required={true}
                            list={PLAN_TYPE_OPTIONS}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Description 1'
                            name='description1'
                            validationMessage='Please input correct description 1'
                            requiredMessage='Please input description 1'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Description 2'
                            name='description2'
                            validationMessage='Please input correct description 2'
                            requiredMessage='Please input description 2'
                            display={true}
                            required={false}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Interval'
                            name='interval'
                            validationMessage='Please input correct type'
                            requiredMessage='Please input type'
                            display={true}
                            required={true}
                            onChange={(e) => this.intervalChange(e)}
                            list={this.state.intervalList}
                        />
                    </Col>
                </Row>

                {(interval === 'month' || interval === 'both') &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSelect
                                defaultValue={true}
                                field={this.props.form}
                                label='Price per month'
                                name='priceIdMonth'
                                validationMessage='Please input correct price'
                                requiredMessage='Please input price'
                                display={true}
                                required={false}
                                list={this.props.priceListMonth}
                            />
                        </Col>
                    </Row>
                }

                {(interval === 'year' || interval === 'both') &&
                    <Row type="flex" justify="center">
                        <Col sm={12} xs={24}>
                            <InputSelect
                                defaultValue={true}
                                field={this.props.form}
                                label='Price per year'
                                name='priceIdYear'
                                validationMessage='Please input correct price'
                                requiredMessage='Please input price'
                                display={true}
                                required={false}
                                list={this.props.priceListYear}
                            />
                        </Col>
                    </Row>
                }
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Amount per record'
                            name='amountPerRecord'
                            validationMessage='Please input correct amount'
                            requiredMessage='Please input amount'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                {
                    this.props.filteredArray.map((index) => (
                        <Perameter name="item_params"
                            filterList={this.state.filterList}
                            key={index.key}
                            data={index}
                            arrayNumber={index.key}
                            onChange={(key, name, value) => this.handlePerameterChange(key, name, value)}
                            onDelete={(e) => this.deletePerameter(e)}
                            onAddparameter={() => { this.addPerameter() }}
                            form={this.props.form} />
                    ))
                }



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

            </React.Fragment >
        );
    }
}

export default withRouter(AddPlan);
