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
  handlePutValToParentInputClick = (parent_name, parent_id, dataKey) => {
    alert(parent_name + '~~~');
    dispatch({
      type: 'funcBoard/_putValToParentInput',
      payload: {
        parent_name,
        parent_id,
        key: dataKey,
      },
    });

    // 判断 parentNames 中的第一个元素是否是临时添加的
    console.log('fengexian');
    console.log(this.props.funcBoard.containers[dataKey].parentNames);

    const { parentNames } = this.props.funcBoard.containers[dataKey];

    if (parentNames[0].temp !== undefined && Number.isNaN(Number(parentNames[0].parent_id))) {
      alert('需要处理');
      console.log('()()()--');
      console.log(parentNames[0].parent_name);
      // 发送当前元素值
      dispatch({
        type: 'funcBoard/getNewParentNamesEle',
        payload: {
          parent_name: parentNames[0].parent_name,
          key: dataKey,
        },
      });
    }

    console.log('-- -- 分割线 -- --');
    console.log(this.props.funcBoard.containers[dataKey].isSureParentNamesEle);
    console.log(parentNames);

    /*console.log(")() 分割线 ()(");
    console.log(this.props.funcBoard.isCouldReqChildrenData);
    const { isCouldReqChildrenData } = this.props.funcBoard;
    if(isCouldReqChildrenData) { // 请求子节点数据
      /!*dispatch({
        type: "funcBoard/",
        payload: ,
      });*!/
    }else {
      console.warn("已经添加过该规格并且已经请求过数据了!");
    }*/
  };

  handleCheckChineseInputStart = () => {
    dispatch({
      type: 'funcBoard/_checkChineseInputStart',
    });
  };

  handleCheckChineseInputEnd = () => {
    dispatch({
      type: 'funcBoard/_checkChineseInputEnd',
    });
  };

  handleCheckInputNow = (val, key) => {
    dispatch({
      type: 'funcBoard/_bindParentHoverInput',
      payload: {
        value: val,
        key,
      },
    });
  };

  handleAddChildNodeClick = (dataKey, id) => {
    // const proxy_obj = this.props.funcBoard.containers[dataKey];

    // let id = Number(proxy_obj.parentInputId);
    // if (Number.isNaN(id)) {
    //     //   id = proxy_obj.parentNames[proxy_obj.parentNames.length - 1].parent_id;
    //     // }

    console.log('父节点索引 ...');
    console.log(id, this.props.funcBoard.containers[dataKey].parentInputVal);

    // 加载对应子节点数据
    dispatch({
      type: 'funcBoard/loadChildNodeData',
      payload: {
        parent_name: this.props.funcBoard.containers[dataKey].parentInputVal,
        parent_id: id,
        key: dataKey,
      },
    });

    console.log('__ + 分割线 + __');
    console.log(this.props.funcBoard.containers[dataKey].parentInputId);

    const { parentNames } = this.props.funcBoard.containers[dataKey];

    console.log(
      parentNames[parentNames.length - 1].parent_id,
      parentNames[parentNames.length - 1].parent_name,
    );
  };

  /*  handleChildInputClick = (key) => {

    // 关闭面板
    dispatch({
      type: "funcBoard/_removeChildHoverBoard",
      payload: {
        key,
      }
    });

  };*/

  handleSwitchChildHoverBoardStatus = key => {
    let tag = false;
    // 切换子节点的悬浮选值面板的状态
    if (this.props.funcBoard.containers[key].hoverChildInputBoard_tag) {
      tag = false;
    } else {
      tag = true;
    }
    // 隐藏

    // 更新子节点的悬浮选值面板的状态
    dispatch({
      type: 'funcBoard/_changeChildHoverBoardStatus',
      payload: {
        tag: tag,
        key,
      },
    });

    // 更新子节点的悬浮选值面板的样式
    /*dispatch({
      type: "funcBoard/_changeChildHoverBoardStyle",
      payload: ,
    });*/
  };

  handlePutValToChildInputClick = (child_name, child_id, dataKey) => {
    console.log('^-_^_-^');
    console.log(child_name, child_id, dataKey);

    // 将选中的子节点数据填充进容器
    dispatch({
      type: 'funcBoard/_tempSaveSelectedChildNodeData',
      payload: {
        child_name,
        child_id,
        key: dataKey,
      },
    });
  };

  handleRemoveAfterNative_childNames = (item, key) => {
    // 删除当前选项
    dispatch({
      type: 'funcBoard/_removeAfterNative_childNames',
      payload: {
        item,
        key,
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
            onPutValToChildInputClick={this.handlePutValToChildInputClick}
            onCheckInputNow={this.handleCheckInputNow}
            onCheckChineseInputStart={this.handleCheckChineseInputStart}
            onCheckChineseInputEnd={this.handleCheckChineseInputEnd}
            onAddChildNodeClick={this.handleAddChildNodeClick}
            // onChildInputClick={this.handleChildInputClick}
            onSwitchChildHoverBoardStatus={this.handleSwitchChildHoverBoardStatus}
            onRemoveAfterNative_childNames={this.handleRemoveAfterNative_childNames}
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
