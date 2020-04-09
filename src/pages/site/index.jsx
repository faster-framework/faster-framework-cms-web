import React, { Component } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import request from '@/common/utils/request'
import styles from './index.less';
import DictUtils from '@/common/utils/dict';


export default class SiteIndex extends Component {

  constructor(props) {
    super(props);
    // 默认筛选参数，key与下方筛选条件内的name相对应
    this.defaultParam = {
    }
  }

  /**
   * 静态页面生成
   */
  generateStatic = () => {
    Modal.confirm({
      title: '生成静态站点',
      okText: "确认",
      cancelText: "取消",
      centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          request.post("/site/generate").then(res => {
            message.success('生成成功');
            resolve();
          }).catch(() => reject());
        });
      }
    });
  }

  render() {
    return (
      <GridContent>
        <div className={styles.container}>
          <Button size="large" className={styles.bt} onClick={this.generateStatic}>生成静态站点</Button>
          <Button size="large"  className={styles.bt} href={DictUtils.value('site-url','site-url')} target="_blank">站点预览</Button>
        </div>
      </GridContent>
    );
  }
}
