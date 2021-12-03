import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import { getAllAuthorizeUsers } from "../../../service/LicenseService";
import moment from "moment";
import DataTable from "../../../../components/DataTable/DataTable";
import { getEmail } from "../../../service/GeneralService";


const title = 'Subscription List';

class Subscription extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedRowKeys: [],
      selectedRows: '',
      currantPage: 1,
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
      isShowPagination: false,
      customerList: [],
      page: 1,
      pageTotal: 1,
      totalItem: '',
      loadingData: false
    }

    this.sorter = (v1, v2) => {
      return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    }

    const columns = [
      { title: 'Subscription ID', dataIndex: 'id', key: 'id', sorter: (a, b) => this.sorter(a.id, b.id),},
      { title: 'Customer', dataIndex: 'firstName', key: 'firstName', sorter: (a, b) => this.sorter(a.firstName, b.firstName) },
      { title: 'Customer Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
      { title: 'Collection Method', dataIndex: 'paymentMethod', key: 'paymentMethod', sorter: (a, b) => this.sorter(a.paymentMethod, b.paymentMethod) },
      { title: 'Subscription Description', dataIndex: 'description', key: 'description', sorter: (a, b) => this.sorter(a.description, b.description), },
      { title: 'Subscription Type', dataIndex: 'name', key: 'name', sorter: (a, b) => this.sorter(a.name, b.name) },
      { title: 'Status', dataIndex: 'status', key: 'status', render: (text, index) => index.status === 'active' ? 'Active' : 'Inactive', sorter: (a, b) => this.sorter(a.status, b.status) },
      { title: 'Discount', dataIndex: 'discount', key: 'discount', sorter: (a, b) => this.sorter(a.discount, b.discount), render: (text, index) => index.discount ? `(-${Number(index.discount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : `(-${Number(0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` },
      { title: 'Date Started', dataIndex: 'startDate', key: 'startDate', sorter: (a, b) => this.sorter(a.startDate, b.startDate), },
      { title: 'Period Start', dataIndex: 'startDate', key: 'startDate', sorter: (a, b) => this.sorter(a.startDate, b.startDate), },
      { title: 'Period End', dataIndex: 'endDate', key: 'endDate', sorter: (a, b) => this.sorter(a.endDate, b.endDate), },
      { title: 'Term', dataIndex: 'interval', key: 'interval', sorter: (a, b) => this.sorter(a.interval, b.interval), },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      xScroll: 2000,
      handleRefresh: this.handleRefresh,
      onSelectionChange: this.onSelectionChange
    }

  }

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleRefresh = () => {
    this.setState({ data: [], loadingData: true });
    this.fetchUserData();
  };

  componentDidMount() {
    this.fetchUserData()
  }

  fetchUserData = async () => {

    let response = await getAllAuthorizeUsers()
    if (response === false) {
      message.error('Something wrong happen')
    } else {
      this.setState({ customerList: response, })
      this.fetchData()
    }
  }

  fetchData = async () => {
    this.setState({ loadingData: true })
    let body = {}
    body = {
      ...body,
      size: this.state.limit,
      page: this.state.currantPage
    }
    let response = await API.post('PaymentGatewayAPI', `/paymentgateway/pagination/subscription`, { body })
    if (response.success) {
      let data = response.subscriptions.subscriptionDetails.subscriptionDetail
      let page = response.subscriptions.totalNumInResultSet
      if (page) {
        this.setState({ pageTotal: page })
      }

      let result = await getEmail(data)
      let formatData = await this.formatData(data, result)
      this.setState({ data: formatData })
    }else{
      console.log(response)
      message.error('Something wrong happen')
    }
    this.setState({ loadingData: false })
  }


  formatData = (data, result) => {
    return data.map((item, i) => {
      let interval = 'monthly'
      let email
      let customerProfileId = item.customerProfileId

      let index = result && result.findIndex(obj => Number(obj.customerProfileId) === customerProfileId)
      if (index > -1) {
        email = result[index].email
      }

      let startDate = item.createTimeStampUTC ? moment(item.createTimeStampUTC).format("MM-DD-YYYY") : ""
      return {
        ...item,
        interval: interval,
        startDate: startDate,
        email: email
      };
    });
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
    var response = await API.del('PaymentGatewayAPI', `/paymentgateway/subscription/${row[0].id}`)
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

  changePageSize = (currantPage, pageSize) => {
    this.setState({ currantPage: 1, limit: pageSize }, () => {
      this.fetchData()
    })
  }

  changePageNumber = (e,) => {
    this.setState({ currantPage: e }, () => {
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
    let tableData = this.tableData

    return (
      <Auxiliary>
        <DataTable
          menu={menu}
          dataSource={this.state.data}
          data={tableData}
          loadingData={this.state.loadingData}
          pagination={true}
          pageTotal={this.state.pageTotal}
          selectedRowKeys={this.state.selectedRowKeys}
          selectedRows={this.state.selectedRows}
          setPageNumber={this.changePageNumber}
          setPageSize={this.changePageSize}
        />
        {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
      </Auxiliary>
    );
  }
}

export default withRouter(Subscription);



