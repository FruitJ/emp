let dataSource = [
  {
    parent_id: 1,
    parent_name: '颜色',
    id: 1,
    prop: 'color',
  },
  {
    parent_id: 2,
    parent_name: '尺寸',
    id: 2,
    prop: 'size',
  },
  {
    parent_id: 3,
    parent_name: '版本',
    id: 3,
    prop: 'version',
  },
  {
    parent_id: 4,
    parent_name: 'color',
    id: 4,
    prop: 'color_other',
  },
  {
    parent_id: 5,
    parent_name: 'size',
    id: 5,
    prop: 'size_other',
  },
  {
    parent_id: 6,
    parent_name: 'version',
    id: 6,
    prop: 'version_other',
  },
];

let childDataSource = [
  {
    parent_id: 1,
    child_name: '红色',
    child_id: 1,
    id: 1,
  },
  {
    parent_id: 1,
    child_name: '蓝色',
    child_id: 2,
    id: 2,
  },
  {
    parent_id: 1,
    child_name: '紫色',
    child_id: 3,
    id: 3,
  },
  {
    parent_id: 2,
    child_name: '32 寸',
    child_id: 4,
    id: 4,
  },
  {
    parent_id: 2,
    child_name: '56 寸',
    child_id: 5,
    id: 5,
  },
  {
    parent_id: 2,
    child_name: '128 寸',
    child_id: 6,
    id: 6,
  },
  {
    parent_id: 3,
    child_name: '7.0',
    child_id: 7,
    id: 7,
  },
  {
    parent_id: 3,
    child_name: '8.0',
    child_id: 8,
    id: 8,
  },
  {
    parent_id: 3,
    child_name: '9.0',
    child_id: 9,
    id: 9,
  },
];

let count = dataSource.length;
let num = childDataSource.length;

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
        id: count,
      });

      res.status(200).json({
        parent_id: count,
        parent_name: req.body.parent_name,
        id: count,
      });
    }
  },
  ['POST /api/loadChildNodeDataService'](req, res) {
    console.log('啦啦啦');
    console.log(req.body);

    childDataSource.forEach((item, index) => {
      if (item.parent_id === Number(req.body.parent_id)) {
        item.prop = req.body.prop;
      }
    });

    let data = childDataSource.filter(
      (item, index) => item.parent_id === Number(req.body.parent_id),
    );

    res.status(200).json(data);
  },
  ['POST /api/getNewChildNamesEleService'](req, res) {
    console.log('/api/getNewChildNamesEleService');
    console.log(req.body);

    let { temp_addEle, prop } = req.body;
    temp_addEle = temp_addEle.map((item, index) => {
      num += 1;

      return {
        child_id: num,
        child_name: item.child_name,
        id: num,
        prop: item.prop,
        parent_id: item.parent_id,
      };
    });

    console.log('呵呵');
    console.log(temp_addEle);
    // console.log(Array.from(req.body));
    res.status(200).json(temp_addEle);
  },
};
