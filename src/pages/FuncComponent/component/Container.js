import React, { Component, useEffect } from 'react';
import { Row, Col } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/container.less';

import HoverInputBoard from '@/pages/FuncComponent/component/HoverInputBoard';

// 容器组件
const Container = props => {
  useEffect(() => {
    console.log(`props dataKey: ${props.dataKey}`);
  }, []);

  // 获取父级 input 框中数据的回调函数
  const handleParentInputClick = () => {
    console.log(`click: ${props.dataKey}`);

    // 请求父节点数据
    props.onParentInputClick(props.dataKey);
  };

  // 移除 container 的回调函数
  const handleRemoveContainerClick = () => {
    alert(`remove: ${props.dataKey}`);
    props.onRemoveContainerClick(props.dataKey);
  };

  let proxy_obj = props.board.containers[props.dataKey];
  return (
    <Row>
      <Col span={12} style={{ position: 'relative' }}>
        <div
          style={{ marginTop: '10px', padding: '7px 10px 7px 10px', backgroundColor: '#F8F8F8' }}
        >
          <div className="ele-input-specs" onClick={handleParentInputClick}>
            <span className="ele-name">{proxy_obj.parentInputVal}</span>
            <span className="hint caret" style={proxy_obj.hoverInputBoard_rotate} />
          </div>
          <span className="glyphicon glyphicon-remove" onClick={handleRemoveContainerClick}>
            {' '}
          </span>
        </div>
        <HoverInputBoard
          list={proxy_obj.parentNames}
          dataKey={props.dataKey}
          board={props.board}
          value={proxy_obj.parentHoverInputVal}
          isCouldReqChildrenData={props.board.isCouldReqChildrenData}
          boardStatus={proxy_obj.hoverInputBoard_status}
          onPutValToParentInputClick={props.onPutValToParentInputClick}
          onCheckInputNow={props.onCheckInputNow}
          onCheckChineseInputStart={props.onCheckChineseInputStart}
          onCheckChineseInputEnd={props.onCheckChineseInputEnd}
        />
      </Col>
    </Row>
  );
};
export default Container;
