import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddUser from './AddUser';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './userDetails.css'
import { UpdateUserData } from '../../../../util/UserService';
import * as urlConfig from '../../../../constants/URLConstant';
import { listUserByEmail } from '../../../../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import { updateUser } from '../../../../graphql/mutations';

const FormItem = Form.Item;

class UserDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      this.setState({ idRow: true })
      this.setState({ customerEmail: this.props.location.state.data.email })
      this.formRef.current.setFieldsValue({
        given_name: this.props.location.state.data.given_name,
        family_name: this.props.location.state.data.family_name,
        phone_number: this.props.location.state.data.phone_number,
        email: this.props.location.state.data.email,
        'custom:company-name': this.props.location.state.data['custom:company-name']
      });
    }
  }


  onSave = async (values) => {
    try {
      this.setState({
        loadingData: true
      });
      let isUserUpdate = true
      if (this.state.customerEmail !== values.email) {
        let getUser = {
          email: this.state.customerEmail
        }
        await API.graphql(graphqlOperation(listUserByEmail, getUser))
          .then(async (result) => {
            if (result && result.data && result.data.listUserByEmail && result.data.listUserByEmail.items && result.data.listUserByEmail.items.length > 0) {
              let updateUserData = {
                updateUserInput: {
                  id: result.data.listUserByEmail.items[0].id,
                  email: values.email
                }
              }

              await API.graphql(graphqlOperation(updateUser, updateUserData))
                .catch(err => {
                  console.log(err)
                  isUserUpdate = true
                  message.error('Something wrong happened');
                });
            }
          })
          .catch(err => {
            console.log(err)
            isUserUpdate = true
            message.error('Something wrong happened');
          });
      }

      if (isUserUpdate === true) {
        values['email_verified'] = 'true'
        let output = Object.entries(values).map(([Name, Value]) => ({ Name, Value }));
        let response = await UpdateUserData(output, this.props.location.state.data.Username)
        if (!response.message) {



          message.success('Data saved successfully ');
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_USER_LIST, });
          }, 1000);
        }

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



  render() {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    return (
      <Card title='User Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>
          <Form ref={this.formRef} form={form} onFinish={this.onSave} {...formItemLayout}>
            <div className="components-table-demo-control-bar">
              <FormItem
                className='header-button-content'>
                <Button
                  type='primary'
                  icon={<ArrowLeftOutlined />}
                  onClick={() => this.props.history.goBack()}
                  style={{ marginBottom: 0 }}
                >
                  Back
                </Button>
              </FormItem>
              <FormItem
                className='header-button-content'>
                <Button
                  type='primary'
                  htmlType="submit"
                  loading={this.state.loadingData}
                  style={{ marginBottom: 0 }}
                >
                  Save Details
                </Button>
              </FormItem>
            </div>
            <AddUser form={form} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (UserDetails);

export default WrappedLocalAuthForm;
