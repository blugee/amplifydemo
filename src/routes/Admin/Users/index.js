import React, { Component } from "react";
import Auxiliary from "../../../util/Auxiliary";
import DefaultTable from "../../../components/DefaultTable/DefaultTable";
import { GetAllUser, EnableUser, DisableUser, UpdateUserPassword } from "../../../util/UserService";
import { Menu, message, Modal, Form, Row, Col } from "antd";
import { CheckCircleOutlined, MinusCircleOutlined, PlusOutlined, ToTopOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import * as urlConfig from '../../../constants/URLConstant';
import InputText from "../../../components/InputControl/InputText/InputText";

const title = 'Users List';

class Coupon extends Component {
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
      { title: 'Username', dataIndex: 'given_name', key: 'given_name', sorter: (a, b) => this.sorter(a.given_name, b.given_name) },
      { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => this.sorter(a.email, b.email) },
      { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number', sorter: (a, b) => this.sorter(a.phone_number, b.phone_number) },
      { title: 'Email Verified', dataIndex: 'email_verified', key: 'email_verified', render: (text, index) => index.email_verified === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.email_verified, b.email_verified) },
      { title: 'User Status', dataIndex: 'UserStatus', key: 'UserStatus', render: (text, index) => index.UserStatus === 'CONFIRMED' ? 'Confirmed' : 'Unconfirmed', sorter: (a, b) => this.sorter(a.UserStatus, b.UserStatus) },
      { title: 'Active', dataIndex: 'Enabled', key: 'Enabled', render: (text, index) => index.Enabled === true ? 'True' : 'False', sorter: (a, b) => this.sorter(a.Enabled, b.Enabled) },
    ]

    this.tableData = {
      title: title,
      columns: columns,
      search: true,
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
    var data = await GetAllUser()
    data = data.Users
    let dataArray = []
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        let dataObj = {
          UserStatus: data[i].UserStatus,
          Enabled: data[i].Enabled,
          Username: data[i].Username,
          id: data[i].Username,
        }
        for (let index = 0; index < data[i].Attributes.length; index++) {
          dataObj = { ...dataObj, [data[i].Attributes[index].Name]: data[i].Attributes[index].Value }
        }
        dataArray.push(dataObj)
      }
    }
    this.setState({ data: dataArray, loadingData: false })
  }

  onActionChange = value => {
    const actionValue = value.key;
    this.showConfirm(actionValue);
  };

  enableEntity = async (key, row) => {

    try {
      this.setState({ loadingData: true })
      var response = await EnableUser(row[0].Username)
      if (!response.message) {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('User activated successfuly');
        this.fetchData()
      } else {
        message.error(response.message);
      }
    } catch (ex) {
      console.log(ex)
      message.error('Something wrong happened');
      this.setState({
        selectedRowKeys: [],
        selectedRows: '',
        loadingData: false
      });
    }
  };

  disabledEntity = async (key, row) => {

    try {
      this.setState({ loadingData: true })
      var response = await DisableUser(row[0].Username)
      if (!response.message) {
        this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
        message.success('User deactivated successfuly');
        this.fetchData()
      } else {
        message.error(response.message);
      }
    } catch (ex) {
      console.log(ex)
      message.error('Something wrong happened');
      this.setState({
        selectedRowKeys: [],
        selectedRows: '',
        loadingData: false
      });
    }
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
    } else if (type === 'edit') {
      this.setState({
        actionData: {
          message: 'Do you want to edit selected entries?', action: e => that.handleEdit(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'changePassword') {
      this.handlePassowrdChange()

    }
  };

  handlePassowrdChange = () => {
    this.setState({ isVisible: true, visiblemodel: false, visible_confirm_model: false }, () => {
      document.getElementById("passwordRequirements").style.display = "none";
    })

  }


  visibleModel = () => {
    this.setState({ visiblemodel: !this.state.visiblemodel })
  }

  handleEdit = (key, row) => {
    this.setState({ loadingData: true });
    setTimeout(() => {
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_USER, state: { data: row[0] } });
    }, 2000);

  };

  handleOk = async () => {
    let row = this.state.selectedRows
    let password = this.state.password
    if (!password) {
      message.error("please enter new password")
    } else {
      this.setState({ loadingData: true })
      try {
        var response = await UpdateUserPassword(password, row[0].Username)
        if (!response.message) {
          this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
          message.success('User password change successfuly');
          this.setState({ isVisible: false, })
          this.fetchData()
        } else {
          message.error(response.message);
        }
      } catch (err) {
        if (err.message.includes("password") || err.message.includes("Password")) {
          document.getElementById("passwordRequirements").style.display = "block";

          password.length > 7 ? this.setState({ lengthState: true }) : this.setState({ lengthState: false });


          /[A-Z]/.test(password) ? this.setState({ upperState: true }) : this.setState({ upperState: false });

          /\d/.test(password) ? this.setState({ numberState: true }) : this.setState({ numberState: false });

          const format = /[!@#$%^&*()_+\-={};':"\\|,.<>?]+/
            ;
          format.test(password) ? this.setState({ symbolState: true }) : this.setState({ symbolState: false })
        } else {
          document.getElementById("passwordRequirements").style.display = "none";
          this.setState({ isVisible: false, loadingData: true })
          message.error(err.message);
        }

        console.log(err)

        this.setState({
          loadingData: false
        });
      }
      this.setState({ password: null })
    }

  }

  handleCancel = async () => {
    this.setState({ isVisible: false, })
  }

  handleChange = (name, e) => {
    this.setState({ [name]: e })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        xl: { span: 24 },
        lg: { span: 24 },
        md: { span: 24 }
      },
    };

    const { form } = this.props;

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
        <Menu.Item key="changePassword">
          <ToTopOutlined />
                   Change Password
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
        <Modal title="Change Password" visible={this.state.isVisible} onOk={() => this.handleOk()} okText={"Submit"} onCancel={() => this.handleCancel()}>
          <Form ref={this.formRef} form={form} onFinish={this.onFinish} {...formItemLayout}>
            <Row type="flex" justify="center">
              <Col sm={24} xs={24}>
                <InputText
                  defaultValue={true}
                  showSearch={true}
                  field={form}
                  label='New Password'
                  name='password'
                  validationMessage='Please input correct password'
                  requiredMessage='Please input password'
                  display={true}
                  required={true}
                  onChange={(e) => this.handleChange('password', e)}
                />
                  <div id="passwordRequirements" style={{ paddingLeft: 30, paddingRight: 5 }}>
              <span style={this.state.lengthState ? { color: 'green' } : { color: 'red' }}>* More than 8 characters.</span> <br />
              <span style={this.state.upperState ? { color: 'green' } : { color: 'red' }} >* At least 1 Uppercase.</span> <br />
              <span style={this.state.numberState ? { color: 'green' } : { color: 'red' }} >* At least 1 Number.</span> <br />
              <span style={this.state.symbolState ? { color: 'green' } : { color: 'red' }} >* At least 1 Symbol.</span> <br />
            </div>
              </Col>
            </Row>
          
          </Form>
        </Modal>
      </Auxiliary>
    );
  }
}

export default withRouter(Coupon);



