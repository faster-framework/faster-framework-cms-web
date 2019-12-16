import React, { Component } from 'react';
import styles from './index.less';

class FixedRow extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { children, ...otherPorps } = this.props;
    let className = 'fixed-row';

    if (otherPorps.upload) {
      className = 'fixed-row-upload';
    }
    if (otherPorps.editor) {
      className = 'fixed-row-editor';
    }
    if(otherPorps.full){
      className = 'fixed-row-full';
    }
    return (
      <div className={className}>{children}</div>
    )
  }
}
export default FixedRow;
