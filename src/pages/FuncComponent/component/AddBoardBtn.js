import React, { Component } from 'react';
import { Button } from 'antd';

// 按钮组件
const AddBoardBtn = props => {
  // 点击添加按钮的回调函数
  const handleAddComponentClick = () => {
    props.onAddComponentClick();
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddComponentClick}>
        添加规格
      </Button>
    </div>
  );
};
export default AddBoardBtn;
