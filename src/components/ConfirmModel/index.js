import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Row, Col, Button } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const formItemLayout = {
    labelcol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrappercol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
export class ConfirmModel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visibleModel
        }
    }
    handleCancel = e => {
        this.setState({
            visible: false,
            loadingButton: false
        });

        this.props.visible()

    };
    handleSubmit = e => {

        this.setState({
            visible: false,
            loadingButton: false
        });
        if (this.props.actionData.action) {
            this.props.actionData.action()
        }

        this.props.visible()

    };
    showConfirm = () => {
        return (

            <Modal
                visible={this.props.visibleModel}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={this.props.okButton ?
                    [
                        <Button key="back" type="primary" onClick={this.handleCancel}>
                            Ok
                        </Button>,
                        
                    ] :
                    [
                        <Button key="back" onClick={this.handleCancel}>
                            No
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                            Yes
                        </Button>,
                    ]}>
                <div {...formItemLayout}>
                    <Row type="flex">
                        <Col sm={3} xs={3} >
                            <QuestionCircleTwoTone twoToneColor="#fa8c16" style={{ fontSize: '22px' }} />
                        </Col>
                        <Col sm={18} xs={24} >
                            <h3>{this.props.actionData.message}</h3>
                        </Col>
                    </Row>
                </div>
            </Modal>

        )
    };
    render() {
        return (
            this.showConfirm()
        )
    }
}

export default withRouter(ConfirmModel)
