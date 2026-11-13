import React from 'react';
import { Form as AntdForm } from 'antd';

/**
 * antd 3 -> antd 5 兼容层。
 *
 * 目的：在升级底层依赖的同时，尽量保留原有页面里
 * `Form.create()` / `this.props.form.getFieldDecorator()` / `validateFields(callback)`
 * 的写法，避免大面积重写表单结构。
 *
 * 实现方式：
 * - `Form.create()` 返回一个 HOC，为被包裹组件注入带兼容方法的 form 实例；
 * - `Form.Item` 识别 `getFieldDecorator()` 产生的描述对象，转换为 antd 5 的
 *   `<Form.Item name rules initialValue>`；
 * - `validateFields(callback)` 适配为 antd 5 的 Promise API。
 */

const LegacyFormContext = React.createContext(null);

const FIELD_FLAG = '__legacyField__';

export function getFieldDecorator(name, options = {}) {
  return node => ({
    [FIELD_FLAG]: true,
    name,
    options,
    node,
  });
}

function isFieldDescriptor(node) {
  return !!node && typeof node === 'object' && node[FIELD_FLAG] === true;
}

export function LegacyFormItem({ children, ...rest }) {
  const buildItemProps = descriptor => {
    const { name, options } = descriptor;
    const itemProps = { ...rest, name };

    if (options.rules) {
      itemProps.rules = options.rules;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'initialValue')) {
      itemProps.initialValue = options.initialValue;
    }
    if (options.normalize) {
      itemProps.normalize = options.normalize;
    }
    if (options.validateTrigger) {
      itemProps.validateTrigger = options.validateTrigger;
    }
    if (options.valuePropName) {
      itemProps.valuePropName = options.valuePropName;
    }
    return itemProps;
  };

  if (isFieldDescriptor(children)) {
    return <AntdForm.Item {...buildItemProps(children)}>{children.node}</AntdForm.Item>;
  }

  // 兼容原来的“Form.Item 内同时放字段和额外内容”的写法（例如登录验证码输入框 + 图片）
  if (Array.isArray(children)) {
    const descriptor = children.find(isFieldDescriptor);
    if (!descriptor) {
      return <AntdForm.Item {...rest}>{children}</AntdForm.Item>;
    }
    const extraChildren = children.filter(child => child !== descriptor);
    if (extraChildren.length === 0) {
      return <AntdForm.Item {...buildItemProps(descriptor)}>{descriptor.node}</AntdForm.Item>;
    }
    return (
      <AntdForm.Item {...rest}>
        <AntdForm.Item {...buildItemProps(descriptor)} noStyle>
          {descriptor.node}
        </AntdForm.Item>
        {extraChildren}
      </AntdForm.Item>
    );
  }

  return <AntdForm.Item {...rest}>{children}</AntdForm.Item>;
}

function createLegacyForm(form) {
  const methodCache = new Map();

  const validateFields = (fieldsOrCallback, maybeCallback) => {
    const callback =
      typeof fieldsOrCallback === 'function' ? fieldsOrCallback : maybeCallback;
    const fields = typeof fieldsOrCallback === 'function' ? undefined : fieldsOrCallback;
    const promise = form.validateFields(fields);

    if (!callback) {
      return promise;
    }

    // antd 3 的调用方只关心 err 是否存在，不需要返回 Promise
    promise.then(values => callback(null, values)).catch(error => callback(error));
    return undefined;
  };

  return new Proxy(form, {
    get(target, prop) {
      if (prop === 'getFieldDecorator') {
        return getFieldDecorator;
      }
      if (prop === 'validateFields') {
        return validateFields;
      }
      const value = target[prop];
      if (typeof value === 'function') {
        if (!methodCache.has(prop)) {
          methodCache.set(prop, value.bind(target));
        }
        return methodCache.get(prop);
      }
      return value;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });
}

export function withLegacyForm(WrappedComponent) {
  const canUseRef = !!(
    WrappedComponent &&
    WrappedComponent.prototype &&
    WrappedComponent.prototype.isReactComponent
  );
  const LegacyFormWrapper = React.forwardRef((props, ref) => {
    const [form] = AntdForm.useForm();
    const instanceRef = React.useRef(null);
    const { wrappedComponentRef, ...restProps } = props;

    React.useImperativeHandle(ref, () => instanceRef.current, []);

    const legacyForm = React.useMemo(() => createLegacyForm(form), [form]);

    const handleRef = React.useCallback(
      instance => {
        instanceRef.current = instance;
        if (typeof wrappedComponentRef === 'function') {
          wrappedComponentRef(instance);
        }
      },
      [wrappedComponentRef],
    );

    return (
      <LegacyFormContext.Provider value={form}>
        {canUseRef ? (
          <WrappedComponent {...restProps} ref={handleRef} form={legacyForm} />
        ) : (
          <WrappedComponent {...restProps} form={legacyForm} />
        )}
      </LegacyFormContext.Provider>
    );
  });

  LegacyFormWrapper.displayName = `Form(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return LegacyFormWrapper;
}

function LegacyForm(props) {
  const form = React.useContext(LegacyFormContext);
  return <AntdForm {...(form ? { form } : {})} {...props} />;
}

LegacyForm.Item = LegacyFormItem;
LegacyForm.List = AntdForm.List;
LegacyForm.ErrorList = AntdForm.ErrorList;
LegacyForm.Provider = AntdForm.Provider;
LegacyForm.useForm = AntdForm.useForm;
LegacyForm.useWatch = AntdForm.useWatch;
LegacyForm.useFormInstance = AntdForm.useFormInstance;
LegacyForm.create = () => WrappedComponent => withLegacyForm(WrappedComponent);

export default LegacyForm;
