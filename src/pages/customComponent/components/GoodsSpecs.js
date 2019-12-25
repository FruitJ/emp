import React, { useRef } from 'react';
import { Row, Col, Button } from 'antd';

import 'bootstrap/dist/css/bootstrap.css';
import '../static/goodsSpecs.less';
import PanelRouter from '../../PanelRouter';

// class 集合 ( 公共样式 )
const COMMON_OPTION_EDIT = 'common_option_edit';
const COMMON_SEARCH_CONTENT = 'common_search_content';
const COMMON_INPUT_STYLE = 'form-control';

let arr_select$class = [COMMON_INPUT_STYLE, 'select-input'];
let flag = false;
let index_key = 0;
const GoodsSpecs = props => {
  const addBtnRef = useRef();
  const selectRef = useRef();
  const containerRef = useRef();

  console.log('15646l');
  console.log(props.modal);

  const handleSelectSpecsClick = index => {
    alert('...');
    alert('specs' + index);
    console.log('+++');
    console.log(`specs: ${index}....`);
    console.log(props.modal.specs);
    // console.log(ev.target);
    index_key = index;
    // alert("当前点击的索引" + index_key);
    // console.log(typeof index + "okok");
  };

  const handleAddSpecsVal = () => {
    // alert("添加商品规格值 ...");

    console.log('---) 分割线 (---');

    console.log(addBtnRef.current.parentNode.parentNode.parentNode.offsetHeight);

    // 获取当前的添加商品规格的 dom 节点
    const { current: node } = addBtnRef;

    // 获取当前节点的位置信息
    console.log(node.getBoundingClientRect());

    const { x: _left, y: _top, width, height } = node.getBoundingClientRect();
    let left = _left + width / 2;
    let top = _top + height;
    console.log(left, top);
    props.onUpdateAddSpecsPanelStatus(node);
  };

  const handleUpdateHintPanelStatus = ev => {
    // ev.stopPropagation();

    const { current: select_node } = selectRef;
    const { top: select_top, height: select_height } = select_node.getBoundingClientRect();

    // 加载列表数据
    // props.onLoadGoodsSpecsOption(1);

    props.onLoadGoodsSpecs(index_key);
    // 更新 select 表单下面的弹框的样式状态
    alert(props.modal.specs_count);
    console.log('()()()()(____');
    console.log(containerRef);
    console.log(containerRef.current.dataset.key);
    if (!flag) {
      // 显示列表
      props.onUpdateSelectHintPanelStatus({
        display: 'block',
        key: index_key,
      });

      // 旋转三角
      props.onRotateTriangleTag('triangleUp');
      flag = true;
    } else {
      // 隐藏列表
      props.onUpdateSelectHintPanelStatus({
        display: 'none',
        key: index_key,
        // top: ,
      });

      // 还原三角
      props.onRotateTriangleTag('triangleDown');
      flag = false;
    }
  };

  const handleAddSpecs = ev => {
    // props.onAddSpecs(ev);
    alert('done');
    // 添加值
    props.onAddGoodsSpecsToSelector(ev);

    // 干掉面板

    props.onUpdateSelectHintPanelStatus({
      display: 'none',
      key: index_key,
      // top: ,
    });
    // 改变三角形状态
    props.onRotateTriangleTag('triangleDown');

    flag = false;
  };

  const handleBindSelectInputVal = ev => {
    props.onBindSelectInputVal(ev);
  };

  const handleSelectCompositionEnd = () => {
    props.onSelectCompositionEnd();
  };
  const handleSelectCompositionStart = () => {
    props.onSelectCompositionStart();
  };

  const handleRmSpecs = ev => {
    props.onRemoveSelectSpecsFromSelector(ev);
  };

  return (
    <div className="container">
      {props.modal.specs.map((item, index) => (
        <div
          key={index}
          ref={containerRef}
          data-key={index}
          onClick={() => {
            handleSelectSpecsClick(index);
          }}
        >
          <Row>
            <Col
              span={12}
              offset={5}
              style={{
                border: '1px solid #E4E4E4',
              }}
            >
              <div className={COMMON_OPTION_EDIT}>
                <Row>
                  <Col span={24}>
                    <div className={COMMON_SEARCH_CONTENT} style={{}}>
                      <Row>
                        <Col
                          span={12}
                          style={{
                            marginLeft: '5px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                          }}
                        >
                          {/*<select className={arr_select$class.join(' ')} disabled>
                          <option>尺寸</option>
                        </select>*/}

                          <div
                            className="input-area"
                            style={{
                              margin: '0',
                              height: '32px',
                              lineHeight: '35px',
                            }}
                            ref={selectRef}
                            onClick={ev => {
                              handleUpdateHintPanelStatus(ev);
                            }}
                          >
                            <span
                              className="input"
                              style={{
                                // color: '#C7C8CB',
                                color: '#000',
                              }}
                            >
                              {props.modal.specs[index].saveGoodsSpecs$arr.length !== 0
                                ? props.modal.specs[index].saveGoodsSpecs$arr[0].name
                                : '商品规格'}
                            </span>
                            <span
                              className={`caret ${props.modal.specs[index].select_triangleDirection}`}
                            ></span>
                          </div>

                          <div
                            className="panel-hint-area"
                            style={{
                              width: '81%',
                              display: props.modal.specs[index].selectHint_panel_status.display,
                              left: `${0}px`,
                              top: `${35}px`,
                              zIndex: '1000',
                            }}
                          >
                            {/*用户自定义输入区域*/}
                            <div className="input-group user-custom-area">
                              <div className="input-group-addon input-front-modal">
                                <span className="glyphicon glyphicon-search"> </span>
                              </div>
                              <input
                                type="text"
                                value={props.modal.specs[index].select_input_custom}
                                className="form-control"
                                onChange={handleBindSelectInputVal}
                                onCompositionEnd={handleSelectCompositionEnd}
                                onCompositionStart={handleSelectCompositionStart}
                              />
                            </div>
                            {/*数据列表展示区域*/}
                            <div className="data-show-area">
                              {/*用户选择下拉框时或者输入自定义内容时弹出的待选内容列表*/}
                              <ul>
                                {props.modal.specs[index].specs$arr.map((item, index) => (
                                  <li
                                    data-key={item.current_id}
                                    key={item.current_id}
                                    onClick={handleAddSpecs}
                                  >
                                    {' '}
                                    {item.name}{' '}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Row>
                      <Col
                        span={24}
                        style={{
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        {// ------------------------------
                        props.modal.specs[index].goodsSpecs$arr.length !== 0
                          ? props.modal.specs[index].goodsSpecs$arr.map((item, index) => (
                              <div
                                className="btn btn-default"
                                style={{
                                  marginLeft: '5px',
                                }}
                                key={index}
                              >
                                {item.name}
                                <span
                                  className="glyphicon glyphicon-remove"
                                  style={{
                                    paddingLeft: '2px',
                                  }}
                                  data-key={item.current_id}
                                  onClick={handleRmSpecs}
                                >
                                  {' '}
                                </span>
                              </div>
                            ))
                          : null
                        // ------------------------------
                        }
                        <div
                          style={{
                            display: 'inline-block',
                          }}
                        >
                          <span
                            ref={addBtnRef}
                            style={{
                              paddingLeft: '10px',
                              paddingRight: '10px',
                              color: '#1A5BD2',
                              cursor: 'pointer',
                            }}
                            onClick={handleAddSpecsVal}
                          >
                            + 添加
                          </span>
                        </div>
                        {/* 添加商品规格的弹框区域 */}
                        <div
                          style={{
                            display: `${props.modal.specs[index].addSpecsPanelStyle.status}`,
                            position: 'absolute',
                            top: `${props.modal.specs[index].addSpecsPanelStyle.top}px`,
                            left: `${props.modal.specs[index].addSpecsPanelStyle.left}px`,
                          }}
                        >
                          <PanelRouter
                            modal={props.modal}
                            dataKey={index}
                            onLoadGoodsSpecsOption={props.onLoadGoodsSpecsOption}
                            onChangeTriangleStyle={props.onChangeTriangleStyle}
                            onUpdateHintPanelStatus={props.onUpdateHintPanelStatus}
                            onAddSpecsToSelector={props.onAddSpecsToSelector}
                            onRemoveSpecsFromSelector={props.onRemoveSpecsFromSelector}
                            onBindInputVal={props.onBindInputVal}
                            onCancelOperatePanel={props.onCancelOperatePanel}
                            onSubmitValFromOperatePanel={props.onSubmitValFromOperatePanel}
                            onCompositionEnd={props.onCompositionEnd}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      ))}

      <Button
        type="primary"
        onClick={() => {
          props.onAddCount();
        }}
      >
        添加商品规格
      </Button>
    </div>
  );
};
export default GoodsSpecs;
