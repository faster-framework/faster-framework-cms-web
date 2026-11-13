import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Input } from 'antd';
import { describe, expect, test } from 'vitest';
import Form from '@/common/components/Form';

function Demo(props) {
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <Form.Item label="标题">
        {getFieldDecorator('title', {
          rules: [{ required: true, message: '请填写标题' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="顺序">
        {getFieldDecorator('sort', { initialValue: 3 })(<Input />)}
      </Form.Item>
      <button
        type="button"
        onClick={() =>
          props.form.validateFields((err, values) => {
            props.onResult(err, values);
          })
        }
      >
        提交
      </button>
    </Form>
  );
}

const Wrapped = Form.create()(Demo);

describe('antd 3 Form 兼容层', () => {
  test('保留 Form(Component) displayName，TableList 依赖该标记', () => {
    expect(Wrapped.displayName).toBe('Form(Demo)');
  });

  test('getFieldDecorator / initialValue / validateFields(callback) 正常工作', async () => {
    let result;
    render(<Wrapped onResult={(err, values) => (result = { err, values })} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '升级测试' } });
    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => expect(result).toBeTruthy());
    expect(result.err).toBeFalsy();
    expect(result.values.title).toBe('升级测试');
    expect(result.values.sort).toBe(3);
  });

  test('必填校验失败时回调 err，并渲染错误信息', async () => {
    let result;
    render(<Wrapped onResult={(err, values) => (result = { err, values })} />);

    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => expect(result && result.err).toBeTruthy());
    expect(await screen.findByText('请填写标题')).toBeTruthy();
  });
});
