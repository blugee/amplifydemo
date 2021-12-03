import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { Menu, message } from "antd";
import { PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import {  updateCountry } from "../../../../graphql/mutations";
import * as urlConfig from '../../../../constants/URLConstant';

const title = 'Email Template List';

class EmailTemplate extends Component {
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
      }
    }

    this.sorter = (v1, v2) => {
      return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    }

    const columns = [
      { title: 'Event', dataIndex: 'event', key: 'event', sorter: (a, b) => this.sorter(a.event, b.event) },
      { title: 'Subject', dataIndex: 'subject', key: 'subject', sorter: (a, b) => this.sorter(a.subject, b.subject) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      selectionType: 'radio',
      button: 'Add Template',
      addNewDataUrl: urlConfig.ADMIN_ADD_EMAIL_TEMPLATE,
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
    var res = await API.post('PaymentGatewayAPI', '/paymentgateway/emailTemplate', {})
    if (res.success) {
      this.setState({ data: res.result, })
    } else {
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
    } else if (type === 'edit') {
      this.setState({
        actionData: {
          message: 'Do you want to edit selected entries?', action: e => that.handleEdit(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'enable') {
      this.setState({
        actionData: {
          message: 'Do you want to enable selected entries?', action: e => that.enableEntity(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'disable') {
      this.setState({
        actionData: {
          message: 'Do you want to disable selected entries?', action: e => that.disabledEntity(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    }
  };

  visibleModel = () => {
    this.setState({ visiblemodel: !this.state.visiblemodel })
  }

  handleEdit = (key, row) => {
    this.setState({ loadingData: true });
    setTimeout(() => {
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_EMAIL_TEMPLATE, state: { data: row[0].id } });
    }, 2000);

  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    let body = {
      id: row[0].id
    }
    var res = await API.post('PaymentGatewayAPI', '/paymentgateway/deleteEmailTemplate', {body})
    if (res.success) {
      message.success('Email template deleted successfully')
      this.onSelectionChange([], '');
      this.fetchData()
    } else {
      console.log(JSON.stringify(res))
      message.error('Something wrong happened');
    }

    this.setState({
      loadingData: false
    });
  }


  enableEntity = async (key, row) => {
    this.setState({ loadingData: true })
    for (let i = 0; i < row.length; i++) {
      let data = {
        updateCountryInput: {
          id: row[i].id,
          active: true
        }
      }
      await API.graphql(graphqlOperation(updateCountry, data))
        .then(result => {
          if (i === row.length - 1) {
            this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
            message.success('Country activated successfuly');
            this.fetchData()
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          return false
        });
    };
    this.setState({
      loadingData: false
    });
  }

  disabledEntity = async (key, row) => {
    this.setState({ loadingData: true })
    for (let i = 0; i < row.length; i++) {
      let data = {
        updateCountryInput: {
          id: row[i].id,
          active: false
        }
      }
      await API.graphql(graphqlOperation(updateCountry, data))
        .then(result => {
          if (i === row.length - 1) {
            this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
            message.success('Country deactivated successfully');
            this.fetchData()
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          return false
        });
    };
    this.setState({
      loadingData: false
    });
  }

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

export default withRouter(EmailTemplate);



