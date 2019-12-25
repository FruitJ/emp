import React, { Component } from 'react';

import { connect } from 'dva';
import { Button, message } from 'antd';

import GoodsSpecs from './customComponent/components/GoodsSpecs';

class GoodsSpecsRouter extends Component {
  constructor(props) {
    super(props);
  }

  handleUpdateAddSpecsPanelStatus = node => {
    // 检测当前是否已经选择商品规格
    if (this.props.goodsSpecs.saveGoodsSpecs$arr.length !== 0) {
      // 更新状态
      this.props.dispatch({
        type: 'goodsSpecs/_updateAddSpecsPanelStyle',
        payload: {
          top: node.offsetTop,
          left: node.offsetLeft,
          status: 'block',
        },
      });
    } else {
      // 全具提示
      message.warning('请选择具体的商品规格后再添加对应的规格值 !');
    }
  };

  // 加载商品规格值的数据
  handleLoadGoodsSpecsOption = id => {
    this.props.dispatch({
      type: 'goodsSpecs/loadSpecsOption',
      payload: {
        specs_id: id,
      },
    });
  };

  // 加载商品规格数据
  handleLoadGoodsSpecs = key => {
    console.log(`${key} : ~`);
    this.props.dispatch({
      type: 'goodsSpecs/loadSpecs',
    });
  };

  handleChangeTriangleStyle = direct => {
    this.props.dispatch({
      type: 'goodsSpecs/_changeTriangleStyle',
      payload: direct,
    });
  };

  handleUpdateHintPanelStatus = data => {
    this.props.dispatch({
      type: 'goodsSpecs/_updateHintPanelStatus',
      payload: data,
    });
  };

  handleAddSpecsToSelector = ev => {
    this.props.dispatch({
      type: 'goodsSpecs/_addSpecsToSelector',
      payload: Number(ev.target.dataset.key),
    });
  };

  handleRemoveSpecsFromSelector = ev => {
    this.props.dispatch({
      type: 'goodsSpecs/_removeSpecsFromSelector',
      payload: {
        key: ev.target.dataset.key,
      },
    });
  };

  handleRemoveSelectSpecsFromSelector = ev => {
    this.props.dispatch({
      type: 'goodsSpecs/_removeSelectSpecsFromSelector',
      payload: {
        key: ev.target.dataset.key,
      },
    });
  };

  handleBindInputVal = ev => {
    console.log('-- * 分割线 * --');
    console.log('onChange ...');
    this.props.dispatch({
      type: 'goodsSpecs/_bindInputVal',
      payload: ev.target.value,
    });
  };

  handleCancelOperatePanel = status => {
    this.props.dispatch({
      type: 'goodsSpecs/_CancelOperatePanel',
      payload: status,
    });
  };

  handleSubmitValFromOperatePanel = () => {
    this.props.dispatch({
      type: 'goodsSpecs/_submitValFromOperatePanel',
    });
  };

  handleUpdateSelectHintPanelStatus = data => {
    this.props.dispatch({
      type: 'goodsSpecs/_updateSelectHintPanelStatus',
      payload: data,
    });
  };

  handleRotateTriangleTag = style => {
    this.props.dispatch({
      type: 'goodsSpecs/_changeSelectTriangleDirection',
      payload: style,
    });
  };

  handleAddGoodsSpecsToSelector = ev => {
    this.props.dispatch({
      type: 'goodsSpecs/_addGoodsSpecsToSelector',
      payload: Number(ev.target.dataset.key),
    });
  };

  handleBindSelectInputVal = ev => {
    this.props.dispatch({
      type: 'goodsSpecs/_bindSelectInputVal',
      payload: ev.target.value,
    });
  };

  handleCompositionEnd = () => {
    console.log('() 分割线 ()');
    console.log('CompositionEnd ...');
    this.props.dispatch({
      type: 'goodsSpecs/_compositionEnd',
    });
  };

  onSelectCompositionEnd = () => {
    this.props.dispatch({
      type: 'goodsSpecs/_selectCompositionEnd',
    });
  };

  onSelectCompositionStart = () => {
    this.props.dispatch({
      type: 'goodsSpecs/_selectCompositionStart',
    });
  };

  handleAddCount = () => {
    // 增加商品规格控件
    this.props.dispatch({
      type: 'goodsSpecs/_addGoodsSpecsComponent',
    });
  };

  render() {
    const { goodsSpecs } = this.props;

    return (
      <div>
        <GoodsSpecs
          modal={this.props.goodsSpecs}
          onUpdateAddSpecsPanelStatus={this.handleUpdateAddSpecsPanelStatus}
          onLoadGoodsSpecsOption={this.handleLoadGoodsSpecsOption}
          onChangeTriangleStyle={this.handleChangeTriangleStyle}
          onUpdateHintPanelStatus={this.handleUpdateHintPanelStatus}
          onAddSpecsToSelector={this.handleAddSpecsToSelector}
          onRemoveSpecsFromSelector={this.handleRemoveSpecsFromSelector}
          onRemoveSelectSpecsFromSelector={this.handleRemoveSelectSpecsFromSelector}
          onBindInputVal={this.handleBindInputVal}
          onCancelOperatePanel={this.handleCancelOperatePanel}
          onSubmitValFromOperatePanel={this.handleSubmitValFromOperatePanel}
          onUpdateSelectHintPanelStatus={this.handleUpdateSelectHintPanelStatus}
          onRotateTriangleTag={this.handleRotateTriangleTag}
          onAddSpecs={this.handleAddSpecs}
          onAddGoodsSpecsToSelector={this.handleAddGoodsSpecsToSelector}
          onBindSelectInputVal={this.handleBindSelectInputVal}
          onLoadGoodsSpecs={this.handleLoadGoodsSpecs}
          onCompositionEnd={this.handleCompositionEnd}
          onSelectCompositionEnd={this.onSelectCompositionEnd}
          onSelectCompositionStart={this.onSelectCompositionStart}
          onAddCount={this.handleAddCount}
        />
      </div>
    );
  }
}
export default connect(({ goodsSpecs }) => ({
  goodsSpecs,
}))(GoodsSpecsRouter);
