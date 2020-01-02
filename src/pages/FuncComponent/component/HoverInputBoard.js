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

  //
  const handlePutValToParentInputClick = (parent_name, parent_id) => {
    alert(`parent_id: ${parent_name}`);

    props.onPutValToParentInputClick(parent_name, parent_id, props.dataKey);
  };

  const handleCheckChineseInputStart = () => {
    console.log('中文输入开始 ...');
    props.onCheckChineseInputStart();
  };

  const handleCheckChineseInputEnd = () => {
    console.log('中文输入结束 ...');
    props.onCheckChineseInputEnd();
  };

  const handleCheckInputNow = ev => {
    console.log('元素正在输入中 ...');
    props.onCheckInputNow(ev.target.value, props.dataKey);
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
          value={props.value}
          onCompositionStart={handleCheckChineseInputStart}
          onCompositionEnd={handleCheckChineseInputEnd}
          onChange={handleCheckInputNow}
        />
        <ul>
          {props.list !== undefined
            ? props.list.map((item, index) => (
                <li key={item.id}>
                  <div
                    onClick={() => {
                      handlePutValToParentInputClick(
                        item.child_name === undefined ? item.parent_name : item.child_name,
                        item.id,
                      );
                    }}
                  >
                    {item.child_name === undefined ? item.parent_name : item.child_name}
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
