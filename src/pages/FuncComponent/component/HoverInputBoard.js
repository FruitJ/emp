import React, { useEffect } from 'react';
import { Input, Icon } from 'antd';

import '../static/HoverInputBoard.less';
// 悬浮输入面板组件
const HoverInputBoard = props => {
  console.log(props.board);
  useEffect(() => {
    console.log(props.list);
    // 获取需要展示的数据
  }, []);

  const handlePutValToParentInputClick = parent_id => {
    alert(`parent_id: ${parent_id}`);

    props.onPutValToParentInputClick(parent_id, props.dataKey);
  };

  return (
    <div className="hover-container" style={{ display: props.boardStatus }}>
      <div className="hover-content">
        <Input
          placeholder="请选择"
          prefix={
            <Icon
              type="search"
              style={{
                position: 'relative',
                top: '0',
                lineHeight: '14px',
                color: 'rgba(0,0,0,.25)',
              }}
            />
          }
        />
        <ul>
          {props.list !== undefined
            ? props.list.map((item, index) => (
                <li key={item.parent_id}>
                  <div
                    onClick={() => {
                      handlePutValToParentInputClick(item.parent_id);
                    }}
                  >
                    {item.parent_name}
                  </div>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};
export default HoverInputBoard;
