/*
import {
	loadInitTableDataService
} form '';*/

export default {
  namespace: 'table',
  state: {},
  effects: {
    *createTable({}, { call, put }) {
      // let res = yield call(loadInitTableDataService);
    },
  },
  reducers: {
    _rmSize32(state, { payload: param }) {
      return { ...state };
    },
  },
  subscriptions: {},
};
