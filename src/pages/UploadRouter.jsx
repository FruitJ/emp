import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { connect } from "dva";

/*const props = {
	name: 'file',
	action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
	headers: {
		authorization: 'authorization-text',
	},
	onChange(info) {
			
			
			console.log("info ...");
		console.log(info);
		
		
		if (info.file.status !== 'uploading') {
			
			
			
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	},
};*/

let dispatch = null;
class UploadRouter extends Component {

    constructor(props) {
        super(props);
        dispatch = this.props.dispatch;
    }
	
	
	
	handleChangeUpload = (info) => {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
			console.log("|||||");
			dispatch({
				type: "upload/uploadFile",
				payload: {
					file: info.file,
				}
			});
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};
    
    render() {
        return (
	        <Upload
	                onChange={ this.handleChangeUpload }
	        
	        >
		        <Button>
			        <Icon type="upload" /> Click to Upload
		        </Button>
	        </Upload>
        );
    }
}
export default connect(({ upload }) => ({
	upload,
}))(UploadRouter);
