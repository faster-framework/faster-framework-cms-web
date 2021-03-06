import React, { Component } from 'react';
import { Input, Form, message } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';

class RoleEdit extends Component {
  constructor(props) {
    super(props)
    request.get('/sys/roles/' + this.props.currentRecord.id).then(res => {
      this.props.form.setFieldsValue(res);
    });
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.put('/sys/roles/' + this.props.currentRecord.id,  { data: values }).then(res => {
        //提交成功
        message.success('修改成功');
        modal.hideAndRefresh();
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FixedRow>
          <Form.Item label="角色名称">
            {
              getFieldDecorator("name", { rules: [{ required: true, message: "请填写角色名称" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
      </Form>
    );
  }
}
export default Form.create()(RoleEdit);
