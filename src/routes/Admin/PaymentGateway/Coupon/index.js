import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message } from "antd";
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../constants/URLConstant';
import { listCouponsPagination } from "../../../../graphql/queries";
import { deleteCoupon, updateCoupon } from "../../../../graphql/mutations";
import DataTable from "../../../../components/DataTable/DataTable";
import moment from 'moment'

const title = "Coupon Details"

class Coupon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      selectedRowKeys: [],
      selectedRows: '',
      currantPage: 1,
      currantSize: 10,
      sorter: null,
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
      { title: 'Percentage off', dataIndex: 'percentageOff', key: 'percentageOff', sorter: (a, b) => this.sorter(a.percentageOff, b.percentageOff) },
      { title: 'Amount off', dataIndex: 'amountOff', key: 'amountOff', render: (text, index) => index.amountOff ? index.amountOff.toLocaleString() : null, sorter: (a, b) => this.sorter(a.amountOff, b.amountOff) },
      { title: 'Duration', dataIndex: 'duration', key: 'duration', sorter: (a, b) => this.sorter(a.duration, b.duration) },
      { title: 'Code', dataIndex: 'code', key: 'code', sorter: (a, b) => this.sorter(a.code, b.code) },
      { title: 'Coupon Attach To', dataIndex: 'couponAttachTo', key: 'couponAttachTo', sorter: (a, b) => this.sorter(a.couponAttachTo, b.couponAttachTo) },
      { title: 'Duration (in month)', dataIndex: 'durationInMonth', key: 'durationInMonth', sorter: (a, b) => this.sorter(a.durationInMonth, b.durationInMonth) },
      { title: 'Redeem by', dataIndex: 'redeemBy', key: 'redeemBy', sorter: (a, b) => this.sorter(a.redeemBy, b.redeemBy) },
      { title: 'Currency', dataIndex: 'currency', key: 'currency', render: (text, index) => index.currency ? index.currency.toUpperCase() : null, sorter: (a, b) => this.sorter(a.currency, b.currency) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Coupon',
      addNewDataUrl: urlConfig.ADMIN_ADD_COUPON,
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
    // let body = {}
    // let paginationData = this.state.paginationData
    // if (paginationData) {
    //   body = paginationData
    // }
    // body = { ...body, limit: this.state.limit }
    let data = {
      page: this.state.currantPage,
      size: this.state.currantSize,
    }
    var response = await API.graphql(graphqlOperation(listCouponsPagination, data))
    let res = response.data.listCouponsPagination.items
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      res = await this.formatData(res)
      this.setState({ data: res, pageTotal: response.data.listCouponsPagination.total })
    }
    this.setState({ loadingData: false })
  }

  formatData(data) {
    return data.map((item, i) => {
      if (item.redeemBy) {
        var t = new Date(item.redeemBy);
        item.redeemBy = moment(t).format('MM/DD/YYYY');
      }
      return {
        ...item,
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
    } else if (type === 'edit') {
      this.setState({
        actionData: {
          message: 'Do you want to edit selected entries?', action: e => that.handleEdit(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    }

    else if (type === 'enable') {
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
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_COUPON, state: { data: row[0].id } });
    }, 2000);

  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    let body = {
      id: row[0].id,
    }
    await API.graphql(graphqlOperation(deleteCoupon, body))
    message.success('coupon deleted successfully');
    this.onSelectionChange([], '');
    this.setState({
      loadingData: false
    });
    this.fetchData();

  };


  enableEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let couponData = {
      updateCouponInput: {
        id: row[0].id,
        active: 'true',
      }
    }
    await API.graphql(graphqlOperation(updateCoupon, couponData))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Coupon activated successfuly');
        this.fetchData()
      })
      .catch(err => {
        console.log(err)
        message.error('Something wrong happened');
        this.setState({
          selectedRowKeys: [],
          selectedRows: '',
          loadingData: false
        });
      });
  };

  disabledEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let couponData = {
      updateCouponInput: {
        id: row[0].id,
        active: 'false',
      }
    }
    await API.graphql(graphqlOperation(updateCoupon, couponData))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Coupon deactivated successfuly');
        this.fetchData()
      })
      .catch(err => {
        console.log(err)
        message.error('Something wrong happened');
        this.setState({
          selectedRowKeys: [],
          selectedRows: '',
          loadingData: false
        });
      });
  };

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

    const menu = (
      <Menu onClick={this.onActionChange}>
        <Menu.Item key="enable">
          <CheckCircleOutlined />
          Active
        </Menu.Item>
        <Menu.Item key="disable">
          <MinusCircleOutlined />
          InActive
        </Menu.Item>
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
        <DataTable
          menu={menu}
          dataSource={this.state.data}
          data={this.tableData}
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

export default withRouter(Coupon);



