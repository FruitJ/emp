import React, { Component, useEffect } from 'react';
import { Row, Col } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
// 容器组件

const Container = props => {
  useEffect(() => {
    console.log(`props dataKey: ${props.dataKey}`);
  }, []);

  const handleParentInputClick = () => {
    console.log(`click: ${props.dataKey}`);

    // 请求父节点数据
    props.onParentInputClick();
  };

  return (
    <Row>
      <Col span={12}>
        <div
          style={{ marginTop: '10px', padding: '7px 10px 7px 10px', backgroundColor: '#F8F8F8' }}
        >
          <div
            className="ele-input-specs"
            style={{
              position: 'relative',
              backgroundColor: '#FFF',
              width: '240px',
              height: '32px',
              lineHeight: '32px',
            }}
            onClick={handleParentInputClick}
          >
            <span className="ele-name" style={{ paddingLeft: '10px' }}>
              元素
            </span>
            <span
              className="hint caret"
              style={{ position: 'absolute', right: '10px', top: '50%', marginTop: '-2px' }}
            />
          </div>
          <span
            className="glyphicon glyphicon-remove"
            style={{ position: 'absolute', right: 10, top: '50%', marginTop: '-3.5px' }}
          >
            {' '}
          </span>
        </div>
      </Col>
    </Row>
  );
};
export default Container;
