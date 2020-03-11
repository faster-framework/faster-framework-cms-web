import React, { Component } from 'react';
import { Input, Form, message, Radio, InputNumber } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';
import UploadImg from '@/common/components/UploadImg';
import Editor from '@/common/components/BraftEditor';

class ArticleAdd extends Component {
  constructor(props) {
    super(props)
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      values.sectionId = this.props.sectionId;
      values.publishStatus = 0;
      request.post('/article', { data: values }).then(res => {
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
          <Form.Item label="封面图片">
            {
              getFieldDecorator("img", {})(<UploadImg />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow full>
          <Form.Item label="标题">
            {
              getFieldDecorator("title", { rules: [{ required: true, message: "请填写标题" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="编码">
            {
              getFieldDecorator("code", {})(<InputNumber />)
            }
          </Form.Item>
          <Form.Item label="顺序">
            {
              getFieldDecorator("sort", {})(<InputNumber />)
            }
          </Form.Item>
          <Form.Item label="发布状态">
            {
              getFieldDecorator("publishStatus", { rules: [{ required: true, message: "请设置发布状态" }] })(
                <Radio.Group>
                  <Radio value={0}>未发布</Radio>
                  <Radio value={1}>发布</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
        </FixedRow>
        <FixedRow full>
          <Form.Item label="描述">
            {
              getFieldDecorator("description", {})(<Input.TextArea rows={4} />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow editor>
          <Form.Item label="文章内容">
            {
              getFieldDecorator("content", { rules: [{ required: true, message: "请填写文章内容" }] })(<Editor />)
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(ArticleAdd);
