import React, { PureComponent } from 'react';
import { Form } from "antd";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './InputTextEditor.css'
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

class InputTextEditor extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            editorState: EditorState.createEmpty(),
            defaultValue: EditorState.createEmpty()
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.defaultValue !== prevState.defaultValue)) {
            const newState = {
                ...prevState,
                editorState: nextProps.defaultValue,
                defaultValue: nextProps.defaultValue
            }
            return newState;
        }
        else return null;
    }



    handleEditorStateChange = (editorState) => {
        let data = stateToHTML(editorState.getCurrentContent())
        this.setState({ editorState });
        if (this.props.onChange) {
            this.props.onChange(this.props.name, data)
        }
    }

    render() {
        const data = this.state.editorState
        return (

            <Form.Item
                name={this.props.name}
                label={this.props.label}
                style={this.props.display ? '' : { display: 'none' }}
                rules={[{
                    required: this.props.required ? true : false,
                    message: this.props.requiredMessage
                }]}
            >
                <Editor
                    editorState={data}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.handleEditorStateChange}
                    mention={this.props.mention ? this.props.mention : ''}
                />

            </Form.Item>


        )
    }
}


export default InputTextEditor