import React, { Component } from 'react';
import { Table } from 'antd';
import request from '@/common/utils/request';
import Action from './Action';
import styles from './index.less';

// antd 5 移除了 Table.Column 的渲染能力，保留同名标记组件，由 TablePro 转为 columns 配置。
const Column = () => null;
Column.displayName = 'TableColumn';
const ColumnGroup = () => null;
ColumnGroup.displayName = 'TableColumnGroup';


export default class TablePro extends Component {
  static Column = Column;
  static ColumnGroup = ColumnGroup;
  static Action = Action;
  state = {
    selectedRowKeys: [],
    data: [],
    flatData: [],
    pagination: {
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100', '200']
    },
    lastFilter: {

    },
    total: 0,
    pageSize: 10,
    current: 0
  }
  constructor(props) {
    super(props)
  }
  currentClickRow = () => {
    return this.state.currentClickRow;
  }
  currentSelectRows = () => {
    const selectRows = this.state.flatData.filter(item => this.state.selectedRowKeys.indexOf(item.id) > -1);
    return selectRows;
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    if (pager.pageSize != pagination.pageSize) {
      pager.current = 1;
    }
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    this.loadData({
      ...this.state.lastFilter,
      current: pager.current,
      size: pager.pageSize,
    });
  };
  reload() {
    this.setState({
      pagination: Object.assign({}, this.state.pagination, { current: 1 })
    });
    this.loadData({
      current: 1,
      size: this.state.pagination.pageSize
    });
  }
  loadData(param) {
    let filter = Object.assign({}, this.props.defaultParam, param);
    filter = Object.assign({}, {
      current: this.state.pagination.current,
      size: this.state.pagination.pageSize
    }, filter);
    this.setState({
      lastFilter: filter
    });
    request.get(this.props.url, { params: filter }).then(res => {
      let data;
      if (this.props.pagination == false) {
        this.setState({
          data: res
        })
        data = res;
      } else {
        const pagination = { ...this.state.pagination };
        pagination.total = res.total;
        this.setState({
          data: res.records,
          pagination: pagination
        })
        data = res.records;
      }
      let result = [];
      if (data && data.length > 0) {
        data.forEach(item => {
          result.push(item);
          if (item.children) {
            this.recursiveChildren(result, item);
          }
        })
      }
      this.setState({ flatData: result });

    })
  }


  componentDidMount() {
    this.loadData({});
    this.props.onRef('table', this)
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  recursiveChildren = (allChildren, record) => {
    if (record.children && record.children.length > 0) {
      record.children.forEach(item => {
        allChildren.push(item);
        this.recursiveChildren(allChildren, item);
      })
    }
  }
  onSelect = (record, selected, selectedRows, nativeEvent) => {
    //如果没有子集
    if (!record.children || record.children == undefined || record.children.length == 0) {
      //结束
      this.setState({
        selectedRowKeys: selectedRows.map(item => item.id)
      });
      return;
    }
    //如果存在子集,则获取该子集下所有的记录
    let allChildren = [];
    this.recursiveChildren(allChildren, record);
    //选中，加入到当前集合中
    if (selected) {
      allChildren.forEach(item => {
        selectedRows.push(item);
      })
      this.setState({
        selectedRowKeys: selectedRows.map(item => item.id)
      });
    } else {
      //取消选中，从当前集合中删除
      selectedRows = selectedRows.filter(item => {
        return allChildren.findIndex(children => item.id == children.id) == -1;
      });
      this.setState({
        selectedRowKeys: selectedRows.map(item => item.id)
      });
    }
  }
  onSelectAll = (selected, selectedRows, changeRows) => {

    this.setState({
      selectedRowKeys: selectedRows.map(item => item.id)
    });
  }
  onSelectInvert = (selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRows.map(item => item.id)
    });
  }
  initSelect = (values) => {
    this.setState({
      selectedRowKeys: values
    });
  }
  render() {
    const { children, url, defaultParam, onRef, ...tableProps } = this.props;
    const columns = [];
    React.Children.forEach(children, item => {
      if (!React.isValidElement(item) || !item.type) {
        return;
      }
      if (item.type === Column || item.type === ColumnGroup) {
        columns.push({
          ...item.props,
          key: item.key || item.props.dataIndex || item.props.title,
        });
      } else if (item.type.displayName === 'ColumnAction') {
        columns.push({
          ...item.props,
          title: '操作',
          key: 'col-action',
          className: [styles.tableAction, item.props.className].filter(Boolean).join(' '),
        });
      }
    });
    return (
      <Table
        key={`table-${this.state.data && this.state.data.length}`}
        dataSource={this.state.data}
        columns={columns}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        bordered={true}
        rowSelection={{
          selectedRowKeys: this.state.selectedRowKeys,
          onSelect: this.onSelect,
          onSelectAll: this.onSelectAll,
          onSelectInvert: this.onSelectInvert,
        }}
        rowKey="id"
        {...tableProps}
      />
    );
  }
}
