import React, { Component } from 'react';
import { Tree } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import ArticleList from './ArticleList';
import request from '@/common/utils/request';
import TreeUtils from '@/common/utils/treeUtils';
import styles from './index.less';

const { DirectoryTree } = Tree;

export default class ArticleIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableQuery: {},
      sectionTrees: []
    }
  }
  componentDidMount() {
    request.get('/section').then((response) => {
      this.setState({
        sectionTrees: [{
          value: '0',
          title: '站点',
          children: TreeUtils.convertTreeSelectData(response)
        }]
      });
    });
  }
  onSelect = (keys, event) => {
    this.setState({
      tableQuery: {
        sectionId: keys[0] == '0-0' ? '' : keys[0]
      }
    });
    const self = this;
    setTimeout(() => {
      self.refs.articleList.refs.tableList.reload();
    }, 0);

  };
  render() {
    return (
      <GridContent className={styles.container}>
        <div className={styles.left}>
          <DirectoryTree expandAction={false} key={`tree-${this.state.sectionTrees && this.state.sectionTrees.length}`} defaultExpandAll onSelect={this.onSelect} treeData={this.state.sectionTrees} />
        </div>
        <div className={styles.right}>
          <ArticleList defaultParam={this.state.tableQuery} ref="articleList"/>
        </div>
      </GridContent>
    );
  }
}
