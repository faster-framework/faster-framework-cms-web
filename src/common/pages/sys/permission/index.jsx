import React, { Component } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { RedoOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import ModalInfo from '@/common/components/Modal';
import TableList, { Search, Table, Action } from '@/common/components/TableList';
import request from '@/common/utils/request'
import Permission from '@/common/components/Permission';
import PermissionAdd from './PermissionAdd';
import PermissionEdit from './PermissionEdit';


export default class UserList extends Component {
  /**
   * 渲染操作列
   * text: 当前行的值
   * record: 当前行数据
   * index: 行索引
   */
  renderColAction = (text, record, index) => {
    return (
      <>
        <Permission authority="permissions:modify">
          <a onClick={() => this.editModal.show(record)}>修改</a>
        </Permission>
        <Permission authority="permissions:delete">
          <a onClick={() => this.delete(record)}>删除</a>
        </Permission>
      </>
    );
  }
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
          request.delete("/sys/permissions/delete", { data: selectRecrods.map(item => item.id) }).then(res => {
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
          <Permission authority="permissions:list">
              <Button type="primary" icon={<RedoOutlined />} onClick={() => this.tableList.reload()}>刷新</Button>
            </Permission>
            <Permission authority="permissions:add">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => this.addModal.show()}>添加</Button>
            </Permission>
            <Permission authority="permissions:delete">
              <Button type="primary" icon={<DeleteOutlined />} onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/sys/permissions/tree' pagination={false}>
            <Table.Column title="权限名称" dataIndex="name" />
            <Table.Column title="权限编码" dataIndex="code" />
            <Table.Column title="创建时间" dataIndex="createDate" />
            <Table.Action render={this.renderColAction}></Table.Action>
          </Table>
        </TableList >
        <ModalInfo title='添加权限' ref={node => { this.addModal = node; }} tableList={() => this.tableList}>
          <PermissionAdd />
        </ModalInfo>
        <ModalInfo title='编辑权限' ref={node => { this.editModal = node; }} tableList={() => this.tableList}>
          <PermissionEdit />
        </ModalInfo>
      </GridContent >
    );
  }
}
