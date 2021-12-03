import React, { PureComponent } from 'react';
import { Button, Form, Upload } from "antd";
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import './UploadImage.css'

class UploadImage extends PureComponent {
    state = {
        fileList: [],
        uploading: false,
    };

    handleDelete = async () => {
        await this.props.setLoader()
        if (this.props.onChange) {
            this.props.onChange(this.props.name, null)
        }
    }

    render() {
        return (

            <Form.Item
                name={this.props.name}
                label={this.props.label}
                style={this.props.display ? '' : { display: 'none' }}
            >
                <Upload
                    className="imageUploadWrrapper"
                    onRemove={async () => {
                        await this.props.setLoader()
                        if (this.props.onChange) {
                            this.props.onChange(this.props.name, null)
                        }
                    }}
                    beforeUpload={file => {
                        this.props.setLoader()
                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                            if (this.props.onChange) {
                                this.props.onChange(this.props.name, reader.result)
                            }
                        });
                        reader.readAsDataURL(file);
                        return false;
                    }}>
                    <Button icon={<UploadOutlined />}>Select File </Button>
                </Upload>
                <Avatar
                    src={this.props.defaultValue}
                    alt="avatar"
                    shape="square"
                    className="imageUploadControl"
                />
                <Button style={{ display: this.props.showDeleteButton ? '' : 'none' }} onClick={() => this.handleDelete()} > <DeleteOutlined className='deleteIcon' /></Button>
            </Form.Item>
        )
    }
}


export default UploadImage