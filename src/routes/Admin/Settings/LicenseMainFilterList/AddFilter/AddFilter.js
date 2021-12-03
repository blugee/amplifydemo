import React, { PureComponent } from 'react';
import { Col, message, Row, } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import Perameter from './Perameter';
import { API } from 'aws-amplify';


class AddFilter extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: true },
                { name: 'False', id: false },
            ],
            demoArray: [{
                key: 1,
                filtertype: '',
                operator: '',
                filtervalue: '',
            },],
            filterList: [],
            // filterList: [
            //     { name: 'licenseNumber', id: 'licenseNumber', },
            //     { name: 'licenseCategory', id: 'licenseCategory', },
            //     { name: 'licenseType', id: 'licenseType', },
            //     { name: 'licenseStatus', id: 'licenseStatus', },
            //     { name: 'licenseIssueDate', id: 'licenseIssueDate', },
            //     { name: 'licenseExpireDate', id: 'licenseExpireDate', },
            //     { name: 'licenseOwner', id: 'licenseOwner', },
            //     { name: 'retail', id: 'retail', },
            //     { name: 'medical', id: 'medical', },
            //     { name: 'businessLegalName', id: 'businessLegalName', },
            //     { name: 'businessDoingBusinessAs', id: 'businessDoingBusinessAs', },
            //     { name: 'businessAddress1', id: 'businessAddress1', },
            //     { name: 'businessAddress2', id: 'businessAddress2', },
            //     { name: 'businessCity', id: 'businessCity', },
            //     { name: 'businessCounty', id: 'businessCounty', },
            //     { name: 'businessState', id: 'businessState', },
            //     { name: 'businessZipcode', id: 'businessZipcode', },
            //     { name: 'businessCountry', id: 'businessCountry', },
            //     { name: 'businessPhoneNumber', id: 'businessPhoneNumber', },
            //     { name: 'businessEmailAddress', id: 'businessEmailAddress', },
            //     { name: 'businessStructure', id: 'businessStructure', },
            //     { name: 'active', id: 'active', }
            // ],
            operatorList: [
                { name: 'Equal', id: 'eq', },
                { name: 'Not equal', id: 'ne', },
                { name: 'Like', id: 'like', },
            ]
        }
    }

    componentDidMount() {
        this.fetchTableColumns()
        this.props.spinLoading()
    }

    fetchTableColumns = async () => {
        let body = {
            tableName: 'LicenseInformation'
        }
        var response = await API.post('CustomerRestAPI', '/customers/getColumnName', { body })
        if (response.success) {
            response = response.result
            response = await response.filter(function (el) { return el.COLUMN_NAME !== "id" && el.COLUMN_NAME !== "csvRowUniqueKey"; });
            let columns = await this.formatColumns(response)
            this.setState({ filterList: columns })
        } else {
            console.log(response.err)
            message.error('something bad happen')
        }
    }

    formatColumns = async (data) => {
        return data.map((item, i) => {
            return {
                ...item,
                name: item.COLUMN_NAME,
                id: item.COLUMN_NAME
            };
        });
    }


    addPerameter() {
        var lastItem = this.props.filteredArray.slice(-1)[0]

        let newObj = {
            key: lastItem.key + 1,
            filtertype: '',
            operator: '',
            filtervalue: '',
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
                            label='Order'
                            name='filterOrder'
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
                {this.props.filteredArray.map((index) => (
                    <Perameter name="item_params"
                        filterList={this.state.filterList}
                        operatorList={this.state.operatorList}
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

            </React.Fragment>
        );
    }
}

export default withRouter(AddFilter);
