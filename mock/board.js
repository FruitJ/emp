let dataSource = [
  {
    parent_id: 1,
    parent_name: '颜色',
  },
  {
    parent_id: 2,
    parent_name: '尺寸',
  },
  {
    parent_id: 3,
    parent_name: '版本',
  },
  {
    parent_id: 4,
    parent_name: 'color',
  },
  {
    parent_id: 5,
    parent_name: 'size',
  },
  {
    parent_id: 6,
    parent_name: 'version',
  },
];

module.exports = {
  ['POST /api/loadParentNodeDataService'](req, res) {
    res.status(200).json(dataSource);
  },
};
