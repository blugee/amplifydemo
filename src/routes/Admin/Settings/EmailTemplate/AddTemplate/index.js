import React, { PureComponent } from 'react';
import { Button, Card, Form, message, Spin } from "antd";
import AddTemplate from './AddTemplate';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../../constants/URLConstant';
import { searchEmailTemplate } from '../../../../../graphql/queries';

const FormItem = Form.Item;

class EmailTemplateDetails extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      loadingData: false,
      spinLoading: false,
    };

  }

  formRef = React.createRef()
  templateDetails = React.createRef()

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      var res = await API.post('PaymentGatewayAPI', '/paymentgateway/getEmailTemplateById', { body })
      if (res.success) {
        res = res.result[0]
        if (res) {
          this.setState({ data: res })
          this.formRef.current && this.formRef.current.setFieldsValue({
            id: res.id,
            event: res.event,
            subject: res.subject
          });
          if (res.design) {
            this.handleLoadDesign(res.design)
          }
        }
      } else {
        console.log(JSON.stringify(res))
        message.error('Something wrong happened');
      }
    }
    this.setState({ spinLoading: false })
  }

  handleLoadDesign = async (design) => {
    let designS = design;
    designS = await designS.replaceAll('\n', '');
    let data = await JSON.parse(designS)
    if (this.templateDetails && this.templateDetails.current && this.templateDetails.current.emailEditorRef && this.templateDetails.current.emailEditorRef.current) {
      await this.templateDetails.current.emailEditorRef.current.editor.loadDesign(data)
    }
  }


  onFinish = async (data) => {
    this.setState({ loadingData: true })
    if (this.templateDetails && this.templateDetails.current && this.templateDetails.current.emailEditorRef && this.templateDetails.current.emailEditorRef.current) {
      await this.templateDetails.current.emailEditorRef.current.editor.exportHtml(async (item) => {
        const { design, html } = item;
        let htmlCode = await html.replaceAll('"', "'")
        let designS = JSON.stringify(design);
        let designString = ''
        let designArray = designS.split('<');
        for (let i = 0; i < designArray.length; i++) {
          let element = designArray[i].split('>')
          if (element.length > 1) {
            let finalString = element[0].replaceAll('"', '\\\\\"')
            designString += `<${finalString}>${element[1]}`
          } else {
            if (i === 0) {
              designString += designArray[i]
            } else {
              designString += `<${designArray[i]}`
            }
          }
        }
        designS = designString
        let body = { ...data, design: designS, html: htmlCode }
        if (data.id) {
          var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateEmailTemplate', { body })
          if (res.success) {
            message.success('Email template updated successfully')
            setTimeout(() => {
              this.props.history.push({ pathname: urlConfig.ADMIN_EMAIL_TEMPLATE_PAGE_LIST, });
            }, 1000);
          } else {
            this.setState({
              loadingData: false
            });
            message.error('Something wrong happen')
          }
        } else {
          let emailBody = {
            event: data.event,
          }
          let result = await API.graphql(graphqlOperation(searchEmailTemplate, emailBody))
          if (result.data && !result.data.searchEmailTemplate.length > 0) {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveEmailTemplate', { body })
            if (response.success) {
              message.success('Email template added successfully')
              setTimeout(() => {
                this.props.history.push({ pathname: urlConfig.ADMIN_EMAIL_TEMPLATE_PAGE_LIST, });
              }, 1000);
            } else {
              this.setState({
                loadingData: false
              });
              message.error('Something wrong happen')
            }
          } else {
            message.error("event already exist")
          }
          this.setState({
            loadingData: false
          });
        }

      })
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
      <Card title='Email Template Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>

          <Form ref={this.formRef} form={form} onFinish={(e) => this.onFinish(e)} {...formItemLayout}>
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
            <AddTemplate form={form} ref={this.templateDetails} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (EmailTemplateDetails);

export default WrappedLocalAuthForm;
