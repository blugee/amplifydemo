import React, { PureComponent } from 'react';
import { Card, Col, Row, Spin, Form, Button, message } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../components/InputControl/InputText/InputId';
import InputDate from '../../../../components/InputControl/InputDate/InputDate';
import { API, } from 'aws-amplify';
import moment from 'moment'
import InputTextEditor from '../../../../components/InputControl/InputTextEditor/InputTextEditor';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import './GeneralSetting.css'
import MapPerameter from './MapPerameter';
import { getStateOptions } from '../../../service/GeneralService';
import UploadImage from '../../../../components/InputControl/UploadImage/UploadImage';

const FormItem = Form.Item;

class GeneralSetting extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: true },
                { name: 'False', id: false },
            ],
            spinLoading: false,
            dashboardPageDetails: EditorState.createEmpty(),
            enableAutoRenewalMessage: EditorState.createEmpty(),
            disableAutoRenewalMessage: EditorState.createEmpty(),
            cancelSubscriptionMessage: EditorState.createEmpty(),
            copyrightText: EditorState.createEmpty(),
            data: {},
            statusList: [
                { id: 'Legal', name: 'Legal' },
                { id: 'Mixed', name: 'Mixed' },
                { id: 'Illegal', name: 'Illegal' },
            ],
            fieldArray: ['dashboardPageDetails', 'copyrightText', 'enableAutoRenewalMessage', 'disableAutoRenewalMessage', 'cancelSubscriptionMessage'],
            filteredArray: [{
                key: 1,
                id: [],
                status: '',
                color: '',
                hoverText: ''
            }],
            stateOptionsList: [],
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
        let stateOptionsList = await getStateOptions()
        let filterStateOptionsList = stateOptionsList
        let res = await API.post('PaymentGatewayAPI', '/paymentgateway/generalSettings', {})
        if (res.success) {
            res = res.result
            if (res && res.length > 0) {
                res[0].mapCardUpdateDate = moment(res[0].mapCardUpdateDate)

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

                let filteredArray = []
                if (res[0].mapDetails) {
                    filteredArray = JSON.parse(res[0].mapDetails)
                    if (filteredArray && filteredArray.length > 0) {
                        res[0] = await this.setData(res[0], filteredArray)
                        this.setState({ filteredArray: filteredArray })
                    }
                    filterStateOptionsList = await this.getFileredState(filteredArray, stateOptionsList)
                }

                this.setState({ data: res[0] })
                this.formRef.current && this.formRef.current.setFieldsValue({
                    ...res[0],
                });

            }
        } else {
            message.error('Something wrong happen')
        }
        this.setState({ spinLoading: false, stateOptionsList: stateOptionsList, filterStateOptionsList: filterStateOptionsList })
    }

    setData = (obj, data) => {
        for (let i = 0; i < data.length; i++) {
            obj = {
                ...obj,
                ['id' + data[i].key]: data[i].id,
                ['status' + data[i].key]: data[i].status,
                ['color' + data[i].key]: data[i].color,
                ['hoverText' + data[i].key]: data[i].hoverText,
            }
        }
        return obj
    }

    getFileredState = (data, options) => {
        let filteredState = []
        let selectedState = []
        if (data && data.length > 0) {

            for (let i = 0; i < data.length; i++) {
                if (data[i].id && data[i].id.length) {
                    selectedState = selectedState.concat(data[i].id)
                }
            }
            if (selectedState && selectedState.length > 0) {
                filteredState = options.filter(item => !selectedState.includes(item.id))
            } else {
                filteredState = options
            }

        } else if (options && options.length > 0) {
            filteredState = options
        }
        return filteredState
    }

    onFinish = async (data) => {
        this.setState({ loadingData: true })
        let mapDetails = await this.getMapDetails(data, this.state.filteredArray)
        data.mapDetails = JSON.stringify(mapDetails)

        let fieldArray = this.state.fieldArray
        for (let i = 0; i < fieldArray.length; i++) {
            data[fieldArray[i]] = this.state.data[fieldArray[i]]
        }

        data.headerImage = this.state.data.headerImage
        data.dashBoardVideoPoster = this.state.data.dashBoardVideoPoster

        let body = {
            ...data
        }
        if (data.id) {
            var res = await API.post('PaymentGatewayAPI', '/paymentgateway/updateGeneralSettings', { body })
            if (res.success) {
                message.success('General Settings updated successfully')
            } else {
                message.error('Something wrong happen')
            }

        } else {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/saveGeneralSettings', { body })
            if (response.success) {
                message.success('General Settings added successfully')
                this.fetchData()
            } else {
                message.error('Something wrong happen')
            }
        }
        this.setState({
            loadingData: false
        });

    };

    getMapDetails = (data, mapArr) => {
        let mapDetails = []
        if (mapArr && mapArr.length > 0) {
            for (let i = 0; i < mapArr.length; i++) {
                let obj = {
                    ...mapArr[i],
                    id: data['id' + mapArr[i].key],
                    status: data['status' + mapArr[i].key],
                    color: data['color' + mapArr[i].key],
                    hoverText: data['hoverText' + mapArr[i].key]
                }
                mapDetails.push(obj)
            }
        }
        return mapDetails

    }

    handleChange = (name, value) => {
        let data = this.state.data
        data[name] = value
        this.setState({ loadingData: false })
    }

    handleChangeImage = (name, value) => {
        let data = this.state.data
        data[name] = value
        this.setState({ data: data, loadingData: false })
    }

    addPerameter() {
        var lastItem = this.state.filteredArray.slice(-1)[0]

        let newObj = {
            key: lastItem.key + 1,
            id: [],
            status: '',
            color: '',
            hoverText: ''
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

    handleStateChange = async (key, name, value) => {
        let demoArray = this.state.filteredArray
        let newArray = [...this.state.filteredArray]
        let objIndex = demoArray.findIndex((obj => obj.key === key));
        newArray[objIndex] = { ...newArray[objIndex], [name]: value }
        let filterStateOptionsList = await this.getFileredState(newArray, this.state.stateOptionsList)
        this.setState({ filteredArray: newArray, filterStateOptionsList: filterStateOptionsList })
    }

    setLoader = (value) => {
        this.setState({ loadingData: value })
    }

    render() {
        const { form } = this.props;
        const { copyrightText, dashboardPageDetails, statusList, data, filteredArray, filterStateOptionsList, enableAutoRenewalMessage, cancelSubscriptionMessage, disableAutoRenewalMessage } = this.state
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

                    <Card title='General Setting'>
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
                                    <InputDate
                                        field={form}
                                        label='Map Card Update Date'
                                        name='mapCardUpdateDate'
                                        requiredMessage='Please input date'
                                        validationMessage='Please input correct date'
                                        required={true}
                                        display={true}
                                    />
                                </Col>
                                {/* 
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputText
                                        field={form}
                                        label='Copyright Text'
                                        name='copyrightText'
                                        validationMessage='Please input correct copyright text'
                                        requiredMessage='Please input copyright text'
                                        display={true}
                                        required={true}
                                    />
                                </Col> */}
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Copyright Text'
                                        name='copyrightText'
                                        validationMessage='Please input correct copyright text'
                                        requiredMessage='Please input copyright text'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={copyrightText}
                                    />
                                </Col>

                            </Row>
                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Enable Auto Renewal Message'
                                        name='enableAutoRenewalMessage'
                                        validationMessage='Please input correct enable auto renewal message'
                                        requiredMessage='Please input enable auto renewal message'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={enableAutoRenewalMessage}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Disable Auto Renewal Message'
                                        name='disableAutoRenewalMessage'
                                        validationMessage='Please input correct disable auto renewal message'
                                        requiredMessage='Please input disable auto renewal message'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={disableAutoRenewalMessage}
                                    />
                                </Col>

                            </Row>
                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Cancel Subscription Message'
                                        name='cancelSubscriptionMessage'
                                        validationMessage='Please input correct cancel subscription message'
                                        requiredMessage='Please input cancel subscription message'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={cancelSubscriptionMessage}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <UploadImage
                                        field={form}
                                        label='Header Image'
                                        name='headerImage'
                                        defaultValue={data.headerImage && data.headerImage !== 'null' ? data.headerImage : require('assets/images/CanojaLeaf.png')}
                                        validationMessage='Please input header image'
                                        requiredMessage='Please input header image'
                                        display={true}
                                        showDeleteButton={data.headerImage && data.headerImage !== 'null'}
                                        setLoader={() => this.setLoader(true)}
                                        onChange={this.handleChangeImage}
                                        required={true}
                                    />
                                </Col>

                            </Row>
                        </Spin>
                    </Card>
                    <Card title="Dynamic Content">
                        <Spin tip="Loading..." spinning={this.state.spinLoading}>
                            <Row type="flex" justify="center">
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputText
                                        field={form}
                                        label='Dashboard Page Title '
                                        name='dashboardPageTitle'
                                        validationMessage='Please input correct dashboard page title'
                                        requiredMessage='Please input dashboard page title'
                                        display={true}
                                        required={true}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputTextEditor
                                        rows={4}
                                        field={form}
                                        label='Dashboard Page Details'
                                        name='dashboardPageDetails'
                                        validationMessage='Please input correct dashboard page details'
                                        requiredMessage='Please input dashboard page details'
                                        display={true}
                                        required={true}
                                        onChange={this.handleChange}
                                        defaultValue={dashboardPageDetails}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <InputText
                                        field={form}
                                        label='Dashboard Video Link '
                                        name='dashboardVideoLink'
                                        validationMessage='Please input correct dashboard video link'
                                        requiredMessage='Please input dashboard video link'
                                        display={true}
                                        required={true}
                                    />
                                </Col>
                                <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                    <UploadImage
                                        field={form}
                                        label='Dashboard Video Poster'
                                        name='dashBoardVideoPoster'
                                        defaultValue={data.dashBoardVideoPoster && data.dashBoardVideoPoster !== 'null' ? data.dashBoardVideoPoster : require('assets/images/dashboardVideoPoster.png')}
                                        validationMessage='Please input dashboard video poster'
                                        requiredMessage='Please input dashboard video poster'
                                        display={true}
                                        showDeleteButton={data.dashBoardVideoPoster && data.dashBoardVideoPoster !== 'null'}
                                        setLoader={() => this.setLoader(true)}
                                        onChange={this.handleChangeImage}
                                        required={true}
                                    />
                                </Col>
                            </Row>
                        </Spin>
                    </Card>

                    <Card title="Map Content">
                        <Spin tip="Loading..." spinning={this.state.spinLoading}>
                            <Row type="flex" justify="center">
                                <Col sm={12} xs={24}>
                                    <InputText
                                        field={form}
                                        label='Hover Color'
                                        name='stateHoverColor'
                                        placeholder={"#5FA30F"}
                                        validationMessage='Please input correct copyright text'
                                        requiredMessage='Please input copyright text'
                                        display={true}
                                        required={true}
                                    />
                                </Col>
                            </Row>
                            <Row type="flex" justify="center">


                                {filteredArray.map((index) => (

                                    <Col lg={12} xl={12} md={12} sm={24} xs={24} key={index.key}>
                                        <MapPerameter name="item_params"
                                            filterList={this.state.filterList}
                                            key={index.key}
                                            data={index}
                                            arrayNumber={index.key}
                                            onChange={this.handlePerameterChange}
                                            handleStateChange={this.handleStateChange}
                                            onDelete={(e) => this.deletePerameter(e)}
                                            onAddparameter={() => { this.addPerameter() }}
                                            statusList={statusList}
                                            stateOptionsList={filterStateOptionsList}
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

export default withRouter(GeneralSetting);
