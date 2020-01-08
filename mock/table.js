export default {
  ['POST /api/loadInitTableData'](req, res) {
    // 返回要生成的表格数据
    let table = [
      {
        name: '颜色',
        id: 1,
        children: [
          {
            prop: 'color',
            name: '红色',
            id: 2,
          },
          {
            prop: 'color',
            name: '绿色',
            id: 3,
          },
          {
            prop: 'color',
            name: '紫色',
            id: 4,
          },
        ],
      },
      {
        name: '尺寸',
        id: 5,
        children: [
          {
            prop: 'size',
            name: '32 寸',
            id: 6,
          },
          {
            prop: 'size',
            name: '56 寸',
            id: 7,
          },
          {
            prop: 'size',
            name: '96 寸',
            id: 8,
          },
        ],
      },
      {
        name: '版本',
        id: 9,
        children: [
          {
            prop: 'version',
            name: '7.0',
            id: 10,
          },
          {
            prop: 'version',
            name: '8.0',
            id: 11,
          },
          {
            prop: 'version',
            name: '9.0',
            id: 12,
          },
        ],
      },
      {
        name: '价格',
        id: 9,
        children: [
          {
            prop: 'price',
            name: '7.0',
            id: 10,
          },
        ],
      },
    ];

    res.status(200).json(table);
  },
};
