import React, { Component } from 'react';
import { message } from 'antd';
import { GridContent } from '@ant-design/pro-components';
import TableList, { Table } from '@/common/components/TableList';
import request from '@/common/utils/request'


export default class UserRoleList extends Component {
  constructor(props){
    super(props)
    request.get("/sys/users/" + this.props.currentRecord.id + '/roles').then((response) => {
      this.tableList.initSelect(response);
    })
  }

  onOk(modal) {
    const tableSelect = this.tableList.currentSelectRows();
    const data = tableSelect.map(item => {
      return {
        roleId: item.id
      }
    });
    request.put(`/sys/users/${this.props.currentRecord.id}/roles/choose`,  { data: { list: data } }).then(res => {
      //提交成功
      message.success('保存成功');
      modal.hideAndRefresh();
    });

  }
  render() {
    return (
      <GridContent>
        <TableList ref={node => { this.tableList = node; }}>
          <Table url='/sys/roles'>
            <Table.Column title="角色名称" dataIndex="name" />
            <Table.Column title="创建时间" dataIndex="createDate" />
          </Table>
        </TableList >
      </GridContent >
    );
  }
}
