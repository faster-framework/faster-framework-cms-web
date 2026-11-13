import React, { Component } from 'react';
import { Input, Button, message, Modal, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
  reload = () => {
    if (this.tableList) {
      this.tableList.reload();
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
          <a onClick={() => this.editModal.show(record)}>修改</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.publishModal.show(record)}>发布</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.showModal.show(record)}>展示</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.topModal.show(record)}>置顶</a>
        </Permission>
        <Permission authority="article:modify">
          <a onClick={() => this.sortModal.show(record)}>顺序</a>
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
    const tableList = this.tableList;
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
    const tableList = this.tableList;
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
        <TableList ref={node => { this.tableList = node; }}>
          <Search>
            <Input label='标题' name='title' />
            <Input label='编码' name='code' />
            <Select label='发布状态' name='publishStatus' placeholder="请选择" options={[{ value: '', label: '全部' }, { value: '0', label: '未发布' }, { value: '1', label: '已发布' }]} />
            <Select label='展示状态' name='showStatus' placeholder="请选择" options={[{ value: '', label: '全部' }, { value: '0', label: '隐藏' }, { value: '1', label: '展示' }]} />
            <Select label='置顶状态' name='topStatus' placeholder="请选择" options={[{ value: '', label: '全部' }, { value: '0', label: '未置顶' }, { value: '1', label: '置顶' }]} />
          </Search>
          <Action>
            {
              (this.props.defaultParam && this.props.defaultParam.sectionId && this.props.defaultParam.sectionId!= '') ?
                <Permission authority="article:add">
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => this.addModal.show()}>添加</Button>
                </Permission>
                : <></>
            }
            <Permission authority="article:delete">
              <Button type="primary" icon={<DeleteOutlined />} onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/article' defaultParam={this.props.defaultParam} scroll={{ x: 1100 }}>
            <Table.Column width={250} ellipsis title="标题" dataIndex="title" render={this.renderTitle}/>
            <Table.Column width={80}  title="发布" dataIndex="publishStatus" render={this.renderStatus} />
            <Table.Column width={80} title="展示" dataIndex="showStatus" render={this.renderStatus} />
            <Table.Column width={80} title="置顶" dataIndex="topStatus" render={this.renderStatus} />
            <Table.Column width={200} title="发布时间" dataIndex="publishDate" />
            <Table.Column width={80} title="序号" dataIndex="sort" />
            <Table.Action width={280} render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加文章' ref={node => { this.addModal = node; }} tableList={() => this.tableList}>
          <ArticleAdd  sectionId={this.props.defaultParam.sectionId}/>
        </ModalInfo>
        <ModalInfo title='编辑文章' ref={node => { this.editModal = node; }} tableList={() => this.tableList}>
          <ArticleEdit />
        </ModalInfo>
        <ModalInfo title='发布' ref={node => { this.publishModal = node; }} tableList={() => this.tableList}>
          <ArticlePublish />
        </ModalInfo>
        <ModalInfo title='展示' ref={node => { this.showModal = node; }} tableList={() => this.tableList}>
          <ArticleShow />
        </ModalInfo>
        <ModalInfo title='置顶' ref={node => { this.topModal = node; }} tableList={() => this.tableList}>
          <ArticleTop />
        </ModalInfo>
        <ModalInfo title='顺序' ref={node => { this.sortModal = node; }} tableList={() => this.tableList}>
          <ArticleSort />
        </ModalInfo>
      </>
    );
  }
}
