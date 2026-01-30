// 测试组件在不同环境中的兼容性
// 这个文件用于验证JoeEnhancedSelect组件在函数组件和类组件中都能正常使用

import React from 'react';
import JoeEnhancedSelect from '../components/JoeEnhancedSelect';
import type { Option } from '../types';

// 定义类组件接口
interface ClassTestProps {}

// 测试选项
const testOptions: Option[] = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2' },
  { value: 'option3', label: '选项 3' },
];

// 模拟异步加载选项
const mockLoadOptions = (query: string) => {
  return new Promise<Option[]>((resolve) => {
    setTimeout(() => {
      const filteredOptions = testOptions.filter(option =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredOptions);
    }, 300);
  });
};

// 1. 函数组件测试 - 静态选项
const FunctionalStaticTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  return (
    <div>
      <h3>函数组件 - 静态选项</h3>
      <JoeEnhancedSelect
        options={testOptions}
        value={value}
        onChange={setValue}
        placeholder="请选择"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 2. 函数组件测试 - 多选
const FunctionalMultiTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>([]);

  return (
    <div>
      <h3>函数组件 - 多选</h3>
      <JoeEnhancedSelect
        options={testOptions}
        value={value}
        onChange={setValue}
        multiple
        placeholder="请选择多个"
      />
      <p>当前值: {Array.isArray(value) ? (value as (string | number)[]).join(', ') : value?.toString() || '无'}</p>
    </div>
  );
};

// 3. 函数组件测试 - 异步加载
const FunctionalAsyncTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  return (
    <div>
      <h3>函数组件 - 异步加载</h3>
      <JoeEnhancedSelect
        loadOptions={mockLoadOptions}
        value={value}
        onChange={setValue}
        placeholder="搜索选项"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 4. 函数组件测试 - 同步函数
const FunctionalSyncTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  return (
    <div>
      <h3>函数组件 - 同步函数</h3>
      <JoeEnhancedSelect
        loadOptions={(query: string) => {
          return testOptions.filter(option =>
            option.label.toLowerCase().includes(query.toLowerCase())
          );
        }}
        value={value}
        onChange={setValue}
        placeholder="同步搜索"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 5. 类组件状态接口
interface ClassTestState {
  singleValue: string | number | (string | number)[] | null;
  multiValue: (string | number)[];
}

// 6. 类组件测试
class ClassComponentTest extends React.Component<ClassTestProps, ClassTestState> {
  constructor(props: ClassTestProps) {
    super(props);
    this.state = {
      singleValue: null,
      multiValue: [],
    };
  }

  handleSingleChange = (value: string | number | (string | number)[] | null) => {
    this.setState({ singleValue: value });
  };

  handleMultiChange = (value: string | number | (string | number)[] | null) => {
    this.setState({ multiValue: Array.isArray(value) ? value : [] });
  };

  render() {
    return (
      <div>
        <h3>类组件 - 单选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={this.state.singleValue}
          onChange={this.handleSingleChange}
          placeholder="类组件单选"
        />
        <p>当前值: {this.state.singleValue?.toString() || '无'}</p>
        
        <h3>类组件 - 多选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={this.state.multiValue}
          onChange={this.handleMultiChange}
          multiple
          placeholder="类组件多选"
        />
        <p>当前值: {this.state.multiValue.join(', ') || '无'}</p>
      </div>
    );
  }
}

// 主测试组件
const CompatibilityTest: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>JoeEnhancedSelect 兼容性测试</h1>
      
      <FunctionalStaticTest />
      <hr />
      
      <FunctionalMultiTest />
      <hr />
      
      <FunctionalAsyncTest />
      <hr />
      
      <FunctionalSyncTest />
      <hr />
      
      <ClassComponentTest />
    </div>
  );
};

export default CompatibilityTest;

// 导出类型供外部使用
export type { Option };