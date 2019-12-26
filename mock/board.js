module.exports = {
  ['POST /api/loadParentNodeDataService'](req, res) {
    res.status(200).json([
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
    ]);
  },
};
