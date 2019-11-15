import React, { Component } from 'react';
import axios from 'axios';
import { Upload } from 'antd';


const uploadProps = {
  action: 'uploadFile',
  multiple: false,
  data: { a: 1, b: 2 },
  headers: {
    Authorization: '$prefix $token',
  },
  onStart(file) {
    console.log('onStart', file, file.name);
  },
  onSuccess(ret, file) {
    console.log('onSuccess', ret, file.name);
  },
  onError(err) {
    console.log('onError', err);
  },
  onProgress({ percent }, file) {
    console.log('onProgress', `${percent}%`, file.name);
  },
  customRequest({
                  action,
                  data,
                  file,
                  filename,
                  headers,
                  onError,
                  onProgress,
                  onSuccess,
                  withCredentials,
                }) {
    // EXAMPLE: post form-data with 'axios'
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }
    formData.append(filename, file);
    
    axios
      .post(action, formData, {
        withCredentials,
        headers,
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
        },
      })
      .then(({ data: response }) => {
        onSuccess(response, file);
      })
      .catch(onError);
    
    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  },
};


const TestUpload = () => {
// class TestUpload extends Component {

    return (
      <div
        style={{
          margin: 100,
        }}
      >
        <div>
          <Upload {...uploadProps}>
            <button>开始上传</button>
          </Upload>
        </div>
      </div>
    );
};
export default TestUpload;
