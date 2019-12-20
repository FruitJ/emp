import React, { Component, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from 'dva';

import './customComponent/static/panel.less';

let global_top = 0;

const PanelRouter = ({ dispatch, goodsSpecs }) => {
  // class PanelRouter extends Component {
  const input_area$nodeRef = useRef();
  const panel_hint_area$nodeRef = useRef();

  useEffect(() => {}, []);

  const handleChangeTriangleStatus = ev => {
    // 获取目标节点的 display 值
    const { current: node } = input_area$nodeRef;
    global_top =
      Number(node.offsetHeight) +
      Number(/\d+/.exec(getComputedStyle(node.parentNode, null)['paddingTop'])[0]);

    let hint_panel_status = window.getComputedStyle(panel_hint_area$nodeRef.current, null)[
      'display'
    ];

    // 加载列表数据
    dispatch({
      type: 'goodsSpecs/loadSpecsOption',
      payload: {
        specs_id: 1,
      },
    });

    if (hint_panel_status !== 'none') {
      dispatch({
        type: 'goodsSpecs/_changeTriangleStyle',
        payload: 'triangleDown',
      });
      dispatch({
        type: 'goodsSpecs/_updateHintPanelStatus',
        payload: {
          display: 'none',
          top: 0,
        },
      });
    } else {
      dispatch({
        type: 'goodsSpecs/_changeTriangleStyle',
        payload: 'triangleUp',
      });
      dispatch({
        type: 'goodsSpecs/_updateHintPanelStatus',
        payload: {
          display: 'block',
          top: global_top,
        },
      });
    }
    // 为 document 添加点击事件
    document.addEventListener(
      'click',
      function(ev) {
        // 检测当前的点击区域是否是操作区域

        const { current: node } = panel_hint_area$nodeRef;

        if (node !== null) {
          // 当前点击坐标
          const { clientX: cur_posX, clientY: cur_posY } = ev;

          // 热点区域坐标
          let posDataCollection_hint = node.getBoundingClientRect();
          let _top = posDataCollection_hint.y;
          let _bottom = posDataCollection_hint.y + Math.floor(posDataCollection_hint.height);
          let _left = posDataCollection_hint.x;
          let _right = posDataCollection_hint.x + Math.floor(posDataCollection_hint.width);

          //
          let posDataCollection_select = input_area$nodeRef.current.getBoundingClientRect();

          let $top = posDataCollection_select.y;
          let $bottom = $top + Math.floor(posDataCollection_select.height);
          let $left = posDataCollection_select.x;
          let $right = $left + posDataCollection_select.width;
          // 比对当前点击区域是否落在了热点区域范围内

          if (
            !(cur_posX >= _left && cur_posX <= _right && cur_posY >= _top && cur_posY <= _bottom)
          ) {
            if (
              !(cur_posY >= $top && cur_posY <= $bottom && cur_posX >= $left && cur_posX <= $right)
            ) {
              dispatch({
                type: 'goodsSpecs/_updateHintPanelStatus',
                payload: {
                  display: 'none',
                  top: 0,
                },
              });

              dispatch({
                type: 'goodsSpecs/_changeTriangleStyle',
                payload: 'triangleDown',
              });
            } else {
              if (ev.target.classList[0] !== 'glyphicon') {
                // 判断一下当前状态

                dispatch({
                  type: 'goodsSpecs/_updateHintPanelStatus',
                  payload: {
                    display: 'block',
                    top: global_top,
                  },
                });

                dispatch({
                  type: 'goodsSpecs/_changeTriangleStyle',
                  payload: 'triangleUp',
                });
              } else {
              }
            }
          }
        }
      },
      false,
    );
  };

  // 添加商品规格选项的回调函数
  const handleAddSpecsOption = ev => {
    // 获取输入区域节点
    // 将值传进 select 框内部
    dispatch({
      type: 'goodsSpecs/_addSpecsToSelector',
      payload: Number(ev.target.dataset.key),
    });
    dispatch({
      type: 'goodsSpecs/_changeTriangleStyle',
      payload: 'triangleDown',
    });

    dispatch({
      type: 'goodsSpecs/_updateHintPanelStatus',
      payload: {
        display: 'none',
        top: 0,
      },
    });
  };

  // 测试点击标签
  const handleRmSpecsOption = ev => {
    ev.stopPropagation();
    ev.nativeEvent.stopPropagation();

    // 移除待选区域的标签
    dispatch({
      type: 'goodsSpecs/_removeSpecsFromSelector',
      payload: {
        key: ev.target.dataset.key,
      },
    });
  };

  // 将商品规格值绑定到 Modal 上
  const handleBindInputVal = ev => {
    // 绑定表单值到 Modal
    dispatch({
      type: 'goodsSpecs/_bindInputVal',
      payload: ev.target.value,
    });
  };

  // 测试能否阻止事件冒泡到 document 层
  const handleClick = ev => {
    ev.stopPropagation();
    console.log('阻止 ...');
  };

  const handleCancelOperatePanel = () => {
    // 取消

    // 将当前的面板干掉
    dispatch({
      type: 'goodsSpecs/_CancelOperatePanel',
      payload: 'none',
    });
  };

  const handleSubmitValFromOperatePanel = () => {
    // 将当前选中的值提交 ( 替换数据源 )
    dispatch({
      type: 'goodsSpecs/_submitValFromOperatePanel',
    });
  };

  return (
    <div
      style={{
        display: goodsSpecs.isVanish,
      }}
    >
      <div
        className="container"
        style={{
          // width: "300px",
          height: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <div className="row">
          {/* 内容主体区域 */}
          <div className="col-md-3 content">
            {/* 输入区域 */}
            <div
              className="input-area"
              ref={input_area$nodeRef}
              onClick={handleChangeTriangleStatus}
            >
              {/* 根据 input_select$arr 数组中的长度动态生成在 selector 中的元素 */}
              {// 数组中没有添加的内容不生成标签元素 ( 将控件中的字体置灰 )
              goodsSpecs.input_select$arr.length === 0 ? (
                <span
                  className="input"
                  style={{
                    color: '#C7C8CB',
                  }}
                >
                  {' '}
                  {goodsSpecs.input_select$val}{' '}
                </span>
              ) : (
                // 数组中有已添加的内容，生成对应的标签元素
                goodsSpecs.input_select$arr.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-block',
                    }}
                  >
                    {/* 添加的内容标签 */}
                    <div className="outer-tag">
                      {/* 内容字体 */}
                      <div>
                        <span>{item.name}</span>
                      </div>

                      {/* 内容标签移除的 logo 标 */}
                      <span
                        className="glyphicon glyphicon-remove"
                        data-key={item.current_id}
                        onClick={handleRmSpecsOption}
                      >
                        {' '}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <span className={`caret ${goodsSpecs.triangleDirection}`}> </span>
            </div>

            {/* 操作区域 */}
            <div className="operate-area">
              <div>
                <button className="btn btn-default btn-xs" onClick={handleCancelOperatePanel}>
                  取消
                </button>
                <button
                  className="btn btn-primary btn-xs btn-sure"
                  onClick={handleSubmitValFromOperatePanel}
                >
                  确定
                </button>
              </div>
            </div>

            {/* 面板提示输入区域 */}
            {/*<div className = "panel-hint-area" style={ visible }*/}
            <div
              className="panel-hint-area"
              style={{
                display: goodsSpecs.hint_panel_status.display,
                top: `${goodsSpecs.hint_panel_status.top}px`,
              }}
              ref={panel_hint_area$nodeRef}
            >
              {/* 用户自定义输入区域 */}
              <div className="input-group user-custom-area">
                <div className="input-group-addon input-front-modal">
                  <span className="glyphicon glyphicon-search"> </span>
                </div>
                <input
                  type="text"
                  value={goodsSpecs.input_custom$val}
                  className="form-control"
                  onChange={handleBindInputVal}
                />
              </div>
              {/* 数据列表展示区域 */}
              <div className="data-show-area">
                {/* 用户选择下拉框时或者输入自定义内容时弹出的待选内容列表 */}
                <ul>
                  {goodsSpecs.specsOptionArr.map((item, index) => (
                    <li
                      data-key={item.current_id}
                      key={item.current_id}
                      onClick={handleAddSpecsOption}
                    >
                      {' '}
                      {item.name}{' '}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/*<button onClick = { handleClick }>点我啊</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ goodsSpecs }) => ({
  goodsSpecs,
}))(PanelRouter);
