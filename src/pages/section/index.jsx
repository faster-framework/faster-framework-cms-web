import React, { Component } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { RedoOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import ModalInfo from '@/common/components/Modal';
import TableList, { Search, Table, Action } from '@/common/components/TableList';
import request from '@/common/utils/request'
import Permission from '@/common/components/Permission';
import DictUtils from '@/common/utils/dict';

import SectionAdd from './SectionAdd';
import SectionEdit from './SectionEdit';
import SectionSort from './SectionSort';
import SectionPublish from './SectionPublish';
import SectionShow from './SectionShow';
import SectionTop from './SectionTop';

export default class SectionList extends Component {

  constructor(props) {
    super(props);
    // 默认筛选参数，key与下方筛选条件内的name相对应
    this.defaultParam = {
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
        <Permission authority="section:add">
          <a onClick={() => this.addModal.show(record)}>添加下级</a>
        </Permission>
        <Permission authority="section:modify">
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
        <Permission authority="section:modify">
          <a onClick={() => this.sortModal.show(record)}>顺序</a>
        </Permission>
        <Permission authority="section:delete">
          <a onClick={() => this.delete(record)}>删除</a>
        </Permission>
      </>
    );
  }
  renderStatus = (text, record, index) => {
    return text == 1 ? '是' : '否';
  }
  renderTemplateType = (text, record, index) => {
    return text == 1 ? '普通' : '分页';
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
          request.delete("/section/delete", { data: selectRecrods.map(item => item.id) }).then(res => {
            resolve();
            tableList.reload();
          }).catch(() => reject());
        });
      }
    });
  }
  render() {
    return (
      <GridContent>
        <TableList ref={node => { this.tableList = node; }}>
          <Action>
            <Permission authority="section:list">
              <Button type="primary" icon={<RedoOutlined />} onClick={() => this.tableList.reload()}>刷新</Button>
            </Permission>
            <Permission authority="section:add">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => this.addModal.show()}>添加</Button>
            </Permission>
            <Permission authority="section:delete">
              <Button type="primary" icon={<DeleteOutlined />} onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/section/tree' pagination={false} defaultParam={this.defaultParam} scroll={{ x: 1250 }}>
            <Table.Column width={250} ellipsis title="栏目名称" dataIndex="name" />
            <Table.Column width={150} title="编码" dataIndex="code" />
            <Table.Column width={100} title="模板类型" dataIndex="templateType" render={this.renderTemplateType} />
            <Table.Column width={80} title="发布" dataIndex="publishStatus" render={this.renderStatus} />
            <Table.Column width={80} title="展示" dataIndex="showStatus" render={this.renderStatus} />
            <Table.Column width={80} title="置顶" dataIndex="topStatus" render={this.renderStatus} />
            <Table.Column width={80} title="序号" dataIndex="sort" />
            <Table.Action width={350}  render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加栏目' ref={node => { this.addModal = node; }} tableList={() => this.tableList}>
          <SectionAdd />
        </ModalInfo>
        <ModalInfo title='编辑栏目' ref={node => { this.editModal = node; }} tableList={() => this.tableList}>
          <SectionEdit />
        </ModalInfo>
        <ModalInfo title='设置顺序' ref={node => { this.sortModal = node; }} tableList={() => this.tableList}>
          <SectionSort />
        </ModalInfo>
        <ModalInfo title='发布' ref={node => { this.publishModal = node; }} tableList={() => this.tableList}>
          <SectionPublish />
        </ModalInfo>
        <ModalInfo title='展示' ref={node => { this.showModal = node; }} tableList={() => this.tableList}>
          <SectionShow />
        </ModalInfo>
        <ModalInfo title='置顶' ref={node => { this.topModal = node; }} tableList={() => this.tableList}>
          <SectionTop />
        </ModalInfo>
      </GridContent >
    );
  }
}
