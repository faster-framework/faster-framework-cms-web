import React, { Component } from 'react';
import { Input, Form, message, Radio } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';

class SectionShow extends Component {
  constructor(props) {
    super(props)
    request.get('/section/' + this.props.currentRecord.id).then(res => {
      this.props.form.setFieldsValue(res);
    });
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.put('/section/' + this.props.currentRecord.id, { data: values }).then(res => {
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
          <Form.Item label="是否展示">
            {
              getFieldDecorator("showStatus", { rules: [{ required: true, message: "请选择展示状态" }] })
                (
                  <Radio.Group>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                )
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(SectionShow);
