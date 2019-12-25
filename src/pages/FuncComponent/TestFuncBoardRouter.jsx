// 官方包
import React, { Component } from 'react';
import { connect } from 'dva';

// 自定义包
import AddBoardBtn from './component/AddBoardBtn';
import Container from './component/Container';
import './static/TestFuncBoardRouterd.less';
/**
 * @author FruitJ
 */

// 初始化 dispatch ( 简化写法 )
let dispatch = null;
// 测试组件
class TestFuncBoardRouter extends Component {
  constructor(props) {
    super(props);
    // 简化 dispatch 写法
    dispatch = this.props.dispatch;
  }

  // 点击添加按钮的回调函数
  handleAddComponentClick = () => {
    // 动态添加组件
    dispatch({
      type: 'funcBoard/_addContainer',
    });
    console.log(this.props.funcBoard.count_addContainer);
    console.log(this.props.funcBoard.containers);
  };

  // 获取父节点数据的回调函数
  handleParentInputClick = () => {
    dispatch({
      type: 'funcBoard/loadParentNodeData',
    });
  };

  render() {
    return (
      <div>
        {/* 容器组件 ( 动态生成 ) */}
        {this.props.funcBoard.containers.map((item, index) => (
          <Container
            key={index}
            data-key={index}
            dataKey={index}
            onParentInputClick={this.handleParentInputClick}
          />
        ))}
        {/* 添加按钮组件 */}
        <AddBoardBtn onAddComponentClick={this.handleAddComponentClick} />
      </div>
    );
  }
}
export default connect(({ funcBoard }) => ({
  funcBoard,
}))(TestFuncBoardRouter);
