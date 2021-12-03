import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../components/InputControl/InputText/InputId';
import { API, } from 'aws-amplify';
import InputTextEditor from '../../../../components/InputControl/InputTextEditor/InputTextEditor';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import './AlertSettings.css'

const FormItem = Form.Item;

class AlertSettings extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            documentation: EditorState.createEmpty(),
            frequentlyAskedQuestion: EditorState.createEmpty(),
            hearFromYouDeatils: EditorState.createEmpty(),
            subscriptionInterruption: EditorState.createEmpty(),
            data: {},
            stateOptionsList: [],
            fieldArray: ['loginSuccess', 'loginError', 'subscriptionInterruption', 'reportPurchase', 'invalidCardErrorMessage', 'generalCardErrorMessage', 'reportGenerate', 'purchaseSuccess', 'purchaseError', 'reportSuccess', 'reportError', 'genericAlert'],
            selectedState: [],
            filterStateOptionsList: []
        }
    }

    formRef = React.createRef();

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ spinLoading: true })
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/alertSettings', {})
        if (res.success) {
            res = res.result

            if (res && res.length > 0) {
                let array = this.state.fieldArray
                for (let i = 0; i < array.length; i++) {
                    if (res[0][array[i]]) {
                        const supportContentBlock = htmlToDraft(res[0][array[i]]) || ''
                        if (supportContentBlock) {
                            const contentState = ContentState.createFromBlockArray(supportContentBlock.contentBlocks);
                            const editorState = EditorState.createWithContent(contentState);
                            this.setState({ [array[i]]: editorState })
                        }
                    } else {
                        this.setState({ [array[i]]: EditorState.createEmpty() })
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
        let fieldArray = this.state.fieldArray
        for (let i = 0; i < fieldArray.length; i++) {
            data[fieldArray[i]] = this.state.data[fieldArray[i]]
        }
        let body = {
            ...data
        }
        if (data.id) {
            var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateAlertSettings', { body })
            if (res.success) {
                message.success('Support Settings updated successfully')
            } else {
                message.error('Something wrong happen')
            }

        } else {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveAlertSettings', { body })
            if (response.success) {
                this.fetchData()
                message.success('Support Settings added successfully')
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
        this.setState({ data: data })
    }


    render() {
        const { form } = this.props;
        const { loginSuccess, loginError, purchaseSuccess, invalidCardErrorMessage, reportPurchase, generalCardErrorMessage, reportGenerate, subscriptionInterruption, purchaseError, reportSuccess, reportError, genericAlert } = this.state
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

                    <Card title='Alert Settings'>
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
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Login Success'
                                        name='loginSuccess'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={loginSuccess}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Login Error'
                                        name='loginError'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={loginError}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Purchase Success'
                                        name='purchaseSuccess'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        mention={{
                                            separator: ' ',
                                            trigger: '{',
                                            suggestions: [
                                                { text: 'REPORT_NAME', value: '{REPORT_NAME}}' },
                                            ],
                                        }}
                                        defaultValue={purchaseSuccess}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Purchase Error'
                                        name='purchaseError'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        mention={{
                                            separator: ' ',
                                            trigger: '{',
                                            suggestions: [
                                                { text: 'REPORT_NAME', value: '{REPORT_NAME}}' },
                                            ],
                                        }}
                                        onChange={this.handleChange}
                                        defaultValue={purchaseError}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Report Success'
                                        name='reportSuccess'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={reportSuccess}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Report Error'
                                        name='reportError'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={reportError}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Report Purchase'
                                        name='reportPurchase'
                                        validationMessage='Please input correct report purchase'
                                        requiredMessage='Please input report purchase'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={reportPurchase}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Report Generate'
                                        name='reportGenerate'
                                        validationMessage='Please input correct report generate'
                                        requiredMessage='Please input report generate'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={reportGenerate}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Generic Alert'
                                        name='genericAlert'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={genericAlert}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Subscription Interruption'
                                        name='subscriptionInterruption'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={subscriptionInterruption}
                                    />
                                </Col>
                            </Row>
                        </Spin>
                    </Card>
                    <Card title='Credit Card Alert Settings'>
                        <Spin tip="Loading..." spinning={this.state.spinLoading}>
                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Invalid Card Error Message'
                                        name='invalidCardErrorMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={invalidCardErrorMessage}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='General Card Error Message'
                                        name='generalCardErrorMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={generalCardErrorMessage}
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

export default withRouter(AlertSettings);
