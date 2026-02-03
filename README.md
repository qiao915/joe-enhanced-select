# JoeEnhancedSelect

![JoeEnhancedSelect](https://img.shields.io/badge/JoeEnhancedSelect-1.0.5-brightgreen.svg)  
![React16.8+](https://img.shields.io/badge/react-16.8%2B-blue.svg)

  
一个功能强大、高度可定制的React选择组件，支持单选、多选、异步加载选项、搜索等功能(高亮匹配关键词)。

## 特性

- 🎯 **智能搜索** - 支持实时搜索和高亮匹配文本
- ⚡ **高性能** - 使用防抖技术优化搜索性能
- 🎨 **可定制样式** - 支持自定义高亮颜色和其他样式
- 🔧 **多种模式** - 支持单选、多选、静态选项、异步加载
- ♿ **无障碍支持** - 符合无障碍访问标准
- 💻 **TypeScript支持** - 完整的类型定义
- ❌ **禁用选项** - 支持禁用特定选项

## 安装

```bash
npm install joe-enhanced-select
```

## 使用方法

安装完成后，您可以在项目中导入并使用该组件

```tsx
import React from 'react';
import { JoeEnhancedSelect } from 'joe-enhanced-select';
const App: React.FC = () => {
  const options = [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3' },
  ];

  const handleChange = (value: string | number | (string | number)[] | null) => {
    console.log('Selected value:', value);
  };

  return (
    <div>
      <h1>JoeEnhancedSelect 示例</h1>
      <JoeEnhancedSelect
        options={options}
        value={null}
        onChange={handleChange}
        placeholder="请选择"
      />
    </div>
  );
};

export default App;
```

## 快速开始

### 基本用法

```tsx
import React, { useState } from 'react';
import { JoeEnhancedSelect } from 'joe-enhanced-select';
import type { Option } from 'joe-enhanced-select';

const App = () => {
  const [value, setValue] = useState<string | number | (string | number)[] | null>(null);

  const options: Option[] = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
    { value: 'disabled-option', label: '禁用选项', disabled: true }
  ];

  return (
    <JoeEnhancedSelect
      options={options}
      value={value}
      onChange={setValue}
      placeholder="请选择..."
    />
  );
};
```

### 多选模式

```tsx
<JoeEnhancedSelect
  options={options}
  value={value}
  onChange={setValue}
  multiple
  placeholder="请选择多个选项"
/>
```

### 异步加载选项

```tsx
const loadOptions = async (query: string) => {
  // 模拟API调用
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
};

<JoeEnhancedSelect
  loadOptions={loadOptions}
  value={value}
  onChange={setValue}
  placeholder="搜索并选择..."
/>
```

### 同步函数

```tsx
const syncLoadOptions = (query: string): Option[] => {
  return options.filter(option =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
};

<JoeEnhancedSelect
  loadOptions={syncLoadOptions}
  value={value}
  onChange={setValue}
  placeholder="同步搜索..."
/>
```

## API

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| options | `Option[]` | `[]` | 静态选项列表 |
| value | `string \| number \| (string \| number)[] \| null` | `null` | 当前选中值 |
| onChange | `(value: string \| number \| (string \| number)[] \| null) => void` | - | 值改变回调函数 |
| multiple | `boolean` | `false` | 是否多选 |
| disabled | `boolean` | `false` | 是否禁用 |
| placeholder | `string` | `'请选择...'` | 占位符文本 |
| noResultsText | `string` | `'暂无数据'` | 无结果提示文本 |
| noMatchText | `string` | `'无匹配项'` | 无匹配项提示文本 |
| searchPlaceholder | `string` | `placeholder` | 搜索框占位符文本 |
| loadOptions | `(inputValue: string) => Promise<Option[]> \| Option[]` | - | 异步加载选项函数 |
| loadingText | `string` | `'加载中...'` | 加载时显示文本 |
| highlightColor | `string` | `'#0066cc'` | 高亮文本颜色 |
| normalTextColor | `string` | `'#333333'` | 普通文本颜色 |
| debounceTimeout | `number` | `300` | 搜索防抖时间(ms) |
| className | `string` | `''` | 自定义CSS类名 |
| style | `React.CSSProperties` | - | 自定义样式 |

### Option 类型

```ts
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean; // 是否禁用该选项
  [key: string]: any; // 允许扩展字段
}
```

## 使用场景

### 1. 基础单选
适用于简单的单选选择场景，同时也支持输入关键词搜索选项，且匹配的关键词会高亮显示。

### 2. 多选
适用于需要选择多个选项的场景，同时也支持输入关键词搜索选项，且匹配的关键词会高亮显示。已选择的内容可以单独删除

### 3. 异步搜索
适用于选项较多或需要远程搜索的场景，支持单选和多选，具有防抖功能，且同样有关键词高亮。

### 4. 静态选项
适用于选项固定不变的场景，如国家列表、状态枚举等。

## 注意事项

1. 当同时提供 `options` 和 `loadOptions` 时，`loadOptions` 优先级更高
2. 在多选模式下，`value` 应为数组类型
3. `loadOptions` 函数可以返回 `Promise<Option[]>` 或直接返回 `Option[]`
4. 组件会自动处理异步请求的竞态条件问题
5. 打开下拉菜单时，搜索框会自动获得焦点
7. 禁用的选项将显示为灰色且无法被选择

## 许可证

MIT