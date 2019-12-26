import { loadParentNodeDataService } from '../../../services/board';

const config_common_properties = {
  COUNT_CONTAINER: 3, // 允许生成的组件的数量
  ROTATE_UP: -180, // 三角标上旋角度
  ROTATE_DOWN: 0, // 三角标下旋角度
  DURATION_TIME: 0.5, // // 动画过渡时间
};
export default {
  namespace: 'funcBoard',
  state: {
    count_addContainer: 0, // 添加 container 的数量
    containers: [],
    isCouldReqChildrenData: true,
  },
  effects: {
    *loadParentNodeData({ payload: param }, { call, put }) {
      let res = yield call(loadParentNodeDataService);
      console.log('--- 分割线 ---');
      console.log(res);
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
      state.containers[param.key].parentNames = param.res;

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
      } else {
        str = 'none';
        tag = false;
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
        };
      }
      rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
      state.containers[param.key].hoverInputBoard_rotate = rotate;
      state.containers[param.key].hoverInputBoard_tag = tag;
      state.containers[param.key].hoverInputBoard_status = str;
      return { ...state };
    },
    _putValToParentInput(state, { payload: param }) {
      let temp_container = [];
      // 多个 container 面板组件
      if (state.containers.length > 1) {
        // 判断其他父节点表单输入框中的值是否重复
        console.log('___+++___');
        console.log(state.containers[param.key].parentNames[param.parent_id - 1].parent_name);
        temp_container = state.containers.filter((item, index) => index !== param.key);
        if (
          temp_container.every(
            (item, index) =>
              item.parentInputVal !==
              state.containers[param.key].parentNames[param.parent_id - 1].parent_name,
          )
        ) {
          state.containers[param.key].parentInputVal =
            state.containers[param.key].parentNames[param.parent_id - 1].parent_name;
          alert(111111);
        } else {
          alert('false 2');
        }
        console.log(')_(((__)(_');
        console.log(temp_container);
      } else {
        // state.containers[param.key].isCouldReqChildrenData = false;
      }

      state.containers[param.key].prev_parentInputVal = state.containers[param.key].parentInputVal;
      return { ...state };
    },
  },
  subscriptions: {},
};
