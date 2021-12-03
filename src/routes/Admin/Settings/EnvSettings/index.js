import { API, graphqlOperation } from 'aws-amplify';
import React from 'react';
import Auxiliary from '../../../../util/Auxiliary';
import * as urlConfig from '../../../../constants/URLConstant'
import { listEnvVariables } from '../../../../graphql/queries';
import { Menu, message } from "antd";
import { deleteEnvVariables } from '../../../../graphql/mutations';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ConfirmModel } from '../../../../components/ConfirmModel';
import DefaultTable from '../../../../components/DefaultTable/DefaultTable';

const title = "Env Settings Details"

class EnvSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            currantPage: 1,
            currantSize: 10,
            selectedRowKeys: [],
            sorter: null,
            visible_confirm_model: false,
            visiblemodel: false,
            actionData: {
                message: '',
                action: ''
            },
            selectedRows: '',
            pageTotal: 1,

        }
        this.sorter = (v1, v2) => {
            return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
        }

        const columns = [
            { title: 'Env Name', dataIndex: 'name', key: 'name', sorter: (a, b) => this.sorter(a.name, b.name) },
            { title: 'Env Value', dataIndex: 'value', key: 'value', sorter: (a, b) => this.sorter(a.value, b.value) },
        ]

        this.tableData = {
            title: title,
            columns: columns,
            search: true,
            button: 'Add Env',
            addNewDataUrl: urlConfig.ADMIN_ADD_ENV_SETTINGS,
            handleRefresh: this.handleRefresh,
            onSelectionChange: this.onSelectionChange
        }
    }

    handleRefresh = () => {
        this.setState({ data: [], loadingData: true });
        this.fetchData();
    };

    componentDidMount() {
        this.fetchData()
    }


    onSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
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
        } else if (type === 'edit') {
            this.setState({
                actionData: {
                    message: 'Do you want to edit selected entries?', action: e => that.handleEdit(that.state.selectedRowKeys, that.state.selectedRows)
                }
            })
        }
    }

    visibleModel = () => {
        this.setState({ visiblemodel: !this.state.visiblemodel })
    }

    handleEdit = (key, row) => {
        this.setState({ loadingData: true });
        setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_ADD_ENV_SETTINGS, state: { data: row[0].id } });
        }, 2000);

    };

    handleDelete = async (key, row) => {
        this.setState({ loadingData: true });
        let body = {
            id: row[0].id,
        }
        await API.graphql(graphqlOperation(deleteEnvVariables, body))
        message.success('Env variable deleted successfully');
        this.onSelectionChange([], '');
        this.setState({
            loadingData: false
        });
        this.fetchData();

    };


    fetchData = async () => {
        this.setState({ loadingData: true })
        await API.graphql(graphqlOperation(listEnvVariables, {}))
            .then(res => {
                if (res) {
                    let data = res.data.listEnvVariables
                    this.setState({ data: data })
                }
            })
            .catch(err => {
                console.log(err)
                message.error('Something wrong happen')
            })

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
    onActionChange = value => {
        this.showConfirm(value.key);
    };

    render() {

        const menu = (
            <Menu onClick={this.onActionChange}>
                <Menu.Item key="edit">
                    <PlusOutlined />
                    Edit
                </Menu.Item>
                <Menu.Item key="delete">
                    <DeleteOutlined />
                    Delete
                </Menu.Item>

            </Menu>
        );
        return (
            <Auxiliary>
                <DefaultTable
                    menu={menu}
                    dataSource={this.state.data}
                    data={this.tableData}
                    loadingData={this.state.loadingData}
                    pagination={true}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                />
                {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
            </Auxiliary>
        );
    }
}

export default EnvSettings;