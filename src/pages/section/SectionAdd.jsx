import React, { Component } from 'react';
import { Input, Form, message, Select, Radio, TreeSelect, InputNumber } from 'antd';
import FixedRow from '@/common/components/FixedRow';
import request from '@/common/utils/request';
import UploadImg from '@/common/components/UploadImg';
import Upload from '@/common/components/Upload';
import Editor from '@/common/components/BraftEditor';
import TreeUtils from '@/common/utils/treeUtils';
import DictUtils from '@/common/utils/dict';

class SectionAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sectionTrees: []
    }

  }
  componentDidMount() {
    request.get('/section').then((response) => {
      this.setState({
        sectionTrees: [{
          value: '0',
          title: '站点',
          children: TreeUtils.convertTreeSelectData(response)
        }]
      });
      let parentId = 0;
      if (this.props.currentRecord != undefined && this.props.currentRecord.id != undefined) {
        parentId = this.props.currentRecord.id;
      }
      const parent = response.find(item => {
        return item.id == parentId;
      });
      this.props.form.setFieldsValue({ "parentId": parentId, "code": parent ? parent.code + "-" : "" });
    });
  }
  onOk(modal) {
    this.props.form.validateFields((err, values) => {
      if (!!err) {
        return;
      };
      request.post('/section', { data: values }).then(res => {
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
        <FixedRow upload>
          <Form.Item label="图片">
            {
              getFieldDecorator("img", {})(<UploadImg />)
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
        <FixedRow>
          <Form.Item label="父级栏目">
            {
              getFieldDecorator("parentId", { rules: [{ required: true, message: "请选择父级栏目" }] })(<TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={this.state.sectionTrees}
              />)
            }
          </Form.Item>
          <Form.Item label="栏目名称">
            {
              getFieldDecorator("name", { rules: [{ required: true, message: "请填写名称" }] })(<Input />)
            }
          </Form.Item>
          <Form.Item label="编码">
            {
              getFieldDecorator("code", { rules: [{ required: true, message: "请填写编码" }] })(<Input />)
            }
          </Form.Item>
          <Form.Item label="顺序">
            {
              getFieldDecorator("sort")(<InputNumber />)
            }
          </Form.Item>
        </FixedRow>
        <FixedRow>
          <Form.Item label="模板类型">
            {
              getFieldDecorator("templateType", { initialValue: 1, rules: [{ required: true, message: "请选择模板类型" }] })(
                <Select placeholder="请选择">
                  <Select.Option value={1}>普通</Select.Option>
                  <Select.Option value={2}>分页</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="栏目模板">
            {
              getFieldDecorator("templatePath")(
                <Select placeholder="请选择">
                  {
                    DictUtils.listByType("section-template").map(item => {
                      return (
                        <Select.Option value={item.dictValue}>{item.name}</Select.Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="跳转链接">
            {
              getFieldDecorator("link")(<Input />)
            }
          </Form.Item>
          <Form.Item label="文章模板">
            {
              getFieldDecorator("articleTemplatePath")(
                <Select placeholder="请选择">
                {
                  DictUtils.listByType("article-template").map(item => {
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
          <Form.Item label="富文本内容">
            {
              getFieldDecorator("content")(<Editor />)
            }
          </Form.Item>
        </FixedRow>
      </Form >
    );
  }
}
export default Form.create()(SectionAdd);
