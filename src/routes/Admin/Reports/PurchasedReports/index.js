import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message, Button } from "antd";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import { deletePurchaseReport } from '../../../../graphql/mutations'
import { GetAllUser } from "../../../../util/UserService";
import * as Amplify from 'aws-amplify';
import { listPurchaseReportPagination, searchEnvVariables } from "../../../../graphql/queries";
import { DeleteOutlined, MailOutlined } from "@ant-design/icons";
import AWS from 'aws-sdk';
import DataTable from "../../../../components/DataTable/DataTable";
import { getJSONData } from "../../../service/ReportService";

const title = 'Purchased Report List';

class PurchaseReport extends Component {
    constructor(props) {
        super(props)
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
            { title: 'User Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email), width: 200, },
            { title: 'Report Name', dataIndex: 'reportname', key: 'reportname', sorter: (a, b) => this.sorter(a.reportname, b.reportname), width: 200, },
            { title: 'Report Type', dataIndex: 'reportType', key: 'reportType', sorter: (a, b) => this.sorter(a.reportType, b.reportType), width: 200, },
            { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => this.sorter(a.description, b.description), width: 200, },
            { title: 'Date Purchase', dataIndex: 'datePurchase', key: 'datePurchase', sorter: (a, b) => this.sorter(a.datePurchase, b.datePurchase), width: 100, },
            { title: 'Expiration Date', dataIndex: 'expirationDate', key: 'expirationDate', sorter: (a, b) => this.sorter(a.expirationDate, b.expirationDate), width: 100, },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (text, index) => index.amount ? Number(index.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.amount, b.amount), width: 100, },
            { title: 'Record Cost', dataIndex: 'recordCost', key: 'recordCost', render: (text, index) => index.recordCost ? Number(index.recordCost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.expirationDate, b.expirationDate), width: 100, },
            { title: 'Promotion Code', dataIndex: 'promotionCode', key: 'promotionCode', sorter: (a, b) => this.sorter(a.promotionCode, b.promotionCode), width: 100, },
            { title: 'Discount', dataIndex: 'discount', key: 'discount', render: (text, index) => index.discount ? `(-${Number(index.discount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : null, sorter: (a, b) => this.sorter(a.discount, b.discount), width: 100, },
            { title: 'Total Paid Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (text, index) => index.totalAmount ? Number(index.totalAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null, sorter: (a, b) => this.sorter(a.totalAmount, b.totalAmount), width: 100, },
            {
                title: 'Link',
                dataIndex: 'link',
                key: 'link',
                width: 150,
                fixed: "right",
                render: (text, record) => {
                    return <>
                        <Button type="link"
                            onClick={(e) => this.downloadFile(record, record.csvFileName)}
                            style={{
                                pointerEvents: "inherit",
                                color: "#5FA30F",
                                marginRight: '0px',
                                margin: '0px',
                                padding: '0px'
                            }}
                        >
                            CSV
                        </Button>
                        <span> | </span>
                        <Button type="link"
                            onClick={(e) => this.downloadFile(record, record.pdfFileName)}
                            style={{
                                pointerEvents: "inherit",
                                color: "#5FA30F",
                                marginRight: '0px',
                                margin: '0px',
                                padding: '0px'
                            }}
                        >
                            PDF
                        </Button>
                        <span> | </span>
                        <Button type="link"
                            onClick={(e) => this.downloadJsonData(record)}
                            style={{
                                pointerEvents: "inherit",
                                color: "#5FA30F",
                                marginRight: '0px',
                                margin: '0px',
                                padding: '0px'
                            }}
                        >
                            JSON
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
            xScroll: 2000
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ loadingData: true })
        let purchasedReportList = []
        let userList = []
        let filter = this.state.filter
        let body = {
            page: this.state.page,
            size: this.state.currantSize,
            orderBy: this.state.sorter
        }
        if (filter) {
            body = {
                ...body,
                filter: filter,
            }
        }
        await API.graphql(graphqlOperation(listPurchaseReportPagination, body))
            .then(async (result) => {
                result = result.data.listPurchaseReportPagination
                var data = await GetAllUser()
                data = data.Users
                this.setState({ pageTotal: result.total, })
                if (data && data.length) {
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
                            purchasedReportList.push(...items)
                        }
                    }
                    result = purchasedReportList
                }
                this.setState({ data: result, userList: userList, loadingData: false })
            })
            .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
                this.setState({
                    loadingData: false
                });
            });
        this.setState({ loadingData: false })
    }


    downloadFile = async (report, fileName) => {
        await this.setState({ loading: true });
        const url = await Amplify.Storage.get(fileName)
        var link = document.createElement("a");
        link.style.display = 'none';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await this.setState({ loading: false });
    }

    downloadJsonData = async (report) => {
        let data = await getJSONData(report)
        this.setState({ loadingData: true })
        if (data !== false) {
            const fileName = report.reportname;
            const json = JSON.stringify(data);
            const blob = new Blob([json], { type: 'application/json' });
            const href = await URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            message.error('something bad happen')
        }
        this.setState({ loadingData: false })
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
            filter = `username = '${user}'`
        }
        this.setState({ filter: filter }, () => {
            this.fetchData()
        });
    };


    createNotification = async () => {
        await message.success("Message was successfully sent");
    }

    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchData()
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
        } else if (type === 'sendmail') {
            this.setState({
                actionData: {
                    message: 'Do you want to Send email of selected entries?', action: e => that.onSendMail(that.state.selectedRowKeys, that.state.selectedRows)
                }
            })
        }
    };

    onSendMail = async (key, row) => {
        this.setState({ loadingData: true })
        var purchaseDate = Date.parse(row[0].datePurchase);
        var expirationDate = Date.parse(row[0].expirationDate);
        let user = this.state.userList.filter(item => item.Username === row[0].username);
        let username = `${user[0].given_name + ' ' + user[0].family_name}`
        if (purchaseDate >= expirationDate) {
            message.error("Link is expired");
        } else {
            await this.setState({ loading: true });

            let envQuery = "SELECT * FROM EnvVariables WHERE name in ('REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_CONTACT_EMAIL_SUBJECT','REACT_APP_SES_API_VERSION','REACT_APP_SES_REGION','REACT_APP_SES_ACCESS_KEY_ID','REACT_APP_SES_SECRET_ACCESS_KEY','REACT_APP_SES_ENDPOINT')"
            let envVariable = {
                EnvVariablesListQuery: {
                    query: envQuery
                }
            }
            let Env = {}
            await API.graphql(graphqlOperation(searchEnvVariables, envVariable))
                .then(res => {
                    if (res.data && res.data.searchEnvVariables && res.data.searchEnvVariables.items) {
                        let data = res.data.searchEnvVariables.items
                        for (let i = 0; i < data.length; i++) {
                            Env[data[i].name] = data[i].value
                        }

                    }
                })
                .catch((errors) => {
                    console.log(errors)
                })
            const url = await Amplify.Storage.get(row[0].pdfFileName)
            const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
            const recipient = row[0].email;
            const subject = Env['REACT_APP_CONTACT_EMAIL_SUBJECT'];

            const charset = "UTF-8";

            const ses = new AWS.SES({
                apiVersion: Env['REACT_APP_SES_API_VERSION'],
                region: Env['REACT_APP_SES_REGION'],
                accessKeyId: Env['REACT_APP_SES_ACCESS_KEY_ID'],
                secretAccessKey: Env['REACT_APP_SES_SECRET_ACCESS_KEY'],
                endpoint: Env['REACT_APP_SES_ENDPOINT'],
            });

            const params = {
                Source: sender,
                Destination: {
                    ToAddresses: [
                        recipient
                    ],
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: charset
                    },
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `<html><body>
                            <p><b>Report created for : </b>${username}</p>
                            <p><b>Report Title : </b>${row[0].reportname}</p> 
                            <p><b>Report Description : </b>${row[0].description}</p> 
                            <p><b>Report Creation Date : </b>${row[0].datePurchase}</p> 
                            <p><b>Report Expiration Date : </b>${row[0].expirationDate}</p> 
                            <p><b>For downloading report </b><a href='${url}'>Click here </a> </p> 
                            </body></html>`
                        },

                    }
                },
            };

            const sendPromise = ses.sendEmail(params).promise();

            const me = this;
            sendPromise.then(
                function (data) {
                    me.createNotification()
                }).catch(
                    function (err) {
                        console.error(err, err.stack);
                    });
        }
        this.setState({ loadingData: false })

    }

    handleDelete = async (key, row) => {
        this.setState({ loadingData: true });
        let body = {
            id: row[0].id
        }
        await API.graphql(graphqlOperation(deletePurchaseReport, body))
            .then(result => {
                message.success('Report Deleted Successfully');
                this.onSelectionChange([], '');
                this.setState({
                    loadingData: false
                });
                this.fetchData();
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
            this.fetchData()
        })

    }

    changePageSize = (current, pageSize) => {
        this.setState({ page: 1, currantSize: pageSize }, () => {
            this.fetchData()
        })
    }

    handleTableDataChange = (pagination, filters, sorter, extra) => {
        if (sorter.column) {
            let order = sorter.order === "ascend" ? "ASC" : "DESC"
            let columnName = sorter.columnKey
            let orderBy = `${columnName + " " + order}`
            this.setState({ sorter: orderBy }, () => {
                this.fetchData()
            })
        }
    }

    render() {

        const menu = (
            <Menu onClick={this.onActionChange}>
                <Menu.Item key="sendmail">
                    <MailOutlined />
                    Send Email
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
                    pagination={true}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                    pageTotal={this.state.pageTotal}
                    handleTableDataChange={this.handleTableDataChange}
                    setPageNumber={this.changePageNumber}
                    setPageSize={this.changePageSize}

                />
                {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
            </Auxiliary>
        );
    }
}


export default withRouter(PurchaseReport);



