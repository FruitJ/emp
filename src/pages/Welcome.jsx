import React from 'react';
import {
	Upload,
	Modal,
	Icon,
} from 'antd';
import { connect } from 'dva';

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

const Welcome = ({ dispatch, welcome }) => {
	
	const handleCancel = () => {
		dispatch({
			type: "welcome/_cancel",
			payload: false
		});
	};
	
	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		dispatch({
			type: "welcome/_preview",
			payload: file
		});
	};
	
	// 上传文件前的回调函数
	const handleBeforeUpload = (file) => {
		
		// 检测上传文件类型 ( png、jpg、jpeg )
		return /image[/](?:png|(?:(?:jpg|jpeg)|gif))/.test(file.type) ? file.size / 1024 / 1024 < 3 : false;
	};
	

	
	let count = 0;
	const handleOnClick = () => {
		count += 1;
		if(count === 1) {
			// 判断当前的 token 是否存活
			if(welcome.token.prevReqTime === 0 || (new Date().getTime() - welcome.prevReqTime) > (58 * 60 * 1000)) {
				// 重新请求 token
				dispatch({
					type: "welcome/getToken",
					payload: {
						action: "getToken"
					}
				});
			}else {
				// 不用请求 token
				alert("no req token");
			}
		}else {
			count = 0;
		}
		
	};
	
	const handleRemove = (file) => {
		// 清除服务端的上传的图片
		dispatch({
			type: "welcome/removePic",
			payload: {
				name: file.name
			}
		})
	};
	
	const handleCustomRequest = (option) =>{
			
			option.onProgress({percent: 90});
			dispatch({
				type: "welcome/uploadPic",
				payload: {
					params: {
						token: welcome.token.token
					},
					data: option
				}
			});
	};
	
	
	const uploadButton = (
		<div>
			<Icon type="plus" />
			<div className="ant-upload-text">Upload</div>
		</div>
	);
	
		return (
			<div className="clearfix" onClick={handleOnClick}>
				<Upload
					action="uploadFile"
					listType="picture-card"
					fileList={welcome.fileList}
					onPreview={handlePreview}
					beforeUpload = { handleBeforeUpload }
					openFileDialogOnClick={true}
					customRequest = { handleCustomRequest }
					onRemove = { (file) => {handleRemove(file)} }
				>
					{ welcome.fileList.length >= 8 ? null : uploadButton }
					
				</Upload>
				<Modal visible={welcome.previewVisible}
				       footer={null}
				       onCancel={handleCancel}
				       onOk = { handleOnClick }
				       
				>
					<img alt="example" style={{ width: '100%' }} src={welcome.previewImage} />
				</Modal>
				
				{ welcome.previewImage }
				
			</div>
		);
	};
export default connect(({ welcome }) => ({
	welcome
}))(Welcome);
