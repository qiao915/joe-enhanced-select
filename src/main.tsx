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
  { value: 'mt', label: '名堂', disabled: true },
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

// 模拟同步加载选项（直接返回结果，不使用Promise）
const syncLoadOptions = (query: string): Option[] => {
  return largeOptions.filter(option => 
    option.label.toLowerCase().includes(query.toLowerCase())
  );
};

// 使用公开API的真实示例 - 搜索维基百科页面
const wikipediaApiLoadOptions = async (query: string) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    
    if (response.status === 404) {
      // 如果精确匹配没找到，尝试搜索API
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.query && searchData.query.search) {
        return searchData.query.search.slice(0, 10).map((item: any) => ({
          value: item.title,
          label: item.title
        }));
      }
      return [];
    }
    
    const data = await response.json();
    return [{
      value: data.title,
      label: data.title
    }];
  } catch (error) {
    console.error('Wikipedia API调用失败:', error);
    return [];
  }
};

// 使用公开API的真实示例 - 搜索GitHub仓库
const githubApiLoadOptions = async (query: string) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((repo: any) => ({
        value: repo.full_name,
        label: `${repo.full_name} (${repo.language || 'N/A'})`
      }));
    }
    
    return [];
  } catch (error) {
    console.error('GitHub API调用失败:', error);
    return [];
  }
};

// 使用公开API的真实示例 - 搜索城市
const citiesApiLoadOptions = async (query: string) => {
  if (!query.trim()) return [];
  
  try {
    // 使用免费的地理位置API
    const response = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(query)}`
    );
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 10).map((location: any) => ({
        value: location.display_name,
        label: location.display_name
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Geocode API调用失败:', error);
    return [];
  }
};

// 为了演示目的，创建一个模拟真实API调用的函数（绕过跨域问题）
const mockRealApiLoadOptions = async (query: string) => {
  if (!query.trim()) return [];
  
  // 模拟真实API调用的延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 模拟根据用户输入返回相关结果
  const mockResults = [
    { value: `${query}-官方旗舰店`, label: `${query}-官方旗舰店` },
    { value: `${query}-正品`, label: `${query}-正品` },
    { value: `${query}-特价`, label: `${query}-特价` },
    { value: `${query}-热销`, label: `${query}-热销` },
    { value: `${query}-新品`, label: `${query}-新品` },
  ];
  
  return mockResults;
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
        <h2>函数组件同步搜索（非异步函数）</h2>
        <JoeEnhancedSelect
          loadOptions={syncLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="同步搜索选项（非异步函数）"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件真实API模拟搜索</h2>
        <JoeEnhancedSelect
          loadOptions={mockRealApiLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="模拟真实API搜索（如淘宝建议）"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件维基百科搜索</h2>
        <JoeEnhancedSelect
          loadOptions={wikipediaApiLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="搜索维基百科页面"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件GitHub仓库搜索</h2>
        <JoeEnhancedSelect
          loadOptions={githubApiLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="搜索GitHub仓库"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>函数组件城市搜索</h2>
        <JoeEnhancedSelect
          loadOptions={citiesApiLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="搜索城市位置"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div>

      {/* 注意：由于跨域限制，淘宝API示例可能无法直接在浏览器中工作 */}
      {/* <div style={{ marginBottom: '30px' }}>
        <h2>函数组件真实淘宝API搜索（可能受跨域限制）</h2>
        <JoeEnhancedSelect
          loadOptions={taobaoApiLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="真实淘宝搜索建议API（可能无法工作）"
        />
        <p>当前选中值: {singleValue?.toString()}</p>
      </div> */}

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
