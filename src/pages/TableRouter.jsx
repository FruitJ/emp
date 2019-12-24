import React, { Component } from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    // colSpan: 0,
    dataIndex: 'name',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      console.log(value);
      console.log(row);
      console.log(index);
      if (index === 0) {
        obj.props.rowSpan = 2;
      }
      if (index === 1) {
        obj.props.rowSpan = 0;
      }
      /*if( index === 2 ) {
				obj.props.rowSpan = 0;
			}*/
      return obj;
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

class TableRouter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Table columns={columns} dataSource={data} size="middle" />
      </div>
    );
  }
}
export default TableRouter;
