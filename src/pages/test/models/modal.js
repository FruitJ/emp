export default {
  namespace: "test",
  state: {
    ModalText: "AAA",
    visible: false,
    confirmLoading: false,
  },
  effects: {
  
  },
  reducers: {
    '_show'( state, { payload: visible } ) {
      state.visible = visible;
      return { ...state };
    },
    '_ok'( state, { payload: obj } ) {
      state.ModalText = obj.ModalText;
      state.confirmLoading = obj.confirmLoading;
      return { ...state };
    },
    '_delay'( state, { payload: obj } ) {
      state.visible = obj.visible;
      state.confirmLoading = obj.confirmLoading;
      return { ...state };
    },
    '_cancel'( state, { payload: visible } ) {
      state.visible = visible;
      return { ...state };
    },
  },
  subscriptions: {
  
  }
}
