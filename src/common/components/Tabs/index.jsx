import React, { Component } from 'react';
import { Spin, Popover, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, history } from '@umijs/max';
import styles from './index.less';
import withLocation from '@/common/components/WithLocation';

class TabsPro extends Component {
  constructor(props) {
    super(props);
    const { dispatch, location } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/addTab',
        menuItemProps: { path: '/', name: '控制台' },
      });
      this.addCurrentTab(location ? location.pathname : '/', this.currentTabList());
    }
  }

  componentDidUpdate(prevProps) {
    const { location, dispatch } = this.props;
    if (!location || !dispatch) {
      return;
    }
    if (!prevProps.location || prevProps.location.pathname !== location.pathname) {
      this.addCurrentTab(location.pathname, this.currentTabList());
    }
  }

  currentTabList() {
    return (this.props.tabList || []).slice();
  }

  addCurrentTab(pathname, tabList = []) {
    const { dispatch } = this.props;
    if (!dispatch || !pathname) {
      return;
    }
    if (tabList.some(item => item.path === pathname)) {
      return;
    }
    const route = FLAT_ROUTES.find(item => item.path === pathname);
    dispatch({
      type: 'global/addTab',
      menuItemProps: {
        path: pathname,
        name: route ? route.name : pathname === '/' ? '控制台' : pathname,
      },
    });
  }

  tabClick = key => {
    const { dispatch, location } = this.props;
    if (dispatch && location.pathname !== key) {
      history.push(key);
    }
  };

  closeTab = (key, index, e) => {
    e.stopPropagation();
    const { dispatch, activeTab, tabList, location } = this.props;
    if (dispatch) {
      if (key == activeTab) {
        const prev = tabList[index - 1];
        history.push(prev ? prev.path : '/');
      }
      dispatch({
        type: 'global/closeTab',
        menuItemProps: { path: key, activeTab: location.pathname },
      });
    }
  };

  closeOtherTab = (key, index, e) => {
    e.stopPropagation();
    const { dispatch, activeTab, location } = this.props;
    if (dispatch) {
      if (activeTab != key) {
        history.push(key);
      }
      dispatch({
        type: 'global/closeOtherTab',
        menuItemProps: { path: key, activeTab: location.pathname },
      });
    }
  };

  closeRightTab = (key, index, e) => {
    e.stopPropagation();
    const { dispatch, activeTab, location } = this.props;
    if (dispatch) {
      if (activeTab != key) {
        history.push(key);
      }
      dispatch({
        type: 'global/closeRightTab',
        menuItemProps: { path: key, activeTab: location.pathname },
      });
    }
  };

  closeAllTab = (key, index, e) => {
    e.stopPropagation();
    const { dispatch, activeTab, tabList, location } = this.props;
    if (dispatch) {
      let currentIndex;
      tabList.forEach((item, i) => {
        if (item.path == activeTab) {
          currentIndex = i;
        }
      });
      if (currentIndex != 0) {
        history.push(tabList[0] ? tabList[0].path : '/');
      }
      dispatch({
        type: 'global/closeAllTab',
        menuItemProps: { index: currentIndex, activeTab: location.pathname },
      });
    }
  };

  renderTabName = (name, key, index) => {
    let className = styles.tabName;
    if (index == 0) {
      className = `${styles.tabName} ${styles.tabNameNoClose}`;
    }
    const content = (
      <div className="tab-popover-content" onClick={e => e.stopPropagation()}>
        {index != 0 ? (
          <div className="item" onClick={e => this.closeTab(key, index, e)}>
            关闭
          </div>
        ) : (
          <></>
        )}
        <div className="item" onClick={e => this.closeOtherTab(key, index, e)}>
          关闭其它
        </div>
        <div className="item" onClick={e => this.closeRightTab(key, index, e)}>
          关闭右侧
        </div>
        <div className="item" onClick={e => this.closeAllTab(key, index, e)}>
          关闭全部
        </div>
      </div>
    );
    return (
      <Popover
        overlayClassName="tab-popover"
        content={content}
        title=""
        trigger="contextMenu"
        placement="bottom"
      >
        <div className={className}>
          {name}
          {index == 0 ? (
            <></>
          ) : (
            <PlusOutlined
              rotate={45}
              onClick={e => this.closeTab(key, index, e)}
              className={styles.icon}
            />
          )}
        </div>
      </Popover>
    );
  };

  render() {
    const { children, globalLoading, tabList, location } = this.props;
    const activeKey = location ? location.pathname : '/';
    const tabs = (tabList || []).slice();
    if (!tabs.some(item => item.path === activeKey)) {
      const route = FLAT_ROUTES.find(item => item.path === activeKey);
      tabs.push({
        path: activeKey,
        name: route ? route.name : activeKey === '/' ? '控制台' : activeKey,
      });
    }
    const items = tabs.map((item, index) => ({
      key: item.path,
      label: this.renderTabName(item.name, item.path, index),
      children:
        item.path === activeKey ? (
          <Spin size="large" spinning={globalLoading}>
            {children}
          </Spin>
        ) : null,
    }));
    return (
      <div className="header-tab">
        <Tabs
          activeKey={activeKey}
          animated={false}
          className={styles.tabs}
          onTabClick={this.tabClick}
          items={items}
        />
      </div>
    );
  }
}

export default connect(({ global }) => ({
  tabList: global.tabList,
  activeTab: global.activeTab,
  globalLoading: global.loading,
}))(withLocation(TabsPro));
