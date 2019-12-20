import React, { Component } from 'react';

import { connect } from 'dva';

import GoodsSpecs from './customComponent/components/GoodsSpecs';

class GoodsSpecsRouter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <GoodsSpecs />
      </div>
    );
  }
}
export default connect(({ custom }) => ({
  custom,
}))(GoodsSpecsRouter);
