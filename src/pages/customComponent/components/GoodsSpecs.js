import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import 'bootstrap/dist/css/bootstrap.css';
import '../static/goodsSpecs.less';
import PanelRouter from '@/pages/PanelRouter';
import goodsSpecs from '@/models/goodsSpecs';

// class 集合 ( 公共样式 )
const COMMON_OPTION_EDIT = 'common_option_edit';
const COMMON_SEARCH_CONTENT = 'common_search_content';
const COMMON_INPUT_STYLE = 'form-control';

let arr_select$class = [COMMON_INPUT_STYLE, 'select-input'];

class GoodsSpecs extends Component {
  constructor(props) {
    super(props);

    this.addBtnRef = React.createRef();
    console.log('#$#');
    console.log(goodsSpecs.state.goodsSpecs$arr);
  }

  handleAddSpecsVal = () => {
    // alert("添加商品规格值 ...");
    console.log(this.addBtnRef);

    // 获取当前的添加商品规格的 dom 节点
    const { current: node } = this.addBtnRef;

    // 获取当前节点的位置信息
    console.log(node.getBoundingClientRect());

    const { x: _left, y: _top, width, height } = node.getBoundingClientRect();
    let left = _left + width / 2;
    let top = _top + height;
    console.log(left, top);

    // 更新状态
    this.props.dispatch({
      type: 'goodsSpecs/_updateAddSpecsPanelStyle',
      payload: {
        top: node.offsetTop,
        left: node.offsetLeft,
        status: 'block',
      },
    });
  };

  render() {
    return (
      <div className="container">
        <Row>
          <Col
            span={12}
            offset={5}
            style={{
              border: '1px solid #E4E4E4',
              // textAlign: "center",
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
                        <select className={arr_select$class.join(' ')} disabled>
                          <option>尺寸</option>
                        </select>
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
                      this.props.goodsSpecs.goodsSpecs$arr.length !== 0
                        ? this.props.goodsSpecs.goodsSpecs$arr.map((item, index) => (
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
                              >
                                {' '}
                              </span>
                            </div>
                          ))
                        : /*
                              
                              (
                                <>
                                  <div className = "btn btn-default" style={{
                                    marginLeft: "5px"
                                  }}>
                                    23x15cm
                                    <span
                                      className = "glyphicon glyphicon-remove"
                                      style={{
                                        paddingLeft: "2px",
                                      }}
                                    > </span>
                                  </div>
                                  <div className = "btn btn-default" style={{
                                    marginLeft: "5px"
                                  }}>
                                    23x15cm
                                    <span
                                      className = "glyphicon glyphicon-remove"
                                      style={{
                                        paddingLeft: "2px",
                                      }}
                                    > </span>
                                  </div>
                                </>
                              )*/
                          null
                      // ------------------------------
                      }
                      <div
                        style={{
                          display: 'inline-block',
                        }}
                      >
                        <span
                          ref={this.addBtnRef}
                          style={{
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            color: '#1A5BD2',
                            cursor: 'pointer',
                          }}
                          onClick={this.handleAddSpecsVal}
                        >
                          + 添加
                        </span>
                      </div>
                      {/* 添加商品规格的弹框区域 */}
                      <div
                        style={{
                          display: `${this.props.goodsSpecs.addSpecsPanelStyle.status}`,
                          position: 'absolute',
                          top: `${this.props.goodsSpecs.addSpecsPanelStyle.top}px`,
                          left: `${this.props.goodsSpecs.addSpecsPanelStyle.left}px`,
                        }}
                      >
                        <PanelRouter />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default connect(({ goodsSpecs }) => ({
  goodsSpecs,
}))(GoodsSpecs);
