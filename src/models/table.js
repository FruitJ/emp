import { loadInitTableDataService } from '../services/table';

export default {
  namespace: 'table',
  state: {
    dataSource: [],
    data: [],
    columns: [],
  },
  effects: {
    *createTable({}, { call, put }) {
      let res = yield call(loadInitTableDataService);

      console.log(`__ & 分割线 & __`);
      console.log(res);

      // 初始化表格
      yield put({
        type: '_createTable',
        payload: res,
      });
    },
  },
  reducers: {
    _rmSize32(state, { payload: param }) {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].name === param.parent_name) {
          state.dataSource[i].children = state.dataSource[i].children.filter((item, index) => {
            return item.name !== param.target;
          });
        }
      }

      // 格式化并保存数据
      let res = formatData(state.dataSource);
      console.log('干掉 bug');
      console.log(res);
      state.data = res[0];
      state.columns = res[1];

      return { ...state };
    },
    _addSize32(state, { payload: param }) {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].name === param.parent_name) {
          state.dataSource[i].children.push({
            name: param.target,
            id: param.id,
            prop: param.prop,
          });
        }
      }

      // 格式化并保存数据
      let res = formatData(state.dataSource);
      state.data = res[0];
      state.columns = res[1];

      return { ...state };
    },
    _createTable(state, { payload: data }) {
      // 格式化数据
      state.dataSource = data;

      let res = formatData(state.dataSource);
      console.log('&^&');
      state.data = res[0];
      console.log(state.data);
      state.columns = res[1];
      console.log(state.columns);
      return { ...state };
    },
  },
  subscriptions: {},
};
function formatData(data) {
  // 抽取数据结构
  // let

  console.log('formatData ...');
  console.log(data);

  let arr = [];

  for (let i = 0; i < data.length; i++) {
    arr.push(data[i].children);
  }

  console.log(arr);

  let temp = [];
  let count = 0;

  // 格式化表格数据
  switch (arr.length) {
    case 1:
      arr[0].forEach((item, index) => {
        count += 1;
        temp.push({
          [item.prop]: item.name,
          key: count,
        });
      });
      break;

    case 2:
      arr[0].forEach((item, index) => {
        arr[1].forEach((ele, num) => {
          count += 1;
          temp.push({
            [item.prop]: item.name,
            [ele.prop]: ele.name,
            key: count,
          });
        });
      });
      break;
    case 3:
      arr[0].forEach((item, index) => {
        arr[1].forEach((ele, num) => {
          arr[2].forEach((object, id) => {
            count += 1;
            temp.push({
              [item.prop]: item.name,
              [ele.prop]: ele.name,
              [object.prop]: object.name,
              key: count,
            });
          });
        });
      });
      break;
  }

  // 格式化 column 数据
  let columns = [];

  for (let i = 0; i < data.length; i++) {
    let obj = {
      title: data[i].name,
      dataIndex: data[i].children[0].prop,
    };

    if (i === 0) {
      // 为第一个元素设置 render
      if (data.length === 2) {
        if (data[1].children.length > 1) {
          let arr = [];
          for (let j = 0; j < data[0].children.length; j++) {
            arr.push(j * data[data.length - 1].children.length);
          }
          // alert(777888999);

          obj.render = (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // alert("秋主任: " + data[1].children.length);
            if (arr.indexOf(index) !== -1) {
              // console.log(obj);
              obj.props.rowSpan = data[data.length - 1].children.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;
          };
        }
      } else if (data.length === 3) {
        alert('a');
        if (data[2].children.length > 1) {
          let arr = [];
          for (let j = 0; j < data[0].children.length; j++) {
            arr.push(
              j * data[data.length - 1].children.length * data[data.length - 2].children.length,
            );
          }
          console.log('^* 分割线 *^');
          console.log(arr);
          // alert(777888999);
          obj.render = (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // alert("秋主任: " + data[1].children.length);
            if (arr.indexOf(index) !== -1) {
              // console.log(obj);
              obj.props.rowSpan =
                data[data.length - 1].children.length * data[data.length - 2].children.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;
          };
        }
      }
    } else if (i === 1) {
      // 为第二个元素设置 render
      alert('b');
      if (data.length === 3) {
        if (data[2].children.length > 1) {
          let arr = [];

          console.log('-------------)(-------------');
          console.log(data[0].children.length * data[1].children.length);

          for (let j = 0; j < data[0].children.length * data[1].children.length; j++) {
            arr.push(j * data[data.length - 1].children.length);
          }
          // alert(777888999);
          obj.render = (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            // alert("秋主任: " + data[1].children.length);

            console.log('^^_^^');
            console.log(arr);

            if (arr.indexOf(index) !== -1) {
              console.log(obj);
              obj.props.rowSpan = data[data.length - 1].children.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;
          };
        }
      }
    }

    columns.push(obj);
  }

  console.log(arr);
  console.log('temp');
  console.log(temp);
  console.log('columns');
  console.log(columns);

  return [temp, columns];
}
