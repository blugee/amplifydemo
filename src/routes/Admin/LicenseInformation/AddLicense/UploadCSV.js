import React, { PureComponent } from 'react';
import {
    Button,
    Card,
    Form,
    message, Spin, Upload, Row, Col
} from "antd";

import './UploadCSV.css'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { createLicenseInformationWithBatch, } from '../../../../graphql/mutations';
import * as urlConfig from '../../../../constants/URLConstant';
import { getCSVRowUniqueKey } from '../../../service/LicenseService';
import { exportCSVFile2 } from '../../../service/ReportService';

const FormItem = Form.Item;

class UploadCSV extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loadingData: false,
            spinLoading: false,
            fileData: [],
            isCSVProper: true,
            dataToDownload: [],
            headerArray: [
                "id", "license_number", "license_category", "license_type", "license_status", "license_issue_date", "license_expire_date", "license_owner", "retail", "medical", "business_legal_name", "business_doing_business_as", "business_address_1", "business_address_2", "business_city", "business_county", "business_state", "business_zipcode", "business_country", "business_phone_number", "business_email_address", "business_structure", "created_at", "updated_at"
            ],
            graphqlArray: [
                "id", "licenseNumber", "licenseCategory", "licenseType", "licenseStatus", "licenseIssueDate", "licenseExpireDate", "licenseOwner", "retail", "medical", "businessLegalName", "businessDoingBusinessAs", "businessAddress1", "businessAddress2", "businessCity", "businessCounty", "businessState", "businessZipcode", "businessCountry", "businessPhoneNumber", "businessEmailAddress", "businessStructure", "created_at", "updated_at"
            ]
        };

    }

    formRef = React.createRef();

    handleUpload = async () => {
        if (this.state.isCSVProper) {
            this.setState({ spinLoading: true })
            let uploaded = true

            if (this.state.fileData.length > 0) {
                let uploadBatch50 = await this.uploadLicenseInformationBatch(this.state.fileData, 50)
                if (uploadBatch50.length > 0) {
                    let uploadBatch25 = await this.uploadLicenseInformationBatch(uploadBatch50, 25)
                    if (uploadBatch25.length > 0) {
                        let uploadBatch5 = await this.uploadLicenseInformationBatch(uploadBatch25, 5)
                        if (uploadBatch5.length > 0) {
                            let uploadBatch1 = await this.uploadLicenseInformationBatch(uploadBatch5, 1)
                            if (uploadBatch1.length > 0) {
                                let headers = await this.getHeaderForCSV(this.state.headerArray)
                                var fileTitle = 'ErrorContentData';
                                await exportCSVFile2(headers, uploadBatch1, fileTitle);
                            }
                        }
                    }
                }

                this.setState({ spinLoading: false })
                if (uploaded) {
                    message.success('CSV file data added successfully')
                    setTimeout(() => {
                        this.props.history.push({ pathname: urlConfig.ADMIN_LICENSE_INFORMATION_LIST, });
                    }, 1000);
                } else {
                    message.error('something bad happen')
                }

            } else {
                message.error('something bad happen')
                this.setState({ spinLoading: false })
            }

        } else {
            this.setState({ spinLoading: false })
            message.error('CSV is not proper')
        }
    }

    uploadLicenseInformationBatch = async (fileData, count) => {
        let length = Math.ceil(fileData.length / count)
        let allDeleteData = []
        var addData = function (items) {
            allDeleteData = allDeleteData.concat(items)
        };

        for (let index = 0; index < length; index++) {
            let licenseInformationQuery = ' insert into LicenseInformation (active, csvRowUniqueKey, businessAddress1, businessAddress2, businessCity, businessCountry, businessCounty, businessDoingBusinessAs, businessEmailAddress, businessLegalName, businessPhoneNumber, businessState, businessStructure, businessZipcode, licenseCategory, licenseExpireDate, licenseIssueDate, licenseNumber, licenseOwner, licenseStatus, licenseType, medical, retail, created_at, updated_at) values '
            let deleteData2 = []
            let loopLength = (index + 1) * count
            for (let i = index * count; i < loopLength; i++) {
                if (fileData[i]) {
                    var csvRowUniqueKey = await getCSVRowUniqueKey()
                    let active = 'true'
                    if (i === index * count) {
                        licenseInformationQuery += ` ('${active}', '${csvRowUniqueKey}',  '${fileData[i].business_address_1}', '${fileData[i].business_address_2}', '${fileData[i].business_city}', '${fileData[i].business_country}', '${fileData[i].business_county}',  '${fileData[i].business_doing_business_as}', '${fileData[i].business_email_address}', '${fileData[i].business_legal_name}', '${fileData[i].business_phone_number}', '${fileData[i].business_state}', '${fileData[i].business_structure}', '${fileData[i].business_zipcode}',  '${fileData[i].license_category}', '${fileData[i].license_expire_date}', '${fileData[i].license_issue_date}', '${fileData[i].license_number}', '${fileData[i].license_owner}', '${fileData[i].license_status}', '${fileData[i].license_type}', '${fileData[i].medical}', '${fileData[i].retail}','${fileData[i].created_at}','${fileData[i].updated_at}') `
                    } else {
                        licenseInformationQuery += `, ('${active}', '${csvRowUniqueKey}',  '${fileData[i].business_address_1}', '${fileData[i].business_address_2}', '${fileData[i].business_city}', '${fileData[i].business_country}', '${fileData[i].business_county}',  '${fileData[i].business_doing_business_as}', '${fileData[i].business_email_address}', '${fileData[i].business_legal_name}', '${fileData[i].business_phone_number}', '${fileData[i].business_state}', '${fileData[i].business_structure}', '${fileData[i].business_zipcode}',  '${fileData[i].license_category}', '${fileData[i].license_expire_date}', '${fileData[i].license_issue_date}', '${fileData[i].license_number}', '${fileData[i].license_owner}', '${fileData[i].license_status}', '${fileData[i].license_type}', '${fileData[i].medical}', '${fileData[i].retail}','${fileData[i].created_at}','${fileData[i].updated_at}')`
                    }
                    deleteData2.push(fileData[i])
                } else {
                    loopLength = 0
                }

            }

            let insertLicenseBody = {
                createLicenseInformationInputWithBatch: {
                    query: licenseInformationQuery
                }
            }

            await API.graphql(graphqlOperation(createLicenseInformationWithBatch, insertLicenseBody))
                .catch(async (errors) => {
                    await addData(deleteData2)
                })
        }
        return allDeleteData
    }


    getHeaderForCSV = (data) => {
        let obj = {}
        for (let i = 0; i < data.length; i++) {
            obj = { ...obj, [data[i]]: data[i] }
        }
        return obj
    }

    stripquotes = (a) => {
        a = a.replace("\\", "")
        a = a.replace("/", "")
        if (a.charAt(0) === '"' && a.charAt(a.length - 1) === '"') {
            a = a.substr(1, a.length - 2);
            return a.replace(/'/g, "''")
        }

        if (a.toString().toLowerCase() === 'true') {
            return 'true'
        } else if (a.toString().toLowerCase() === 'false') {
            return 'false'
        }
        return a.replace(/'/g, "''")
    }

    splitCsv = (str) => {
        if (str) {
            return str.split('|').reduce((accum, curr) => {
                if (accum.isConcatting) {
                    accum.soFar[accum.soFar.length - 1] += '|' + curr.split('""').join('')
                } else {
                    accum.soFar.push(curr.split('""').join(''))
                }
                if (curr.split('"').length % 2 === 0) {
                    accum.isConcatting = !accum.isConcatting
                }
                return accum;
            }, { soFar: [], isConcatting: false }).soFar
        } else {
            return null
        }
    }


    render() {
        const { form } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 9 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        const formItemLayout2 = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        };

        return (
            <Card title='License Details'>
                <Spin tip="Loading..." spinning={this.state.spinLoading}>

                    <Form ref={this.formRef} form={form} onFinishFailed={this.onFinishFailed} onFinish={this.onFinish} {...formItemLayout}>
                        <div className="components-table-demo-control-bar">
                            <FormItem
                                className='header-button-content'>
                                <Button
                                    type='primary'
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => this.props.history.goBack()}
                                    style={{ marginBottom: 0 }}
                                >
                                    Back
                             </Button>

                            </FormItem>
                        </div>
                    </Form>
                    <Form {...formItemLayout2}>
                        <FormItem>
                            <Row type="flex" justify="center">
                                <Col sm={4} xs={12}>
                                    <Upload
                                        beforeUpload={file => {
                                            const reader = new FileReader();
                                            reader.onload = async (e) => {
                                                let dataArray = []
                                                let splitted = e.target.result.toString().split("\n");
                                                for (let i = 0; i < splitted.length; i++) {
                                                    var str = splitted[i]
                                                    let obj = {}
                                                    var arr = await this.splitCsv(str)
                                                    if (i === 0) {
                                                        var is_same = false
                                                        if (this.state.headerArray.length === arr.length) {
                                                            for (let index = 0; index < this.state.headerArray.length; index++) {
                                                                let firstEle = JSON.stringify(this.state.headerArray[index])
                                                                let secondEle = JSON.stringify(arr[index]).replace("\\r", "")
                                                                is_same = firstEle === secondEle
                                                            }
                                                        }
                                                        if (is_same) {
                                                            this.setState({ isCSVProper: true })
                                                        } else {
                                                            console.log(this.state.headerArray + '>>>>> ' + arr)
                                                            message.error('CSV File is not proper')
                                                            this.setState({ isCSVProper: false })
                                                            return false;
                                                        }
                                                    } else {
                                                        if (arr !== null) {
                                                            if (arr.length === this.state.headerArray.length) {
                                                                for (let index = 0; index < arr.length; index++) {
                                                                    obj = { ...obj, [this.state.headerArray[index]]: this.stripquotes(arr[index]) }
                                                                }

                                                                console.log(obj)

                                                                dataArray.push(obj)
                                                            } else {
                                                                message.error('CSV File is not proper')
                                                                this.setState({ isCSVProper: false })
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }
                                                this.setState({ fileData: dataArray })
                                            };
                                            reader.readAsText(file);

                                            return false;
                                        }}>
                                        <Button icon={<UploadOutlined />}>Select File </Button>
                                    </Upload>

                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center">
                                <Col sm={4} xs={12}>
                                    <Button
                                        type='primary'
                                        icon={<UploadOutlined />}
                                        onClick={() => this.handleUpload()}
                                        style={{ marginBottom: 0 }}
                                    >
                                        Upload CSV
                                        </Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Spin>
            </Card >
        );
    }
}

const WrappedLocalAuthForm = (UploadCSV);

export default WrappedLocalAuthForm;
