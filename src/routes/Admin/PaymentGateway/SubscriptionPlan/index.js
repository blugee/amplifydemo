import React, { Component } from "react";
import Auxiliary from "../../../../util/Auxiliary";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { Menu, message } from "antd";
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import { listSubscriptionPlanByPlanTypeAndActive, listSubscriptionPlans } from "../../../../graphql/queries";
import { deleteSubscriptionPlan, updateSubscriptionPlan } from "../../../../graphql/mutations";
import * as urlConfig from '../../../../constants/URLConstant';

const title = 'Subscription Plan List';

class SubscriptionPlan extends Component {
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
      subscriptionPlans: []
    }

    this.sorter = (v1, v2) => {
      return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    }

    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => this.sorter(a.name, b.name) },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
      button: 'Add Plan',
      addNewDataUrl: urlConfig.ADMIN_ADD_SUBSCRIPTION_PLAN,
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
    let res = await API.graphql(graphqlOperation(listSubscriptionPlans, {}))
    res = res.data.listSubscriptionPlans
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      this.setState({ data: res, })
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
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_SUBSCRIPTION_PLAN, state: { data: row[0].id } });
    }, 2000);

  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    let body = {
      id: row[0].id
    }
    await API.graphql(graphqlOperation(deleteSubscriptionPlan, body))
      .then(result => {
        message.success('Filter deleted successfully')
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
      active: 'true',
      planType: row[0].planType
    }

    await API.graphql(graphqlOperation(listSubscriptionPlanByPlanTypeAndActive, filterBody))
      .then(async (res) => {
        res = res.data.listSubscriptionPlanByPlanTypeAndActive.items
        if (res && res.length > 0) {
          message.error('Selected Plan Type active in another plan')
          this.setState({ loadingData: false })
        } else {
          let data = {
            updateSubscriptionPlanInput: {
              id: row[0].id,
              active: true
            }
          }
          await API.graphql(graphqlOperation(updateSubscriptionPlan, data))
            .then(result => {
              this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
              message.success('Filter activated successfuly');
              this.fetchData()
            })
            .catch(err => {
              console.log(err)
              this.setState({
                loadingData: false
              });
              message.error('Something wrong happened');

            });
        }
      })
      .catch(err => {
        console.log(err)
        message.error('something bad happen')
        this.setState({ loadingData: false })
      })

  };

  disabledEntity = async (key, row) => {
    this.setState({ loadingData: true })
    let data = {
      updateSubscriptionPlanInput: {
        id: row[0].id,
        active: false
      }
    }
    await API.graphql(graphqlOperation(updateSubscriptionPlan, data))
      .then(result => {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('Filter deactivated successfuly');
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

export default withRouter(SubscriptionPlan);



