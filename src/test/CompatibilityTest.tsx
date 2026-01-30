// JoeEnhancedSelect 组件兼容性测试
// 测试组件在类组件、函数组件、TSX组件、JSX组件中的使用

import React from 'react';
import JoeEnhancedSelect from '../components/JoeEnhancedSelect';
import type { Option } from '../types';

// 测试选项
const testOptions: Option[] = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2' },
  { value: 'option3', label: '选项 3' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
];

// 1. 函数组件测试 (TSX)
const FunctionComponentTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);
  const [multiValue, setMultiValue] = React.useState<(string | number)[]>([]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '4px' }}>
      <h3>函数组件测试 (TSX)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>单选模式</h4>
        <JoeEnhancedSelect
          options={testOptions}
          value={value}
          onChange={setValue}
          placeholder="请选择一个选项"
        />
        <p>当前值: {value?.toString() || '无'}</p>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>多选模式</h4>
        <JoeEnhancedSelect
          options={testOptions}
          value={multiValue}
          onChange={setMultiValue}
          multiple
          placeholder="请选择多个选项"
        />
        <p>当前值: {multiValue.join(', ') || '无'}</p>
      </div>
    </div>
  );
};

// 2. 类组件测试 (TSX)
interface ClassComponentTestProps {}

interface ClassComponentTestState {
  value: string | number | (string | number)[] | null;
  multiValue: (string | number)[];
}

class ClassComponentTest extends React.Component<ClassComponentTestProps, ClassComponentTestState> {
  constructor(props: ClassComponentTestProps) {
    super(props);
    this.state = {
      value: null,
      multiValue: []
    };
  }

  handleValueChange = (value: string | number | (string | number)[] | null) => {
    this.setState({ value });
  };

  handleMultiValueChange = (multiValue: string | number | (string | number)[] | null) => {
    this.setState({ 
      multiValue: Array.isArray(multiValue) ? multiValue : [] 
    });
  };

  render() {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '4px' }}>
        <h3>类组件测试 (TSX)</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <h4>单选模式</h4>
          <JoeEnhancedSelect
            options={testOptions}
            value={this.state.value}
            onChange={this.handleValueChange}
            placeholder="请选择一个选项"
          />
          <p>当前值: {this.state.value?.toString() || '无'}</p>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <h4>多选模式</h4>
          <JoeEnhancedSelect
            options={testOptions}
            value={this.state.multiValue}
            onChange={this.handleMultiValueChange}
            multiple
            placeholder="请选择多个选项"
          />
          <p>当前值: {this.state.multiValue.join(', ') || '无'}</p>
        </div>
      </div>
    );
  }
}

// 3. 异步加载测试
const AsyncFunctionComponent: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  const asyncLoadOptions = (query: string) => {
    return new Promise<Option[]>((resolve) => {
      setTimeout(() => {
        const filtered = testOptions.filter(option =>
          option.label.toLowerCase().includes(query.toLowerCase()) ||
          option.value.toString().toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '4px' }}>
      <h3>异步加载测试 (TSX)</h3>
      <JoeEnhancedSelect
        loadOptions={asyncLoadOptions}
        value={value}
        onChange={setValue}
        placeholder="搜索选项 (异步)"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 4. JSX 兼容性测试（使用JavaScript语法）
const JSXCompatibilityTest: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '4px' }}>
      <h3>JSX 兼容性测试</h3>
      <JoeEnhancedSelect
        options={testOptions}
        value={value}
        onChange={setValue}
        placeholder="JSX 兼容性测试"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 5. 同步函数加载测试
const SyncFunctionComponent: React.FC = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[] | null>(null);

  const syncLoadOptions = (query: string): Option[] => {
    return testOptions.filter(option =>
      option.label.toLowerCase().includes(query.toLowerCase()) ||
      option.value.toString().toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '4px' }}>
      <h3>同步函数加载测试</h3>
      <JoeEnhancedSelect
        loadOptions={syncLoadOptions}
        value={value}
        onChange={setValue}
        placeholder="同步搜索选项"
      />
      <p>当前值: {value?.toString() || '无'}</p>
    </div>
  );
};

// 主测试组件
const CompatibilityTest: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>JoeEnhancedSelect 组件兼容性测试</h1>
      <p>此页面测试组件在各种React环境中的兼容性</p>
      
      <FunctionComponentTest />
      <ClassComponentTest />
      <AsyncFunctionComponent />
      <SyncFunctionComponent />
      <JSXCompatibilityTest />
    </div>
  );
};

export default CompatibilityTest;