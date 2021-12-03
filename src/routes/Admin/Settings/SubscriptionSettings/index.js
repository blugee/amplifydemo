import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../components/InputControl/InputText/InputId';
import { API, } from 'aws-amplify';
import InputTextarea from '../../../../components/InputControl/InputTextarea/InputTextarea';
import InputTextEditor from '../../../../components/InputControl/InputTextEditor/InputTextEditor';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import './SubscriptionSetting.css'
import InputNumber from '../../../../components/InputControl/InputNumber/InputNumber';
import InputSelect from '../../../../components/InputControl/InputSelect/InputSelect';

const FormItem = Form.Item;

class SubscriptionSettings extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            condition3: EditorState.createEmpty(),
            yearlySubscriptionMessage: EditorState.createEmpty(),
            sampleDataReportDetails: EditorState.createEmpty(),
            startSubscriptionMessage: EditorState.createEmpty(),
            upgradeSubscriptionMessage: EditorState.createEmpty(),
            overLimitMessage: EditorState.createEmpty(),
            queryLimitMessage: EditorState.createEmpty(),

            yearlySubscriptionFormTitle: EditorState.createEmpty(),
            yearlySubscriptionDescription: EditorState.createEmpty(),
            yearlySubscriptionTitle: EditorState.createEmpty(),
            cancelSubscriptionApplyMessage: EditorState.createEmpty(),
            fieldArray: ['condition3', 'startSubscriptionMessage', 'upgradeSubscriptionMessage', 'sampleDataReportDetails', 'yearlySubscriptionMessage', 'yearlySubscriptionFormTitle', 'yearlySubscriptionDescription', 'yearlySubscriptionTitle', 'queryLimitMessage', 'overLimitMessage',],

            data: {},
            stateOptionsList: [],
            selectedState: [],
            filterStateOptionsList: [],
            subscriptionTypes: [{
                id: 'MONTHLY', name: "Monthly",
            }, {
                id: 'ANNUALLY', name: "Annually",
            }]
        }
    }

    formRef = React.createRef();

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ spinLoading: true })
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/subscriptionSettings', {})
        if (res.success) {
            res = res.result
            if (res && res.length > 0) {
                let fieldArray = this.state.fieldArray
                for (let i = 0; i < fieldArray.length; i++) {
                    if (res[0][fieldArray[i]]) {
                        const contentBlock = htmlToDraft(res[0][fieldArray[i]]) || ''
                        if (contentBlock) {
                            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                            const editorState = EditorState.createWithContent(contentState);
                            this.setState({ [fieldArray[i]]: editorState })
                        }
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
            var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateSubscriptionSettings', { body })
            if (res.success) {
                message.success('Subscription Settings updated successfully')
            } else {
                message.error('Something wrong happen')
            }

        } else {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveSubscriptionSettings', { body })
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
        this.setState({ data: data })
    }


    render() {
        const { form } = this.props;
        const { startSubscriptionMessage, upgradeSubscriptionMessage, condition3, sampleDataReportDetails, data, yearlySubscriptionMessage, overLimitMessage, queryLimitMessage, yearlySubscriptionTitle, yearlySubscriptionDescription, yearlySubscriptionFormTitle } = this.state
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

                    <Card title='Sign-Up Details'>
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
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Signup Agreement Details'
                                        name='signupAgreementDetails'
                                        validationMessage='Please input correct signup agreement details'
                                        requiredMessage='Please input signup agreement details'
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Sample Data Report Title'
                                        name='sampleDataReportTitle'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Sample Data Report Details'
                                        name='sampleDataReportDetails'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={sampleDataReportDetails}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                </Col>
                            </Row>
                        </Spin>
                    </Card>

                    <Card title='Subscription Settings'>
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
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Condition 1'
                                        name='condition1'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Condition 2'
                                        name='condition2'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Condition 3'
                                        name='condition3'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={condition3}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Start Subscription Message'
                                        name='startSubscriptionMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={startSubscriptionMessage}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Upgrade Subscription Message'
                                        name='upgradeSubscriptionMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={upgradeSubscriptionMessage}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Subscription Agreement Details'
                                        name='subscriptionAgreementDetails'
                                        validationMessage='Please input correct subscription agreement details'
                                        requiredMessage='Please input subscription agreement details'
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputSelect
                                        defaultValue={data.defaultSubscriptionType}
                                        field={this.props.form}
                                        label='Default Subscription Type'
                                        name='defaultSubscriptionType'
                                        validationMessage='Please input default subscription type'
                                        requiredMessage='Please input default subscription type'
                                        display={true}
                                        required={true}
                                        list={this.state.subscriptionTypes}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Yearly Subscription Message'
                                        name='yearlySubscriptionMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={yearlySubscriptionMessage}
                                    />
                                </Col>


                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Yearly Subcription Title'
                                        name='yearlySubscriptionTitle'
                                        validationMessage='Please input correct support page title'
                                        requiredMessage='Please input support page title'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={yearlySubscriptionTitle}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Yearly Subcription Description'
                                        name='yearlySubscriptionDescription'
                                        validationMessage='Please input correct subscription agreement details'
                                        requiredMessage='Please input subscription agreement details'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={yearlySubscriptionDescription}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Yearly Subcription Form Title'
                                        name='yearlySubscriptionFormTitle'
                                        validationMessage='Please input correct drop us title'
                                        requiredMessage='Please input drop us title'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={yearlySubscriptionFormTitle}
                                    />
                                </Col>

                                {/* <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextarea
                                        rows={4}
                                        field={form}
                                        label='Cancel susbcription Status'
                                        name='cancelStatusMessage'
                                        validationMessage='Please input correct status'
                                        requiredMessage='Please input status'
                                        display={true}
                                        required={true}
                                    />
                                </Col> */}
                            </Row>
                        </Spin>
                    </Card>
                    <Card title='Free Data'>
                        <Spin tip="Loading..." spinning={this.state.spinLoading}>



                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputNumber
                                        field={this.props.form}
                                        label='Daily Limit'
                                        name='dailyLimit'
                                        validationMessage='please enter only digits'
                                        requiredMessage='please enter value'
                                        pattern={new RegExp(/^[0-9]*$/g)}
                                        display={true}
                                        required={true}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>

                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Over Limit Message'
                                        name='overLimitMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={overLimitMessage}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Query Limit Message'
                                        name='queryLimitMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        // mention={{
                                        //     separator: ' ',
                                        //     trigger: '{',
                                        //     suggestions: [
                                        //         { text: 'REMAINING_DATA', value: '{REMAINING_DATA}}' },
                                        //         { text: 'DATA_LIMIT', value: '{DATA_LIMIT}}' },
                                        //     ],
                                        // }}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={queryLimitMessage}
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

export default withRouter(SubscriptionSettings);
