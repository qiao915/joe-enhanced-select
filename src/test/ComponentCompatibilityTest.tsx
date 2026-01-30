import React from 'react';
import JoeEnhancedSelect from '../components/JoeEnhancedSelect';
import type { Option } from '../types';

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

// 函数组件测试
const FunctionalComponentTest: React.FC = () => {
  const [singleValue, setSingleValue] = React.useState<string | number | (string | number)[] | null>(null);
  const [multipleValue, setMultipleValue] = React.useState<string | number | (string | number)[] | null>([]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>函数组件测试</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>静态选项单选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="请选择选项"
        />
        <p>当前值: {singleValue?.toString() || '无'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>静态选项多选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={multipleValue}
          onChange={setMultipleValue}
          multiple
          placeholder="请选择选项"
        />
        <p>当前值: {Array.isArray(multipleValue) ? multipleValue.join(', ') : multipleValue?.toString() || '无'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>异步加载选项</h3>
        <JoeEnhancedSelect
          loadOptions={mockLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="搜索选项"
        />
        <p>当前值: {singleValue?.toString() || '无'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>同步函数加载选项</h3>
        <JoeEnhancedSelect
          loadOptions={(query: string) => {
            return testOptions.filter(option =>
              option.label.toLowerCase().includes(query.toLowerCase())
            );
          }}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="同步搜索选项"
        />
        <p>当前值: {singleValue?.toString() || '无'}</p>
      </div>
    </div>
  );
};

// 类组件状态接口
interface ClassComponentTestState {
  singleValue: string | number | (string | number)[] | null;
  multipleValue: string | number | (string | number)[] | null;
}

// 类组件测试
class ClassComponentTest extends React.Component<{}, ClassComponentTestState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      singleValue: null,
      multipleValue: [],
    };
  }

  handleSingleChange = (value: string | number | (string | number)[] | null) => {
    this.setState({ singleValue: value });
  };

  handleMultipleChange = (value: string | number | (string | number)[] | null) => {
    this.setState({ multipleValue: value });
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>类组件测试</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>静态选项单选</h3>
          <JoeEnhancedSelect
            options={testOptions}
            value={this.state.singleValue}
            onChange={this.handleSingleChange}
            placeholder="请选择选项"
          />
          <p>当前值: {this.state.singleValue?.toString() || '无'}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>静态选项多选</h3>
          <JoeEnhancedSelect
            options={testOptions}
            value={this.state.multipleValue}
            onChange={this.handleMultipleChange}
            multiple
            placeholder="请选择选项"
          />
          <p>当前值: {Array.isArray(this.state.multipleValue) 
            ? this.state.multipleValue.join(', ') 
            : this.state.multipleValue?.toString() || '无'}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>异步加载选项</h3>
          <JoeEnhancedSelect
            loadOptions={mockLoadOptions}
            value={this.state.singleValue}
            onChange={this.handleSingleChange}
            placeholder="搜索选项"
          />
          <p>当前值: {this.state.singleValue?.toString() || '无'}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>同步函数加载选项</h3>
          <JoeEnhancedSelect
            loadOptions={(query: string) => {
              return testOptions.filter(option =>
                option.label.toLowerCase().includes(query.toLowerCase())
              );
            }}
            value={this.state.singleValue}
            onChange={this.handleSingleChange}
            placeholder="同步搜索选项"
          />
          <p>当前值: {this.state.singleValue?.toString() || '无'}</p>
        </div>
      </div>
    );
  }
}

// 主测试组件
const ComponentCompatibilityTest: React.FC = () => {
  return (
    <div>
      <FunctionalComponentTest />
      <ClassComponentTest />
    </div>
  );
};

export default ComponentCompatibilityTest;