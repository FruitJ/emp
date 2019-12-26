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
  /**
   * @author { FruitJ }
   * @param { Number } key 当前正被操作的索引
   * @return { Void } 无返回值
   * @description 加载当前被选中的父级 input 框所要展示的数据
   */
  handleParentInputClick = key => {
    dispatch({
      type: 'funcBoard/loadParentNodeData',
      payload: {
        key,
      },
    });
  };

  /**
   * @author { FruitJ }
   * @param { Number } index 当前 container 面板的索引
   * @return { Void } 无返回值
   * @description 删除当前选中的 container 面板
   */
  handleRemoveContainerClick = index => {
    dispatch({
      type: 'funcBoard/_removeContainer',
      payload: {
        index,
      },
    });
  };

  /**
   * @author { FruitJ }
   * @param { Number } parent_id 当前选中父节点列表项 id
   * @param { Number } dataKey 当前被操作的父节点的 id
   * @return { Void } 无返回值
   * @description 将当前选中的值填充进模拟表单中，同时请求其父节点下面的数据
   */
  handlePutValToParentInputClick = (parent_id, dataKey) => {
    dispatch({
      type: 'funcBoard/_putValToParentInput',
      payload: {
        parent_id,
        key: dataKey,
      },
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
            board={this.props.funcBoard}
            onParentInputClick={this.handleParentInputClick}
            onRemoveContainerClick={this.handleRemoveContainerClick}
            onPutValToParentInputClick={this.handlePutValToParentInputClick}
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
