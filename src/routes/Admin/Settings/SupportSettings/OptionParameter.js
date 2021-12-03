import React, { PureComponent } from 'react';
import { Col, Row, Button } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../components/InputControl/InputText/InputText';


class OptionParameter extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleChange = (e, name) => {
        this.props.onChange(this.props.arrayNumber, name, e)
    }

    render() {

        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} push={6}>
                        <InputText
                            label='Issue Category'
                            name={"name" + this.props.arrayNumber}
                            onChange={(e) => this.handleChange(e, 'name')}
                            validationMessage='Please input correct name'
                            requiredMessage='Please input'
                            field={this.props.form}
                            display={true}
                            required={true}
                        />
                    </Col>
                    <Col sm={12} xs={24} push={6}>
                        {this.props.arrayNumber > 1 ? <Button onClick={() => this.props.onDelete(this.props.arrayNumber)}>Delete</Button> :
                            <Button onClick={() => this.props.onAddparameter(this.props.arrayNumber)}>Add Options</Button>}
                    </Col>
                </Row>



            </React.Fragment >
        );
    }
}

export default withRouter(OptionParameter);
