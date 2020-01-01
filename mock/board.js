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

let childDataSource = [
  {
    parent_id: 1,
    child_name: '红色',
    child_id: 1,
  },
  {
    parent_id: 1,
    child_name: '蓝色',
    child_id: 2,
  },
  {
    parent_id: 1,
    child_name: '紫色',
    child_id: 3,
  },
];

let count = dataSource.length;

module.exports = {
  ['POST /api/loadParentNodeDataService'](req, res) {
    res.status(200).json(dataSource);
  },
  ['POST /api/getNewParentNamesEleService'](req, res) {
    console.log('嘻嘻嘻嘻嘻嘻');
    console.log(req.body);

    if (dataSource.some((item, index) => item.parent_name !== req.body.parent_name)) {
      count += 1;

      dataSource.push({
        parent_id: count,
        parent_name: req.body.parent_name,
      });

      res.status(200).json({
        parent_id: count,
        parent_name: req.body.parent_name,
      });
    }
  },
  ['POST /api/loadChildNodeDataService'](req, res) {
    console.log('啦啦啦');
    console.log(req.body);

    let data = childDataSource.filter(
      (item, index) => item.parent_id === Number(req.body.parent_id),
    );
    res.status(200).json(data);
  },
};
