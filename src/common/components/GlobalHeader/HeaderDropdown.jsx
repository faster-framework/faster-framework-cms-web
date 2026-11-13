import { Dropdown, Modal, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { connect, history } from '@umijs/max';
import React from 'react';
import styles from './index.less';
import request from '@/common/utils/request';

const { confirm } = Modal;

class HeaderDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      confirm({
        title: '注销',
        okText: '确定',
        cancelText: '取消',
        content: '确认退出登录？',
        onOk() {
          request.delete('/logout').then(res => {
            window.localStorage.removeItem('token');
            history.push('/login');
          });
        },
      });

      return;
    }
    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        name: '',
      },
    } = this.props;
    const menu = {
      items: [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: '退出登录',
        },
      ],
      onClick: this.onMenuClick,
    };
    return currentUser && currentUser.name ? (
      <Dropdown menu={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </Dropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(HeaderDropdown);
