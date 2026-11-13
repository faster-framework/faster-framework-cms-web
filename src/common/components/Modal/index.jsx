import React, { Component } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

class BaseModal extends Component {
  state = {
    visible: false,
  };
  constructor(props) {
    super(props);
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  };
  hideAndRefresh = () => {
    const { tableList } = this.props;
    const table = typeof tableList === 'function' ? tableList() : tableList;
    if (table && typeof table.reload === 'function') {
      table.reload();
    }
    this.hide();
  };

  show = record => {
    this.setState({
      visible: true,
      currentRecord: record,
    });
  };
  ok = () => {
    if (this.form) {
      this.form.onOk(this);
    } else if (this.modalInfo) {
      this.modalInfo.onOk(this);
    }
  };
  wrappedComponentRef = form => {
    this.form = form;
  };
  render() {
    const { children, ...otherPorps } = this.props;
    return (
      <Modal
        destroyOnHidden
        centered
        keyboard={false}
        maskClosable={false}
        onCancel={this.hide}
        onOk={this.ok}
        {...otherPorps}
        open={this.state.visible}
        className={this.props.width ? 'fit-modal' : 'fit-modal fit-modal-width'}
      >
        <div className="fit-modal-content">
          {React.Children.map(children, (item, index) => {
            return React.cloneElement(item, {
              wrappedComponentRef: this.wrappedComponentRef,
              currentRecord: this.state.currentRecord,
              ref: node => {
                this.modalInfo = node;
              },
            });
          })}
        </div>
      </Modal>
    );
  }
}
export default BaseModal;
