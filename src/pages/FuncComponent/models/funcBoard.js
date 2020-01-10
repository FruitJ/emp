import React from 'react';
// 官方包
import { message } from 'antd';
import UUID from 'uuidjs';
import { Input, Icon, Upload, Button } from 'antd';

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
let flag = 1000;
let DEFAULT_TABLE_UNIT = ["价格", "库存", "图片"];
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
    board_data: [], // 面板数据

    data: [], // 表格数据
    columns: [], // 表格列数据 ( 包含 rowSpan 等信息 - 动态生成 )
  },
  effects: {
    // 加载父节点数据
    *loadParentNodeData({ payload: param }, { call, put }) {
      // 加载数据
      let res = yield call(loadParentNodeDataService);

      res.forEach((item, index) => {
        item.id = Number(item.parent_id);
        item.prop = item.parent_id;
      });

      yield put({
        type: '_saveParentNodeData', // 存储父节点数据
        payload: {
          res, // 父节点的响应数据
          key: param.key, // 当前组件的索引
        },
      });
    },
    // 添加新父节点数据
    *getNewParentNamesEle({ payload: param }, { call, put }) {
      let res = yield call(getNewParentNamesEleService, param);
      res.id = res.parent_id;
      console.log('嘻嘻哈哈嘻嘻哈哈');
      console.log(res);
      yield put({
        type: '_updateParentNamesFirstEle',
        payload: {
          key: param.key,
          res,
        },
      });

      yield put({
        type: '_putValToParentInput',
        payload: {
          parent_name: param.parentName,
          parent_id: param.parent_id,
          key: param.key,
        },
      });
    },
    // 加载子节点数据
    *loadChildNodeData({ payload: param }, { call, put }) {
      let obj = {
        parent_name: param.parent_name,
        parent_id: param.parent_id,
        prop: param.prop,
      };
      let res = yield call(loadChildNodeDataService, obj);

      res.forEach((item, index) => {
        item.prop = obj.prop;
        item.id = Number(item.child_id);
      });
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
    // 添加新子节点数据结
    *getNewChildNamesEle({ payload: param }, { call, put }) {
      // 替换 id 元素
      let res = yield call(getNewChildNamesEleService, {
        newElements: param.temp_addEle.map((item, index) => ({
          child_name: item.child_name,
          prop: param.prop,
          parent_id: param.parent_id,
        })),
      });
      console.log(res);
      res.forEach((item, index) => {
        item.prop = item.parent_id;
        item.id = item.child_id;
      });

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
    // 添加组件
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
        });
      }
      return { ...state };
    },
    // 移除组件
    _removeContainer(state, { payload: param }) {
      state.board_data = state.board_data.filter(
        (item, index) => item.name !== state.containers[param.index].parentInputVal,
      );

      // 根据删除当前规格 ( 包括规格值 )来删除表格
      // 格式化表格数据
      let res = formatData(state.board_data);

      // 配置显示表格数据需要的数据源
      state.data = res[0];
      state.columns = res[1];

      // 移除 container
      state.containers = state.containers.filter((item, index) => index !== param.index);
      return { ...state };
    },
    // 保存父节点数据
    _saveParentNodeData(state, { payload: param }) {
      // 保存父节点数据
      // 动态向对应数据项中填充数据 ( key )
      replace_str = '';
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
    // 将选中的值放进父节点的输入框中
    _putValToParentInput(state, { payload: param }) {
      // 将选中父节点的值放进父节点的 Input 框中

      let parentInputVal = state.containers[param.key].parentInputVal;

      let temp_container = [];

      if (state.containers.length > 1) {
        // 多个 container 面板组件

        // 判断其他父节点表单输入框中的值是否重复
        temp_container = state.containers.filter((item, index) => index !== param.key);
        if (temp_container.every((item, index) => item.parentInputVal !== param.parent_name)) {
          // 未添加过的相同的值
          // 更新 parent node 的 Input 框中的内容

          state.containers[param.key].parentInputVal = param.parent_name;

          // 可以开始请求子节点数据
          state.isCouldReqChildrenData = true;

          state.containers[param.key].parentInputId = param.parent_id;

          state.containers[param.key].isSureParentNamesEle = true;
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

      if (parentInputVal !== state.containers[param.key].prev_parentInputVal) {
        if (parentInputVal !== '未选择') {
          // 清空小标签数组中的元素

          state.containers[param.key].real_childNames = [];

          for (let i = 0; i < state.board_data.length; i++) {
            let obj = null;
            if (state.board_data[i].name === parentInputVal) {
              obj = state.backUp_parentNames.filter((item, index) => {
                console.log('____+______');
                console.log(item.parent_id, state.containers[param.key].parentInputId);
                return item.parent_id === state.containers[param.key].parentInputId;
              })[0];

              state.board_data[i].name = obj.parent_name;
              state.board_data[i].id = obj.parent_id;
              state.board_data[i].children = [];

              // 格式化表格数据
              let res = formatData(state.board_data);
              // 配置显示表格数据需要的数据源
              state.data = res[0];
              state.columns = res[1];
            }
          }
        }
      }

      return { ...state };
    },
    // 绑定父节点悬浮选值面板的输入框的表单
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

      return { ...state };
    },
    // 绑定子节点悬浮选值面板的输入框的表单
    _bindChildHoverInput(state, { payload: param }) {
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

    // 监听中文开始输入事件
    _checkChineseInputStart(state, {}) {
      // 输入中文中
      state.isChineseInput = true;
      return { ...state };
    },
    // 监听中文输入完成事件
    _checkChineseInputEnd(state, {}) {
      // 未输入中文
      state.isChineseInput = false;
      return { ...state };
    },
    // 更新父节点当前输入数据 - 用户自定义输入
    _updateParentNamesFirstEle(state, { payload: param }) {
      state.containers[param.key].parentNames[0] = JSON.parse(JSON.stringify(param.res));

      state.backUp_parentNames.push(JSON.parse(JSON.stringify(param.res)));

      return { ...state };
    },
    // 保存子节点数据
    _saveChildNodeData(state, { payload: param }) {
      state.transfer_childNames = param.res;
      state.backUp_childNames = JSON.parse(JSON.stringify(param.res));

      state.containers[param.key].childNames = state.transfer_childNames;
      // 显示子节点的悬浮选值面板
      state.containers[param.key].outsideChildInputBoard_status = 'block';
      // 改变三角标样式

      let rotate = {
        transform: `rotate(${config_common_properties.ROTATE_UP}deg)`,
      };
      rotate.transitionDuration = `${config_common_properties.DURATION_TIME}s`;
      changeChildHoverInputBoardStyle('block', true, rotate, param.key, state);

      return { ...state };
    },
    // 移除子节点的悬浮选值面板
    _removeChildHoverBoard(state, { payload: param }) {
      // 关闭子节点的悬浮选值面板
      state.containers[param.key].hoverChildInputBoard_status = 'none ';
      return { ...state };
    },
    // 改变子节点的悬浮选值面板的状态
    _changeChildHoverBoardStatus(state, { payload: param }) {
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

      return { ...state };
    },
    _changeChildHoverBoardStyle(state, { payload: param }) {
      return { ...state };
    },
    // 临时保存选中的子节点数据
    _tempSaveSelectedChildNodeData(state, { payload: param }) {
      let arr = state.backUp_parentNames.filter(
        (item, index) => item.parent_name === state.containers[param.key].parentInputVal,
      );
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
      } else {
        state.containers[param.key].afterNative_childNames.push({
          child_name: param.child_name,
          child_id: param.child_id,
          id: param.child_id,
          parent_id: param.parent_id,
          prop: param.prop,
        });
      }

      return { ...state };
    },
    // 移除待选区域子节点数据集合
    _removeAfterNative_childNames(state, { payload: param }) {
      state.containers[param.key].afterNative_childNames = state.containers[
        param.key
      ].afterNative_childNames.filter((item, index) => {
        return item.child_id !== param.item.child_id && item.child_name !== param.item.child_name;
      });

      return { ...state };
    },
    // 取消子节点悬浮选值面板
    _cancelChildHoverBoard(state, { payload: param }) {
      state.containers[param.key].outsideChildInputBoard_status = 'none';
      return { ...state };
    },
    // 判断当前节点是否为临时创建
    _judgeTempCreatedEle(state, { payload: param }) {
      state.containers[param.key].isHaveTempCreatedEle = state.containers[
        param.key
      ].afterNative_childNames.some((item, index) => Number.isNaN(Number(item.child_id)));

      return { ...state };
    },
    // 替换节点 id
    _replaceChildEleId(state, { payload: param }) {
      // 替换元素
      let len = state.containers[param.key].afterNative_childNames.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < param.temp_addEle.length; j++) {
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
      let arr = [];

      state.containers[param.key].real_childNames.push(...arr);

      state.containers[param.key].real_childNames = JSON.parse(
        JSON.stringify(state.containers[param.key].afterNative_childNames),
      );
      return { ...state };
    },
    // 将待选区域的数据集合添加到真实展示区域
    _realAddChildEle(state, { payload: param }) {
      
      let tbody = param.table.querySelectorAll("tbody")[0];
      
      setTimeout(() => { // 使用定时器的原因是表格生成的时机比获取行为慢，导致获取失败
        // ( 为每个最后含有 file 类型的 input 设置 data-key 属性 )
        let trs = tbody.children;
        let tds = [];
        for(let i = 0; i < trs.length; i++) {
          let len = trs[i].querySelectorAll("td").length;
          tds.push(trs[i].querySelectorAll("td")[len - 1]);
        }
        // 为当前每个 td 下面的 btn 设置 data-key 属性
        tds.forEach((item, index) => {
          item.querySelectorAll("button")[0].dataset.rowKey = index.toString();
        });
      }, 0);
  
  
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
      }
      state.containers[param.key].real_childNames.push(...arr);

      // 关闭悬浮选值面板
      state.containers[param.key].outsideChildInputBoard_status = 'none';

      // 生成的表格数据对象

      let item = state.backUp_parentNames.filter((item, index) => {
        return item.prop === state.containers[param.key].real_childNames[0].prop;
      });

      if (item.length !== 0) {
        let children = [];
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

        let tag = state.board_data.some((item, index) => item.id === obj.id);

        let arr = [];
        for (let i = 0; i < state.board_data.length; i++) {
          arr.push(state.board_data[i].id);
        }
        // 判断原数组中是否有 id 相同的元素
        if (tag) {
          alert('+');
          state.board_data.splice(arr.indexOf(obj.id), 1, obj);
        } else {
          alert('-');

          /*
          *
          
            let temp = state.board_data.filter((item, index) => item.temp);
	      let arr = state.board_data.filter((item, index) => !item.temp);
          state.board_data.push([...arr, ...temp]);
         
          */

          if (state.board_data.length === 0) {
            state.board_data.push(obj);
          } else {
            state.board_data.push(obj);
            console.log('&&&&&&&&&&&&&');

            let temp = state.board_data.filter((item, index) => item.temp !== undefined);
            let arr = state.board_data.filter((item, index) => item.temp === undefined);
            console.log(state.board_data);
            console.log(state.board_data.length);
            state.board_data = [...arr, ...temp];
            // state.board_data.push();

            console.log(temp);
            console.log(arr);
          }

          /*console.log(";;;;;;;;;");
	        console.log(temp);
	        console.log(obj);
	        console.log(state.board_data);*/
        }

        console.log('嘻嘻哈哈嘿嘿');
        console.log(state.board_data);

        state.board_data = state.board_data.filter((item, index) =>
          item.children.every((obj, num) => {
            return !Number.isNaN(Number(obj.id));
          }),
        );

        console.log('^^&&^^||^^&&^^');
        console.log(state.board_data);

        // 根据规格组件选中的规格值动态生成表格
        // 格式化表格数据

        console.log('] 分割线 [');
        console.log(state.board_data);
        console.log(state.containers[param.key].parentNames);
        console.log(state.backUp_parentNames);

        if (!state.board_data.some((item, index) => item.name === '价格')) {
          flag += 1;

          let arr = [];
          /*let temp_obj = {
            name: '价格',
            id: flag,
            temp: true,
          };*/
          arr.push({
            name: '价格',
            id: flag,
            temp: "price",
          });
          flag += 1;
          arr[0].children = [
            {
              prop: flag.toString(),
              name: (<Input prefix="￥" suffix="RMB" style={{ width: "40%" }} />),
              id: flag,
            },
          ];
          
          state.board_data.push(...arr);
        }
  
        if (!state.board_data.some((item, index) => item.name === '库存')){
          flag += 1;
  
          let arr = [];
          /*let temp_obj = {
            name: '价格',
            id: flag,
            temp: true,
          };*/
          arr.push({
            name: '库存',
            id: flag,
            temp: "repertory",
          });
          flag += 1;
          arr[0].children = [
            {
              prop: flag.toString(),
              name: (<Input prefix={<Icon type="inbox" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            style={{ width: "40%" }}
              />),
              id: flag,
            },
          ];
  
  
          state.board_data.push(...arr);
        }
  
        if (!state.board_data.some((item, index) => item.name === '图片')){
          flag += 1;
    
          let arr = [];
          /*let temp_obj = {
            name: '价格',
            id: flag,
            temp: true,
          };*/
          arr.push({
            name: '图片',
            id: flag,
            temp: "picture",
          });
          flag += 1;
          arr[0].children = [
            {
              prop: flag.toString(),
              name: (<Upload>
                    <Button>
                      <Icon type="upload"/> Click to Upload
                    </Button>
                  </Upload>
              ),
              id: flag,
            },
          ];
    
    
          state.board_data.push(...arr);
        }

        let res = formatData(state.board_data);
        console.log(res);

        // 配置显示表格数据需要的数据源
        state.data = res[0];
        state.columns = res[1];
      }

      return { ...state };
    },
    // 移除真实区域的子节点数据
    _removeReal_childNames(state, { payload: param }) {
      for (let i = 0; i < state.board_data.length; i++) {
        if (state.board_data[i].id === Number(param.item.parent_id)) {
          state.board_data[i].children = state.board_data[i].children.filter(
            (item, index) => item.name !== param.item.child_name,
          );
        }
      }

      // 根据删除小标签动态删除表格
      // 格式化表格数据
      let res = formatData(state.board_data);

      // 配置显示表格数据需要的数据源
      state.data = res[0];
      state.columns = res[1];

      // 删除元素
      state.containers[param.key].real_childNames = state.containers[
        param.key
      ].real_childNames.filter((item, index) => item.child_name !== param.item.child_name);

      return { ...state };
    },
    '_submitCurrentData'(state, { payload: param }) {
      const { table } = param;
      
      console.log(";;;;;;;;;;;;;");
      console.log(table);
      
      // 获取表头
      /*let thead = table.querySelectorAll("thead")[0];
      let thead_ths = thead.querySelectorAll("th");
      console.log(thead_ths);
      let real_thead = Array.from(thead_ths).filter((item, index) => !DEFAULT_TABLE_UNIT.includes(item.innerText));
      console.log("... real_thead ...");
      real_thead.forEach((item, index) => {
        console.log(item.innerText);
      });*/
      let tbody = table.querySelectorAll("tbody")[0];
      console.log(tbody);
      let trs = tbody.querySelectorAll("tr");
      
      let input_data = [];
      Array.from(trs).forEach((item, index) => {
        let tds = item.querySelectorAll("td");
        tds = Array.from(tds).filter((item, index) => item.querySelectorAll("input").length !== 0);
        let td = [];
        tds.forEach((item, index) => {
          console.log("123456789");
          console.log(item);
  
          // console.log(item.querySelectorAll("button"));
          
          td.push(item.querySelectorAll("input")[0].value);
        });
        input_data.push(td);
      });
      
      
      console.log("*********");
      console.log(input_data);
      console.log(trs);
  
      let arr = [];
      console.log("] 分割线 [");
      console.log(state.board_data);
      for(let i = 0; i < state.board_data.length - 3; i++) {
        arr.push(state.board_data[i]);
      }
      console.log(")( )( )(");
  
      /*sku_list.push({
        sku_url: "",
        price: 0,
        stock: 0,
        spec_option_id_list: [],
      });*/
      
      console.log(arr);
      let sku_list = [];
/*      if(arr.length > 1) {
        for(let i = 0; i < arr[arr.length - 1].children.length; i++) {
        
        
        }
      }*/
      
      if(arr.length > 1 && arr.length <= 2) { // 两次循环
        for(let i = 0; i < arr[arr.length - 2].children.length; i++) {
          for(let j = 0; j < arr[arr.length - 1].children.length; j++) {
            let temp = [];
            temp.push(arr[arr.length - 2].children[i].id, arr[arr.length - 1].children[j].id);
            sku_list.push(temp);
          }
        }
        
        
      }else if(arr.length > 2 && arr.length <= 3) { // 三次循环
  
        for(let i = 0; i < arr[arr.length - 3].children.length; i++) {
  
          for(let j = 0; j < arr[arr.length - 2].children.length; j++) {
            for(let o = 0; o < arr[arr.length - 1].children.length; o++) {
              let temp = [];
              temp.push(arr[arr.length - 3].children[i].id, arr[arr.length - 2].children[j].id, arr[arr.length - 1].children[o].id);
              sku_list.push(temp);
            }
          }
        }
       
      }else if(arr.length <= 1) { // 一次循环
        for(let i = 0; i < arr[arr.length - 1].children.length; i++) {
          let temp = [];
          temp.push(arr[arr.length - 1].children[i].id);
          sku_list.push(temp);
        }
      }
  
      // 获取当前所有表格
      let data = [];
      let alis = ["price", "stock", "sku_url"];
      if(input_data.length === sku_list.length) {
        input_data.forEach((item, index) => {
          let obj = {};
          item.forEach((val, num) => {
            obj[alis[num]] = val;
          });
  
          obj.spec_option_id_list = sku_list[index];
  
          data.push(obj);
        });
        
      }
  
      console.log("}_ + + _{");
      console.log(data);
      console.log(input_data);
      console.log(sku_list);
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

      includes.unshift(obj);
    }
  } else {
    // 添加新元素
    obj[config.name] = replace_str;
    includes.unshift(obj);
  }
  state.containers[param.key][config.names] = includes;
};

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
  // 删除表单中的内容
  if (
    state.containers[param.key][config.prev_hoverInputVal] !== '' &&
    state.containers[param.key][config.prev_hoverInputVal].length >
      state.containers[param.key][config.hoverInputVal].length
  ) {
    // 删除中
    let temp = JSON.parse(JSON.stringify(state[config.backUp_names]));
    if (!state.containers[param.key][config.hoverInputVal]) {
      replace_str = '';
      state.containers[param.key][config.names] = temp;
    } else {
      replace_str = '';
      // let temp = JSON.parse(JSON.stringify(state.backUp_parentNames));
      let includes = temp.filter((item, index) =>
        item[config.name].includes(state.containers[param.key][config.hoverInputVal]),
      );

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
      if (includes.length !== 0) {
        // 有元素

        let tag = includes.some(
          (item, index) => item[config.name] === state.containers[param.key][config.hoverInputVal],
        );
        if (!tag) {
          // 删除元素
          if (includes[0].temp !== undefined) {
            includes.shift();
          }
          // 添加元素
          includes.unshift(obj);
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

    let arr = state.backUp_parentNames.filter(
      (item, index) => item.parent_name === state.containers[param.key].parentInputVal,
    );

    // 创建新的 ParentNames 项
    let uuid = UUID.generate();
    let obj = {
      temp: 'temp',
      [config.id]: uuid,
      [config.name]: '',
      id: uuid,
    };

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

// 格式化表格数据
function formatData(data) {
  let arr = [];
  // 抽取数据结构
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i].children);
  }

  console.warn('}{}{}{}{}{');
  console.log(arr);
  let tableData = []; // 表格数据
  let count = 0; // 每行表格必须的 key 值

  // 格式化表格数据
/*  switch (arr.length - 3) {
    case 1: // 仅有一种规格
      alert('A');

      arr[0].forEach((item, index) => {
        // 遍历第一个规格值的集合 -> 创建数据并添加
        count += 1;
        tableData.push({
          [item.prop]: item.name,
          key: count,
        });
      });
      break;

    case 2: // 有两种规格
      alert('B');

      arr[0].forEach((item, index) => {
        // 遍历第一个规格值的集合 -> 创建数据并添加
        if (arr[1].length !== 0) {
          // 第二种规格值的集合有元素
          arr[1].forEach((ele, num) => {
            // // 遍历第二个规格值的集合 -> 创建数据并添加
            count += 1;
            tableData.push({
              [item.prop]: item.name,
              [ele.prop]: ele.name,
              key: count,
            });
          });
        } else {
          // 第二种规格值的集合无元素 ( 直接添加第一种规格模型的表格数据 )
          count += 1;
          tableData.push({
            [item.prop]: item.name,
            key: count,
          });
        }
      });

      break;
    case 3: // 有三种规格
      alert('C');

      if (arr[0].length !== 0) {
        // 第一个规格值集合有元素
        arr[0].forEach((item, index) => {
          // 遍历第一个规格值的集合 -> 创建数据并添加

          if (arr[1].length !== 0) {
            // 第二个规格值集合有元素
            arr[1].forEach((ele, num) => {
              // 遍历第二个规格值的集合 -> 创建数据并添加
              if (arr[2].length !== 0) {
                // 第三个规格值集合有元素
                arr[2].forEach((object, id) => {
                  // 遍历第三个规格值的集合 -> 创建数据并添加
                  count += 1;
                  tableData.push({
                    [item.prop]: item.name,
                    [ele.prop]: ele.name,
                    [object.prop]: object.name,
                    key: count,
                  });
                });
              } else {
                // 第三个规格值集合无元素 ( 直接添加 第一种/第二种 规格模型的表格数据 )
                count += 1;
                tableData.push({
                  [item.prop]: item.name,
                  [ele.prop]: ele.name,
                  key: count,
                });
              }
            });
          } else {
            // 第二个规格值集合无元素
            /!*count += 1;
			tableData.push({
			  [item.prop]: item.name,
			  key: count,
			});*!/
            if (arr[2].length !== 0) {
              // 第三个规格值集合有元素
              arr[2].forEach((object, id) => {
                // 遍历第三个规格值的集合 -> 创建数据并添加
                count += 1;
                tableData.push({
                  [item.prop]: item.name,
                  [object.prop]: object.name,
                  key: count,
                });
              });
            } else {
              // 第三个规格值集合无元素 ( 直接添加 第一种/第二种 规格模型的表格数据 )
              count += 1;
              tableData.push({
                [item.prop]: item.name,
                key: count,
              });
            }
          }
        });
      } else {
        // 第一个规格值集合无元素
        if (arr[1].length !== 0) {
          // 第二个规格值集合有元素
          arr[1].forEach((ele, num) => {
            // 遍历第二个规格值的集合 -> 创建数据并添加
            if (arr[2].length !== 0) {
              // 第三个规格值集合有元素
              arr[2].forEach((object, id) => {
                // 遍历第三个规格值的集合 -> 创建数据并添加
                count += 1;
                tableData.push({
                  [ele.prop]: ele.name,
                  [object.prop]: object.name,
                  key: count,
                });
              });
            } else {
              // 第三个规格值集合无元素
              count += 1;
              tableData.push({
                [ele.prop]: ele.name,
                key: count,
              });
            }
          });
        } else {
          // 第二个规格值集合无元素
          if (arr[2].length !== 0) {
            // 第三个规格值集合有元素 ( 直接添加 第一种 规格模型的表格数据 )
            arr[2].forEach((object, id) => {
              count += 1;
              tableData.push({
                [object.prop]: object.name,
                key: count,
              });
            });
          } else {
            // 第三个规格值集合无元素
            count += 1;
            tableData.push({
              key: count,
            });
          }
        }
      }

      break;
  }*/
  console.log("%&%&%&%&%&%");
  console.log(arr[0]);
  
  

  // ...asdas
/*  for(let i = 0; i < arr.length - 3; i++) {
    
    
    console.log("[]{}【】");
    console.log(arr);
    // if(arr.length - 3 <= 3) {
      // alert("1");
      console.log(arr[i]);
      for(let j = 0; j < arr[i].length; j++) {
       /!* tableData.push({
          key: count,
          [arr[i][j].prop]: arr[i][j].name
        });*!/
        count += 1;
        tableData.push({
          key: count,
          [arr[i][j].prop]: arr[i][j].name
        });
        console.log("sudo");
        console.log([arr[i][j].prop], arr[i][j].name);
      }
    /!*}else {
    
    }*!/
   /!* tableData.push({
      key: count
    });*!/
    /!*for(let j = 0; j < arr[i].length; j++) {
      count += 1;
      tableData[i][arr[i][j].prop] = arr[i][j].name;
      tableData[i].key = count;
    }*!/
  }*/
  
  // yes
/*  for(let j = 0; j < arr[0].length; j++) {
    /!* tableData.push({
	   key: count,
	   [arr[i][j].prop]: arr[i][j].name
	 });*!/
    count += 1;
    tableData.push({
      key: count,
      [arr[0][j].prop]: arr[0][j].name
    });
  }
  console.log("|||");
  console.log(arr.length - 3, arr.length);
  let surplus = arr.slice(1, arr.length);
  console.log("surplus ...");
  console.log(tableData);
  console.log(surplus);
  
  tableData.forEach((item, index) => {
    for(let i = 0; i < surplus.length; i++) {
      for(let j = 0; j < surplus[i].length; j++) {
        item[surplus[i][j].prop] = surplus[i][j].name
      }
      
    }
  });*/
  
  let surplus = arr.slice(0, arr.length - 3);

  console.log("asdasd");
  console.log(surplus[0]);
  console.log(arr[0]);
  if (arr[0].length !== 0) {
      // 第一个规格值集合有元素
      arr[0].forEach((item, index) => {
        // 遍历第一个规格值的集合 -> 创建数据并添加
      
        if (arr[1].length !== 0) {
          // 第二个规格值集合有元素
          arr[1].forEach((ele, num) => {
            // 遍历第二个规格值的集合 -> 创建数据并添加
            if (arr[2].length !== 0) {
              // 第三个规格值集合有元素
              arr[2].forEach((object, id) => {
                // 遍历第三个规格值的集合 -> 创建数据并添加
                count += 1;
                tableData.push({
                  [item.prop]: item.name,
                  [ele.prop]: ele.name,
                  [object.prop]: object.name,
                  [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
                  [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
                  [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
                  key: count,
                });
              });
            } else {
              // 第三个规格值集合无元素 ( 直接添加 第一种/第二种 规格模型的表格数据 )
              count += 1;
              tableData.push({
                [item.prop]: item.name,
                [ele.prop]: ele.name,
                [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
                [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
                [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
                key: count,
              });
            }
          });
        } else {
          // 第二个规格值集合无元素
          /*count += 1;
		  tableData.push({
			[item.prop]: item.name,
			key: count,
		  });*/
          if (arr[2].length !== 0) {
            // 第三个规格值集合有元素
            arr[2].forEach((object, id) => {
              // 遍历第三个规格值的集合 -> 创建数据并添加
              count += 1;
              tableData.push({
                [item.prop]: item.name,
                [object.prop]: object.name,
                [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
                [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
                [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
                key: count,
              });
            });
          } else {
            // 第三个规格值集合无元素 ( 直接添加 第一种/第二种 规格模型的表格数据 )
            count += 1;
            tableData.push({
              [item.prop]: item.name,
              [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
              [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
              [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
              key: count,
            });
          }
        }
      });
    } else {
      // 第一个规格值集合无元素
      if (arr[1].length !== 0) {
        // 第二个规格值集合有元素
        arr[1].forEach((ele, num) => {
          // 遍历第二个规格值的集合 -> 创建数据并添加
          if (arr[2].length !== 0) {
            // 第三个规格值集合有元素
            arr[2].forEach((object, id) => {
              // 遍历第三个规格值的集合 -> 创建数据并添加
              count += 1;
              tableData.push({
                [ele.prop]: ele.name,
                [object.prop]: object.name,
                [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
                [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
                [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
                key: count,
              });
            });
          } else {
            // 第三个规格值集合无元素
            count += 1;
            tableData.push({
              [ele.prop]: ele.name,
              [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
              [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
              [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
              key: count,
            });
          }
        });
      } else {
        // 第二个规格值集合无元素
        if (arr[2].length !== 0) {
          // 第三个规格值集合有元素 ( 直接添加 第一种 规格模型的表格数据 )
          arr[2].forEach((object, id) => {
            count += 1;
            tableData.push({
              [object.prop]: object.name,
              [arr[arr.length - 1][0].prop]: arr[arr.length - 1][0].name,
              [arr[arr.length - 2][0].prop]: arr[arr.length - 2][0].name,
              [arr[arr.length - 3][0].prop]: arr[arr.length - 3][0].name,
              key: count,
            });
          });
        } else {
          // 第三个规格值集合无元素
          count += 1;
          tableData.push({
            key: count,
          });
        }
      }
    }
  
  console.log("&&&********&&&&&&&&&&&&&&&&&***********");
  console.log(tableData);
  
  
  // 格式化 column 数据
  let columns = [];

  console.log('columns');
  console.log(data);
  let len = data.length;
  for (let i = 0; i < len; i++) {
    if (data[i] !== undefined) {
      if (data[i].children.length === 0) {
      } else {
        alert("Go");
        console.log("???????????");
        console.log(data[i]);
        let obj = null;
        /*if(data[i].temp !== undefined) {
          obj = {
            title: data[i].name,
            dataIndex: data[i].children[0].prop,
            render: (text, record) => {
              
              console.log(")))))))))))))))))))))))))))))))))))");
              console.log(text);
              console.log(record);
  
              return data[i].temp === "price" ? (
                  <Input prefix="￥" suffix="RMB" style={{ width: "40%" }} />
              ) : data[i].temp === "repertory" ? (
                  <Input prefix={<Icon type="inbox" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         style={{ width: "40%" }}
                  />
              ) : data[i].temp === "picture" ? (
                  <Upload>
                    <Button>
                      <Icon type="upload"/> Click to Upload
                    </Button>
                  </Upload>
              ) : null;
            },
          };
        }else {*/
          obj = {
            title: data[i].name,
            dataIndex: data[i].children[0].prop,
            render: (text, record) => {
              console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              console.log(text);
              console.log(record);
              return text;
            }
          };
        // }
        
        console.log('ooooooooooooooooooooooooo');
        console.log(data);
        if (i === 0) {
          alert('start ...');
          // 为第一个元素设置 render
          let len = data.length - 3;
          
          alert(`data length: ${ len }`);
          if (len === 2) {
            if (data[1].children.length > 1) {
              let arr = [];
              alert('start .../\\/');
              for (let j = 0; j < data[0].children.length; j++) {
                arr.push(j * data[len - 1].children.length);
              }

              obj.render = (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (arr.indexOf(index) !== -1) {
                  obj.props.rowSpan = data[len - 1].children.length;
                } else {
                  obj.props.rowSpan = 0;
                }

                return obj;
              };
            }
          } else if (len === 3) {
            alert('加油');
            console.warn('|||');
            console.log(data);
            if (data[2].children.length > 1) {
              let arr = [];
              alert("哈哈");
              for (let j = 0; j < data[0].children.length; j++) {
                arr.push(
                  j * data[data.length - (1 + 3)].children.length * data[data.length - (2 + 3)].children.length,
                );
              }
              obj.render = (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (arr.indexOf(index) !== -1) {
                  obj.props.rowSpan =
                    data[data.length - (1 + 3)].children.length * data[data.length - (2 + 3)].children.length;
                } else {
                  obj.props.rowSpan = 0;
                }

                return obj;
              };
            }
          }
        } else if (i === 1) {
          // 为第二个元素设置 render
          
          if (data.length - 3 === 3) {
            if (data[2].children.length > 1) {
              let arr = [];
              console.warn('|-|');
              console.log(data);
              for (let j = 0; j < data[0].children.length * data[1].children.length; j++) {
                arr.push(j * data[data.length - (1 + 3)].children.length);
              }
              obj.render = (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };

                if (arr.indexOf(index) !== -1) {
                  obj.props.rowSpan = data[data.length - ( 1 + 3)].children.length;
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
    }
  }

  return [tableData, columns]; // 返回表格数据与表格列数据
}
