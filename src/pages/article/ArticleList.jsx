import React, { Component } from 'react';
import { Input, Button, message, Modal, Select } from 'antd';
import ModalInfo from '@/common/components/Modal';
import TableList, { Search, Table, Action } from '@/common/components/TableList';
import request from '@/common/utils/request'
import Permission from '@/common/components/Permission';

import ArticleAdd from './ArticleAdd';
import ArticleEdit from './ArticleEdit';
import ArticleSort from './ArticleSort';
import ArticlePublish from './ArticlePublish';

export default class ArticleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultParam: {}
    }
  }
  /**
   * 渲染操作列
   * text: 当前行的值
   * record: 当前行数据
   * index: 行索引
   */
  renderColAction = (text, record, index) => {
    return (
      <>
        <Permission authority="article:modify">
          <a onClick={() => this.refs.editModal.show(record)}>修改</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.refs.publishModal.show(record)}>发布</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.refs.sortModal.show(record)}>设置顺序</a>
        </Permission>
        <Permission authority="article:delete">
          <a onClick={() => this.delete(record)}>删除</a>
        </Permission>
      </>
    );
  }

  renderPublishStatus = (text, record, index) => {
    return text == 1 ? '已发布' : '未发布';
  }

  /**
   * 删除
   */
  delete = (record) => {
    const tableList = this.refs.tableList;
    const selectRecrods = tableList.currentSelectRows(record);
    if (selectRecrods.length == 0) {
      message.error('请选择至少一条记录！');
      return;
    }
    Modal.confirm({
      title: '删除',
      okText: "确认",
      cancelText: "取消",
      centered: true,
      content: '删除操作不可恢复，确认删除？',
      onOk() {
        return new Promise((resolve, reject) => {
          request.delete("/article/delete", { data: selectRecrods.map(item => item.id) }).then(res => {
            resolve();
            tableList.reload();
          }).catch(() => reject());
        });
      }
    });
  }
  render() {
    return (
      <>
        <TableList ref='tableList'>
          <Search>
            <Input label='标题' name='title' />
            <Select label='发布状态' name='publishStatus' placeholder="请选择">
              <Select.Option value=''>全部</Select.Option>
              <Select.Option value='0'>未发布</Select.Option>
              <Select.Option value='1'>发布</Select.Option>
            </Select>
          </Search>
          <Action>
            {
              (this.props.defaultParam && this.props.defaultParam.categoryId && this.props.defaultParam.categoryId!= '') ?
                <Permission authority="article:add">
                  <Button type="primary" icon="plus" onClick={() => this.refs.addModal.show()}>添加</Button>
                </Permission>
                : <></>
            }
            <Permission authority="article:delete">
              <Button type="primary" icon="delete" onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/article' defaultParam={this.props.defaultParam}>
            <Table.Column title="标题" dataIndex="title" />
            <Table.Column title="发布状态" dataIndex="publishStatus" render={this.renderPublishStatus} />
            <Table.Column title="发布时间" dataIndex="publishDate" />
            <Table.Column title="序号" dataIndex="sort" />
            <Table.Action render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加文章' ref="addModal" {...this.refs}>
          <ArticleAdd  categoryId={this.props.defaultParam.categoryId}/>
        </ModalInfo>
        <ModalInfo title='编辑文章' ref="editModal" {...this.refs}>
          <ArticleEdit />
        </ModalInfo>
        <ModalInfo title='发布' ref="publishModal" {...this.refs}>
          <ArticlePublish />
        </ModalInfo>
        <ModalInfo title='设置顺序' ref="sortModal" {...this.refs}>
          <ArticleSort />
        </ModalInfo>
      </>
    );
  }
}
