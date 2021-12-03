import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message } from "antd";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../constants/URLConstant';
import { listPricings, listProducts } from "../../../../graphql/queries";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { getProductTypesOptions } from "../../../service/GeneralService";
import { updatePricing } from "../../../../graphql/mutations";

const title = 'Price List';

class Pricing extends Component {
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
      { title: 'Unit Amount', dataIndex: 'pricePerUnit', key: 'pricePerUnit', render: (text, index) => index.pricePerUnit ? index.pricePerUnit.toLocaleString() : index.pricePerUnit, sorter: (a, b) => this.sorter(a.pricePerUnit, b.pricePerUnit) },
      { title: 'Interval', dataIndex: 'intervalTime', key: 'intervalTime', sorter: (a, b) => this.sorter(a.intervalTime, b.intervalTime) },
      { title: 'Product', dataIndex: 'productName', key: 'productName', sorter: (a, b) => this.sorter(a.productName, b.productName) },
      { title: 'Currency', dataIndex: 'currency', key: 'currency', render: (text, index) => index.currency ? index.currency.toUpperCase() : null, sorter: (a, b) => this.sorter(a.currency, b.currency) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Price',
      addNewDataUrl: urlConfig.ADMIN_ADD_PRICING,
      handleRefresh: this.handleRefresh,
      onSelectionChange: this.onSelectionChange
    }
  }

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleRefresh = () => {
    this.setState({ data: [], loadingData: true });
    this.fetchProductData();
  };

  componentDidMount() {
    this.fetchProductData()
  }

  fetchData = async () => {
    this.setState({ loadingData: true })
    let res = await API.graphql(graphqlOperation(listPricings, {}))
    res = res.data.listPricings
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      res = await this.formatData(res)
      this.setState({ data: res, })
    }
    this.setState({ loadingData: false })
  }


  fetchProductData = async () => {
    this.setState({ loadingData: true })
    let res = await API.graphql(graphqlOperation(listProducts, {}))
    res = res.data.listProducts
    if (res.errors) {
      console.log(res.errors)
      message.error('Something wrong happen')
    } else {
      await this.setState({ productList: res })
      await this.fetchData()
    }
    this.setState({ loadingData: false })
  }

  formatData = async (data) => {
    let pricings = []
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let productName = ''
        let amount
        let productList = await getProductTypesOptions()
        if (productList && productList.length > 0) {
          let product = productList.filter(prod => prod.id === Number(data[i].productId))
          if (product.length > 0) productName = product[0].name
        }
        amount = Number(data[i].pricePerUnit)
        let pricingObj = {
          ...data[i],
          productName: productName,
          pricePerUnit: amount
        };
        pricings.push(pricingObj)
      }
    }
    return pricings
  }

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

  handleEdit = (key, row) => {
    this.setState({ loadingData: true });
    setTimeout(() => {
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_PRICING, state: { data: row[0].id } });
    }, 2000);

  };

  enableEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let pricingData = {
      updatePricingInput: {
        id : row[0].id,
        active: 'true',
      }
    }
    await API.graphql(graphqlOperation(updatePricing, pricingData))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Price activated successfuly');
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
    let pricingData = {
      updatePricingInput: {
        id : row[0].id,
        active: 'false',
      }
    }
    await API.graphql(graphqlOperation(updatePricing, pricingData))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Price deactivated successfuly');
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

export default withRouter(Pricing);



