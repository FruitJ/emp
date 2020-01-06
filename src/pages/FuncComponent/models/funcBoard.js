// 官方包
import { message } from 'antd';
import UUID from 'uuidjs';

// 自定义包
import {
  loadParentNodeDataService,
  getNewParentNamesEleService,
  loadChildNodeDataService,
  getNewChildNamesEleService,
} from '../../../services/board';

// 常量配置区
const config_common_properties = {
  COUNT_CONTAINER: 3, // 允许生成的组件的数量
  ROTATE_UP: -180, // 三角标上旋角度
  ROTATE_DOWN: 0, // 三角标下旋角度
  DURATION_TIME: 0.5, // 动画过渡时间
};

// React Parent Input 输入时的中间临时变量
let replace_str = '';

// 组件的 modal
export default {
  namespace: 'funcBoard',
  state: {
    count_addContainer: 0, // 添加 container 的数量
    containers: [], // 存储 container 的容器
    isCouldReqChildrenData: true, // 是否可以请求子节点的数据
    isChineseInput: false, // 是否是中文输入
    transfer_parentNames: [], // 操作 parentNames ( 父节点选项数组 ) 的临时变量
    backUp_parentNames: [], // 备份的 parentNames 数组
    transfer_childNames: [], // 操作 parentNames ( 子节点选项数组 ) 的临时变量
    backUp_childNames: [], // 备份的 childNames 数组
    board_data: [],

    dataSource: [],
    data: [],
    columns: [],
  },
  effects: {
    *loadParentNodeData({ payload: param }, { call, put }) {
      // 加载父节点数据
      let res = yield call(loadParentNodeDataService);

      yield put({
        type: '_saveParentNodeData', // 存储父节点数据
        payload: {
          res,
          key: param.key,
        },
      });
    },
    *getNewParentNamesEle({ payload: param }, { call, put }) {
      let res = yield call(getNewParentNamesEleService, param);

      console.log('-- 分割线 --');
      console.log(res);

      yield put({
        type: '_updateParentNamesFirstEle',
        payload: {
          key: param.key,
          res,
        },
      });
    },
    *loadChildNodeData({ payload: param }, { call, put }) {
      console.log('**( 分割线 )**');
      console.log(param);

      let res = yield call(loadChildNodeDataService, {
        parent_name: param.parent_name,
        parent_id: param.parent_id,
        prop: param.prop,
      });

      console.log('子节点数据 ...');
      console.log(res);

      yield put({
        type: '_saveChildNodeData',
        payload: {
          res,
          parent_name: param.parent_name,
          parent_id: param.parent_id,
          key: param.key,
        },
      });
    },
    *getNewChildNamesEle({ payload: param }, { call, put }) {
      // 替换 id 元素
      let res = yield call(getNewChildNamesEleService, {
        temp_addEle: param.temp_addEle.map((item, index) => ({
          child_name: item.child_name,
          prop: param.prop,
          parent_id: param.parent_id,
        })),
      });

      console.log('getNewChildNamesEle ...');
      console.log(param.temp_addEle.map((item, index) => ({ child_name: item.child_name })));

      console.log(`返回值:`);
      console.log(res);
      console.log();

      console.log(param.key);
      console.log(param.temp_addEle);

      // 替换集合元素
      yield put({
        type: '_replaceChildEleId',
        payload: {
          temp_addEle: res,
          key: param.key,
        },
      });

      // 将待选区域的标签移至真实区域
      yield put({
        type: '_realAddChildEle',
        payload: {
          key: param.key,
        },
      });
    },
  },
  reducers: {
    _addContainer(state, {}) {
      // 添加 container
      const { length: len } = state.containers; // 解构 containers 容器的长度
      if (len < config_common_properties.COUNT_CONTAINER && len >= 0) {
        // 添加 container 的条件
        // 向 containers 容器中添加 container
        state.containers.push({
          // 初始化 container 的属性
          hoverInputBoard_status: 'none', // 悬浮选值面板的状态 ( 显示/隐藏 )
          hoverInputBoard_tag: false, // 悬浮选值面板的标记
          hoverInputBoard_rotate: {}, // input 输入框的三角标的样式
          hoverChildInputBoard_status: 'none',
          hoverChildInputBoard_tag: false,
          hoverChildInputBoard_rotate: {},
          outsideChildInputBoard_status: 'none',
          parentInputVal: '未选择', // 父节点输入框的 value
          childInputVal: '未选择',
          isChineseInput: false,
          afterNative_childNames: [],
          real_childNames: [],
          prev_parentInputVal: '', // 上一次父节点输入框输入的 value
          prev_childInputVal: '', // 上一次子节点输入框输入的 value
          parentHoverInputVal: '', // 父节点悬浮选值面板输入框的 value
          childHoverInputVal: '', // 子节点悬浮选值面板输入框的 value
          prev_parentHoverInputVal: '', // 上一次父节点悬浮选值面板输入框的 value
          prev_childHoverInputVal: '', // 上一次子节点悬浮选值面板输入框的 value
          parentInputId: 0, // 父节点输入框的元素的 id
          isSureParentNamesEle: false, // 父节点选择框中是否选择元素的标记
          isHaveTempCreatedEle: false,
          // isCouldReqChildrenData: true,
        });
      }
      return { ...state };
    },
    _removeContainer(state, { payload: param }) {
      console.log('current input ...');
      console.log(param.index);
      console.log(state.containers);
      console.log(state.containers[param.index].parentInputVal); //
      console.log(state.board_data);
      state.board_data = state.board_data.filter(
        (item, index) => item.name !== state.containers[param.index].parentInputVal,
      );
      console.log('after remove container ');
      console.log(state.board_data);

      // 移除 container
      state.containers = state.containers.filter((item, index) => index !== param.index);
      return { ...state };
    },
    _saveParentNodeData(state, { payload: param }) {
      // 保存父节点数据
      // 为 param.res
      alert(`cc: ${param.key}`);
      console.log('__+ 分割线 +__');
      console.log(param);

      console.log('...../...//');
      console.log(`prev parentInputVal: ${state.containers[param.key].prev_parentInputVal}`);
      console.log(`current parentInputVal: ${state.containers[param.key].parentInputVal}`);

      // 动态向对应数据项中填充数据 ( key )

      state.transfer_parentNames = param.res; // 中转
      state.backUp_parentNames = JSON.parse(JSON.stringify(param.res)); // 备份
      state.containers[param.key].parentNames = state.transfer_parentNames; // 获取父节点数据

      // 动态更改 container 面板中悬浮选值面板和上旋/下旋三角标的状态
      let str = '', // 悬浮选值面板的状态样式
        tag = false, // 样式切换的标记
        rotate = null; // 三角标的动画样式

      if (!state.containers[param.key].hoverInputBoard_tag) {
        // 此时处于关闭状态 -> 开启
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
        // 此时处于开启状态 -> 关闭
        str = 'none';
        tag = false;
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
        };
        // 当面板关闭的时候清空输入框中的值 ( 当前输入/上次输入 )
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

      console.log('*************');
      console.log(state.containers[param.key]);

      console.log(state.containers[param.key].parentInputVal);
      let parentInputVal = state.containers[param.key].parentInputVal;

      let temp_container = [];

      if (state.containers.length > 1) {
        // 多个 container 面板组件

        // 判断其他父节点表单输入框中的值是否重复
        temp_container = state.containers.filter((item, index) => index !== param.key);
        console.log('-----------==-----');
        console.log(state.containers[param.key].parentNames);
        console.log(param.parent_name);
        if (
          temp_container.every(
            (item, index) => item.parentInputVal !== param.parent_name,
            /*
              item.parentInputVal !== state.containers[param.key].parentNames[param.parent_id - 1].parent_name,
*/
          )
        ) {
          // 未添加过的相同的值
          alert(0);
          // 更新 parent node 的 Input 框中的内容

          state.containers[param.key].parentInputVal = param.parent_name;

          // 可以开始请求子节点数据
          state.isCouldReqChildrenData = true;

          state.containers[param.key].parentInputId = param.parent_id;

          state.containers[param.key].isSureParentNamesEle = true;

          /*
          state.containers[param.key].parentInputVal =
            state.containers[param.key].parentNames[param.parent_id - 1].parent_name;
*/
        } else {
          // 添加过相同的值
          message.warning('该选项已经添加过!');
          state.isCouldReqChildrenData = false;
          state.containers[param.key].isSureParentNamesEle = false;
        }
      } else {
        state.containers[param.key].parentInputVal = param.parent_name;
        state.isCouldReqChildrenData = true;
        state.containers[param.key].parentInputId = param.parent_id;
        state.containers[param.key].isSureParentNamesEle = true;
      }

      // 获取输入框上一个输入的值
      state.containers[param.key].prev_parentInputVal = state.containers[param.key].parentInputVal;

      console.log(') 分割线 (');

      console.log(state.containers[param.key].prev_parentInputVal);
      console.log(parentInputVal);

      if (parentInputVal !== state.containers[param.key].prev_parentInputVal) {
        if (parentInputVal !== '未选择') {
          // 清空小标签数组中的元素

          console.log('*) 分割线 (*');
          console.log(state.containers[param.key].real_childNames);
          console.log(state.board_data);

          state.containers[param.key].real_childNames = [];
          console.log(state.board_data);
          console.log(state.containers[param.key].parentInputId);
          console.log(state.backUp_parentNames);

          for (let i = 0; i < state.board_data.length; i++) {
            console.log(state.board_data[i].name, state.containers[param.key].prev_parentInputVal);
            if (state.board_data[i].name === parentInputVal) {
              let obj = state.backUp_parentNames.filter(
                (item, index) => item.parent_id === state.containers[param.key].parentInputId,
              )[0];
              state.board_data[i].name = obj.parent_name;
              state.board_data[i].id = obj.parent_id;
              state.board_data[i].children = [];
            }
          }
          console.log('😊😊');
          console.log(state.board_data);
        }
      }

      return { ...state };
    },
    _bindParentHoverInput(state, { payload: param }) {
      bindHoverInput(state, param, {
        hoverInputVal: 'parentHoverInputVal',
        prev_hoverInputVal: 'prev_parentHoverInputVal',
        backUp_names: 'backUp_parentNames',
        names: 'parentNames',
        name: 'parent_name',
        id: 'parent_id',
        isChinese: 'isChineseInput',
      });

      /*// 将父节点的 input 输入框与 modal 中的数据进行绑定
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
        // 删除中
        let temp = JSON.parse(JSON.stringify(state.backUp_parentNames));
        if (!state.containers[param.key].parentHoverInputVal) {
          console.log('((((((((( 分割线  ))))))))))');
          replace_str = '';
          console.log(replace_str);
          state.containers[param.key].parentNames = temp;
        } else {
          replace_str = '';
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
        // 添加

        // 创建新的 ParentNames 项
        let obj = {
          temp: 'temp',
          parent_id: UUID.generate(),
          parent_name: '',
        };
        // 判断当前输入是否为中文输入
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

      // 获取上一次悬浮选值面板的 input 中输入的内容
      state.containers[param.key].prev_parentHoverInputVal =
        state.containers[param.key].parentHoverInputVal;*/
      return { ...state };
    },
    _bindChildHoverInput(state, { payload: param }) {
      console.log('child bind input val');
      console.log(param);
      bindHoverInput(state, param, {
        hoverInputVal: 'childHoverInputVal',
        prev_hoverInputVal: 'prev_childHoverInputVal',
        backUp_names: 'backUp_childNames',
        names: 'childNames',
        name: 'child_name',
        id: 'child_id',
        isChinese: 'isChineseInput',
      });
      return { ...state };
    },

    _checkChineseInputStart(state, {}) {
      // 输入中文中
      state.isChineseInput = true;
      return { ...state };
    },
    _checkChineseInputEnd(state, {}) {
      // 未输入中文
      state.isChineseInput = false;
      return { ...state };
    },
    _updateParentNamesFirstEle(state, { payload: param }) {
      state.containers[param.key].parentNames[0] = JSON.parse(JSON.stringify(param.res));

      state.backUp_parentNames.push(JSON.parse(JSON.stringify(param.res)));

      return { ...state };
    },
    _saveChildNodeData(state, { payload: param }) {
      state.transfer_childNames = param.res;
      state.backUp_childNames = JSON.parse(JSON.stringify(param.res));

      /*state.containers[param.key].parentNames.forEach((item, index) => {
        if(item.parent_name === param.parent_name && item.parent_id === param.parent_id) {
          item.childNames = state.transfer_childNames;
        }
      });*/
      state.containers[param.key].childNames = state.transfer_childNames;

      console.warn('$_ 分割线 _$');
      console.log(state.containers[param.key].childNames);

      // 显示子节点的悬浮选值面板
      // state.containers[param.key].hoverChildInputBoard_status = 'block';

      state.containers[param.key].outsideChildInputBoard_status = 'block';
      // 改变三角标样式

      let rotate = {
        transform: `rotate(${config_common_properties.ROTATE_UP}deg)`,
      };
      rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
      changeChildHoverInputBoardStyle('block', true, rotate, param.key, state);

      return { ...state };
    },
    _removeChildHoverBoard(state, { payload: param }) {
      // 关闭子节点的悬浮选值面板
      state.containers[param.key].hoverChildInputBoard_status = 'none ';
      return { ...state };
    },
    _changeChildHoverBoardStatus(state, { payload: param }) {
      console.log('分割线 ____---__');
      console.log(param.key);
      state.containers[param.key].hoverChildInputBoard_tag = param.tag;
      let rotate;
      if (state.containers[param.key].hoverChildInputBoard_tag) {
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_UP}deg)`,
        };
        rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;

        // 显示子节点的悬浮选值面板
        changeChildHoverInputBoardStyle('block', true, rotate, param.key, state);
      } else {
        rotate = {
          transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
        };
        rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
        // 隐藏子节点的悬浮选值面板
        changeChildHoverInputBoardStyle('none', false, rotate, param.key, state);
      }

      console.log(state.containers[param.key].hoverChildInputBoard_tag);

      return { ...state };
    },
    _changeChildHoverBoardStyle(state, { payload: param }) {
      return { ...state };
    },
    _tempSaveSelectedChildNodeData(state, { payload: param }) {
      console.log('_tempSaveSelectedChildNodeData ...');
      console.log(param);
      let arr = state.backUp_parentNames.filter(
        (item, index) => item.parent_name === state.containers[param.key].parentInputVal,
      );
      console.log('啦啦啦啦啦啦啦~~~');
      console.log(arr);
      // 不能重复添加同样的项
      if (state.containers[param.key].afterNative_childNames.length !== 0) {
        // 判断是否重复
        if (
          state.containers[param.key].afterNative_childNames.every(
            (item, index) => item.child_name !== param.child_name,
          )
        ) {
          state.containers[param.key].afterNative_childNames.push({
            child_name: param.child_name,
            child_id: param.child_id,
            id: param.child_id,
            parent_id: param.parent_id,
            prop: param.prop,
          });
        }

        alert('熊掌');
      } else {
        state.containers[param.key].afterNative_childNames.push({
          child_name: param.child_name,
          child_id: param.child_id,
          id: param.child_id,
          parent_id: param.parent_id,
          prop: param.prop,
        });

        console.log('鱼鱼鱼');
        console.log(param.prop);
        alert('鱼');
      }

      return { ...state };
    },
    _removeAfterNative_childNames(state, { payload: param }) {
      alert('__');

      // console.log("-----------------------------------------+");
      // console.log(param.item);

      state.containers[param.key].afterNative_childNames = state.containers[
        param.key
      ].afterNative_childNames.filter((item, index) => {
        console.log('[{ 分割线 }]');
        console.log(item.child_id, param.item.child_id);
        console.log(item.child_name, param.item.child_name);
        return item.child_id !== param.item.child_id && item.child_name !== param.item.child_name;
      });

      // console.log("... 删除 ...");
      // console.log(state.containers[
      //     param.key
      //     ].afterNative_childNames);

      return { ...state };
    },
    _cancelChildHoverBoard(state, { payload: param }) {
      alert(1111111);
      state.containers[param.key].outsideChildInputBoard_status = 'none';
      // let rotate = {
      //   transform: `rotate(${config_common_properties.ROTATE_DOWN}deg)`,
      // };
      // rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
      // changeChildHoverInputBoardStyle('none', false, rotate, param.key, state);
      return { ...state };
    },
    _judgeTempCreatedEle(state, { payload: param }) {
      // isHaveTempCreatedEle

      state.containers[param.key].isHaveTempCreatedEle = state.containers[
        param.key
      ].afterNative_childNames.some((item, index) => Number.isNaN(Number(item.child_id)));

      console.log('| 分割线 |');
      console.log(state.containers[param.key].afterNative_childNames);

      return { ...state };
    },
    _replaceChildEleId(state, { payload: param }) {
      console.log('_replaceChildEleId ................');
      console.log(state.containers[param.key].afterNative_childNames);
      console.log(param.temp_addEle);

      // 替换元素
      let len = state.containers[param.key].afterNative_childNames.length;
      for (let i = 0; i < len; i++) {
        console.warn('----------()----------');
        for (let j = 0; j < param.temp_addEle.length; j++) {
          console.warn('----------(1)----------');
          console.log(
            param.temp_addEle[j].child_name,
            state.containers[param.key].afterNative_childNames[i].child_name,
          );
          if (
            param.temp_addEle[j].child_name ===
            state.containers[param.key].afterNative_childNames[i].child_name
          ) {
            // 替换
            state.containers[param.key].afterNative_childNames[i] = JSON.parse(
              JSON.stringify(param.temp_addEle[j]),
            );
          }
        }
      }

      // 判断当前将要添加的元素是否在 afterNative_childNames 中重复
      /*state.containers[param.key].real_childNames.forEach((item, index) => {
        if(item.child_name === ) {

        }
      });*/
      let arr = [];
      console.log('%%%');

      /*      if(state.containers[param.key].real_childNames.length === 0) {
        state.containers[param.key].real_childNames.push(...state.containers[param.key].afterNative_childNames);
      }else {
        for(let i = 0; i < state.containers[param.key].real_childNames.length; i++) {
          for(let j = 0; j < state.containers[param.key].afterNative_childNames.length; j++) {
            console.log(state.containers[param.key].real_childNames[i].child_name, state.containers[param.key].afterNative_childNames[j].child_name);
            if(state.containers[param.key].real_childNames[i].child_name !== state.containers[param.key].afterNative_childNames[j].child_name) {

              arr.push(state.containers[param.key].afterNative_childNames[j]);
            }
          }
        }
      }*/

      console.log('][ 分割线 ][');
      console.log(arr);
      state.containers[param.key].real_childNames.push(...arr);

      console.log('替换完成 ...'); // real_childNames
      console.log(state.containers[param.key].real_childNames);
      console.log(state.containers[param.key].afterNative_childNames);

      state.containers[param.key].real_childNames = JSON.parse(
        JSON.stringify(state.containers[param.key].afterNative_childNames),
      );
      console.log('+_ 分割线 +_');
      console.log(state.containers[param.key].real_childNames);
      return { ...state };
    },
    _realAddChildEle(state, { payload: param }) {
      let arr = [];
      if (state.containers[param.key].real_childNames.length === 0) {
        state.containers[param.key].real_childNames.push(
          ...state.containers[param.key].afterNative_childNames,
        );
      } else {
        let names = state.containers[param.key].real_childNames.map(
          (item, index) => item.child_name,
        );

        for (let i = 0; i < state.containers[param.key].afterNative_childNames.length; i++) {
          if (
            names.indexOf(state.containers[param.key].afterNative_childNames[i].child_name) === -1
          ) {
            arr.push(state.containers[param.key].afterNative_childNames[i]);
          }
        }

        console.log('分割线-');
        console.log(arr);
        console.log(state.containers[param.key].real_childNames);
        console.log(state.containers[param.key].afterNative_childNames);
      }
      state.containers[param.key].real_childNames.push(...arr);

      // 关闭悬浮选值面板
      state.containers[param.key].outsideChildInputBoard_status = 'none';

      // 清空数据项
      // state.containers[param.key].afterNative_childNames = [];
      // state.containers[param.key].childHoverInputVal = '';
      // state.containers[param.key].prev_childHoverInputVal = '';

      // 生成的表格数据对象
      console.log('_=_ 分割线 _=_');
      console.log(state.containers[param.key].real_childNames);
      console.log('父节点数组');
      console.log(state.backUp_parentNames);
      console.log('^ afterNative_childNames ^');
      console.log(state.containers[param.key].afterNative_childNames);

      let item = state.backUp_parentNames.filter((item, index) => {
        console.log('__+ 分割线 +__');
        console.log(state.containers[param.key].real_childNames);
        // console.log(item.parent_id, state.containers[param.key].real_childNames[0].parent_id);
        return item.prop === state.containers[param.key].real_childNames[0].prop;
      });

      console.log('((( 分割线 item )))');
      console.log(item);

      let children = [];
      console.log('一万个 item');
      console.log(item);
      children = state.containers[param.key].real_childNames.map((obj, index) => ({
        prop: item[0].prop,
        name: obj.child_name,
        id: obj.child_id,
      }));

      let obj = {
        name: item[0].parent_name,
        id: item[0].parent_id,
        children: children,
      };
      state.board_data.push(obj);

      console.log('分割线前 ...');
      console.log(state.board_data);
      state.board_data = state.board_data.filter((item, index) =>
        item.children.every((obj, num) => {
          console.log('obj.id: ');
          console.log(obj.id);
          console.log(Number.isNaN(Number(obj.id)));
          return !Number.isNaN(Number(obj.id));
        }),
      );

      console.log('分割线 ...,');
      console.log(state.board_data);

      return { ...state };
    },
    _removeReal_childNames(state, { payload: param }) {
      console.log('^^^^^^^^');
      console.log(param);
      console.log(state.board_data);

      /*      state.board_data = state.board_data.filter((item, index) => {
        if(item.id === Number(param.item.parent_id)) {
          item.children = item.children.filter((obj, num) => obj.name !== param.item.child_name);
        }
      });
      */
      for (let i = 0; i < state.board_data.length; i++) {
        if (state.board_data[i].id === Number(param.item.parent_id)) {
          state.board_data[i].children = state.board_data[i].children.filter(
            (item, index) => item.name !== param.item.child_name,
          );
        }
      }
      // 删除元素
      state.containers[param.key].real_childNames = state.containers[
        param.key
      ].real_childNames.filter((item, index) => item.child_name !== param.item.child_name);

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

const addParentsNames = (state, param, obj, config) => {
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

  console.log(state.containers[param.key][config.names]);

  let includes = state.containers[param.key][config.names].filter((item, index) =>
    item[config.name].includes(replace_str),
  );
  if (includes.length !== 0) {
    // 已有的数据集合中有与正在输入的表单内容相似的元素

    // 判断两个元素是否相等 ( 相等 -> 不添加新元素、不相等 -> 添加新元素 )
    let tag = includes.some((item, index) => item[config.name] === replace_str);
    if (!tag) {
      // 添加新元素之前判断第一个元素是否有 temp 属性，有则删除其后再添加、没有则直接添加
      if (includes[0].temp !== undefined) {
        // 删除后
        includes.shift();
      }
      // 再添加
      obj[config.name] = replace_str;

      console.log('&&&&');
      console.log(obj);
      includes.unshift(obj);
    }
  } else {
    // 添加新元素
    obj[config.name] = replace_str;
    console.log('^^^^');
    console.log(obj);
    includes.unshift(obj);
  }
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(includes);
  state.containers[param.key][config.names] = includes;
};

/*const addParentsNames = (state, param, obj) => {
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
};*/

const changeChildHoverInputBoardStyle = (str, tag, rotate, index, state) => {
  state.containers[index].hoverChildInputBoard_rotate = rotate;
  state.containers[index].hoverChildInputBoard_tag = tag;
  state.containers[index].hoverChildInputBoard_status = str;
};

// 封装 React 表单输入内容的功能函数
const bindHoverInput = (state, param, config) => {
  // 将父节点的 input 输入框与 modal 中的数据进行绑定
  // state.containers[param.key].parentHoverInputVal = param.value;
  state.containers[param.key][config.hoverInputVal] = param.value;

  // 判断当前的输入状态是否为删除
  console.log('*******************************************');
  console.log(
    state.containers[param.key].prev_parentHoverInputVal,
    state.containers[param.key].parentHoverInputVal,
  );
  // 删除表单中的内容
  if (
    state.containers[param.key][config.prev_hoverInputVal] !== '' &&
    state.containers[param.key][config.prev_hoverInputVal].length >
      state.containers[param.key][config.hoverInputVal].length
  ) {
    // 删除中
    let temp = JSON.parse(JSON.stringify(state[config.backUp_names]));
    if (!state.containers[param.key][config.hoverInputVal]) {
      console.log('((((((((( 分割线  ))))))))))');
      replace_str = '';
      console.log(replace_str);
      state.containers[param.key][config.names] = temp;
    } else {
      replace_str = '';
      console.log(state.containers[param.key][config.hoverInputVal]);
      console.log(state.containers[param.key][config.names]);
      // let temp = JSON.parse(JSON.stringify(state.backUp_parentNames));
      let includes = temp.filter((item, index) =>
        item[config.name].includes(state.containers[param.key][config.hoverInputVal]),
      );
      console.log('() 分割线 ()');
      console.log(includes);

      let arr = state.backUp_parentNames.filter(
        (item, index) => item.parent_name === state.containers[param.key].parentInputVal,
      );

      let uuid = UUID.generate();
      let obj = {
        temp: 'temp',
        [config.id]: uuid,
        [config.name]: state.containers[param.key][config.hoverInputVal],
        id: uuid,
        prop: arr[0].prop,
      };
      // alert(0);
      console.log('#分割线#');
      console.log(state.containers[param.key].parentHoverInputVal);
      console.log(includes);
      if (includes.length !== 0) {
        // 有元素

        let tag = includes.some(
          (item, index) => item[config.name] === state.containers[param.key][config.hoverInputVal],
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
        // 无元素 嗯嗯，
        // 添加元素
        includes.unshift(obj);
      }

      state.containers[param.key][config.names] = includes;
    }
  } else {
    // 添加

    console.log('__++__');
    console.log(state.containers[param.key][config.names]);
    console.log(param);
    console.log(config);

    console.log(state.containers[param.key].parentInputVal);
    let arr = state.backUp_parentNames.filter(
      (item, index) => item.parent_name === state.containers[param.key].parentInputVal,
    );
    console.log(arr[0]);

    // 创建新的 ParentNames 项
    let uuid = UUID.generate();
    let obj = {
      temp: 'temp',
      [config.id]: uuid,
      [config.name]: '',
      id: uuid,
      // prop: arr[0].prop,
    };

    console.log('objobjobj');
    console.log(obj);
    // 判断当前输入是否为中文输入
    if (state[config.isChinese] && param.value.split('')[param.value.length - 1] !== ' ') {
      // 中文输入
      // 更新 parentNames 列表数据
      addParentsNames(state, param, obj, config);
    } else if (state[config.isChinese] === false) {
      // 非中文输入
      // 更新 parentNames 列表数据
      addParentsNames(state, param, obj, config);
    }
  }

  // 获取上一次悬浮选值面板的 input 中输入的内容
  state.containers[param.key][config.prev_hoverInputVal] =
    state.containers[param.key][config.hoverInputVal];
};
