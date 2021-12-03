import React, { Component } from "react";
import Auxiliary from "../../../util/Auxiliary";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import DataTableSimplePagination from "../../../components/DataTableSimplePagination/DataTableSimplePagination";
import { message } from "antd";

const title = 'Customers List';

class Customers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            selectedRowKeys: [],
            selectedRows: '',
            visible_confirm_model: false,
            visiblemodel: false,
            actionData: {
                message: '',
                action: ''
            },
            nextButton: false,
            prevButton: false,
            paginationData: null,
            limit: 10,
            isShowPagination: false
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => this.sorter(a.name, b.name) },
            { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
            { title: 'Phone', dataIndex: 'phone', key: 'phone', sorter: (a, b) => this.sorter(a.phone, b.phone) },
            { title: 'Currency', dataIndex: 'currency', key: 'currency', sorter: (a, b) => this.sorter(a.currency, b.currency) },
            { title: 'Address', dataIndex: 'address', key: 'address', sorter: (a, b) => this.sorter(a.address, b.address) },

        ]

        this.tableData = {
            title: title,
            columns: columns,
            search: true,
            isNoneSelectable: true,
            handleRefresh: this.handleRefresh,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ loadingData: true })
        let body = {}
        let nextButton = this.state.nextButton
        let prevButton = this.state.prevButton
        let paginationData = this.state.paginationData
        if (paginationData) {
            body = paginationData
        }
        body = { ...body, limit: this.state.limit }
        var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/customers', { body })
        if (response.success) {
            response = response.customers
            if (response.has_more && !nextButton && !prevButton) {
                nextButton = true
            } else if (!response.has_more && nextButton && this.state.nextClicked) {
                nextButton = false
                prevButton = true
            } else if (!response.has_more && nextButton && this.state.prevClicked) {
                nextButton = true
                prevButton = false
            } else if (nextButton || prevButton) {
                nextButton = true
                prevButton = true
            }
            this.setState({ isShowPagination: response.has_more, data: response.data, nextButton: nextButton, prevButton: prevButton })
        } else {
            console.log(response.err)
            message.error('something bad happen')
        }
        this.setState({ loadingData: false })
    }

    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchData()
    };

    handlePreviousClick = () => {
        let data = {
            ending_before: this.state.data[0].id
        }
        this.setState({ paginationData: data, prevClicked: true, nextClicked: false }, () => {
            this.fetchData()
        })
    }

    handleNextClick = () => {
        let lastRecordIndex = this.state.data.length - 1
        let data = {
            starting_after: this.state.data[lastRecordIndex].id
        }
        this.setState({ paginationData: data, prevClicked: false, nextClicked: true }, () => {
            this.fetchData()
        })
    }

    handleSizeChange = (e) => {
        this.setState({ limit: e, paginationData: null, prevButton: false, nextButton: false, nextClicked: false, prevClicked: false }, () => {
            this.fetchData()
        })
    }

    render() {

        return (
            <Auxiliary>
                <DataTableSimplePagination
                    dataSource={this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    isShowPagination={this.state.isShowPagination}
                    nextButton={this.state.nextButton}
                    prevButton={this.state.prevButton}
                    handlePreviousClick={() => { this.handlePreviousClick() }}
                    handleNextClick={() => { this.handleNextClick() }}
                    handleSizeChange={(e) => { this.handleSizeChange(e) }}
                />

            </Auxiliary>
        );
    }
}

export default withRouter(Customers);



