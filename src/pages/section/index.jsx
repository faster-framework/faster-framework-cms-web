import React, { Component } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
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
          <a onClick={() => this.refs.addModal.show(record)}>添加下级</a>
        </Permission>
        <Permission authority="section:modify">
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
        <Permission authority="section:modify">
          <a onClick={() => this.refs.sortModal.show(record)}>顺序</a>
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
        <TableList ref='tableList'>
          <Action>
            <Permission authority="section:list">
              <Button type="primary" icon="redo" onClick={() => this.refs.tableList.reload()}>刷新</Button>
            </Permission>
            <Permission authority="section:add">
              <Button type="primary" icon="plus" onClick={() => this.refs.addModal.show()}>添加</Button>
            </Permission>
            <Permission authority="section:delete">
              <Button type="primary" icon="delete" onClick={() => this.delete()}>删除</Button>
            </Permission>
          </Action>
          <Table url='/section/tree' pagination={false} defaultParam={this.defaultParam}>
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
        <ModalInfo title='添加栏目' ref="addModal" {...this.refs}>
          <SectionAdd />
        </ModalInfo>
        <ModalInfo title='编辑栏目' ref="editModal" {...this.refs}>
          <SectionEdit />
        </ModalInfo>
        <ModalInfo title='设置顺序' ref="sortModal" {...this.refs}>
          <SectionSort />
        </ModalInfo>
        <ModalInfo title='发布' ref="publishModal" {...this.refs}>
          <SectionPublish />
        </ModalInfo>
        <ModalInfo title='展示' ref="showModal" {...this.refs}>
          <SectionShow />
        </ModalInfo>
        <ModalInfo title='置顶' ref="topModal" {...this.refs}>
          <SectionTop />
        </ModalInfo>
      </GridContent >
    );
  }
}
