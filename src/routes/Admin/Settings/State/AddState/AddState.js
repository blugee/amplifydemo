import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';


class AddState extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            booleanOptions: [
                { name: 'True', id: true },
                { name: 'False', id: false },
            ],
        }
    }

    componentDidMount() {
        this.props.spinLoading()
    }


    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputId
                            field={this.props.form}
                            label='form.label.id'
                            name="id"
                            display={false}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Name'
                            name='name'
                            validationMessage='Please input correct name'
                            requiredMessage='Please input name'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Abbreviation'
                            name='abbreviation'
                            validationMessage='Please input correct abbreviation'
                            requiredMessage='Please input abbreviation'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Active'
                            name='active'
                            validationMessage='Please input correct type'
                            requiredMessage='Please input active type'
                            display={true}
                            required={true}
                            list={this.state.booleanOptions}
                        />
                    </Col>
                </Row>

            </React.Fragment>
        );
    }
}

export default withRouter(AddState);
