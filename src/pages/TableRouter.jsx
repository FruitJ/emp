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
        // obj.props.rowSpan = 2;
      }
      if (index === 1) {
        // obj.props.rowSpan = 0;
      }
      /*if( index === 2 ) {
				obj.props.rowSpan = 0;
			}*/
      return obj;
    },
  },
  {
    title: '尺寸',
    dataIndex: 'size',
  },
  {
    title: '版本',
    dataIndex: 'version',
  },
];

const data = [
  /* {
    key: '1',
    color: '红色',
    size: '32 寸',
    version: '7.0',
  },*/
  {
    key: '2',
    color: '红色',
    size: '42 寸',
    version: '8.0',
  },
  {
    key: '5',
    color: '蓝色',
    size: '56 寸',
    version: '9.0',
  },
  {
    key: '3',
    color: '黑色',
    size: '128 寸',
    version: '11.0',
  },
];

class TableRouter extends Component {
  constructor(props) {
    super(props);
  }

  /*  handleRmSize32 = () => {
    
    this.props.dispatch({
      type: "table/_rmSize32",
      payload: {
        target: "32 寸",
        payload: {
          columns,
          data,
        },
      },
    });
  };*/

  handleCreatedTable = () => {
    this.props.dispatch({
      type: 'table/createTable',
    });
  };

  render() {
    return (
      <div>
        {/*<Table columns={columns} dataSource={data} size="middle" />
        
        <Button type="primary" onClick={ this.handleRmSize32 }>删除 32 寸</Button>*/}

        <Button type="primary" onClick={this.handleCreatedTable}>
          点击生成表格
        </Button>
      </div>
    );
  }
}
export default connect(({ table }) => ({
  table,
}))(TableRouter);
