module.exports = {
  ['POST /api/loadSpecsOptionService'](req, res) {
    res.status(200).json({
      data: [
        {
          current_id: 1,
          name: '红色',
          key: 1,
        },
        {
          current_id: 2,
          name: '绿色',
          key: 1,
        },
        {
          current_id: 3,
          name: '金色',
          key: 1,
        },
      ],
    });
  },

  ['POST /api/loadSpecsService'](req, res) {
    res.status(200).json({
      data: [
        {
          current_id: 1,
          name: '颜色',
          key: 1,
        },
        {
          current_id: 2,
          name: '尺寸',
          key: 2,
        },
        {
          current_id: 3,
          name: '版本',
          key: 3,
        },
      ],
    });
  },
};
