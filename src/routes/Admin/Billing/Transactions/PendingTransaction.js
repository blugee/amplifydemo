import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { message } from "antd";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import DataTable from "../../../../components/DataTable/DataTable";
import { getEmail } from "../../../service/GeneralService";

const title = "Pending Transaction Details"

class PendingTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            sorter: null,
            paginationData: null,
            pageTotal: 1,
            limit: 10,
            isShowPagination: false
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Product Name', dataIndex: 'productName', key: 'productName', sorter: (a, b) => this.sorter(a.productName, b.productName) },
            { title: 'Customer Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
            { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => this.sorter(a.description, b.description) },
            { title: 'No Of Records Fetch', dataIndex: 'noOfRecordsFetch', key: 'noOfRecordsFetch', sorter: (a, b) => this.sorter(a.noOfRecordsFetch, b.noOfRecordsFetch) },
            { title: 'Price Per Unit', dataIndex: 'pricePerUnit', key: 'pricePerUnit', sorter: (a, b) => this.sorter(a.pricePerUnit, b.pricePerUnit) },
            { title: 'Charge Amount', dataIndex: 'chargeAmount', key: 'chargeAmount', sorter: (a, b) => this.sorter(a.chargeAmount, b.chargeAmount) },
            { title: 'Billed', dataIndex: 'isBilled', key: 'isBilled', sorter: (a, b) => this.sorter(a.isBilled, b.isBilled) },
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
        let body = {
            page: this.state.currantPage,
            size: this.state.currantSize,
        }
        let response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/charge', { body })
        if (response.success) {
            let data = response && response.Charge
            let secondrydata = response && response.Charge && response.Charge.data && response.Charge.data
            let formatData = []
            if (data && data.length > 0) {
                let result = await getEmail(response.Charge)
                for (let i = 0; i < data.length; i++) {
                    const customerProfileId = data[i].customerProfileId
                    let index = result && result.findIndex(item => item.customerProfileId === customerProfileId)
                    if (index > -1) {
                        data[i].email = result[index].email
                    }
                }
                formatData = this.formatData(data)
            } else if (secondrydata && secondrydata.length > 0) {
                let result = await getEmail(response.Charge.data)
                for (let i = 0; i < secondrydata.length; i++) {
                    const customerProfileId = secondrydata[i].customerProfileId
                    let index = result && result.findIndex(item => item.customerProfileId === customerProfileId)
                    if (index > -1) {
                        secondrydata[i].email = result[index].email
                    }
                }
                formatData = this.formatData(secondrydata)
            }
            this.setState({ data: formatData, pageTotal: response.Charge.total })
        } else {
            this.setState({ loadingData: false })
            message.error('Something wrong happen')
        }
        this.setState({ loadingData: false })
    }

    formatData = (data) => {
        return data.map((item, i) => {
            let isBilled = ''

            if (item.isBilled) {
                isBilled = item.isBilled === "true" ? 'Yes' : 'No'
            }

            return {
                ...item,
                isBilled: isBilled,
            };
        });
    }

    changePageNumber = async (e, filters) => {
        this.setState({ currantPage: e }, () => {
            this.fetchData()
        })
    }

    changePageSize = (currentSize, pageSize) => {
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

export default withRouter(PendingTransactions);



