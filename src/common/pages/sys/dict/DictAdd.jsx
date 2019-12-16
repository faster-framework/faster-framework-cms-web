import React, { Component } from 'react';
import { Input, Form, message,InputNumber } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';

class DictAdd extends Component {
  constructor(props) {
    super(props)
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.post('/sys/dict', { data: values }).then(res => {
        //提交成功
        message.success('保存成功');
        modal.hideAndRefresh();
      });

    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FixedRow>
          <Form.Item label="字典名称">
            {
              getFieldDecorator("name", { rules: [{ required: true, message: "请填写字典名称" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="字典值">
            {
              getFieldDecorator("dictValue", { rules: [{ required: true, message: "请填写字典值" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="字典类型">
            {
              getFieldDecorator("type", { rules: [{ required: true, message: "请填写字典类型" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="描述">
            {
              getFieldDecorator("remark", { rules: [{}] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="顺序">
            {
              getFieldDecorator("sort", { })(<InputNumber />)
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(DictAdd);
