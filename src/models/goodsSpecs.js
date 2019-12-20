import { loadSpecsOptionService } from '@/services/panel';
import UUID from 'uuidjs';

export default {
  namespace: 'goodsSpecs',
  state: {
    addSpecsPanelStyle: {
      top: 100,
      left: 100,
      status: 'none',
    },
    goodsSpecs$arr: [],
    triangleDirection: '',
    specsOptionArr: [],
    input_select$val: '请选择',
    input_select$arr: [],
    input_custom$val: '',
    activity_specs$arr: [],
    temp: [],
    hint_panel_status: {
      display: 'none',
      top: '0',
    },
    isVanish: 'block',
  },
  effects: {
    *loadSpecsOption({ payload: data }, { call, put }) {
      // 请求数据
      let res = yield call(loadSpecsOptionService, data);
      console.log('== 分割线 ==');
      console.log(res);
      // 存储数据
      yield put({
        type: '_saveSpecsOptionData',
        payload: {
          data: res,
        },
      });
    },
  },
  reducers: {
    _updateAddSpecsPanelStyle(state, { payload: param }) {
      console.log(param);
      alert(0);
      state.addSpecsPanelStyle.top = param.top;
      state.addSpecsPanelStyle.left = param.left;
      state.addSpecsPanelStyle.status = param.status;

      return { ...state };
    },

    _changeTriangleStyle(state, { payload: className }) {
      state.triangleDirection = className;
      return { ...state };
    },
    _saveSpecsOptionData(state, { payload: param }) {
      state.specsOptionArr = param.data.data;
      return { ...state };
    },
    // 添加商品规格选项
    _addSpecsToSelector(state, { payload: key }) {
      // 判断当前将要添加的项是否是用户自定义项。

      // 判断将要添加的规格值是否已经添加过 ( 只添加未添加过的商品规格选项 )
      let tag = state.input_select$arr.every((item, index) => {
        if (Number.isNaN(key)) {
          return item.key !== key;
        } else {
          return item.current_id !== state.specsOptionArr[key - 1].current_id;
        }
      });

      if (tag) {
        if (Number.isNaN(key)) {
          // (item.name !== state.specsOptionArr[key].name
          state.input_select$arr.push(state.specsOptionArr[0]);
          // 拿数组的最后一项的 name 属性值与其他的带有 temp 属性的元素进行比较如果 name 值的比较返回 true
          // 则，删除当前数组的最后一项
          let temps = state.input_select$arr.filter((item, index) => item.temp !== undefined);

          if (
            temps.length > 1 &&
            temps.some(
              (item, index) =>
                item.name === temps[temps.length - 1].name &&
                item.key !== temps[temps.length - 1].key,
            )
          ) {
            state.input_select$arr.pop();
          }
        } else {
          // 判断当前数组中有无临时元素
          let flag = state.specsOptionArr.some((item, index) => item.temp === 'temp');
          if (flag) {
            // 有临时元素
            let arr = state.input_select$arr.filter((item, index) => {
              return (
                item.key !== state.specsOptionArr[key].key &&
                item.temp !== 'temp' &&
                item.name !== state.specsOptionArr[key].name
              );
            });
            if (arr.length !== 0) {
              state.input_select$arr.push(...arr);
            }
          } else {
            state.input_select$arr.push(state.specsOptionArr[key - 1]);
          }
        }
      }
      // 清空 input 值
      state.input_custom$val = '';
      return { ...state };
    },
    _removeSpecsFromSelector(state, { payload: data }) {
      console.log('modal rm ...');
      console.log(data.key);
      // console.log();
      // 更新集合数据
      if (Number.isNaN(Number(data.key))) {
        state.input_select$arr = state.input_select$arr.filter(
          (item, index) => item.key !== data.key,
        );
      } else {
        state.input_select$arr = state.input_select$arr.filter(
          (item, index) => item.current_id !== Number(data.key),
        );
      }

      return { ...state };
    },
    _bindInputVal(state, { payload: val }) {
      state.input_custom$val = val; // 更新表单值

      // 收集输入过的含有正在输入的元素
      state.activity_specs$arr = state.specsOptionArr.filter((item, index) =>
        item.name.includes(state.input_custom$val),
      );

      let tag;
      try {
        // 如果临时数组中没有任何元素
        // 规格选项列表数组是否已经添加用户自定义内容
        tag = state.specsOptionArr[0].temp !== undefined;
      } catch (err) {
        tag = false; // 走下面的 false 逻辑
      }
      if (tag) {
        // 已添加用户自定义内容
        if (state.input_custom$val) {
          // 用户输入不为空
          state.specsOptionArr[0].name = state.input_custom$val; // 更新当前临时元素的值
        } else {
          // 用户输入为空
          state.activity_specs$arr = []; // 置空；临时数组
          state.specsOptionArr = JSON.parse(JSON.stringify(state.temp)); // 将用户自定义输入之前的规格选项列表数组进行还原
        }
      } else {
        // 未添加用户自定义内容
        let _uuid = UUID.generate(); // 生成 UUID
        state.activity_specs$arr.unshift({
          // 添加用户自定义元素
          temp: 'temp', // 生成临时字段
          current_id: _uuid, // 生成临时 id
          name: state.input_custom$val,
          key: _uuid, // 生成临时 key
        });
        // 保存规格选项列表数组
        state.temp = JSON.parse(JSON.stringify(state.specsOptionArr));
        // 使用临时数组将规格选项列表数组进行覆盖
        state.specsOptionArr = JSON.parse(JSON.stringify(state.activity_specs$arr));
      }

      return { ...state };
    },
    /*'_initWillAddEle'( state, { } ) {
      
      // 生成唯一的 UUID 充当即将添加元素的 key 与 current_id
      // 将其添加到 selector 面板上
      // 同时请求真实的 id
      let _uuid = UUID.generate();
      state.input_select$arr.unshift({
        current_id: _uuid,
        name: "",
        key: _uuid,
      });
      return { ...state };
    },*/
    _updateHintPanelStatus(state, { payload: param }) {
      state.hint_panel_status.display = param.display;
      state.hint_panel_status.top = param.top;
      return { ...state };
    },
    _CancelOperatePanel(state, { payload: param }) {
      state.addSpecsPanelStyle.top = 0;
      state.addSpecsPanelStyle.left = 0;
      state.addSpecsPanelStyle.status = param;

      return { ...state };
    },
    _submitValFromOperatePanel(state, {}) {
      // 添加选中的数据项
      // 用待选区域的数组中的每一项与已经添加好的数组中的每一项进行比对，如果相等则 不执行添加操作，保证数据的唯一性
      // state.input_select$arr.filter((item, index) => item.name !== );
      let arr = [];
      /*if(state.goodsSpecs$arr.length !== 0) {
        for(let i = 0; i < state.input_select$arr.length; i++) {
    
          for(let o = 0; o < state.goodsSpecs$arr.length; o++) {
            if(state.input_select$arr[i].name !== state.goodsSpecs$arr[o].name) {
              state.goodsSpecs$arr.push(state.input_select$arr[i].name);
            }
          }
    
        }
        
        
        
      }else {
        // state.goodsSpecs$arr.push(state.input_select$arr[i].name);
        state.goodsSpecs$arr = JSON.parse(JSON.stringify(state.input_select$arr));
      }*/

      // state.goodsSpecs$arr = JSON.parse(JSON.stringify(state.input_select$arr));
      console.log('--(())');
      console.log([...new Set(JSON.parse(JSON.stringify(state.input_select$arr)))]);
      state.goodsSpecs$arr.push(...JSON.parse(JSON.stringify(state.input_select$arr)));
      state.goodsSpecs$arr = [...new Set(state.goodsSpecs$arr)];
      console.log(state.goodsSpecs$arr);
      // 干掉用户选择面板
      state.addSpecsPanelStyle.top = 0;
      state.addSpecsPanelStyle.left = 0;
      state.addSpecsPanelStyle.status = 'none';

      // 清空待选数组中的内容
      state.input_select$arr = [];

      return { ...state };
    },
  },
  subscriptions: {},
};
