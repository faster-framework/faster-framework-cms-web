import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-components';
import React from 'react';
import { connect, Outlet } from '@umijs/max';
import styles from './LoginLayout.less';
import { Spin } from 'antd';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const { location = { pathname: '' } } = props;
  const { breadcrumb } = getMenuData(routes);
  const { loading } = props;
  const pageTitle = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  React.useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  return (
      <Spin size="large" spinning={loading}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <span className={styles.title}>{TITLE}</span>
              </div>
              <div className={styles.desc}>{TITLE_DESC}</div>
            </div>
            <Outlet />
          </div>
          <DefaultFooter links={[]} copyright={COPRY_RIGHT} />
        </div>
      </Spin>
  );
};

export default connect(({ settings, global }) => ({
  ...settings,
  loading: global.loading,
}))(UserLayout);
