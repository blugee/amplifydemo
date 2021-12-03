import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../components/InputControl/InputText/InputId';
import { API, } from 'aws-amplify';
import InputTextEditor from '../../../../components/InputControl/InputTextEditor/InputTextEditor';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import './MaintenanceWindow.css'
import InputSelect from '../../../../components/InputControl/InputSelect/InputSelect';

const FormItem = Form.Item;

class MaintenanceWindow extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            maintenanceWindowMessage: EditorState.createEmpty(),
            data: {},
            stateOptionsList: [],
            selectedState: [],
            filterStateOptionsList: [],
            maintananceOptions: [{
                id: 'ENABLE', name: "Enable",
            }, {
                id: 'DISABLE', name: "Disable",
            }]
        }
    }

    formRef = React.createRef();

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ spinLoading: true })
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/maintenanceWindowSettings', {})
        if (res.success) {
            res = res.result
            if (res && res.length > 0) {
                if (res[0].maintenanceWindowMessage) {
                    const messageContentBlock = htmlToDraft(res[0].maintenanceWindowMessage) || ''
                    if (messageContentBlock) {
                        const contentState = ContentState.createFromBlockArray(messageContentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        this.setState({ maintenanceWindowMessage: editorState })
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
        data.maintenanceWindowMessage = this.state.data.maintenanceWindowMessage
        let body = {
            ...data
        }
        if (data.id) {
            var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateMaintenanceWindowSettings', { body })
            if (res.success) {
                message.success('maintenance window settings updated successfully')
            } else {
                message.error('Something wrong happen')
            }

        } else {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveMaintenanceWindowSettings', { body })
            if (response.success) {
                message.success('maintenance window settings added successfully')
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
        const { maintenanceWindowMessage, data } = this.state
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

                    <Card title='Maintenance Window'>
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
                                    <InputSelect
                                        defaultValue={data.maintenanceWindow}
                                        field={this.props.form}
                                        label='Maintenance Window'
                                        name='maintenanceWindow'
                                        validationMessage='Please select maintenance window'
                                        requiredMessage='Please select maintenance window'
                                        display={true}
                                        required={true}
                                        list={this.state.maintananceOptions}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Maintenance Window Message'
                                        name='maintenanceWindowMessage'
                                        validationMessage='Please input correct text'
                                        requiredMessage='Please input text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={maintenanceWindowMessage}
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

export default withRouter(MaintenanceWindow);
