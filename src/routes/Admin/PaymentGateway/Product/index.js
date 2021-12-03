import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import { Menu, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../constants/URLConstant';
import { deleteProduct } from "../../../../graphql/mutations";
import {  listProducts } from "../../../../graphql/queries";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { getProductTypesOptions } from "../../../service/GeneralService";

const title = 'Product List';

class Product extends Component {
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
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => this.sorter(a.name, b.name) },
      { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => this.sorter(a.description, b.description) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Product',
      addNewDataUrl: urlConfig.ADMIN_ADD_PRODUCT,
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
    let res = await API.graphql(graphqlOperation(listProducts, {}))
    res = res.data.listProducts
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      res = await this.formetData(res)
      this.setState({ data: res, })
    }
    this.setState({ loadingData: false })
  }

  formetData = async (data) => {
    let products = []
    if (data && data.length > 0) {
      let productTypes = await getProductTypesOptions()
      for (let i = 0; i < data.length; i++) {
        let selectType = await productTypes.filter(product => product.id === Number(data[i].name))
        if (selectType && selectType.length > 0) {
          data[i].name = selectType[0].name
        }
         products.push(data[i])
      }
    }
    return products

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
  };

  visibleModel = () => {
    this.setState({ visiblemodel: !this.state.visiblemodel })
  }

  handleEdit = (key, row) => {
    this.setState({ loadingData: true });
    setTimeout(() => {
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_PRODUCT, state: { data: row[0].id } });
    }, 2000);

  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    let body = {
      id: row[0].id,
    }
    await API.graphql(graphqlOperation(deleteProduct, body))
    message.success('Product deleted successfully');
    this.onSelectionChange([], '');
    this.setState({
      loadingData: false
    });
    this.fetchData();
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

export default withRouter(Product);



