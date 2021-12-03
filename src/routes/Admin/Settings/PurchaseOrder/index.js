import React, { Component } from "react";
import { Card, Col, Spin, Row, Form, Button, message } from "antd";
import { withRouter } from "react-router-dom";
import { API } from 'aws-amplify';
import InputTextarea from "../../../../components/InputControl/InputTextarea/InputTextarea";
import InputText from "../../../../components/InputControl/InputText/InputText";
import InputId from '../../../../components/InputControl/InputText/InputId';
import './PurchaseOrder.css'
import InputTextEditor from "../../../../components/InputControl/InputTextEditor/InputTextEditor";
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';

const FormItem = Form.Item;


class PurchaseOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spinLoading: false,
      data: {},
      popupTitle: EditorState.createEmpty(),
      popupDescription: EditorState.createEmpty(),
      email: '',
      emailSubject: '',
    }
  }

  formRef = React.createRef();
  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    var res = await API.post('PaymentGatewayAPI', '/paymentgateway/PurchaseOrderSettings', {})
    if (res.success) {
      res = res.result
      if (res && res.length > 0) {

        if (res[0].popupTitle) {
          const contentBlock = htmlToDraft(res[0].popupTitle) || ''
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ popupTitle: editorState })
          }
        }

        if (res[0].popupDescription) {
          const contentBlock = htmlToDraft(res[0].popupDescription) || ''
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ popupDescription: editorState })
          }
        }

        this.setState({ data: res[0] })
        this.formRef.current && this.formRef.current.setFieldsValue({
          ...res[0],
        });

      }
    } else {
      message.error('Something wrong happen')
    }
    this.setState({ spinLoading: false, })
  }


  onFinish = async (data) => {
    this.setState({ loadingData: true })
    data.popupTitle = this.state.data.popupTitle
    data.popupDescription = this.state.data.popupDescription
    let body = {
      ...data
    }
    if (data.id) {
      var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updatePurchaseOrderSettings', { body })
      if (res.success) {
        message.success('Subscription Settings updated successfully')
      } else {
        message.error('Something wrong happen')
      }

    } else {
      var response = await API.post('PaymentGatewayAPI', '/paymentgateway/savePurchaseOrderSettings', { body })
      if (response.success) {
        message.success('Subscription Settings added successfully')
        this.fetchData()
      } else {
        message.error('Something wrong happen')
      }
    }
    this.setState({
      loadingData: false
    });

  };

  handleChange = (name, value) => {
    let data = this.state.data
    data[name] = value
    this.setState({ loadingData: false })
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
      <Form ref={this.formRef} form={form} onFinish={this.onFinish}  {...formItemLayout}>
        <Card>
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

          <Card title='Purchase-Order Details'>
            <Spin tip="Loading..." spinning={this.state.spinLoading}>


              <Row type="flex" justify="center">
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <InputId
                    field={form}
                    label='form.label.id'
                    name="id"
                    display={false}
                  />
                </Col>
              </Row>
              <Row type="flex" justify="center">

                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <InputText
                    rows={4}
                    field={form}
                    label='Email'
                    name='email'
                    validationMessage='Please input correct email'
                    requiredMessage='Please input email'
                    display={true}
                    required={true}
                  />
                </Col>

                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <InputTextarea
                    rows={4}
                    field={form}
                    label='Email Subject'
                    name='emailSubject'
                    validationMessage='Please input correct Subject'
                    requiredMessage='Please input Subject'
                    display={true}
                    required={true}
                  />
                </Col>

                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <InputTextEditor
                    rows={4}
                    field={form}
                    label='Submit Popup Title'
                    name='popupTitle'
                    validationMessage='Please input correct details'
                    requiredMessage='Please input details'
                    display={true}
                    required={true}
                    onChange={this.handleChange}
                    defaultValue={this.state.popupTitle}
                  />
                </Col>
                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                  <InputTextEditor
                    rows={4}
                    field={form}
                    label='Submit Popup Deatils'
                    name='popupDescription'
                    validationMessage='Please input correct details'
                    requiredMessage='Please input details'
                    display={true}
                    required={true}
                    onChange={this.handleChange}
                    defaultValue={this.state.popupDescription}
                  />
                </Col>

              </Row>
            </Spin>
          </Card>
        </Card>
      </Form>

    );
  }
}







export default withRouter(PurchaseOrder);



