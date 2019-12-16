import React, { Component } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import ModalInfo from '@/common/components/Modal';
import TableList, { Search, Table, Action } from '@/common/components/TableList';
import request from '@/common/utils/request'
import Permission from '@/common/components/Permission';
import DictUtils from '@/common/utils/dict';

import CategoryAdd from './CategoryAdd';
import CategoryEdit from './CategoryEdit';
import CategorySort from './CategorySort';

export default class CategoryList extends Component {

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
        <Permission authority="category:add">
          <a onClick={() => this.refs.addModal.show(record)}>添加下级</a>
        </Permission>
        <Permission authority="category:modify">
          <a onClick={() => this.refs.editModal.show(record)}>修改</a>
        </Permission>
        <Permission authority="category:modify">
          <a onClick={() => this.refs.sortModal.show(record)}>设置顺序</a>
        </Permission>
        <Permission authority="category:delete">
          <a onClick={() => this.delete(record)}>删除</a>
        </Permission>
      </>
    );
  }
  renderPublishStatus = (text, record, index) => {
    return text == 1 ? '已发布' : '未发布';
  }
  renderShowStatus = (text, record, index) => {
    return text == 1 ? '显示' : '隐藏';
  }
  renderPosition = (text, record, index) => {
    return DictUtils.name('category:position', text);
  }
  renderReqType = (text, record, index) => {
    return DictUtils.name('category:reqType', text);
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
          request.delete("/category/delete", { data: selectRecrods.map(item => item.id) }).then(res => {
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
        <TableList ref='tableList'>
          <Action>
            <Permission authority="category:add">
              <Button type="primary" icon="plus" onClick={() => this.refs.addModal.show()}>添加</Button>
            </Permission>
            <Permission authority="category:delete">
              <Button type="primary" icon="delete" onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/category/tree' pagination={false} defaultParam={this.defaultParam}>
            <Table.Column title="分类名称" dataIndex="name" />
            <Table.Column title="编码" dataIndex="code" />
            <Table.Column title="位置" dataIndex="position" render={this.renderPosition} />
            <Table.Column title="跳转类型" dataIndex="reqType" render={this.renderReqType} />
            <Table.Column title="发布状态" dataIndex="publishStatus" render={this.renderPublishStatus} />
            <Table.Column title="页面展示状态" dataIndex="showStatus" render={this.renderShowStatus} />
            <Table.Column title="序号" dataIndex="sort" />
            <Table.Action render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加分类' ref="addModal" {...this.refs}>
          <CategoryAdd />
        </ModalInfo>
        <ModalInfo title='编辑分类' ref="editModal" {...this.refs}>
          <CategoryEdit />
        </ModalInfo>
        <ModalInfo title='设置顺序' ref="sortModal" {...this.refs}>
          <CategorySort />
        </ModalInfo>
      </GridContent >
    );
  }
}
