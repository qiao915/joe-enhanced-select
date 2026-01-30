// JSX 兼容性测试文件
// 验证 JoeEnhancedSelect 在 JSX 环境中的兼容性

// 由于我们使用 TypeScript 编写，我们需要创建一个 .tsx 文件
// 但在实际使用中，这个组件可以被 .jsx 文件使用

import React from 'react';
import JoeEnhancedSelect from '../components/JoeEnhancedSelect';
import type { Option } from '../types';

// 模拟在纯 JSX 环境中使用
const JSXComponent = () => {
  const [value, setValue] = React.useState(null);
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  return (
    <div>
      <h3>JSX 兼容性测试</h3>
      <JoeEnhancedSelect
        options={options}
        value={value}
        onChange={setValue}
        placeholder="JSX 测试"
      />
    </div>
  );
};

export default JSXComponent;