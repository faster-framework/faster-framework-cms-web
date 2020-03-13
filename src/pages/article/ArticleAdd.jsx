import React, { Component } from 'react';
import { Input, Form, message, Radio, InputNumber } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';
import UploadImg from '@/common/components/UploadImg';
import Upload from '@/common/components/Upload';
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
              getFieldDecorator("img")(<UploadImg />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow upload>
          <Form.Item label="资源文件">
            {
              getFieldDecorator("resourceUrl", {})(<Upload />)
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
              getFieldDecorator("code")(<Input />)
            }
          </Form.Item>
          <Form.Item label="顺序">
            {
              getFieldDecorator("sort", { initialValue: 0 })(<InputNumber />)
            }
          </Form.Item>
          <Form.Item label="是否发布">
            {
              getFieldDecorator("publishStatus", { initialValue: 1, rules: [{ required: true, message: "请设置发布状态" }] })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="是否展示">
            {
              getFieldDecorator("showStatus", { initialValue: 1, rules: [{ required: true, message: "请设置展示状态" }] })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="是否置顶">
            {
              getFieldDecorator("topStatus", { initialValue: 0, rules: [{ required: true, message: "请设置置顶状态" }] })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
        </FixedRow>
        <FixedRow full>
          <Form.Item label="描述">
            {
              getFieldDecorator("description")(<Input.TextArea rows={4} />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow editor>
          <Form.Item label="文章内容">
            {
              getFieldDecorator("content", { rules: [{ message: "请填写文章内容" }] })(<Editor />)
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(ArticleAdd);
