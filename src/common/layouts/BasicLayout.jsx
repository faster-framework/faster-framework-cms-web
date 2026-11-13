import { DefaultFooter, ProLayout } from '@ant-design/pro-components';
import {
  AppstoreOutlined,
  BookOutlined,
  CloudOutlined,
  DatabaseOutlined,
  HomeOutlined,
  LockOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import routers from '../../../config/routers';
import React, { Component } from 'react';
import { Link, Outlet, connect } from '@umijs/max';
import RenderAuthorize from '@/common/components/Authorized';
import { getAuthority } from '@/common/utils/authority';
import RightContent from '@/common/components/GlobalHeader/RightContent';
import Tabs from '@/common/components/Tabs';
import logo from '@/common/logo.png';

const iconMap = {
  home: HomeOutlined,
  setting: SettingOutlined,
  user: UserOutlined,
  'usergroup-add': TeamOutlined,
  lock: LockOutlined,
  database: DatabaseOutlined,
  cluster: AppstoreOutlined,
  book: BookOutlined,
  read: ReadOutlined,
  cloud: CloudOutlined,
};

const footerRender = (_, defaultDom) => {
  return <DefaultFooter links={[]} copyright={COPRY_RIGHT} />;
};

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }
  handleMenuCollapse = payload => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  handleMenu = menuList => {
    return menuList.map(item => {
      const localItem = {
        ...item,
        icon:
          typeof item.icon === 'string'
            ? React.createElement(iconMap[item.icon] || AppstoreOutlined)
            : item.icon,
        children: item.children ? this.handleMenu(item.children) : [],
      };
      const authorized = RenderAuthorize(getAuthority(this.props.currentUser.permissions));
      return authorized.check(item.authority, localItem, null);
    });
  };
  menuClick = menuItemProps => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/addTab',
        menuItemProps,
      });
    }
  };
  render() {
    const { settings } = this.props;
    return (
      <ProLayout
        logo={logo}
        title={TITLE}
        onCollapse={this.handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }
          return (
            <Link onClick={() => this.menuClick(menuItemProps)} to={menuItemProps.path}>
              {defaultDom}
            </Link>
          );
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: '控制台',
            },
            ...routers,
          ];
        }}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        menuDataRender={this.handleMenu}
        rightContentRender={() => <RightContent />}
        {...this.props}
        {...settings}
        route={{ routes: routers }}
      >
        <Tabs>
          <Outlet />
        </Tabs>
      </ProLayout>
    );
  }
}

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
}))(BasicLayout);
