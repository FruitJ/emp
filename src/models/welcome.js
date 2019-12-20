import axios from 'axios';

import { testCrossDomain, testGetToken, uploadPic, removePic } from '@/services/welcome';

export default {
  namespace: 'welcome',
  state: {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    token: {
      token: '',
      prevReqTime: 0,
    },
  },
  effects: {
    *testCrossDomain({ payload: val }, { call, put }) {
      // console.warn(`值 : ${ val }`);
      // yield call(testCrossDomain, JSON.stringify({name: "LJ"}));
    },
    *getToken({ payload: data }, { call, put }) {
      // 请求 token
      let res = yield call(testGetToken, data);
      // if(res.code === 200) {
      // 存储 token
      yield put({
        type: '_saveToken',
        payload: res,
      });
      // }

      console.log(res);
    },
    *uploadPic({ payload: obj }, { call, put }) {
      // 判断当前程序中是否保存了 token

      // 如果保存了 token 则判断其是否过期

      // 如果未过期不必请求 token，使用请求过的 token 就可以

      // 如果已过期则重新请求 token，

      // 如果未保存 token 则请求服务器获取 token

      // 向服务器请求 token
      /*  let res_token = yield call(testGetToken, data);
      if(res_token.code === 200) {
      
      
      
      
      
      }
      */
      console.log('1111');
      console.log(obj.params);
      console.log('2222');
      const formData = new FormData();
      formData.append('token', obj.params.token);
      formData.append(obj.data.filename, obj.data.file);

      // 拿到 token ，并将图片数据一并传递给三方服务器
      console.log(new Date().getTime());
      let res = yield call(uploadPic, formData);
      console.log(new Date().getTime());
      // 更新组件状态
      console.log(res);
      // previewImage
      yield put({
        type: '_updateUploadState',
        payload: {
          data: {
            response: res,
            options: obj,
          },
        },
      });
    },
    *removePic({ payload: fileName }, { call, put }) {
      // 发送移除图片请求
      let res = yield call(removePic, fileName);
      console.log(res);

      yield put({
        type: '_removePic',
        payload: {
          status: res.status,
          fileName: fileName.name,
        },
      });
    },
  },
  reducers: {
    _cancel(state, { payload: previewVisible }) {
      state.previewVisible = previewVisible;
      return { ...state };
    },
    _preview(state, { payload: file }) {
      state.previewImage = file.url || file.preview;
      state.previewVisible = true;
      return { ...state };
    },
    _change(state, { payload: fileList }) {
      console.table(fileList);
      state.fileList = fileList;
      console.log(state.fileList);
      return { ...state };
    },
    _saveToken(state, { payload: res }) {
      // 存储 token
      state.token.token = res.token;
      state.token.prevReqTime = new Date().getTime();
      console.log(state.token.token, state.token.prevReqTime);
      return { ...state };
    },
    _updateUploadState(state, { payload: params }) {
      // state.previewImage = params.data.picUrl;
      // console.info(state.fileList + "ok");
      // const {file} = params.data.options;
      console.log('______');
      state.fileList.push(params.data.response);
      // console.log(params.data.response);

      // state.fileList = params.data.response;
      console.log(state.fileList);

      return { ...state };
    },
    _removePic(state, { payload: config }) {
      if (config.status)
        state.fileList = state.fileList.filter((item, index) => item.name !== config.fileName);
      console.log('-- remove --');
      console.log(config.fileName);
      console.log(state.fileList);
      return { ...state };
    },
  },
  subscriptions: {},
};
