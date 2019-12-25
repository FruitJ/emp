import { loadSpecsOptionService, loadSpecsService } from '../services/panel';
import UUID from 'uuidjs';

export default {
  namespace: 'goodsSpecs',
  state: {
    specs: [],
    specs_count: 0,
  },
  effects: {
    *loadSpecsOption({ payload: data }, { call, put }) {
      // 请求数据
      let res = yield call(loadSpecsOptionService, data);
      console.log('== 分割线 ==');
      console.log();
      console.log(res);
      // 存储数据
      yield put({
        type: '_saveSpecsOptionData',
        payload: {
          data: res,
        },
      });
    },
    *loadSpecs({}, { call, put }) {
      let res = yield call(loadSpecsService);
      console.log('%- 分割线 -%');
      console.log(res);

      yield put({
        type: '_saveSpecsData',
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
    _saveSpecsData(state, { payload: param }) {
      state.specs$arr = param.data.data;

      console.log();

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

    _removeSelectSpecsFromSelector(state, { payload: data }) {
      if (Number.isNaN(Number(data.key))) {
        state.goodsSpecs$arr = state.goodsSpecs$arr.filter((item, index) => item.key !== data.key);
      } else {
        state.goodsSpecs$arr = state.goodsSpecs$arr.filter(
          (item, index) => item.current_id !== Number(data.key),
        );
      }
      return { ...state };
    },
    _bindInputVal(state, { payload: val }) {
      state.input_custom$val = val; // 更新表单值

      // 判断如果是执行删除操作
      if (state.prevInputContent.length > state.input_custom$val.length) {
        // 重新筛选
        console.log('执行 ...');
        console.log(state.specsOptionArr);
        console.log(state.activity_specs$arr);
        console.log(state.temp);

        if (state.input_custom$val === '') {
          if (state.temp.length === 0) {
            state.temp = JSON.parse(JSON.stringify(state.specsOptionArr));
          }

          console.log('分割线');
          console.log(state.input_custom$val + 'bingo');
          alert('go ...');
          console.log(JSON.parse(JSON.stringify(state.temp)));
          state.specsOptionArr = JSON.parse(JSON.stringify(state.temp));
        } else {
          console.log('_- 有值 -_');
          console.log(state.activity_specs$arr);
          console.log(state.temp);
          let temp = JSON.parse(JSON.stringify(state.temp));
          state.activity_specs$arr = temp.filter((item, index) => {
            console.log(item.name, state.prevInputContent, state.input_custom$val);
            return (
              item.name.includes(state.input_custom$val) && item.name !== state.input_custom$val
            );
            // return item.name.includes(state.input_custom$val) && item.name !== state.prevInputContent && item.name !== state.input_custom$val;
          });
          /*
					state.activity_specs$arr = state.specsOptionArr.filter((item, index) => {
					  console.log(item.name, state.prevInputContent, state.input_custom$val);
					  return item.name.includes(state.input_custom$val) && item.name !== state.prevInputContent;
					});
		  */

          // 未添加用户自定义内容
          let _uuid = UUID.generate(); // 生成 UUID
          state.activity_specs$arr.unshift({
            // 添加用户自定义元素
            temp: 'temp', // 生成临时字段
            current_id: _uuid, // 生成临时 id
            name: state.input_custom$val,
            key: _uuid, // 生成临时 key
          });

          state.specsOptionArr = JSON.parse(JSON.stringify(state.activity_specs$arr));
          console.log(state.activity_specs$arr);
          console.log(state.specsOptionArr);
          console.log(state.temp);
        }
      }

      /*      // 收集输入过的含有正在输入的元素
      state.activity_specs$arr = state.specsOptionArr.filter((item, index) =>
        {
          console.log(item.name, state.input_custom$val);
          return item.name.includes(state.input_custom$val);
        }
      );
      console.log("___---___");
      console.log(state.activity_specs$arr);
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
          console.log(")()( 分割线 )()(");
          console.log(state.specsOptionArr[0].name);
          state.specsOptionArr[0].name = state.input_custom$val; // 更新当前临时元素的值
          console.log(state.specsOptionArr[0].name);
        } else {
          // 用户输入为空
          state.activity_specs$arr = []; // 置空；临时数组
          state.specsOptionArr = JSON.parse(JSON.stringify(state.temp)); // 将用户自定义输入之前的规格选项列表数组进行还原
        }
      } else {
        // alert(0);
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
      console.log("#  ... 分割线 ... #");
      console.log(state.specsOptionArr);*/
      state.prevInputContent = state.input_custom$val;
      return { ...state };
    },
    _compositionEnd(state, {}) {
      // 收集输入过的含有正在输入的元素
      state.activity_specs$arr = state.specsOptionArr.filter((item, index) => {
        console.log(item.name, state.input_custom$val);
        return item.name.includes(state.input_custom$val);
      });
      console.log('___---___');
      console.log(state.activity_specs$arr);
      let tag;
      try {
        // 如果临时数组中没有任何元素
        // 规格选项列表数组是否已经添加用户自定义内容
        console.log('++++++++++++++++++++++++++++++');
        console.log(state.specsOptionArr);
        tag = state.specsOptionArr[0].temp !== undefined;
      } catch (err) {
        alert(6);
        console.log(err.message);
        tag = false; // 走下面的 false 逻辑
      }
      if (tag) {
        // 已添加用户自定义内容
        if (state.input_custom$val) {
          // 用户输入不为空
          console.log(')()( 分割线 )()(');
          console.log(state.specsOptionArr);
          console.log(state.specsOptionArr[0].name);

          let tag = state.specsOptionArr.every(
            (item, index) => item.name !== state.input_custom$val,
          );
          if (tag) {
            state.specsOptionArr[0].name = state.input_custom$val; // 更新当前临时元素的值
            console.log('啦啦啦啦啦啦啦');
            console.log(
              state.specsOptionArr.filter((item, index) => item.name === state.input_custom$val),
            );
            state.specsOptionArr = state.specsOptionArr.filter(
              (item, index) => item.name === state.input_custom$val,
            );
          } else {
            state.specsOptionArr.shift();
          }

          console.log(state.specsOptionArr[0].name);
        } else {
          alert(9);
          // 用户输入为空
          state.activity_specs$arr = []; // 置空；临时数组
          state.specsOptionArr = JSON.parse(JSON.stringify(state.temp)); // 将用户自定义输入之前的规格选项列表数组进行还原
        }
      } else {
        // alert(0);
        console.log('(( 分割线 ))');
        // console.log(state.input_custom$val, state.activity_specs$arr[0].name);
        // console.log();
        console.log('*^&');
        console.log(state.activity_specs$arr);

        /*let tag = state.activity_specs$arr.every((item, index) => item.name !== state.input_custom$val);*/

        if (
          (state.activity_specs$arr.length === 0 ||
            state.input_custom$val !== state.activity_specs$arr[0].name) &&
          state.input_custom$val !== ''
        ) {
          alert(110);
          // 未添加用户自定义内容
          let _uuid = UUID.generate(); // 生成 UUID
          state.activity_specs$arr.unshift({
            // 添加用户自定义元素
            temp: 'temp', // 生成临时字段
            current_id: _uuid, // 生成临时 id
            name: state.input_custom$val,
            key: _uuid, // 生成临时 key
          });
        }

        /*if(state.input_custom$val === "") {
        state.input_custom$val !== ""
        }*/
        console.log(`up: ${state.prevInputContent}, current: ${state.input_custom$val}`);

        // 保存规格选项列表数组
        alert('here');
        console.log('哈哈');
        console.log(state.temp);
        if (state.temp.length === 0) {
          state.temp = JSON.parse(JSON.stringify(state.specsOptionArr));
        }
        console.log(state.temp);
        console.log('嘻嘻');
        if (state.prevInputContent === '' && state.input_custom$val === '') {
          // state.activity_specs$arr = JSON.parse(JSON.stringify(state.temp));
          alert('呼啦啦');
        }
        // 使用临时数组将规格选项列表数组进行覆盖
        state.specsOptionArr = JSON.parse(JSON.stringify(state.activity_specs$arr));
      }
      console.log('#  ... 分割线 ... #');
      console.log(state.specsOptionArr);
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
      state.hint_panel_status.left = param.left !== undefined ? param.left : null;
      console.log(param.left);
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

      let len = state.goodsSpecs$arr.length;
      if (len === 0) {
        // 商品规格数组没有元素

        // 直接添加
        state.goodsSpecs$arr.push(...JSON.parse(JSON.stringify(state.input_select$arr)));
      } else {
        // 商品规格数组有元素

        // 判断已添加的商品规格数组是否已经有待添加的元素

        // 将商品规格数组中的 name 值组成一个数组
        let goodsSpecsNameArr = state.goodsSpecs$arr.map((item, index) => item.name);

        // 将待选数组中的 name 值组成一个数组

        let inputSelectNameArr = state.input_select$arr.map((item, index) => item.name);

        // 用商品规格数组中的 name 值去 待选数组中寻找同样的 name 的元素并组成所需索引
        let arr = [];
        for (let i = 0; i < goodsSpecsNameArr.length; i++) {
          for (let j = 0; j < inputSelectNameArr.length; j++) {
            if (inputSelectNameArr[j] !== goodsSpecsNameArr[i]) {
              arr.push({
                name: inputSelectNameArr[j],
                index: j,
              });
            }
          }
        }

        let names = arr.map((item, index) => item.name);
        let len = goodsSpecsNameArr.length;
        goodsSpecsNameArr.push(...names);
        goodsSpecsNameArr = [...new Set(goodsSpecsNameArr)];
        let temp = goodsSpecsNameArr.slice(len, goodsSpecsNameArr.length);
        let real_arr = [];
        for (let i = 0; i < temp.length; i++) {
          let num = names.indexOf(temp[i]);
          if (num >= 0) {
            real_arr.push(num);
          }
        }

        for (let i = 0; i < real_arr.length; i++) {
          state.goodsSpecs$arr.push(state.input_select$arr[real_arr[i]]);
        }
      }

      // 干掉用户选择面板
      state.addSpecsPanelStyle.top = 0;
      state.addSpecsPanelStyle.left = 0;
      state.addSpecsPanelStyle.status = 'none';

      // 清空待选数组中的内容
      state.input_select$arr = [];

      return { ...state };
    },
    _updateSelectHintPanelStatus(state, { payload: param }) {
      console.log('*&*');
      console.log(param.key);
      state.specs[param.key].selectHint_panel_status.display = param.display;

      return { ...state };
    },
    _changeSelectTriangleDirection(state, { payload: param }) {
      state.select_triangleDirection = param;
      return { ...state };
    },
    _addGoodsSpecsToSelector(state, { payload: key }) {
      console.log('glasses ...');
      console.log(Number(state.prevGoodsSpecs) + 'ok', key + 'ok');
      if (Number(state.prevGoodsSpecs) !== key) {
        console.log('dkpwqadjioaqjoiqjd');
        let ele;
        if (state.specs$arr[0].temp !== undefined) {
          // 新添加的规格
          if (Number.isNaN(key)) {
            // NaN
            ele = state.specs$arr[0];
            // ele = state.specs$arr[0].name;
          } else {
            // 非 NaN
            console.log('非 NaN');
            console.log(state.specs$arr);
            console.log(key);
            ele = state.specs$arr[key];
            // ele = state.specs$arr[key].name;
          }
          console.log('^&^&^&^&^');
          console.log(state.specs$arr[0]);
        } else {
          // 原有规格

          ele = state.specs$arr[key - 1];
          // ele = state.specs$arr[key - 1].name;
        }
        state.saveGoodsSpecs$arr.push(ele);
        state.saveGoodsSpecs$arr.length > 1 ? state.saveGoodsSpecs$arr.shift() : null;
        console.log(state.specs$arr);
        console.log(key - 1);
        console.log(state.specs$arr[key - 1]);
        console.log(')()(');
        console.log(state.saveGoodsSpecs$arr);

        if (Number(state.prevGoodsSpecs) !== 0) {
          alert('删除已有的规格值');

          // 判断当前规格下面是否含有规格值
          console.log('%^&*!@#$');
          console.log(state.goodsSpecs$arr);
          state.goodsSpecs$arr = state.goodsSpecs$arr.length !== 0 ? [] : null;
        }
      } else {
      }

      // state.selectorSpecsVal = ;
      state.prevGoodsSpecs = state.saveGoodsSpecs$arr[0].key;
      return { ...state };
    },

    _bindSelectInputVal(state, { payload: val }) {
      console.log('valval');
      console.log(val);
      state.select_input_custom = val;

      // 判断当前是否是删除操作
      if (state.prevSelectInputContent.length > state.select_input_custom.length) {
        // 删除操作
        // 判断当前输入是否为空
        if (state.select_input_custom) {
          // 不为空
          let temp = JSON.parse(JSON.stringify(state.temp_specs$arr));
          temp = temp.filter((item, index) => item.name.includes(state.select_input_custom));
          console.log('*******************************************');
          console.log(temp);
          let tag = temp.every((item, index) => item.name !== state.select_input_custom);
          if (tag) {
            let _uuid = UUID.generate(); // 生成 UUID
            temp.unshift({
              // 添加用户自定义元素
              temp: 'temp', // 生成临时字段
              current_id: _uuid, // 生成临时 id
              name: state.select_input_custom,
              key: _uuid, // 生成临时 key
            });
          } else {
          }
          state.specs$arr = temp;
        } else {
          // 为空
          // 重置展示数组
          alert('#@#');
          if (!state.isInput) {
            state.specs$arr = JSON.parse(JSON.stringify(state.temp_specs$arr));
          }
        }
      } else {
        // alert("back ...");
        console.warn('back ...');
      }
      console.log('*****************************()***********************************');
      console.log(state.specs$arr);
      // 保存上一次的输入
      state.prevSelectInputContent = state.select_input_custom;
      return { ...state };
    },
    _selectCompositionEnd(state, {}) {
      // specs$arr: [], temp_specs$arr: [],
      state.isInput = false;
      console.log('获取当前输入');
      console.log(state.select_input_custom);
      console.log('-------------------------------------------------');
      console.log(state.temp_specs$arr);
      console.log(state.specs$arr);

      console.log('okay');
      let temp;
      if (state.select_input_custom.length !== 0) {
        // 进行数组筛选
        if (state.temp_specs$arr.length === 0) {
          // 备份代码
          state.temp_specs$arr = JSON.parse(JSON.stringify(state.specs$arr));
        }
        // 筛选
        temp = JSON.parse(JSON.stringify(state.temp_specs$arr));
        // 判断展示数组中是否有将要被添加的元素 ? 如果有仅显示当前该元素
        if (state.select_input_custom !== '') {
          temp = temp.filter((item, index) => item.name.includes(state.select_input_custom));
        }
        console.log('()()()() 分割线');
        console.log(temp);
        /*if() {

		}*/
        let tag = temp.every((item, index) => {
          console.log(
            `item.name: ${item.name}; state.select_input_custom: ${state.select_input_custom}; `,
          );
          return item.name !== state.select_input_custom && state.select_input_custom !== '';
        });
        console.log(`tag: ${tag}`);
        console.log(`,${state.select_input_custom},`);
        if (tag) {
          alert(1111111);
          // 如果没有则判断展示数组中是含有正在输入内容的元素
          let _uuid = UUID.generate(); // 生成 UUID
          temp.unshift({
            // 添加用户自定义元素
            temp: 'temp', // 生成临时字段
            current_id: _uuid, // 生成临时 id
            name: state.select_input_custom,
            key: _uuid, // 生成临时 key
          });
        }
      } else {
        console.log('_)(_');
        console.log(state.temp_specs$arr);
        console.log(state.specs$arr);
        temp = JSON.parse(JSON.stringify(state.specs$arr));
      }
      state.specs$arr = temp;
      return { ...state };
    },
    _selectCompositionStart(state, {}) {
      // 正在输入中文中
      state.isInput = true;
      return { ...state };
    },
    _addGoodsSpecsComponent(state, {}) {
      // + 1 ( <=3  )
      if (state.specs_count <= 3 && state.specs_count >= 0) {
        state.specs_count += 1;
        console.log(state.specs_count);
        state.specs.push({
          addSpecsPanelStyle: {
            top: 100,
            left: 100,
            status: 'none',
          },
          goodsSpecs$arr: [],
          specs$arr: [],
          temp_specs$arr: [],
          base_specs$arr: [],
          triangleDirection: '',
          select_triangleDirection: '',
          specsOptionArr: [],
          input_select$val: '请选择',
          input_select$arr: [],
          input_custom$val: '',
          select_input_custom: '',
          activity_specs$arr: [],
          temp: [],
          hint_panel_status: {
            display: 'none',
            top: '0',
            left: '15',
          },
          selectHint_panel_status: {
            display: 'none',
            top: '0',
            // left: "15",
          },
          isVanish: 'block',
          selectorSpecsVal: '',
          prevInputContent: '',
          prevSelectInputContent: '',
          isInput: false,
          saveGoodsSpecs$arr: [],
          prevGoodsSpecs: '',

          add_specs$arr: [],
        });
      }

      return { ...state };
    },
  },
  subscriptions: {},
};
