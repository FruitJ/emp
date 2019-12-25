import { loadParentNodeDataService } from '../../../services/board';

export default {
  namespace: 'funcBoard',
  state: {
    count_addContainer: 0, // 添加 container 的数量
    containers: [],
  },
  effects: {
    *loadParentNodeData({}, { call, put }) {
      let res = yield call(loadParentNodeDataService);
      console.log('--- 分割线 ---');
      console.log(res);
    },
  },
  reducers: {
    _addContainer(state, {}) {
      state.count_addContainer += 1; // 记录添加 container 次数
      if (state.count_addContainer > 0 && state.count_addContainer <= 3) {
        state.containers.push({}); // 用户只添加了 3 个或 3 个以内的规格
      }
      return { ...state };
    },
  },
  subscriptions: {},
};
