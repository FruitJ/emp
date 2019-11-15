import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Modal,
} from 'antd';

const TestModal = ({ dispatch, test }) => {
  
  
  const showModal = () => {
    
    dispatch({
      type: "test/_show",
      payload: true
    });
  };
  
  const handleOk = () => {
    
    dispatch({
      type: "test/_ok",
      payload: {
        ModalText: 'The modal will be closed after two seconds',
        confirmLoading: true,
      }
    });
    
    setTimeout(() => {
  
      dispatch({
        type: "test/_delay",
        payload: {
          visible: false,
          confirmLoading: false,
        }
      });
      
    }, 2000);
  };
  
  const handleCancel = () => {
    console.log('Clicked cancel button');
  
    dispatch({
      type: "test/_cancel",
      payload: false
    });
    
  };

    return (
      <div>
        <Button type="link" onClick={showModal}>
          Open Modal with async logic
        </Button>
        <Modal
          title="Title"
          visible={test.visible}
          onOk={handleOk}
          confirmLoading={test.confirmLoading}
          onCancel={handleCancel}
          width = { 600 }
        >
          <p>{test.ModalText}</p>
        </Modal>
      </div>
    );
};

export default connect(({ test }) => ({
  test,
}))(TestModal);
