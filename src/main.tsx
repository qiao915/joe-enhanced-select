import React from 'react';
import ReactDOM from 'react-dom/client';
import JoeEnhancedSelect from './components/JoeEnhancedSelect';
import type { Option } from './types';

// 生成大量测试选项
const generateOptions = (count: number) => {
  const options = [];
  for (let i = 0; i < count; i++) {
    options.push({
      value: `option-${i}`,
      label: `选项 ${i + 1} 这是一个较长的选项名称，用于测试滚动条`,
    });
  }
  return options;
};

const mockOptions = [
  { value: 'mc', label: '名创优品' },
  { value: 'ml', label: '名龙堂' },
  { value: 'mx', label: '名校堂' },
  { value: 'ms', label: '名彩' },
  { value: 'md', label: '名寇' },
  { value: 'mt', label: '名堂' },
  { value: 'zhs', label: '芝华士' },
  { value: 'lc', label: '兰蔻' },
];

const largeOptions = generateOptions(50);

// 模拟异步加载选项
const mockLoadOptions = (query: string) => {
  return new Promise<Option[]>((resolve) => {
    setTimeout(() => {
      const filteredOptions = largeOptions.filter(option => 
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredOptions);
    }, 500);
  });
};

// 函数组件测试
function FunctionComponentTests() {
  const [singleValue, setSingleValue] = React.useState<string | number | (string | number)[] | null>(null);
  const [multipleValue, setMultipleValue] = React.useState<string | number | (string | number)[] | null>([]);
  const [asyncSingleValue, setAsyncSingleValue] = React.useState<string | number | (string | number)[] | null>(null);
  const [asyncMultipleValue, setAsyncMultipleValue] = React.useState<string | number | (string | number)[] | null>([]);

  return (
    <div style={{ marginBottom: '50px' }}>
      <h1>函数组件测试</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件基础单选</h2>
        <JoeEnhancedSelect
          options={mockOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="请选择品牌"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件基础多选</h2>
        <JoeEnhancedSelect
          options={mockOptions}
          value={multipleValue}
          onChange={setMultipleValue}
          placeholder="请选择品牌"
          multiple
        />
        <p>当前选中值: {Array.isArray(multipleValue) ? multipleValue.join(', ') : multipleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件异步单选</h2>
        <JoeEnhancedSelect
          loadOptions={mockLoadOptions}
          value={asyncSingleValue}
          onChange={setAsyncSingleValue}
          placeholder="请选择选项"
        />
        <p>当前选中值: {asyncSingleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件异步多选</h2>
        <JoeEnhancedSelect
          loadOptions={mockLoadOptions}
          value={asyncMultipleValue}
          onChange={setAsyncMultipleValue}
          placeholder="请选择选项"
          multiple
        />
        <p>当前选中值: {Array.isArray(asyncMultipleValue) ? asyncMultipleValue.join(', ') : asyncMultipleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件大量选项测试</h2>
        <JoeEnhancedSelect
          options={largeOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="请选择选项"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>
    </div>
  );
}

// 类组件测试
interface ClassComponentState {
  singleValue: string | number | (string | number)[] | null;
  multipleValue: string | number | (string | number)[] | null;
  asyncSingleValue: string | number | (string | number)[] | null;
  asyncMultipleValue: string | number | (string | number)[] | null;
}

class ClassComponentTests extends React.Component<{}, ClassComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      singleValue: null,
      multipleValue: [],
      asyncSingleValue: null,
      asyncMultipleValue: [],
    };
  }

  render() {
    return (
      <div style={{ marginBottom: '50px' }}>
        <h1>类组件测试</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>类组件基础单选</h2>
          <JoeEnhancedSelect
            options={mockOptions}
            value={this.state.singleValue}
            onChange={(value) => this.setState({ singleValue: value })}
            placeholder="请选择品牌"
          />
          <p>当前选中值: {this.state.singleValue}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>类组件基础多选</h2>
          <JoeEnhancedSelect
            options={mockOptions}
            value={this.state.multipleValue}
            onChange={(value) => this.setState({ multipleValue: value })}
            placeholder="请选择品牌"
            multiple
          />
          <p>当前选中值: {Array.isArray(this.state.multipleValue) ? this.state.multipleValue.join(', ') : this.state.multipleValue?.toString()}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>类组件异步单选</h2>
          <JoeEnhancedSelect
            loadOptions={mockLoadOptions}
            value={this.state.asyncSingleValue}
            onChange={(value) => this.setState({ asyncSingleValue: value })}
            placeholder="请选择选项"
          />
          <p>当前选中值: {this.state.asyncSingleValue}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>类组件异步多选</h2>
          <JoeEnhancedSelect
            loadOptions={mockLoadOptions}
            value={this.state.asyncMultipleValue}
            onChange={(value) => this.setState({ asyncMultipleValue: value })}
            placeholder="请选择选项"
            multiple
          />
          <p>当前选中值: {Array.isArray(this.state.asyncMultipleValue) ? this.state.asyncMultipleValue.join(', ') : this.state.asyncMultipleValue?.toString()}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>类组件大量选项测试</h2>
          <JoeEnhancedSelect
            options={largeOptions}
            value={this.state.singleValue}
            onChange={(value) => this.setState({ singleValue: value })}
            placeholder="请选择选项"
          />
          <p>当前选中值: {this.state.singleValue}</p>
        </div>
      </div>
    );
  }
}

// 主应用
function App() {
  return (
    <div style={{ margin: '50px', width: '400px' }}>
      <FunctionComponentTests />
      <ClassComponentTests />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
