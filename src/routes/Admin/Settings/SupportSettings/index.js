import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import InputId from '../../../../components/InputControl/InputText/InputId';
import { API, } from 'aws-amplify';
import InputTextEditor from '../../../../components/InputControl/InputTextEditor/InputTextEditor';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import './SupportSettings.css'
import OptionParameter from './OptionParameter';

const FormItem = Form.Item;

class SupportSettings extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            dropUsTitle: EditorState.createEmpty(),
            hearFromYouTitle: EditorState.createEmpty(),
            hearFromYouDeatils: EditorState.createEmpty(),
            data: {},
            stateOptionsList: [],
            selectedState: [],
            filteredArray: [{
                key: 1,
                name: '',
            }],
            filterStateOptionsList: []
        }
    }

    formRef = React.createRef();

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ spinLoading: true })
        var res = await API.post('PaymentGatewayAPI', '/paymentgateway/supportSettings', {})
        if (res.success) {
            res = res.result
            if (res && res.length > 0) {
                if (res[0].dropUsTitle) {
                    const supportContentBlock = htmlToDraft(res[0].dropUsTitle) || ''
                    if (supportContentBlock) {
                        const contentState = ContentState.createFromBlockArray(supportContentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        this.setState({ dropUsTitle: editorState })
                    }
                }

                if (res[0].hearFromYouTitle) {
                    const supportContentBlock = htmlToDraft(res[0].hearFromYouTitle) || ''
                    if (supportContentBlock) {
                        const contentState = ContentState.createFromBlockArray(supportContentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        this.setState({ hearFromYouTitle: editorState })
                    }
                }

                if (res[0].hearFromYouDeatils) {
                    const supportContentBlock = htmlToDraft(res[0].hearFromYouDeatils) || ''
                    if (supportContentBlock) {
                        const contentState = ContentState.createFromBlockArray(supportContentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        this.setState({ hearFromYouDeatils: editorState })
                    }
                }

                let filteredArray = []
                if (res[0].issueCategories) {
                    filteredArray = JSON.parse(res[0].issueCategories)
                    if (filteredArray && filteredArray.length > 0) {
                        res[0] = await this.setData(res[0], filteredArray)
                        this.setState({ filteredArray: filteredArray })
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

    setData = (obj, data) => {
        for (let i = 0; i < data.length; i++) {
            obj = {
                ...obj,
                ['name' + data[i].key]: data[i].name,
            }
        }
        return obj
    }

    getOptions = (data, mapArr) => {
        let options = []
        if (mapArr && mapArr.length > 0) {
            for (let i = 0; i < mapArr.length; i++) {
                let obj = {
                    ...mapArr[i],
                    name: data['name' + mapArr[i].key],
                }
                options.push(obj)
            }
        }
        return options

    }

    onFinish = async (data) => {
        this.setState({ loadingData: true })
        let issueCategories = await this.getOptions(data, this.state.filteredArray)
        data.issueCategories = JSON.stringify(issueCategories)
        data.hearFromYouTitle = this.state.data.hearFromYouTitle
        data.dropUsTitle = this.state.data.dropUsTitle
        data.hearFromYouDeatils = this.state.data.hearFromYouDeatils
        let body = {
            ...data
        }
        if (data.id) {
            var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateSupportSettings', { body })
            if (res.success) {
                message.success('Support Settings updated successfully')
            } else {
                message.error('Something wrong happen')
            }

        } else {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveSupportSettings', { body })
            if (response.success) {
                message.success('Support Settings added successfully')
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

    addPerameter() {
        var lastItem = this.state.filteredArray.slice(-1)[0]

        let newObj = {
            key: lastItem.key + 1,
            name: '',
        }
        var newArray = this.state.filteredArray
        var Array = newArray.concat(newObj);
        this.setState({ filteredArray: Array })
    }

    deletePerameter(e) {
        const items = this.state.filteredArray.filter(item => item.key !== e);
        this.setState({ filteredArray: items })
    }

    handlePerameterChange = async (key, name, value) => {
        let demoArray = this.state.filteredArray
        let newArray = [...this.state.filteredArray]
        let objIndex = demoArray.findIndex((obj => obj.key === key));
        newArray[objIndex] = { ...newArray[objIndex], [name]: value }
        this.setState({ filteredArray: newArray })
    }

    render() {
        const { form } = this.props;
        const { dropUsTitle, hearFromYouTitle, hearFromYouDeatils, filteredArray } = this.state
        
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

                    <Card title='Support Settings'>
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
                                        label='Hear From You Title'
                                        name='hearFromYouTitle'
                                        validationMessage='Please input correct support page title'
                                        requiredMessage='Please input support page title'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={hearFromYouTitle}
                                    />
                                </Col>

                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Hear From You Deatils'
                                        name='hearFromYouDeatils'
                                        validationMessage='Please input correct subscription agreement details'
                                        requiredMessage='Please input subscription agreement details'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={hearFromYouDeatils}
                                    />
                                </Col>
                         
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Drop Us Title'
                                        name='dropUsTitle'
                                        validationMessage='Please input correct drop us title'
                                        requiredMessage='Please input drop us title'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={dropUsTitle}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                </Col>

                            </Row>
                            <Row>
                                {filteredArray.map((index) => (

                                    <Col lg={12} xl={12} md={12} sm={24} xs={24} key={index.key}>
                                        <OptionParameter name="item_params"
                                            filterList={this.state.filterList}
                                            key={index.key}
                                            data={index}
                                            arrayNumber={index.key}
                                            onChange={this.handlePerameterChange}
                                            onDelete={(e) => this.deletePerameter(e)}
                                            onAddparameter={() => { this.addPerameter() }}
                                            form={this.props.form} />
                                    </Col>
                                ))
                                }
                            </Row>
                        </Spin>
                    </Card>


                </Card>
            </Form>

        );
    }
}

export default withRouter(SupportSettings);
