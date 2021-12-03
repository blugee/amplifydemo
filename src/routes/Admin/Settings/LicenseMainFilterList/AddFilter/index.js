import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddFilter from './AddFilter';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { getLicenseMainFilterList } from '../../../../../graphql/queries';
import * as urlConfig from '../../../../../constants/URLConstant';

const FormItem = Form.Item;

class FilterDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      filteredArray: [{
        key: 1,
        filtertype: '',
        filtervalue: '',
      },],
    };

  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      await API.graphql(graphqlOperation(getLicenseMainFilterList, body))
        .then(async (result) => {
          result = result.data.getLicenseMainFilterList
          if (result) {
            let filterArray = await this.createArray(result.filter)
            this.setState({ filteredArray: filterArray })
            let initialValueObj = {
              id: result.id,
              name: result.name,
              filterOrder: result.filterOrder,
              active: result.active,
            }
            for (let i = 0; i < filterArray.length; i++) {
              initialValueObj = {
                ...initialValueObj,
                ["filtertype" + filterArray[i].key]: filterArray[i].filtertype,
                ["operator" + filterArray[i].key]: filterArray[i].operator,
                ["filtervalue" + filterArray[i].key]: filterArray[i].filtervalue,
              }
            }
            this.formRef.current.setFieldsValue(initialValueObj);

          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });

    }
    this.setState({ spinLoading: false })
  }

  createArray = async (data) => {
    data = JSON.parse(data)
    return data.map((item, i) => {
      var arr = Object.entries(item)
      var value = Object.entries(arr[0][1])
      return {
        key: i + 1,
        filtertype: arr[0][0],
        operator: value[0][0],
        filtervalue: value[0][1]
      };
    });
  }

  onFinish = async (data) => {
    this.setState({ loadingData: true })
    let filter = await this.formatData(this.state.filteredArray)
    filter = JSON.stringify(filter)
    let body = {
      id: data.id,
      name: data.name,
      filterOrder: data.filterOrder,
      filter: filter,
      active: data.active
    }
    let response
    if (data.id) {
      response = await API.post('PaymentGatewayAPI', `/paymentgateway/licenseMainFilter/${data.id}`, { body })
    } else {
      response = await API.post('PaymentGatewayAPI', `/paymentgateway/licenseMainFilter`, { body })
    }
    this.setState({
      loadingData: false
    });
    if (response.success) {
      message.success('Filter added successfully')
      setTimeout(() => {
        this.props.history.push({ pathname: urlConfig.ADMIN_MAIN_FILTER_LIST, });
      }, 1000);
    } else {
      console.log(response.err)
      message.error('Something wrong happened');
    }
  };

  formatData = (data) => {
    return data.map((item, i) => {
      return {
        [item['filtertype']]: { [item['operator']]: item['filtervalue'] }
      };
    });
  }

  handleFilteredArray = (e) => {
    this.setState({ filteredArray: e })
  }

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
      <Card title='Filter Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>

          <Form ref={this.formRef} form={form} onFinish={this.onFinish} {...formItemLayout}>
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
            <AddFilter form={form} filteredArray={this.state.filteredArray} handleFilter={(e) => this.handleFilteredArray(e)} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (FilterDetails);

export default WrappedLocalAuthForm;
