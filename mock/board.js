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
  {
    parent_id: 2,
    child_name: '32 寸',
    child_id: 4,
  },
  {
    parent_id: 2,
    child_name: '56 寸',
    child_id: 5,
  },
  {
    parent_id: 2,
    child_name: '128 寸',
    child_id: 6,
  },
  {
    parent_id: 3,
    child_name: '7.0',
    child_id: 7,
  },
  {
    parent_id: 3,
    child_name: '8.0',
    child_id: 8,
  },
  {
    parent_id: 3,
    child_name: '9.0',
    child_id: 9,
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

      let obj = {
        parent_id: count,
        parent_name: req.body.parent_name,
        // id: count,
      };
      dataSource.push(obj);

      res.status(200).json(obj);
    }
  },
  ['POST /api/loadChildNodeDataService'](req, res) {
    console.log('啦啦啦');
    console.log(req.body);

    /*childDataSource.forEach((item, index) => {
      if (item.parent_id === Number(req.body.parent_id)) {
        item.prop = req.body.prop;
      }
    });*/

    console.log('--------------------');
    console.log(req.body.parent_id);
    console.log(childDataSource);
    let data = childDataSource.filter(
      (item, index) => item.parent_id === Number(req.body.parent_id),
    );

    console.log('---');
    console.log(data);
    res.status(200).json(data);
  },
  ['POST /api/getNewChildNamesEleService'](req, res) {
    console.log('/api/getNewChildNamesEleService');
    console.log(req.body);

    let { newElements, prop } = req.body;
    newElements = newElements.map((item, index) => {
      num += 1;

      return {
        child_id: num,
        child_name: item.child_name,
        parent_id: Number(item.parent_id),
      };
    });
    childDataSource.push(...newElements);

    console.log('呵呵');
    console.log(newElements);
    // console.log(Array.from(req.body));
    res.status(200).json(newElements);
  },
};
