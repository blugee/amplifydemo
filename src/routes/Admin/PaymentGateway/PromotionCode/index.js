import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message } from "antd";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import * as urlConfig from '../../../../constants/URLConstant';
import DataTableSimplePagination from "../../../../components/DataTableSimplePagination/DataTableSimplePagination";
import moment from 'moment'

const title = 'Promotion Code List';

class PromotionCode extends Component {
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
      { title: 'Code', dataIndex: 'code', key: 'code', sorter: (a, b) => this.sorter(a.code, b.code) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === true ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
      { title: 'Expires at', dataIndex: 'expires_at', key: 'expires_at', sorter: (a, b) => this.sorter(a.expires_at, b.expires_at) },
      { title: 'Livemode', dataIndex: 'livemode', key: 'livemode', render: (text, index) => index.livemode === true ? 'True' : 'False', sorter: (a, b) => this.sorter(a.livemode, b.livemode) },
      { title: 'Max redemptions', dataIndex: 'max_redemptions', key: 'max_redemptions', sorter: (a, b) => this.sorter(a.max_redemptions, b.max_redemptions) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Promotion Code',
      addNewDataUrl: urlConfig.ADMIN_ADD_PROMOTION_CODE,
      handleRefresh: this.handleRefresh,
      onSelectionChange: this.onSelectionChange,
      expandable: true
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
    var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/promotioncode', { body })
    if (response.success) {
      response = response.promotionCodes
      response.data = await this.formatData(response.data)
      if (response.has_more && !nextButton && !prevButton) {
        nextButton = true
      } else if (!response.has_more && nextButton && this.state.nextClicked) {
        nextButton = false
        prevButton = true
      } else if (!response.has_more && prevButton && this.state.prevClicked) {
        nextButton = true
        prevButton = false
      } else if (nextButton) {
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

  formatData(data) {
    return data.map((item, i) => {
      if (item.expires_at) {
        var t = new Date(item.expires_at * 1000);
        item.expires_at = moment(t).format('MM/DD/YYYY');
      }
      return {
        ...item,
      };
    });
  }

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleRefresh = () => {
    this.setState({ data: [], loadingData: true });
  };

  enableEntity = async (key, row) => {
    try {
      const body = {
        active: true,
      }
      this.setState({ loadingData: true })
      var response = await API.post('PaymentGatewayAPI', `/paymentgateway/promotioncode/${row[0].id}`, { body })
      if (response.success) {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Promotion Code activated successfuly');
        this.fetchData()
      } else {
        message.error(response.message);
      }
      this.setState({
        loadingData: false
      });
    } catch (ex) {
      console.log(ex)
      message.error('Something wrong happen');
      this.setState({
        selectedRowKeys: [],
        selectedRows: '',
        loadingData: false
      });
    }
  };

  disabledEntity = async (key, row) => {
    try {
      const body = {
        active: false,
      }
      this.setState({ loadingData: true })
      var response = await API.post('PaymentGatewayAPI', `/paymentgateway/promotioncode/${row[0].id}`, { body })
      if (response.success) {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Promotion Code deactivated successfuly');
        this.fetchData()
      } else {
        message.error(response.message);
      }
      this.setState({
        loadingData: false
      });
    } catch (ex) {
      console.log(ex)
      message.error('Something wrong happen');
      this.setState({
        selectedRowKeys: [],
        selectedRows: '',
        loadingData: false
      });
    }
  };

  onActionChange = value => {
    this.showConfirm(value.key);
  };

  showConfirm = type => {
    const that = this;
    this.setState({ visiblemodel: true, visible_confirm_model: true })
    if (type === 'enable') {
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
      </Menu>
    );

    return (
      <Auxiliary>
        <DataTableSimplePagination
          menu={menu}
          dataSource={this.state.data}
          data={this.tableData}
          loadingData={this.state.loadingData}
          selectedRowKeys={this.state.selectedRowKeys}
          selectedRows={this.state.selectedRows}
          isShowPagination={this.state.isShowPagination}
          nextButton={this.state.nextButton}
          prevButton={this.state.prevButton}
          handlePreviousClick={() => { this.handlePreviousClick() }}
          handleNextClick={() => { this.handleNextClick() }}
          handleSizeChange={(e) => { this.handleSizeChange(e) }}
        />
        {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
      </Auxiliary>
    );
  }
}

export default withRouter(PromotionCode);



