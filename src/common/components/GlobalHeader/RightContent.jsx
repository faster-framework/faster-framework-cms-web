import React, { Component } from 'react';
import { connect } from '@umijs/max';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  render() {
    const { theme, layout } = this.props;
    let className = styles.right;
    if (theme === 'dark' && layout === 'topmenu') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderDropdown />
      </div>
    );
  }
}

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
