import React, { Component } from 'react';
import { Input, Form, message, Select, Radio, InputNumber } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';
import UploadImg from '@/common/components/UploadImg';
import Editor from '@/common/components/BraftEditor';
import DictUtils from '@/common/utils/dict';

class CategoryEdit extends Component {
  constructor(props) {
    super(props)
    request.get('/category/' + this.props.currentRecord.id).then(res => {
      this.props.form.setFieldsValue(res);
    });
  }

  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      if (values.reqType == 'list') {
        values.templatePath = 'article/list.ftl';
      } else if (values.reqType == 'editor') {
        values.templatePath = 'category/content.ftl';
      }
      request.put('/category/' + this.props.currentRecord.id, { data: values }).then(res => {
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
          <Form.Item label="分类名称">
            {
              getFieldDecorator("name", { rules: [{ required: true, message: "请填写名称" }] })(<Input />)
            }
          </Form.Item>
          <Form.Item label="编码">
            {
              getFieldDecorator("code", { rules: [{ required: true, message: "请填写编码" }] })(<Input />)
            }
          </Form.Item>
        </FixedRow>

        <FixedRow>
          <Form.Item label="位置">
            {
              getFieldDecorator("position", { rules: [{ required: true, message: "请选择位置" }] })(
                <Select placeholder="请选择">
                  {
                    DictUtils.listByType("category:position").map(item => {
                      return (
                        <Select.Option value={item.dictValue}>{item.name}</Select.Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="跳转类型">
            {
              getFieldDecorator("reqType", { rules: [{ required: true, message: "请选择跳转类型" }] })(
                <Select placeholder="请选择">
                  {
                    DictUtils.listByType("category:reqType").map(item => {
                      return (
                        <Select.Option value={item.dictValue}>{item.name}</Select.Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
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
          <Form.Item label="页面展示状态">
            {
              getFieldDecorator("showStatus", { rules: [{ required: true, message: "请设置展示状态" }] })(
                <Radio.Group>
                  <Radio value={0}>隐藏</Radio>
                  <Radio value={1}>显示</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
        </FixedRow>
        <FixedRow upload>
          <Form.Item label="封面图片">
            {
              getFieldDecorator("img", {})(<UploadImg />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow full>
          <Form.Item label="描述">
            {
              getFieldDecorator("description", {})(<Input.TextArea rows={4} placeholder="可选参数" />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="顺序">
            {
              getFieldDecorator("sort", {})(<InputNumber />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow full>
          <Form.Item label="内容模板地址">
            {
              getFieldDecorator("contentTemplatePath", {})(<Input placeholder="可选参数" />)
            }
          </Form.Item>
        </FixedRow>
        {
          this.props.form.getFieldValue("reqType") == 'template' ?
            <FixedRow full>
              <Form.Item label="模板地址">
                {
                  getFieldDecorator("templatePath", {})(<Input />)
                }
              </Form.Item>
            </FixedRow>
            : ''
        }
        <FixedRow full>
          <Form.Item label="跳转链接">
            {
              getFieldDecorator("reqLocation", { rules: [{}] })(<Input />)
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(CategoryEdit);
