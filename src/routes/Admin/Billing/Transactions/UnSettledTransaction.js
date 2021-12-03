import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { message } from "antd";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import DataTable from "../../../../components/DataTable/DataTable";
import { getEmail } from "../../../service/GeneralService";

const title = "Unsettled Transaction Details"

class UnSettledTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            sorter: null,
            paginationData: null,
            limit: 10,
            isShowPagination: false
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Account Type', dataIndex: 'accountType', key: 'accountType', sorter: (a, b) => this.sorter(a.accountType, b.accountType) },
            { title: 'Market Type', dataIndex: 'marketType', key: 'marketType', sorter: (a, b) => this.sorter(a.marketType, b.marketType) },
            { title: 'Customer Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
            { title: 'Settlement Time Local', dataIndex: 'submitTimeLocal', key: 'submitTimeLocal', sorter: (a, b) => this.sorter(a.submitTimeLocal, b.submitTimeLocal) },
            { title: 'Settle Amount', dataIndex: 'settleAmount', key: 'settleAmount', sorter: (a, b) => this.sorter(a.settleAmount, b.settleAmount) },
            { title: 'Transaction Status', dataIndex: 'transactionStatus', key: 'transactionStatus', sorter: (a, b) => this.sorter(a.transactionStatus, b.transactionStatus) },
        ]

        this.tableData = {
            title: title,
            columns: columns,
            isNoneSelectable: true,
            search: true,
            handleRefresh: this.handleRefresh,
        }
    }
    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchData();
    };

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ loadingData: true })
        let body = {}
        let paginationData = this.state.paginationData
        if (paginationData) {
            body = paginationData
        }
        body = { ...body, page: 1, size: 10 }
        let response = await API.post('PaymentGatewayAPI', '/paymentgateway/unsettledtransaction', { body })
        if (response.success) {
            if (response.transactions && response.transactions.message && response.transactions.message !== "I00004") {
                let data = response.transactions.transactions
                if (data.length > 0) {
                    let result = await getEmail(data)
                    if (result) {
                        for (let i = 0; i < data.length; i++) {
                            const customerProfileId = data[i].customerProfileId
                            let index = result && result.findIndex(item => item.customerProfileId === customerProfileId)
                            if (index > -1) {
                                data[i].email = result[index].email
                            }
                        }
                        this.setState({ data: data, pageTotal: response.transactions.total })
                    } else if (data.length > 0) {
                        this.setState({ data: data, pageTotal: response.transactions.total })
                    } else {
                        this.setState({ loadingData: false })
                        message.error('Something wrong happen')
                    }
                }
            }
        }

        this.setState({ loadingData: false })
    }

    changePageNumber = async (e) => {
        this.setState({ currantPage: e }, () => {
            this.fetchData()
        })
    }

    changePageSize = (currantPage, pageSize) => {
        this.setState({ currantPage: 1, currantSize: pageSize }, () => {
            this.fetchData()
        })
    }

    render() {

        return (
            <Auxiliary>
                <DataTable
                    dataSource={this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    pagination={true}
                    pageTotal={this.state.pageTotal}
                    setPageNumber={this.changePageNumber}
                    setPageSize={this.changePageSize}
                />
            </Auxiliary>
        );
    }
}

export default withRouter(UnSettledTransactions);



