import React, { Component } from 'react';
import { Button } from 'antd';

// 按钮组件
/*const AddBoardBtn = props => {
  // 点击添加按钮的回调函数
  const handleAddComponentClick = () => {
    props.onAddComponentClick();
  };

  return (
    <div ref={props.ref}>
      <Button type="primary" onClick={handleAddComponentClick}>
        添加规格
      </Button>
    </div>
  );
};*/



const AddBoardBtn = React.forwardRef((props, ref) => {
    
    const handleAddComponentClick = () => {
        props.onAddComponentClick();
    };
    
    return (
        <div ref={ref}>
            <Button type="primary" onClick={handleAddComponentClick}>
                添加规格
            </Button>
        </div>
    );
});


export default AddBoardBtn;
