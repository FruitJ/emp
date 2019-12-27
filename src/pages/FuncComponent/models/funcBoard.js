import { loadParentNodeDataService } from '../../../services/board';
import { message } from 'antd';
import UUID from 'uuidjs';

const config_common_properties = {
  COUNT_CONTAINER: 3, // 允许生成的组件的数量
  ROTATE_UP: -180, // 三角标上旋角度
  ROTATE_DOWN: 0, // 三角标下旋角度
  DURATION_TIME: 0.5, // 动画过渡时间
};
let replace_str = '';
export default {
  namespace: 'funcBoard',
  state: {
    count_addContainer: 0, // 添加 container 的数量
    containers: [],
    isCouldReqChildrenData: true,
    isChineseInput: false,
    transfer_parentNames: [],
    backUp_parentNames: [],
  },
  effects: {
    *loadParentNodeData({ payload: param }, { call, put }) {
      let res = yield call(loadParentNodeDataService);
      console.log('--- 分割线 ---');
      console.log(res);

      alert('bingoogoog');

      yield put({
        type: '_saveParentNodeData',
        payload: {
          res,
          key: param.key,
        },
      });
    },
  },
  reducers: {
    _addContainer(state, {}) {
      // 添加 container
      const { length: len } = state.containers;
      if (len < config_common_properties.COUNT_CONTAINER && len >= 0) {
        state.containers.push({
          // 初始化 container 面板属性
          hoverInputBoard_status: 'none',
          hoverInputBoard_tag: false,
          hoverInputBoard_rotate: {},
          parentInputVal: '未选择',
          prev_parentInputVal: '',
          parentHoverInputVal: '',
          prev_parentHoverInputVal: '',
          // isCouldReqChildrenData: true,
        });
      }
      return { ...state };
    },
    _removeContainer(state, { payload: param }) {
      // 移除 container
      console.log(`rm: ${param.index}`);
      // 删除 container
      state.containers = state.containers.filter((item, index) => index !== param.index);

      return { ...state };
    },
    _saveParentNodeData(state, { payload: param }) {
      // 保存父节点数据

      // 为 param.res
      alert(`cc: ${param.key}`);
      // 动态向对应数据项中填充数据 ( key )

      state.transfer_parentNames = param.res;
      state.backUp_parentNames = JSON.parse(JSON.stringify(param.res));
      state.containers[param.key].parentNames = state.transfer_parentNames;

      // 动态更改 container 面板中悬浮选值面板和上旋/下旋三角标的状态

      let str = '', // 悬浮选值面板的状态样式
        tag = false, // 样式切换的标记
        rotate = null; // 三角标的动画样式

      if (!state.containers[param.key].hoverInputBoard_tag) {
        str = 'block';
        tag = true;
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_UP}deg)`,
        };

        // 当前只能有一个组件的悬浮选值面板处于开启状态
        state.containers.forEach((item, index) => {
          if (index !== param.key && item.hoverInputBoard_tag) {
            changeHoverInputBoardStyle(
              'none',
              false,
              {
                transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
              },
              index,
              state,
            );
          }
        });
      } else {
        str = 'none';
        tag = false;
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
        };
        state.containers[param.key].parentHoverInputVal = '';
        state.containers[param.key].prev_parentHoverInputVal = '';
        replace_str = '';
      }
      rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
      changeHoverInputBoardStyle(str, tag, rotate, param.key, state);
      return { ...state };
    },
    _putValToParentInput(state, { payload: param }) {
      // 将选中父节点的值放进父节点的 Input 框中
      let temp_container = [];

      if (state.containers.length > 1) {
        // 多个 container 面板组件
        // 判断其他父节点表单输入框中的值是否重复
        temp_container = state.containers.filter((item, index) => index !== param.key);
        if (
          temp_container.every(
            (item, index) =>
              item.parentInputVal !==
              state.containers[param.key].parentNames[param.parent_id - 1].parent_name,
          )
        ) {
          // 未添加过的相同的值
          // 更新 parent node 的 Input 框中的内容
          state.containers[param.key].parentInputVal =
            state.containers[param.key].parentNames[param.parent_id - 1].parent_name;
        } else {
          // 添加过相同的值
          message.warning('该选项已经添加过!');
        }
      }

      // 获取输入框上一个输入的值
      state.containers[param.key].prev_parentInputVal = state.containers[param.key].parentInputVal;
      return { ...state };
    },
    _bindParentHoverInput(state, { payload: param }) {
      state.containers[param.key].parentHoverInputVal = param.value;

      // 判断当前的输入状态是否为删除
      console.log('*******************************************');
      console.log(
        state.containers[param.key].prev_parentHoverInputVal,
        state.containers[param.key].parentHoverInputVal,
      );
      // 删除表单中的内容
      if (
        state.containers[param.key].prev_parentHoverInputVal !== '' &&
        state.containers[param.key].prev_parentHoverInputVal.length >
          state.containers[param.key].parentHoverInputVal.length
      ) {
        // alert("删除");
        console.log('删除 ing ...');
        // alert("删除");
        //
        let temp = JSON.parse(JSON.stringify(state.backUp_parentNames));
        if (!state.containers[param.key].parentHoverInputVal) {
          state.containers[param.key].parentNames = temp;
        } else {
          console.log(state.containers[param.key].parentHoverInputVal);
          console.log(state.containers[param.key].parentNames);
          // let temp = JSON.parse(JSON.stringify(state.backUp_parentNames));
          let includes = temp.filter((item, index) =>
            item.parent_name.includes(state.containers[param.key].parentHoverInputVal),
          );
          console.log('() 分割线 ()');
          console.log(includes);

          let obj = {
            temp: 'temp',
            parent_id: UUID.generate(),
            parent_name: state.containers[param.key].parentHoverInputVal,
          };
          // alert(0);
          console.log('#分割线#');
          console.log(state.containers[param.key].parentHoverInputVal);
          console.log(includes);
          if (includes.length !== 0) {
            // 有元素

            let tag = includes.some(
              (item, index) => item.parent_name === state.containers[param.key].parentHoverInputVal,
            );
            // alert(0);
            if (!tag) {
              // 删除元素
              console.log('((((');
              console.log(includes);
              if (includes[0].temp !== undefined) {
                includes.shift();
              }
              // 添加元素
              includes.unshift(obj);
              console.log(obj);
              console.log('&&&&&&&&&&&&&&&&&&&&&&&');
              console.log(includes);
            }
          } else {
            // 无元素
            // 添加元素
            includes.unshift(obj);
          }

          state.containers[param.key].parentNames = includes;
        }
      } else {
        // 添加表单中的内容
        // alert("非删除");

        // 创建新的 ParentNames 项
        console.log('________________________---------------------------');
        console.log(state.containers);

        let obj = {
          temp: 'temp',
          parent_id: UUID.generate(),
          parent_name: '',
        };
        // let str = "";
        if (state.isChineseInput && param.value.split('')[param.value.length - 1] !== ' ') {
          // 中文输入
          // 更新 parentNames 列表数据
          addParentsNames(state, param, obj);
        } else if (state.isChineseInput === false) {
          // 非中文输入
          // 更新 parentNames 列表数据
          addParentsNames(state, param, obj);
        }
      }
      state.containers[param.key].prev_parentHoverInputVal =
        state.containers[param.key].parentHoverInputVal;
      return { ...state };
    },
    _checkChineseInputStart(state, {}) {
      // 设置中文输入标记
      state.isChineseInput = true;
      return { ...state };
    },
    _checkChineseInputEnd(state, {}) {
      state.isChineseInput = false;
      return { ...state };
    },
  },
  subscriptions: {},
};

/**
 * @author { FruitJ }
 * @param { String } str 悬浮选值面板的 display 属性值
 * @param { Boolean } tag 悬浮选值面板的切换依赖的 tag
 * @param { Object } rotate 悬浮选值面板的三角标切换的动画样式
 * @param { Number } index 当前被操作 container 的 key
 * @param { Object } state 组件的 state
 * @return { Void } 无返回值
 * @description 改变悬浮选值面板的样式的功能函数
 */
const changeHoverInputBoardStyle = (str, tag, rotate, index, state) => {
  state.containers[index].hoverInputBoard_rotate = rotate;
  state.containers[index].hoverInputBoard_tag = tag;
  state.containers[index].hoverInputBoard_status = str;
};

const addParentsNames = (state, param, obj) => {
  let arr = param.value.split('');
  if (replace_str) {
    arr.splice(0, arr.length - 1);
  }
  arr.forEach((item, index) => {
    replace_str += arr[index];
  });
  // replace_str += arr[0];
  console.log('+++++++++++++++++++++++++++++++++');
  console.log(replace_str);

  console.log(state.containers[param.key].parentNames);

  let includes = state.containers[param.key].parentNames.filter((item, index) =>
    item.parent_name.includes(replace_str),
  );
  if (includes.length !== 0) {
    // 已有的数据集合中有与正在输入的表单内容相似的元素

    // 判断两个元素是否相等 ( 相等 -> 不添加新元素、不相等 -> 添加新元素 )
    let tag = includes.some((item, index) => item.parent_name === replace_str);
    if (!tag) {
      // 添加新元素之前判断第一个元素是否有 temp 属性，有则删除其后再添加、没有则直接添加
      if (includes[0].temp !== undefined) {
        // 删除后
        includes.shift();
      }
      // 再添加
      obj.parent_name = replace_str;
      includes.unshift(obj);
    }
  } else {
    // 添加新元素
    obj.parent_name = replace_str;
    includes.unshift(obj);
  }
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(includes);
  state.containers[param.key].parentNames = includes;
};
