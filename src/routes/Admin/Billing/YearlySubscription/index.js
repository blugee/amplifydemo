import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import DataTable from "../../../../components/DataTable/DataTable";
import { message,Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";


const title = "Yearly Subscription "

class YearlySubscription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            visible_confirm_model: false,
            visiblemodel: false,
            actionData: {
                message: '',
                action: ''
            },
            pageTotal: 1,
            sorter: null,
            selectedRowKeys: [],
            selectedRows: '',
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Name', dataIndex: 'companyName', key: 'companyName', sorter: (a, b) => this.sorter(a.name, b.name), },
            { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
            { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => this.sorter(a.description, b.description) },
            { title: 'PostalCode', dataIndex: 'postalCode', key: 'postalCode', sorter: (a, b) => this.sorter(a.postalCode, b.postalCode) },
            { title: 'Address', dataIndex: 'address', key: 'address', sorter: (a, b) => this.sorter(a.address, b.address) },
            { title: 'city', dataIndex: 'city', key: 'city', sorter: (a, b) => this.sorter(a.city, b.city) },
            { title: 'country', dataIndex: 'country', key: 'country', sorter: (a, b) => this.sorter(a.country, b.country) },
            { title: 'state', dataIndex: 'state', key: 'state', sorter: (a, b) => this.sorter(a.state, b.state) },
        ]

        this.tableData = {
            title: title,
            columns: columns,
            search: true,
            handleRefresh: this.handleRefresh,
            onSelectionChange: this.onSelectionChange
        }

    }


    onSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

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

        body = {
            page: this.state.currantPage,
            size: this.state.currantSize,
        }
        let response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/subscriptionrequest', { body })
        if (response.success) {
            if (response.Charge.data) {
                let data = response.Charge.data
                this.setState({ data: data, pageTotal: response.Charge.total })
            }
        } else {
            this.setState({ loadingData: false })
            message.error('Something wrong happen')
        }
        this.setState({ loadingData: false })
    }


    onActionChange = value => {
        this.showConfirm(value.key);
    };

    showConfirm = type => {
        const that = this;
        this.setState({ visiblemodel: true, visible_confirm_model: true })
        if (type === 'delete') {
            this.setState({
                actionData: {
                    message: 'Do you want to Delete selected entries?', action: e => that.handleDelete(that.state.selectedRowKeys, that.state.selectedRows)
                }
            })
        }
    };

    visibleModel = () => {
        this.setState({ visiblemodel: !this.state.visiblemodel })
      }

    handleDelete = async (key, row) => {
        this.setState({ loadingData: true });
        var response = await API.del('PaymentGatewayAPI', `/paymentgateway/delete/subscriptionrequests/${row[0].id}`)
        if (response.success) {
            message.success(response.success);
            this.onSelectionChange([], '');
            this.setState({
                loadingData: false
            });
            this.fetchData();
        } else {
            console.log(response.err)
            message.error('Something wrong happened');
            this.setState({
                loadingData: false
            });
        }
    };

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
        const menu = (
            <Menu onClick={this.onActionChange}>
                <Menu.Item key="delete">
                    <DeleteOutlined />
                    Delete
                </Menu.Item>
            </Menu>
        );
        return (
            <Auxiliary>

                <DataTable
                    menu={menu}
                    dataSource={this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    pagination={true}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                    pageTotal={this.state.pageTotal}
                    setPageNumber={this.changePageNumber}
                    setPageSize={this.changePageSize}
                />
        {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
            </Auxiliary>
        );
    }
}

export default withRouter(YearlySubscription);



