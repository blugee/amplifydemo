import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import { API, } from 'aws-amplify';
import './Cronjob.css'
import moment from "moment";
import DataTable from '../../../../components/DataTable/DataTable';

const FormItem = Form.Item;
const title = "Cronjob Logs"


class GeneralSetting extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            cronjobObj: {},
            data: null,
            currantPage: 1,
            currantSize: 10,
            sorter: null,
            paginationData: null,
            pageTotal: 1,
            limit: 10,
            isShowPagination: false,
            cronJob: 'ALL',
            start_date: '',
            end_date: '',

        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Cronjob', dataIndex: 'cronJob', key: 'cronJob', sorter: (a, b) => this.sorter(a.cronJob, b.cronJob) },
            { title: 'customerProfileId', dataIndex: 'customerProfileId', key: 'customerProfileId', sorter: (a, b) => this.sorter(a.customerProfileId, b.customerProfileId) },
            { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a, b) => this.sorter(a.date, b.date) },
            { title: 'Code', dataIndex: 'code', key: 'code', sorter: (a, b) => this.sorter(a.code, b.code) },
            { title: 'Message', dataIndex: 'message', key: 'message', sorter: (a, b) => this.sorter(a.message, b.message) },
        ]

        this.tableData = {
            title: title,
            columns: columns,
            isNoneSelectable: true,
            search: true,
            DatePicker: true,
            isDropdown: true,
            handleRefresh: this.handleTableDataRefresh,
            onDateSelect: this.onDateSelect,
            onSelect: this.onSelect,

        }
    }

    formRef = React.createRef();

    componentDidMount() {
        this.fetchData()
        this.cronjobData()
    }

    onDateSelect = (e) => {
        if (e) {
            let start_date = moment(e[0]._d).format('MM-DD-YYYY')
            let end_date = moment(e[1]._d).format('MM-DD-YYYY')
            this.setState({ start_date: start_date, end_date: end_date }, () => { this.cronjobData() })
        }
    }

    onSelect = (item) => {
        if (item) {
            this.setState({ cronJob: item, }, () => { this.cronjobData() })
        }
    };


    handleTableDataRefresh = () => {
        this.setState({ data: [], spinLoading: true });
        this.cronjobData()
    }

    cronjobData = async () => {
        let body = {}
        body = {
            page: this.state.currantPage,
            size: this.state.currantSize,
        }
        body = { ...body, startDate: this.state.start_date, endDate: this.state.end_date, cronJob: this.state.cronJob }
        this.setState({ spinLoading: true })
        let response = await API.post('PaymentGatewayAPI', '/paymentgateway/cronlogs', { body })
        if (response.success) {
            let data = response && response.cronLogs && response.cronLogs.data
            if (data) {
                this.setState({ spinLoading: false })
                this.setState({ data: data })
            }
            if (response && response.cronLogs && response.cronLogs.total) {
                this.setState({ pageTotal: response.cronLogs.total })
            }
        } else {
            this.setState({ spinLoading: false })
            message.error('something bad happen')
        }
    }


    changePageNumber = async (e, filters) => {
        this.setState({ currantPage: e }, () => {
            this.cronjobData()
        })
    }

    changePageSize = (currentSize, pageSize) => {
        this.setState({ currantPage: 1, currantSize: pageSize }, () => {
            this.cronjobData()
        })
    }

    setLoader = (value) => {
        this.setState({ loadingData: value })
    }
    handleRefresh = () => {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ spinLoading: true })

        var res = await API.get('PaymentGatewayAPI', '/paymentgateway/cronjobs', {})
        if (res.success) {
            if (res.result && res.result.length > 0) {
                let cronjobObj = {}
                for (let i = 0; i < res.result.length; i++) {
                    cronjobObj = {
                        ...cronjobObj,
                        [res.result[i].name]: res.result[i].isRunning
                    }
                }
                this.setState({ cronjobObj: cronjobObj })
            }

        } else {
            message.error('Something wrong happen')
        }
        this.setState({ spinLoading: false, })
    }

    handleCancelSubscriptionCronjob = async () => {
        this.setState({ spinLoading: true })
        let body = {
            cronjobName: 'CANCEL_SUBSCRIPTION_CRONJOB'
        }
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/restart/cronjob', { body })
        if (res.success) {
            this.setState({ cronjobObj: { ...this.state.cronjobObj, CANCEL_SUBSCRIPTION_CRONJOB: 'true' } })
        } else {
            console.log('res')
            message.error('Something wrong happen')
        }
        this.setState({ spinLoading: false, })
    }

    handleChargeCronjob = async () => {
        this.setState({ spinLoading: true })
        let body = {
            cronjobName: 'CHARGES_CRONJOB'
        }
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/restart/cronjob', { body })
        if (res.success) {
            this.setState({ cronjobObj: { ...this.state.cronjobObj, CHARGES_CRONJOB: 'true' } })
        } else {
            console.log('res')
            message.error('Something wrong happen')
        }
        this.setState({ spinLoading: false, })
    }

    render() {
        const { cronjobObj } = this.state
        let cronjobType = [
            { name: 'CANCEL_SUBSCRIPTION_CRONJOB', id: 'CANCEL_SUBSCRIPTION_CRONJOB' },
            { name: 'CHARGES_CRONJOB', id: 'CHARGES_CRONJOB' },
        ]
        return (
            <>
                <Card>
                    <FormItem
                        className='header-button-content'>
                        <Button
                            type='primary'
                            onClick={() => this.handleRefresh()}
                            loading={this.state.loadingData}
                            style={{ marginBottom: 0 }}
                        >
                            Refresh
                        </Button>
                    </FormItem>


                    <Card title='Cronjob Setting'>
                        <Spin tip="Loading..." spinning={this.state.spinLoading}>
                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <FormItem
                                        label='Cancel Subscription Cronjob'>
                                        <Button
                                            type='primary'
                                            onClick={() => this.handleCancelSubscriptionCronjob()}
                                            disabled={cronjobObj["CANCEL_SUBSCRIPTION_CRONJOB"] === 'true'}
                                            loading={this.state.loadingData}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {cronjobObj["CANCEL_SUBSCRIPTION_CRONJOB"] === 'true' ? 'Cronjob Running' : 'Start Cronjob'}
                                        </Button>
                                    </FormItem>
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <FormItem
                                        label='Charge Cronjob'>
                                        <Button
                                            type='primary'
                                            disabled={cronjobObj["CHARGES_CRONJOB"] === 'true'}
                                            onClick={() => this.handleChargeCronjob()}
                                            loading={this.state.loadingData}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {cronjobObj["CHARGES_CRONJOB"] === 'true' ? 'Cronjob Running' : 'Start Cronjob'}
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Spin>
                    </Card>

                        <DataTable
                            cronjobList={cronjobType}
                            dataSource={this.state.data}
                            data={this.tableData}
                            loadingData={this.state.spinLoading}
                            pagination={true}
                            pageTotal={this.state.pageTotal}
                            setPageNumber={this.changePageNumber}
                            setPageSize={this.changePageSize}
                        />

                </Card>
            </>
        );
    }
}

export default withRouter(GeneralSetting);
