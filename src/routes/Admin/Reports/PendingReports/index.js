import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { message, Modal, Spin, Menu, Button } from "antd";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import { listPendingReportPagination } from '../../../../graphql/queries'
import { GetAllUser } from "../../../../util/UserService";
import { setSessionForPayment, getData, updatePendingReportToDB, clearSessionForPayment, openSanckbarNotification, openSanckbarNotificationError, setPendingReportToDB } from "../../../service/ReportService";
import './index.css'
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { deletePendingReport } from "../../../../graphql/mutations";
import DataTable from "../../../../components/DataTable/DataTable";

const title = 'Pending Report List';
const key = 'updatable';

class PendingReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            selectedRowKeys: [],
            selectedRows: '',
            visible_confirm_model: false,
            visiblemodel: false,
            actionData: {
                message: '',
                action: ''
            },
            isShowModal: false,
            filterData: null,
            page: 1,
            currantSize: 10,
            filter: null,
            sorter: null
        }

        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'User Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email), width: 250 },
            { title: 'Report Name', dataIndex: 'reportName', key: 'reportName', sorter: (a, b) => this.sorter(a.reportName, b.reportName), width: 200 },
            { title: 'Report Description', dataIndex: 'reportDescription', key: 'reportDescription', sorter: (a, b) => this.sorter(a.reportDescription, b.reportDescription), width: 200 },
            { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate', sorter: (a, b) => this.sorter(a.purchaseDate, b.purchaseDate), width: 150 },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (text, index) => index.amount ? Number(index.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.amount, b.amount), width: 150 },
            { title: 'Record Cost', dataIndex: 'recordCost', key: 'recordCost', render: (text, index) => index.recordCost ? Number(index.recordCost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.expirationDate, b.expirationDate), width: 100, },
            { title: 'Promotion Code', dataIndex: 'promotionCode', key: 'promotionCode', sorter: (a, b) => this.sorter(a.promotionCode, b.promotionCode), width: 150 },
            { title: 'Discount', dataIndex: 'discount', key: 'discount', render: (text, index) => index.discount ? `(-${Number(index.discount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : null, sorter: (a, b) => this.sorter(a.discount, b.discount), width: 150 },
            { title: 'Total Paid Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (text, index) => index.totalAmount ? Number(index.totalAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.totalAmount, b.totalAmount), width: 150 },
            {
                title: 'Download Status',
                dataIndex: 'downloadStatus',
                key: 'downloadStatus',
                fixed: "right",
                render: (text, record) => {
                    return <>
                        <Button type="link"
                            className='buttonAsLink'
                            onClick={(e) => this.downloadReport(record)}
                            style={{
                                pointerEvents: "inherit",
                                color: "#5FA30F",
                                marginRight: '0px'
                            }}
                        >
                            Generate Report
                        </Button>
                    </>
                }
            },
        ]

        this.tableData = {
            title: title,
            columns: columns,
            search: true,
            isUserSelect: true,
            onUserSelect: this.onUserSelect,
            handleRefresh: this.handleRefresh,
            onSelectionChange: this.onSelectionChange,
            xScroll: 1800
        }
    }

    componentDidMount() {
        this.fetchInitialData()
    }

    fetchInitialData = async () => {
        this.setState({ loadingData: true })
        let pendingReportList = []
        let userList = []
        let filter = this.state.filter || `downloadStatus = 'false'`
        let pendingReportBody = {
            filter: filter,
            page: this.state.page,
            size: this.state.currantSize,
            orderBy: this.state.sorter
        }

        await API.graphql(graphqlOperation(listPendingReportPagination, pendingReportBody))
            .then(async (result) => {
                result = result.data.listPendingReportPagination
                var data = await GetAllUser()
                data = data.Users
                this.setState({ pageTotal: result.total, })
                if (data && data.length && result.items) {
                    for (let index = 0; index < data.length; index++) {
                        let items = result.items.filter(item => item.username === data[index].Username);

                        let dataObj = {
                            UserStatus: data[index].UserStatus,
                            Enabled: data[index].Enabled,
                            Username: data[index].Username,
                            id: data[index].Username,
                        }

                        for (let i = 0; i < data[index].Attributes.length; i++) {
                            dataObj = { ...dataObj, [data[index].Attributes[i].Name]: data[index].Attributes[i].Value }
                        }

                        userList.push(dataObj)
                        items = await this.formatData(items, dataObj.email)
                        if (items.length > 0) {
                            pendingReportList.push(...items)
                        }
                    }
                    result = pendingReportList
                }
                this.setState({
                    data: result, userList: userList, loadingData: false
                })
            })
            .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
                this.setState({
                    loadingData: false
                });
            });

    }

    addReportCount = (data) => {
        let username = data.split(' #c_')
        var count = new Date().getTime() / 1000
        count = Math.floor(count)
        var addCount = `${username[0] + ' #c_' + count} `
        return addCount
    }

    copyReport = async (rowkey, row) => {
        try {
            console.log(row);
            this.setState({ loadingData: true });
            let user = this.state.userList.filter(item => item.Username === row[0].username);
            row[0].reportName = await this.addReportCount(row[0].reportName)
            await setSessionForPayment(row[0]);
            var result = await setPendingReportToDB(user[0]);
            if (result.errors) {
                message.error("Error in report object stored")
                openSanckbarNotificationError(key, 'bottomRight', 'Error in report object stored',)
                this.setState({ errorInReportGeneration: true, loading: false, loadingData: false });
            } else {
                await clearSessionForPayment();
                await this.fetchInitialData(user);
                openSanckbarNotification(row[0].id, 'bottomRight', `Report Copied successfully for ${row[0].reportName}`)
                this.setState({ loading: false, loadingData: false });
            }
        } catch (e) {
            this.setState({ loadingData: false });
            console.log(e);
            message.error("Error in report object stored")
            openSanckbarNotificationError(row[0].id, 'bottomRight', `Error in report object stored for ${row[0].reportName}`)
        }

    }

    downloadReport = async (record) => {
        try {
            console.log(record);
            this.setState({ isShowModal: true });
            let user = this.state.userList.filter(item => item.Username === record.username);
            await setSessionForPayment(record);
            var result = await getData(user[0]);
            if (result.data !== null && result.data) {
                result = await updatePendingReportToDB(record.id);
                if (result.errors) {
                    message.error("We are not able to set payment status");
                } else {
                    await clearSessionForPayment();
                    await this.fetchInitialData(user);
                    openSanckbarNotification(record.id, 'bottomRight', `Report Generated successfully for ${record.reportName}`)
                }
            } else {
                this.setState({ isShowModal: false });
                message.error("Error in report generation");
                openSanckbarNotificationError(record.id, 'bottomRight', `Error in report object stored for ${record.reportName}`)
            }

            this.setState({ isShowModal: false });
        } catch (e) {
            this.setState({ isShowModal: false });
            console.log(e);
            message.error("Error in report object stored")
            openSanckbarNotificationError(record.id, 'bottomRight', `Error in report object stored for ${record.reportName}`)
        }

    }


    formatData(data, userEmail) {
        return data.map((item, i) => {
            return {
                ...item,
                email: userEmail
            };
        });
    }

    onSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    onUserSelect = (user) => {
        let filter = null
        if (user !== 'AllUsers') {
            filter = `downloadStatus = 'false' and username = '${user}'`
        }
        this.setState({ filter: filter }, () => {
            this.fetchInitialData()
        });

    };


    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchInitialData()
    };


    visibleModel = () => {
        this.setState({ visiblemodel: !this.state.visiblemodel })
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
        } else if (type === 'copy') {
            this.setState({
                actionData: {
                    message: 'Do you want to Copy selected entries?', action: e => that.copyReport(that.state.selectedRowKeys, that.state.selectedRows)
                }
            })
        }
    };

    handleDelete = async (key, row) => {
        this.setState({ loadingData: true });

        let body = {
            id: row[0].id
        }
        await API.graphql(graphqlOperation(deletePendingReport, body))
            .then(result => {
                message.success('Report Deleted Successfully');
                this.onSelectionChange([], '');
                this.setState({
                    loadingData: false
                });
                this.fetchInitialData();
            })
            .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
                this.setState({
                    loadingData: false
                });
            });

    };

    changePageNumber = (e) => {
        this.setState({ page: e }, () => {
            this.fetchInitialData()
        })

    }

    changePageSize = (current, pageSize) => {
        this.setState({ page: 1, currantSize: pageSize }, () => {
            this.fetchInitialData()
        })
    }

    handleTableDataChange = (pagination, filters, sorter, extra) => {
        if (sorter.column) {
            let order = sorter.order === "ascend" ? "ASC" : "DESC"
            let columnName = sorter.columnKey
            let orderBy = `${columnName + " " + order}`
            this.setState({ sorter: orderBy }, () => {
                this.fetchInitialData()
            })
        }
    }

    render() {

        const menu = (
            <Menu onClick={this.onActionChange}>
                <Menu.Item key="copy">
                    <CopyOutlined />
                        Copy
                      </Menu.Item>
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
                    userList={this.state.userList}
                    dataSource={this.state.filterData || this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                    pageTotal={this.state.pageTotal}
                    handleTableDataChange={this.handleTableDataChange}
                    setPageNumber={this.changePageNumber}
                    setPageSize={this.changePageSize}
                />
                <Modal
                    centered
                    title={` Report Generating ...`}
                    visible={this.state.isShowModal}
                    footer={null}
                    closable={false}
                >
                    <div className='confirm-popup-content2'>
                        <div className='report-modal-content'>
                            <p><Spin size="large" /></p>
                        </div>
                        <div className='report-modal-content confirm-popup-text'>
                            <p>can take a few minutes..</p>
                            <p>Do not refresh the page or navigate away</p>
                        </div>
                    </div>
                </Modal>
                {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
            </Auxiliary>
        );
    }
}

export default withRouter(PendingReports);



