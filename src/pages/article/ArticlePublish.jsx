import React, { Component } from 'react';
import { Input, Form, message, Radio } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';

class ArticlePublish extends Component {
  constructor(props) {
    super(props)
    request.get('/article/' + this.props.currentRecord.id).then(res => {
      this.props.form.setFieldsValue(res);
    });
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.put('/article/' + this.props.currentRecord.id, { data: values }).then(res => {
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
          <Form.Item label="发布状态">
            {
              getFieldDecorator("publishStatus", { rules: [{ required: true, message: "请选择发布状态" }] })
                (
                  <Radio.Group>
                    <Radio value={0}>未发布</Radio>
                    <Radio value={1}>发布</Radio>
                  </Radio.Group>
                )
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(ArticlePublish);
