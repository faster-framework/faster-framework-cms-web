import React, { Component } from 'react';
import { Input, message } from 'antd';
import Form from '@/common/components/Form';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';

class UserPwdModify extends Component {
  constructor(props) {
    super(props)
  }
  checkPwd = (rule, value) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('两次输入密码不一致！'));
    }
    return Promise.resolve();
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.put(`/sys/users/${this.props.currentRecord.id}/password/change`,{ data: values }).then(res => {
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
          <Form.Item label="密码">
            {
              getFieldDecorator("oldPwd", { rules: [{ required: true, message: "请填写密码" }] })(<Input type="password" />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="新密码">
            {
              getFieldDecorator("password", { rules: [{ required: true, message: "请填写新密码" }] })(<Input type="password" />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="确认密码">
            {
              getFieldDecorator("confimPwd", {
                rules: [{ required: true, message: "请确认密码" }, {
                  validator: this.checkPwd,
                }]
              })(<Input type="password" />)
            }
          </Form.Item>
        </FixedRow>
      </Form>
    );

  }
}
export default Form.create()(UserPwdModify);
