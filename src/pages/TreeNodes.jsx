import React, { Component, useEffect } from 'react';
import { Tree, Icon, Row, Col } from 'antd';

import './css/TreeNodes.less';

const { TreeNode } = Tree;

const data = [
  { key: '0', value: '未分类' },
  {
    key: '1',
    value: '电子',
    children: [
      {
        key: '10',
        value: '手机',
        children: [
          {
            key: '100',
            value: '智能机',
            children: [
              {
                key: '1000',
                value: '华为 mete 30',
              },
              {
                key: '1001',
                value: 'iPhone 11 plus',
              },
            ],
          },
          {
            key: '101',
            value: '老年机',
            children: [
              {
                key: '1010',
                value: '诺基亚',
              },
              {
                key: '1011',
                value: '摩托罗拉',
              },
            ],
          },
        ],
      },
      {
        key: '11',
        value: '电脑',
        children: [
          {
            key: '110',
            value: 'i3',
            children: [
              {
                key: '1100',
                value: 'Hasee',
              },
            ],
          },
          {
            key: '111',
            value: 'i5',
          },
          {
            key: '112',
            value: 'i9',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    value: '食品',
    children: [
      {
        key: '20',
        value: '饮品',
        children: [
          {
            key: '200',
            value: '酒水',
            children: [
              {
                key: '2000',
                value: '白酒',
              },
              {
                key: '2001',
                value: '啤酒',
              },
            ],
          },
          {
            key: '201',
            value: '饮料',
            children: [
              {
                key: '2010',
                value: '可口可乐',
              },
              {
                key: '2011',
                value: '雪碧',
              },
            ],
          },
        ],
      },
      {
        key: '21',
        value: '熟食',
        children: [
          {
            key: '210',
            value: '鸡类',
            children: [
              {
                key: '2100',
                value: '德州扒鸡',
              },
              {
                key: '2101',
                value: '陈家熏鸡',
              },
            ],
          },
        ],
      },
    ],
  },
];
/*const data = [
  {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": null,
                    "key": 12,
                    "label": "低度酒",
                    "value": "低度酒"
                  },
                  {
                    "children": null,
                    "key": 13,
                    "label": "高度酒",
                    "value": "高度酒"
                  }
                ],
                "key": 8,
                "label": "白酒",
                "value": "白酒"
              },
              {
                "children": null,
                "key": 10,
                "label": "啤酒",
                "value": "啤酒"
              }
            ],
            "key": 5,
            "label": "酒",
            "value": "酒"
          },
          {
            "children": null,
            "key": 6,
            "label": "饮用水",
            "value": "饮用水"
          },
          {
            "children": [
              {
                "children": null,
                "key": 11,
                "label": "可乐",
                "value": "可乐"
              }
            ],
            "key": 7,
            "label": "饮料",
            "value": "饮料"
          }
        ],
        "key": 4,
        "label": "酒水饮料",
        "value": "酒水饮料"
      }
    ],
    "key": 1,
    "label": "食品类",
    "value": "食品类"
  },
  {
    "children": null,
    "key": 2,
    "label": "日用品类",
    "value": "日用品类"
  },
  {
    "children": [
      {
        "children": null,
        "key": 9,
        "label": "手机",
        "value": "手机"
      }
    ],
    "key": 3,
    "label": "家电 / 数码 / 手机",
    "value": "家电 / 数码 / 手机"
  }
];*/

const TreeNodes = props => {
  // class TreeNodes extends Component {

  /*    constructor(props) {
        super(props);
        
    }*/

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  /*componentDidMount() {
    let sa = document.querySelectorAll(".sa")[1];
    sa.addEventListener('click', function() {
      alert("111");
    }, false);
  }*/
  useEffect(() => {
    // console.log("sasasa");
    // console.log(btnRef);

    let sa = document.querySelectorAll('.sa')[1];
    sa.addEventListener(
      'click',
      function() {
        alert('111');
      },
      false,
    );
  }, []);
  const dynamicTreeNodeGenerator = data =>
    data.map((item, index) => {
      // if(item.children) {
      //   console.log(item);

      return (
        <TreeNode
          title={
            <Row
              style={{
                position: 'relative',
              }}
            >
              <Col span={6} offset={0}>
                <span>{item.value}</span>
              </Col>
              <span className="sa">123</span>
              <Col
                style={
                  {
                    // position: "absolute",
                    // right: "0"
                  }
                }
                offset={20}
              >
                {Number(item.key) !== 0 ? 123 : null}
              </Col>
            </Row>
          }
          key={item.key}
        >
          {/*{ item.children ? this.dynamicTreeNodeGenerator(item.children) : null }*/}
          {item.children ? dynamicTreeNodeGenerator(item.children) : null}
        </TreeNode>
      );
      // }
    });

  // render() {
  return (
    <>
      <Tree
        showLine
        defaultExpandedKeys={['0-0-0']}
        // onSelect={this.onSelect}
        onSelect={onSelect}
      >
        {/* 动态生成 TreeNode */}
        {/*{ this.dynamicTreeNodeGenerator(data) }*/}
        {dynamicTreeNodeGenerator(data)}
      </Tree>
    </>
  );
  // }
};
export default TreeNodes;
