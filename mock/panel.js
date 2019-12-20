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
};
