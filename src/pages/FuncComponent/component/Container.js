import React, { Component, useEffect, useRef } from 'react';
import { Row, Col, Table } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/container.less';

import HoverInputBoard from '../../../pages/FuncComponent/component/HoverInputBoard';

let id = 0;
let proxy_obj;
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

  const handleAddChildNodeClick = () => {
    proxy_obj = props.board.containers[props.dataKey];

    id = Number(proxy_obj.parentInputId);
    if (Number.isNaN(id)) {
      id = proxy_obj.parentNames[proxy_obj.parentNames.length - 1].parent_id;
    }

    console.log('idid: ' + id);

    console.log('id .......');
    console.log(typeof id);
    console.log(id);

    props.onAddChildNodeClick(props.dataKey, id);
  };

  const handleChildInputClick = () => {
    // 面板切换 ( 状态的 )
    // props.onChildInputClick(props.dataKey);
  };

  const handleSwitchChildHoverBoardStatus = () => {
    // 切换子节点的悬浮选值面板的状态
    props.onSwitchChildHoverBoardStatus(props.dataKey);
  };

  const handleRemoveAfterNative_childNames = (ev, item) => {
    // 阻止事件传播
    ev.stopPropagation();

    console.log('删除选中的项 ...');
    console.log(item);

    // 删除待选子节点数组中的选中的元素
    props.onRemoveAfterNative_childNames(item, props.dataKey);
  };

  const handleCancelChildHoverBoard = () => {
    props.onCancelChildHoverBoard(props.dataKey);
  };

  const handleAddChildNamesToRealArea = () => {
    props.onAddChildNamesToRealArea(props.dataKey);
  };

  const handleRemoveReal_childNames = (ev, item) => {
    // 删除元素
    ev.stopPropagation();
    console.log('((((***********(((((((((');
    console.log(item);
    console.log(props.board.containers[props.dataKey].afterNative_childNames);
    console.log(props.board.containers[props.dataKey].real_childNames);

    props.onRemoveReal_childNames(item, props.dataKey);
  };

  let proxy_obj = props.board.containers[props.dataKey];
  return (
    <Row>
      <Col span={12} style={{ position: 'relative', zIndex: '99999' }}>
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

          {proxy_obj.isSureParentNamesEle ? (
            <>
              {proxy_obj.real_childNames.length !== 0
                ? proxy_obj.real_childNames.map((item, index) => (
                    <span
                      key={item.child_id}
                      style={{
                        display: 'inline-block',
                        marginLeft: '5px',
                        marginBottom: '5px',
                        width: '80px',
                        height: '25px',
                        lineHeight: '25px',
                        border: '1px solid rgba(0, 0, 0, 0.5)',
                        borderRadius: '6px',
                      }}
                    >
                      {item.child_name}

                      <span
                        className="close"
                        style={{
                          paddingRight: '5px',
                          lineHeight: '25px',
                        }}
                        onClick={ev => {
                          handleRemoveReal_childNames(ev, item);
                        }}
                      >
                        &times;
                      </span>
                    </span>
                  ))
                : null}
              <span
                style={{
                  display: 'inline-block',
                  paddingTop: '15px',
                  width: '50px',
                  textAlign: 'center',
                  color: '#155BD3',
                  cursor: 'pointer',
                  zIndex: 1060,
                }}
                onClick={handleAddChildNodeClick}
              >
                + 添加
              </span>
              <div
                style={{
                  position: 'relative',
                  top: '0px',
                  display: proxy_obj.outsideChildInputBoard_status,
                }}
              >
                <div
                  style={{
                    paddingLeft: '10px',
                    width: '308px',
                    // height: '75px',
                    background: '#FFF',
                    boxShadow: '0 2px 8px 0 rgba(200,201,204,.5)',
                  }}
                >
                  <div
                    className="ele-input-specs child-input"
                    onClick={handleSwitchChildHoverBoardStatus}
                    style={{
                      position: 'relative',
                      zIndex: '1000',
                      height: 'auto',
                      boxShadow: '0 2px 8px 0 rgba(200,201,204,.5)',
                    }}
                  >
                    {proxy_obj.afterNative_childNames.length === 0 ? (
                      <span className="ele-name">{proxy_obj.childInputVal}</span>
                    ) : (
                      proxy_obj.afterNative_childNames.map((item, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-block',
                            marginLeft: '5px',
                            width: '80px',
                            height: '25px',
                            lineHeight: '25px',
                            border: '1px solid rgba(0, 0, 0, 0.5)',
                            borderRadius: '6px',
                          }}
                        >
                          {item.child_name}

                          <span
                            className="close"
                            style={{
                              paddingRight: '5px',
                              lineHeight: '25px',
                            }}
                            onClick={ev => {
                              handleRemoveAfterNative_childNames(ev, item);
                            }}
                          >
                            &times;
                          </span>
                        </span>
                      ))
                    )}

                    <span className="hint caret" style={proxy_obj.hoverChildInputBoard_rotate} />
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      paddingTop: '5px',
                      paddingLeft: '150px',
                      paddingBottom: '5px',
                    }}
                  >
                    <button className="btn btn-default" onClick={handleCancelChildHoverBoard}>
                      取消
                    </button>

                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: '20px' }}
                      onClick={handleAddChildNamesToRealArea}
                    >
                      确定
                    </button>
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: '1', top: '-93px', left: '0px' }}>
                  <HoverInputBoard
                    list={proxy_obj.childNames}
                    dataKey={props.dataKey}
                    board={props.board}
                    value={proxy_obj.childHoverInputVal}
                    boardStatus={proxy_obj.hoverChildInputBoard_status}
                    onPutValToParentInputClick={props.onPutValToChildInputClick}
                    onCheckInputNow={props.onChildCheckInputNow}
                    onCheckChineseInputStart={props.onCheckChineseInputStart}
                    onCheckChineseInputEnd={props.onCheckChineseInputEnd}
                  />
                  {/*
                <HoverInputBoard list={proxy_obj.parentNames[(id - 1) >= 0 ? id - 1 : 0].childNames}
                                 boardStatus={proxy_obj.hoverChildInputBoard_status}
                />
*/}
                </div>
              </div>
            </>
          ) : null}
        </div>
        <HoverInputBoard
          list={proxy_obj.parentNames}
          dataKey={props.dataKey}
          board={props.board}
          value={proxy_obj.parentHoverInputVal}
          isCouldReqChildrenData={props.board.isCouldReqChildrenData}
          boardStatus={proxy_obj.hoverInputBoard_status}
          onPutValToParentInputClick={props.onPutValToParentInputClick}
          onPutValToChildInputClick={props.onPutValToChildInputClick}
          onCheckInputNow={props.onCheckInputNow}
          onCheckChineseInputStart={props.onCheckChineseInputStart}
          onCheckChineseInputEnd={props.onCheckChineseInputEnd}
        />
      </Col>
    </Row>
  );
};
export default Container;
