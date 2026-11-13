import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'antd/dist/reset.css';
import request from '@/common/utils/request';
import { setDictList } from '@/common/utils/dict';
import { dispatch } from '@/common/utils/store';

dayjs.locale('zh-cn');

export function rootContainer(container) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
}

export function onRouteChange({ location }) {
  // 登录页不请求字典，避免无 token 时产生 401 提示
  if (!window.localStorage.token) {
    return;
  }
  request
    .get('/sys/dict/all')
    .then(res => {
      setDictList(res);
      dispatch({
        type: 'dict/refreshDict',
        dictList: res,
      });
    })
    .catch(() => {
      // 字典加载失败不阻塞页面；错误提示由 request 统一处理
    });
}
