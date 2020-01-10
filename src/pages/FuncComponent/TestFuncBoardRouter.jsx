// 官方包
import React, { Component } from 'react';
import { connect } from 'dva';

// 自定义包
import AddBoardBtn from './component/AddBoardBtn';
import Container from './component/Container';
import './static/TestFuncBoardRouterd.less';
import { Table } from 'antd';
/**
 * @author FruitJ
 */

// 初始化 dispatch ( 简化写法 )
let dispatch = null;
let id = 0;
// 测试组件
class TestFuncBoardRouter extends Component {
  constructor(props) {
    super(props);
    // 简化 dispatch 写法
    dispatch = this.props.dispatch;
    this.tableRef = React.createRef();
  }

  // 点击添加按钮的回调函数
  handleAddComponentClick = () => {
    // 动态添加组件
    dispatch({
      type: 'funcBoard/_addContainer',
    });
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
    // 判断 parentNames 中的第一个元素是否是临时添加的

    alert(parent_id);

    const { parentNames } = this.props.funcBoard.containers[dataKey];

    if (parentNames[0].temp !== undefined && Number.isNaN(Number(parentNames[0].parent_id))) {
      alert(`: ${id}`);
      // 发送当前元素值
      dispatch({
        type: 'funcBoard/getNewParentNamesEle',
        payload: {
          parent_name: parentNames[0].parent_name,
          key: dataKey,
          parentName: parent_name,
          parent_id: id,
        },
      });
      id = 0;
    } else {
      dispatch({
        type: 'funcBoard/_putValToParentInput',
        payload: {
          parent_name,
          parent_id,
          key: dataKey,
        },
      });

      id = parent_id;
    }
  };

  // 检测中文输入
  handleCheckChineseInputStart = () => {
    dispatch({
      type: 'funcBoard/_checkChineseInputStart',
    });
  };

  // 检测中文输出
  handleCheckChineseInputEnd = () => {
    dispatch({
      type: 'funcBoard/_checkChineseInputEnd',
    });
  };

  // 检测正在输入
  handleCheckInputNow = (val, key) => {
    dispatch({
      type: 'funcBoard/_bindParentHoverInput',
      payload: {
        value: val,
        key,
      },
    });
  };

  handleChildCheckInputNow = (val, key) => {
    dispatch({
      type: 'funcBoard/_bindChildHoverInput',
      payload: {
        value: val,
        key,
      },
    });
  };

  handleAddChildNodeClick = (dataKey, id, prop) => {
    // 加载对应子节点数据
    dispatch({
      type: 'funcBoard/loadChildNodeData',
      payload: {
        parent_name: this.props.funcBoard.containers[dataKey].parentInputVal,
        parent_id: id,
        key: dataKey,
        prop,
      },
    });

    const { parentNames } = this.props.funcBoard.containers[dataKey];
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
  };

  handlePutValToChildInputClick = (child_name, child_id, dataKey, parent_id, prop) => {
    // 将选中的子节点数据填充进容器
    dispatch({
      type: 'funcBoard/_tempSaveSelectedChildNodeData',
      payload: {
        child_name,
        child_id,
        key: dataKey,
        parent_id,
        prop,
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

  handleCancelChildHoverBoard = key => {
    dispatch({
      type: 'funcBoard/_cancelChildHoverBoard',
      payload: {
        key,
      },
    });
  };

  handleAddChildNamesToRealArea = key => {
    // 判断当前数组中的元素是否有临时生成的元素
    dispatch({
      type: 'funcBoard/_judgeTempCreatedEle',
      payload: {
        key,
      },
    });
    if (this.props.funcBoard.containers[key].isHaveTempCreatedEle) {
      // 有，则先将该元素提交给后台并由后台返回一个已经替换了 id 的元素

      let temp_addEle = this.props.funcBoard.containers[key].afterNative_childNames.filter(
        (item, index) => Number.isNaN(Number(item.child_id)),
      );
      let arr = this.props.funcBoard.backUp_parentNames.filter(
        (item, index) => item.parent_name === this.props.funcBoard.containers[key].parentInputVal,
      );

      // 替换上传元素的 id
      dispatch({
        type: 'funcBoard/getNewChildNamesEle',
        payload: {
          key,
          temp_addEle,
          prop: arr[0].prop,
          parent_id: arr[0].parent_id,
        },
      });
    }
    // 将待选区域的标签移至真实区域 ( 同时清空待选区域数组 )

    dispatch({
      type: 'funcBoard/_realAddChildEle',
      payload: {
        key,
        table: this.tableRef.current.nextElementSibling.querySelectorAll("table")[0],
      },
    });
  };

  handleRemoveReal_childNames = (item, key) => {
    dispatch({
      type: 'funcBoard/_removeReal_childNames',
      payload: {
        item,
        key,
      },
    });
  };
  
  handleTableChange = (pagination, filters, sorter, extra) => {
    console.log("---------------------");
    console.log(extra);
  };
  
  handleClick = () => {
    console.log(11233214165);
    console.log(this.props.funcBoard.data);
    console.log(this.props.funcBoard.columns);
    // console.log(this.tableRef.current.nextElementSibling.querySelectorAll("table")[0]);
    
    // 提交页面数据
    dispatch({
      type: "funcBoard/_submitCurrentData",
      payload: {
        table: this.tableRef.current.nextElementSibling.querySelectorAll("table")[0],
      }
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
            onChildCheckInputNow={this.handleChildCheckInputNow}
            onCheckChineseInputStart={this.handleCheckChineseInputStart}
            onCheckChineseInputEnd={this.handleCheckChineseInputEnd}
            onAddChildNodeClick={this.handleAddChildNodeClick}
            onSwitchChildHoverBoardStatus={this.handleSwitchChildHoverBoardStatus}
            onRemoveAfterNative_childNames={this.handleRemoveAfterNative_childNames}
            onCancelChildHoverBoard={this.handleCancelChildHoverBoard}
            onAddChildNamesToRealArea={this.handleAddChildNamesToRealArea}
            onRemoveReal_childNames={this.handleRemoveReal_childNames}
          />
        ))}
        {/* 添加按钮组件 */}
        <AddBoardBtn ref={ this.tableRef } onAddComponentClick={this.handleAddComponentClick} />

        <Table
          
          columns={this.props.funcBoard.columns}
          dataSource={this.props.funcBoard.data}
          size="middle"
          pagination={false}
          onChange={this.handleTableChange}
          
        />
        <button className = "btn btn-info" onClick = { this.handleClick }>提交</button>
      </div>
    );
  }
}
export default connect(({ funcBoard }) => ({
  funcBoard,
}))(TestFuncBoardRouter);
