import { message } from 'antd';
import { API } from 'aws-amplify';
import React from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import Auxiliary from '../../../../util/Auxiliary';

const title = "Settled Transaction Details"

class SettledTransactionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            pageTotal: 1,

        }
        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Account Type', dataIndex: 'accountType', key: 'accountType', sorter: (a, b) => this.sorter(a.accountType, b.accountType) },
            { title: 'Market Type', dataIndex: 'marketType', key: 'marketType', sorter: (a, b) => this.sorter(a.marketType, b.marketType) },
            { title: 'First Name', dataIndex: 'firstName', key: 'firstName', sorter: (a, b) => this.sorter(a.firstName, b.firstName) },
            { title: 'Product', dataIndex: 'product', key: 'product', sorter: (a, b) => this.sorter(a.product, b.product) },
            { title: 'Submit Time Local', dataIndex: 'submitTimeLocal', key: 'submitTimeLocal', sorter: (a, b) => this.sorter(a.submitTimeLocal, b.submitTimeLocal) },
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
        if (this.props && this.props.location && this.props.location.state && this.props.location.state.data) {
            let batchId = this.props.location.state.data
            let body = {
                page: this.state.currantPage,
                size: this.state.currantSize,
            }

            let response = await API.post('PaymentGatewayAPI', `/paymentgateway/transaction/${batchId}`, { body })
            if (response.success) {
                let data = response.transactions.transactions
                this.setState({ data: data, pageTotal: response.transactions.total })
            }
            else {
                this.setState({ loadingData: false })
                message.error('Something wrong happen')
            }
        }
        this.setState({ loadingData: false })

    }
    changePageNumber = async (e) => {
        this.setState({ currantPage: e }, () => {
            this.fetchData()
        })
    }

    changePageSize = (currantPage,pageSize) => {
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

export default SettledTransactionDetails;