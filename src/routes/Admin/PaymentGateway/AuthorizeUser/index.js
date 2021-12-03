import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { message } from "antd";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";


const title = 'Users List';

class AuthorizeUser extends Component {
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
      page: 1,
      currantSize: 10,
      filter: null,
      sorter: null
    }

    this.sorter = (v1, v2) => {
      return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    }

    const columns = [
      { title: 'Id', dataIndex: 'id', key: 'id', sorter: (a, b) => this.sorter(a.id, b.id) },
    
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      isNoneSelectable: true,
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
    let response = await API.get('PaymentGatewayAPI', '/paymentgateway/customers', {})

    if (response.errors) {
      message.error('Something wrong happen')
    } else {
      this.setState({ data: response.customers,  })
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
      this.props.history.push({ pathname: `/admin/licensecategory/add`, state: { data: row[0].id } });
    }, 2000);
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


    return (
      <Auxiliary>
        <DefaultTable
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

export default withRouter(AuthorizeUser);



