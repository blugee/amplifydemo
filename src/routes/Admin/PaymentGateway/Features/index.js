import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { Menu, message } from "antd";
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import { listFeatureByPlanTypeAndActive, listFeatures, listSubscriptionPlans } from "../../../../graphql/queries";
import { updateFeature, deleteFeature } from "../../../../graphql/mutations";
import * as urlConfig from '../../../../constants/URLConstant';

const title = 'Features List';

class Features extends Component {
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
      { title: 'Subscription Name', dataIndex: 'subName', key: 'subName', sorter: (a, b) => this.sorter(a.subName, b.subName) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Feature',
      addNewDataUrl: urlConfig.ADMIN_ADD_FEATURES,
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
    let response = await API.graphql(graphqlOperation(listSubscriptionPlans, {}))
    response = response.data.listSubscriptionPlans
    if (!response.errors) {
      this.setState({ subPlanList: response, })
    }
    let res = await API.graphql(graphqlOperation(listFeatures, {}))
    res = res.data.listFeatures

    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      res = await this.formateData(res)
      this.setState({ data: res, })
    }
    this.setState({ loadingData: false })
  }

  onActionChange = value => {
    this.showConfirm(value.key);
  };

  formateData(data) {
    return data.map((item, i) => {
      let subscriptionPlan = []
      if (this.state.subPlanList && this.state.subPlanList.length > 0) {
        subscriptionPlan = this.state.subPlanList.filter(plan => plan.planType === item.subscriptionPlanId)
      }
      if (subscriptionPlan.length > 0) {
        return {
          ...item,
          subName: subscriptionPlan[0].name
        };
      } else {
        return {
          ...item,
        };
      }

    });
  }

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
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_FEATURES, state: { data: row[0].id } });
    }, 2000);

  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    let body = {
      id: row[0].id
    }
    await API.graphql(graphqlOperation(deleteFeature, body))
      .then(result => {
        message.success('Feature deleted successfully')
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


  enableEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let filterBody = {
      active: true,
      subscriptionPlanId: row[0].subscriptionPlanId
    }

    await API.graphql(graphqlOperation(listFeatureByPlanTypeAndActive, filterBody))
      .then(async (res) => {
        res = res.data.listFeatureByPlanTypeAndActive.items
        if (res && res.length > 0) {
          message.error("Selected feature's subscription plan is already active")
        } else {
          let data = {
            updateFeatureInput: {
              id: row[0].id,
              active: true
            }
          }
          await API.graphql(graphqlOperation(updateFeature, data))
            .then(result => {
              this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
              message.success('Feature activated successfuly');
              this.fetchData()
            })
            .catch(err => {
              console.log(err)
              this.setState({
                loadingData: false
              });
              this.setState({ loadingData: false })
              message.error('Something wrong happened');

            });
        }

      })
      .catch(err => {
        console.log(err)
        this.setState({ loadingData: false })
        message.error('something bad happen')
      })
  };


  disabledEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let data = {
      updateFeatureInput: {
        id: row[0].id,
        active: false
      }
    }
    await API.graphql(graphqlOperation(updateFeature, data))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Feature deactivated successfuly');
        this.fetchData()
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loadingData: false
        });
        message.error('Something wrong happened');

      });
  };

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

export default withRouter(Features);



