import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import moment from "moment";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";

const title = "Settled Transaction "

class SettledTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            pageTotal: 1,
            sorter: null,
            paginationData: null,
            limit: 10,
            end_date: '',
            start_date: '',
            isShowPagination: false,
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            {
                title: 'Batch Id',
                dataIndex: 'batchId',
                key: 'batchId',
                width: 150,
                fixed: "right",
                render: (text, item) => {
                    return <>
                        <Button type="batchId"
                            onClick={(e) => this.handleShowData(item)}
                            style={{
                                pointerEvents: "inherit",
                                color: "#5FA30F",
                                marginRight: '0px',
                                margin: '0px',
                                padding: '0px',
                                border: 'none',
                                background: 'none'
                            }}
                        >
                            {item.batchId}
                        </Button>

                    </>
                }
            },
            { title: 'Account Type', dataIndex: 'accountType', key: 'accountType', sorter: (a, b) => this.sorter(a.accountType, b.accountType) },
            { title: 'Market Type', dataIndex: 'marketType', key: 'marketType', sorter: (a, b) => this.sorter(a.marketType, b.marketType) },
            { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod', sorter: (a, b) => this.sorter(a.paymentMethod, b.paymentMethod) },
            { title: 'Settlement Time Local', dataIndex: 'settlementTimeLocal', key: 'settlementTimeLocal', sorter: (a, b) => this.sorter(a.settlementTimeLocal, b.settlementTimeLocal) },
            { title: 'Charge Amount', dataIndex: 'chargeAmount', key: 'chargeAmount', sorter: (a, b) => this.sorter(a.chargeAmount, b.chargeAmount) },
            { title: 'Settlement State', dataIndex: 'settlementState', key: 'settlementState', sorter: (a, b) => this.sorter(a.settlementState, b.settlementState) },

        ]

        this.tableData = {
            title: title,
            columns: columns,
            isNoneSelectable: true,
            DatePicker: true,
            search: true,
            isRefresh: true,
            isShowSubmit:true,
            button: 'Add Feature',
            handleRefresh: this.handleRefresh,
            onDateSelect: this.onDateSelect
        }

    }

    handleShowData = (data) => {
        this.props.history.push({
            pathname: "settledtransactionsdetails",
            state: { data: data.batchId }
        });
    }

    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchData();
    };

    onDateSelect = (e) => {
        if (e) {
            let start_date = moment(e[0]._d).format('MM-DD-YYYY')
            let end_date = moment(e[1]._d).format('MM-DD-YYYY')
            var admission = moment(start_date, 'MM-DD-YYYY');
            var discharge = moment(end_date, 'MM-DD-YYYY');
            let diff = discharge.diff(admission, 'days')
            if (diff > 31) {
                this.setState({ loadingData: false })
                message.error('The date range can not exceed 31 days')
            } else {
                this.setState({ start_date: start_date, end_date: end_date })
            }
        }

    }



    defualDate = () => {
        let today = new Date()
        let dateLimit = new Date(new Date().setDate(today.getDate() - 30))
        let start_date = moment(dateLimit).format('MM-DD-YYYY');
        let end_date = moment(today).format('MM-DD-YYYY');
        this.setState({ start_date: start_date, end_date: end_date }, () => {
            this.fetchData();
        })

    }

    componentDidMount() {
        this.defualDate()
    }

    fetchData = async () => {

        this.setState({ loadingData: true })
        let body = {}

        body = {
            page: this.state.currantPage,
            size: this.state.currantSize,
        }
        body = { ...body, start_date: this.state.start_date, end_date: this.state.end_date }
        let response = await API.post('PaymentGatewayAPI', '/paymentgateway/transaction/batchlists', { body })
        if (response.success) {
            if (response.Transactions && response.Transactions.batchList && response.Transactions.batchList && response.Transactions.batchList.batch && response.Transactions.batchList.batch.length > 0) {
                let formatData = await this.formatData(response.Transactions.batchList.batch)
                this.setState({ data: formatData })

            }
        } else {
            this.setState({ loadingData: false })
            message.error('Something wrong happen')
        }
        this.setState({ loadingData: false })
    }

    // fetchData = async () => {
    //     if (this.state.start_date && this.state.end_date) {
    //         this.setState({ loadingData: true })
    //         let body = {}

    //         body = {
    //             page: this.state.currantPage,
    //             size: this.state.currantSize,
    //         }
    //         body = { ...body, start_date: /* '2021/07/15' */ this.state.start_date, end_date: /* '2021/08/05' */this.state.end_date }
    //         let response = await API.post('PaymentGatewayAPI', '/paymentgateway/transaction/batchlists', { body })
    //         if (response.success) {
    //             if (response.Transactions && response.Transactions.batchList && response.Transactions.batchList && response.Transactions.batchList.batch && response.Transactions.batchList.batch.length > 0) {
    //                 let formatData = await this.formatData(response.Transactions.batchList.batch)
    //                 this.setState({ data: formatData })

    //             }
    //         } else {
    //             this.setState({ loadingData: false })
    //             message.error('Something wrong happen')
    //         }
    //         this.setState({ loadingData: false })
    //     } else {
    //         message.error('Please Select Date')
    //     }

    // }

    formatData = (data) => {
        return data.map((item, i) => {
            let accountType = '-'
            let chargeAmount = 0

            if (item.statistics && item.statistics.statistic.length > 0 && item.statistics.statistic[0].accountType) {
                accountType = item.statistics.statistic[0].accountType
            }

            if (item.statistics && item.statistics.statistic.length > 0 && item.statistics.statistic[0].chargeAmount) {
                chargeAmount = item.statistics.statistic[0].chargeAmount
            }
            return {
                ...item,
                accountType: accountType,
                chargeAmount: chargeAmount
            };
        });
    }

    // changePageNumber = async (e) => {
    //     this.setState({ currantPage: e }, () => {
    //         this.fetchData()
    //     })
    // }

    // changePageSize = (currantPage, pageSize) => {
    //     this.setState({ currantPage: 1, currantSize: pageSize }, () => {
    //         this.fetchData()
    //     })
    // }

    render() {

        return (
            <Auxiliary>
                <DefaultTable
                    dataSource={this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    pagination={true}
                />
            </Auxiliary>
        );
    }
}

export default withRouter(SettledTransactions);



