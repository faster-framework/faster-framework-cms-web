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
import ArticleShow from './ArticleShow';
import ArticleTop from './ArticleTop';
import DictUtils from '@/common/utils/dict';

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
          <a onClick={() => this.refs.showModal.show(record)}>展示</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.refs.topModal.show(record)}>置顶</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.refs.sortModal.show(record)}>顺序</a>
        </Permission>
        <Permission authority="article:add">
          <a onClick={() => this.clone(record)}>克隆</a>
        </Permission>
        <Permission authority="article:delete">
          <a onClick={() => this.delete(record)}>删除</a>
        </Permission>
      </>
    );
  }

  renderStatus = (text, record, index) => {
    return text == 1 ? '是' : '否';
  }
  renderTitle = (text,record,index)=>{
    const siteUrl = DictUtils.value('site-url','site-url');
    const articleUrl = siteUrl + "a/"+record.id;
  return <a href={articleUrl} target='_blank'>{text}</a>;
  }

   /**
   * 克隆
   */
  clone = (record) => {
    const tableList = this.refs.tableList;
    const selectRecrods = tableList.currentSelectRows(record);
    if (selectRecrods.length != 1) {
      message.error('请选择一条记录！');
      return;
    }

    Modal.confirm({
      title: '克隆',
      okText: "确认",
      cancelText: "取消",
      centered: true,
      content: '仅可克隆不存在编码的文章，确认？',
      onOk() {
        return new Promise((resolve, reject) => {
          request.post('/article', { data: selectRecrods[0] }).then(res => {
            resolve();
            tableList.reload();
          }).catch(() => reject());
        });
      }
    });
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
            <Input label='编码' name='code' />
            <Select label='发布状态' name='publishStatus' placeholder="请选择">
              <Select.Option value=''>全部</Select.Option>
              <Select.Option value='0'>未发布</Select.Option>
              <Select.Option value='1'>已发布</Select.Option>
            </Select>
            <Select label='展示状态' name='showStatus' placeholder="请选择">
              <Select.Option value=''>全部</Select.Option>
              <Select.Option value='0'>隐藏</Select.Option>
              <Select.Option value='1'>展示</Select.Option>
            </Select>
            <Select label='置顶状态' name='topStatus' placeholder="请选择">
              <Select.Option value=''>全部</Select.Option>
              <Select.Option value='0'>未置顶</Select.Option>
              <Select.Option value='1'>置顶</Select.Option>
            </Select>
          </Search>
          <Action>
            {
              (this.props.defaultParam && this.props.defaultParam.sectionId && this.props.defaultParam.sectionId!= '') ?
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
            <Table.Column width={250} ellipsis title="标题" dataIndex="title" render={this.renderTitle}/>
            <Table.Column width={80}  title="发布" dataIndex="publishStatus" render={this.renderStatus} />
            <Table.Column width={80} title="展示" dataIndex="showStatus" render={this.renderStatus} />
            <Table.Column width={80} title="置顶" dataIndex="topStatus" render={this.renderStatus} />
            <Table.Column width={200} title="发布时间" dataIndex="publishDate" />
            <Table.Column width={80} title="序号" dataIndex="sort" />
            <Table.Action render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加文章' ref="addModal" {...this.refs}>
          <ArticleAdd  sectionId={this.props.defaultParam.sectionId}/>
        </ModalInfo>
        <ModalInfo title='编辑文章' ref="editModal" {...this.refs}>
          <ArticleEdit />
        </ModalInfo>
        <ModalInfo title='发布' ref="publishModal" {...this.refs}>
          <ArticlePublish />
        </ModalInfo>
        <ModalInfo title='展示' ref="showModal" {...this.refs}>
          <ArticleShow />
        </ModalInfo>
        <ModalInfo title='置顶' ref="topModal" {...this.refs}>
          <ArticleTop />
        </ModalInfo>
        <ModalInfo title='顺序' ref="sortModal" {...this.refs}>
          <ArticleSort />
        </ModalInfo>
      </>
    );
  }
}
