import { Button, Result } from 'antd';
import React from 'react';
import { history } from '@umijs/max';

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，您请求的页面不存在"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        回首页
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
