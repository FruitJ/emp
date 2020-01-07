import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';

const columns = [
  {
    title: '颜色',
    // colSpan: 0,
    dataIndex: 'color',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      console.log(value);
      console.log(row);
      console.log(index);
      if (index === 0) {
        obj.props.rowSpan = 9;
      }
      if (index === 1) {
        obj.props.rowSpan = 0;
      }
      if (index === 2) {
        obj.props.rowSpan = 0;
      }

      if (index === 9) {
        obj.props.rowSpan = 9;
      }
      /*if( index === 18 ) {
				obj.props.rowSpan = 9;
			}*/
      return obj;
    },
  },
  {
    title: '尺寸',
    dataIndex: 'size',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };

      if (index === 0) {
        obj.props.rowSpan = 3;
      }
      if (index === 1) {
        obj.props.rowSpan = 0;
      }
      if (index === 2) {
        obj.props.rowSpan = 0;
      }

      return obj;
    },
  },
  /*{
    title: '版本',
    dataIndex: 'version',
  },*/
];

/*const data = [
  { color: '红色', size: '32 寸', version: '7.0', key: 1 },
  { color: '红色', size: '32 寸', version: '8.0', key: 2 },
  { color: '红色', size: '32 寸', version: '9.0', key: 3 },
  { color: '红色', size: '56 寸', version: '7.0', key: 4 },
  { color: '红色', size: '56 寸', version: '8.0', key: 5 },
  { color: '红色', size: '56 寸', version: '9.0', key: 6 },
  { color: '红色', size: '96 寸', version: '7.0', key: 7 },
  { color: '红色', size: '96 寸', version: '8.0', key: 8 },
  { color: '红色', size: '96 寸', version: '9.0', key: 9 },
  { color: '绿色', size: '32 寸', version: '7.0', key: 10 },
  { color: '绿色', size: '32 寸', version: '8.0', key: 11 },
  { color: '绿色', size: '32 寸', version: '9.0', key: 12 },
  { color: '绿色', size: '56 寸', version: '7.0', key: 13 },
  { color: '绿色', size: '56 寸', version: '8.0', key: 14 },
  { color: '绿色', size: '56 寸', version: '9.0', key: 15 },
  { color: '绿色', size: '96 寸', version: '7.0', key: 16 },
  { color: '绿色', size: '96 寸', version: '8.0', key: 17 },
  { color: '绿色', size: '96 寸', version: '9.0', key: 18 },
  { color: '紫色', size: '32 寸', version: '7.0', key: 19 },
  { color: '紫色', size: '32 寸', version: '8.0', key: 20 },
  { color: '紫色', size: '32 寸', version: '9.0', key: 21 },
  { color: '紫色', size: '56 寸', version: '7.0', key: 22 },
  { color: '紫色', size: '56 寸', version: '8.0', key: 23 },
  { color: '紫色', size: '56 寸', version: '9.0', key: 24 },
  { color: '紫色', size: '96 寸', version: '7.0', key: 25 },
  { color: '紫色', size: '96 寸', version: '8.0', key: 26 },
  { color: '紫色', size: '96 寸', version: '9.0', key: 27 },
];*/
const data = [
  { color: '红色', size: '32 寸', key: 1 },
  { color: '红色', size: '32 寸', key: 2 },
  { color: '红色', size: '56 寸', key: 4 },
  { color: '红色', size: '56 寸', key: 5 },
  { color: '红色', size: '96 寸', key: 7 },
  { color: '红色', size: '96 寸', key: 8 },
  { color: '绿色', size: '32 寸', key: 11 },
  { color: '绿色', size: '32 寸', key: 12 },
  { color: '绿色', size: '56 寸', key: 14 },
  { color: '绿色', size: '56 寸', key: 15 },
  { color: '绿色', size: '96 寸', key: 16 },
  { color: '绿色', size: '96 寸', key: 18 },
  { color: '紫色', size: '32 寸', key: 19 },
  { color: '紫色', size: '32 寸', key: 21 },
  { color: '紫色', size: '56 寸', key: 22 },
  { color: '紫色', size: '56 寸', key: 24 },
  { color: '紫色', size: '96 寸', key: 25 },
  { color: '紫色', size: '96 寸', key: 27 },
];

let count = 100;

class TableRouter extends Component {
  constructor(props) {
    super(props);
  }

  handleRmSize32 = () => {
    this.props.dispatch({
      type: 'table/_rmSize32',
      payload: {
        target: '32 寸',
        parent_name: '尺寸',
      },
    });
  };

  handleCreatedTable = () => {
    this.props.dispatch({
      type: 'table/createTable',
    });
  };

  handleAddSize32 = () => {
    count += 1;

    this.props.dispatch({
      type: 'table/_addSize32',
      payload: {
        target: '32 寸',
        parent_name: '尺寸',
        prop: 'size',
        id: count,
      },
    });
  };

  render() {
    return (
      <div>
        <Table
          columns={this.props.table.columns}
          dataSource={this.props.table.data}
          size="middle"
          pagination={false}
        />

        <Button type="primary" onClick={this.handleRmSize32}>
          删除 32 寸
        </Button>

        <Button type="primary" onClick={this.handleCreatedTable}>
          点击生成表格
        </Button>

        <Button type="primary" onClick={this.handleAddSize32}>
          添加 32
        </Button>
      </div>
    );
  }
}
export default connect(({ table }) => ({
  table,
}))(TableRouter);
