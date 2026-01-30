import { useState } from 'react';
import JoeEnhancedSelect from './components/JoeEnhancedSelect';
import type { Option } from './components/JoeEnhancedSelect';
import './App.css';

const staticOptions: Option[] = [
  { value: 'mc', label: '名创优品' },
  { value: 'ml', label: '名龙堂' },
  { value: 'mx', label: '名校堂' },
  { value: 'ms', label: '名彩' },
  { value: 'md', label: '名寇' },
];

async function loadOptions(query: string): Promise<Option[]> {
  if (!query.trim()) return [];
  await new Promise((r) => setTimeout(r, 300)); // 模拟网络延迟
  return staticOptions.filter(option => 
    option.label.toLowerCase().includes(query.toLowerCase())
  );
}

function App() {
  const [singleValue, setSingleValue] = useState<string | number | (string | number)[] | null>(null);
  const [multipleValue, setMultipleValue] = useState<string | number | (string | number)[] | null>([]);
  const [asyncValue, setAsyncValue] = useState<string | number | (string | number)[] | null>(null);
  const [asyncMultipleValue, setAsyncMultipleValue] = useState<string | number | (string | number)[] | null>([]);

  return (
    <div className="app">
      <h1>JoeEnhancedSelect 测试</h1>
      
      <div className="test-section">
        <h2>基础单选</h2>
        <JoeEnhancedSelect
          options={staticOptions}
          value={singleValue}
          onChange={(value) => setSingleValue(value as string | null)}
          placeholder="请选择品牌"
        />
        <p>选中值: {singleValue}</p>
      </div>

      <div className="test-section">
        <h2>基础多选</h2>
        <JoeEnhancedSelect
          options={staticOptions}
          value={multipleValue}
          onChange={(value) => setMultipleValue(Array.isArray(value) ? value : [])}
          placeholder="请选择品牌（多选）"
          multiple
        />
        <p>选中值: {Array.isArray(multipleValue) ? multipleValue.join(', ') : multipleValue?.toString()}</p>
      </div>

      <div className="test-section">
        <h2>异步单选</h2>
        <JoeEnhancedSelect
          loadOptions={loadOptions}
          value={asyncValue}
          onChange={(value) => setAsyncValue(value as string | null)}
          placeholder="异步搜索品牌"
        />
        <p>选中值: {asyncValue}</p>
      </div>

      <div className="test-section">
        <h2>异步多选</h2>
        <JoeEnhancedSelect
          loadOptions={loadOptions}
          value={asyncMultipleValue}
          onChange={(value) => setAsyncMultipleValue(Array.isArray(value) ? value : [])}
          placeholder="异步搜索品牌（多选）"
          multiple
        />
        <p>选中值: {Array.isArray(asyncMultipleValue) ? asyncMultipleValue.join(', ') : asyncMultipleValue?.toString()}</p>
      </div>

      <div className="test-section">
        <h2>自定义高亮颜色</h2>
        <JoeEnhancedSelect
          options={staticOptions}
          value={null}
          onChange={() => {}}
          placeholder="自定义高亮颜色"
          highlightColor="#ff6600"
          normalTextColor="#666666"
        />
      </div>

      <div className="test-section">
        <h2>禁用状态</h2>
        <JoeEnhancedSelect
          options={staticOptions}
          value={null}
          onChange={() => {}}
          placeholder="禁用状态"
          disabled
        />
      </div>
    </div>
  );
}

export default App
