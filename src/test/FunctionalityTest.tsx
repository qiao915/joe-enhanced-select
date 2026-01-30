// 组件功能验证测试
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

// 异步加载选项函数
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

// 同步加载选项函数
const syncLoadOptions = (query: string): Option[] => {
  return testOptions.filter(option =>
    option.label.toLowerCase().includes(query.toLowerCase()) ||
    option.value.toString().toLowerCase().includes(query.toLowerCase())
  );
};

// 带有禁用选项的测试数据
const testOptionsWithDisabled: Option[] = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2', disabled: true },
  { value: 'option3', label: '选项 3' },
];

// 函数组件使用示例
const FunctionalExample: React.FC = () => {
  const [singleValue, setSingleValue] = React.useState<string | number | (string | number)[] | null>(null);
  const [multiValue, setMultiValue] = React.useState<(string | number)[]>([]);
  const [asyncValue, setAsyncValue] = React.useState<string | number | (string | number)[] | null>(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>JoeEnhancedSelect 组件功能验证</h1>
      
      {/* 静态选项 - 单选 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>静态选项 - 单选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="请选择一个选项"
          clearable
        />
        <p>当前值: {singleValue?.toString() || '无'}</p>
      </div>
      
      {/* 静态选项 - 多选 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>静态选项 - 多选</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={multiValue}
          onChange={(value) => setMultiValue(Array.isArray(value) ? value : [])}
          multiple
          placeholder="请选择多个选项"
          clearable
        />
        <p>当前值: {multiValue.join(', ') || '无'}</p>
      </div>
      
      {/* 异步加载选项 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>异步加载选项</h3>
        <JoeEnhancedSelect
          loadOptions={asyncLoadOptions}
          value={asyncValue}
          onChange={setAsyncValue}
          placeholder="搜索选项 (异步)"
          clearable
        />
        <p>当前值: {asyncValue?.toString() || '无'}</p>
      </div>
      
      {/* 同步加载选项 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>同步加载选项</h3>
        <JoeEnhancedSelect
          loadOptions={syncLoadOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="搜索选项 (同步)"
          clearable
        />
      </div>
      
      {/* 带有禁用选项 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>带有禁用选项</h3>
        <JoeEnhancedSelect
          options={testOptionsWithDisabled}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="包含禁用选项"
        />
      </div>
      
      {/* 禁用状态 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>禁用状态</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value="option1"
          onChange={() => {}}
          disabled
          placeholder="这是一个禁用的选择器"
        />
      </div>
      
      {/* 自定义样式和高亮颜色 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>自定义高亮颜色</h3>
        <JoeEnhancedSelect
          options={testOptions}
          value={singleValue}
          onChange={setSingleValue}
          placeholder="自定义高亮颜色"
          highlightColor="#ff6b35"
          normalTextColor="#666666"
        />
      </div>
    </div>
  );
};

export default FunctionalExample;