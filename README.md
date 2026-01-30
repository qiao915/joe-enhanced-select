# JoeEnhancedSelect

一个功能强大、易于使用的增强型选择组件，支持静态选项、异步加载、多选、搜索等功能。

[![npm version](https://badge.fury.io/js/joe-enhanced-select.svg)](https://badge.fury.io/js/joe-enhanced-select)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/qiao915/joe-enhanced-select.svg?style=social&label=Star)](https://github.com/qiao915/joe-enhanced-select)

## 安装

使用npm:
```bash
npm install joe-enhanced-select
```

使用yarn:
```bash
yarn add joe-enhanced-select
```

## 特性

- 🚀 **高性能**：使用防抖技术避免频繁请求
- 🔍 **智能搜索**：支持模糊匹配和高亮显示
- ⚡ **异步加载**：支持异步加载选项，兼容Promise和同步函数
- ✅ **多选模式**：支持单选和多选模式
- 📱 **响应式**：适配各种屏幕尺寸
- 🎨 **可定制**：支持自定义样式和颜色
- 🌐 **跨域友好**：支持调用公共API进行搜索建议

## 快速使用

### 基础用法

```tsx
import JoeEnhancedSelect from 'joe-enhanced-select';
import type { Option } from 'joe-enhanced-select';

const options: Option[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子' }
];

function MyComponent() {
  const [value, setValue] = useState<string | number | (string | number)[] | null>(null);

  return (
    <JoeEnhancedSelect
      options={options}
      value={value}
      onChange={setValue}
      placeholder="请选择水果"
    />
  );
}
```

### 异步加载选项

```tsx
// 异步函数
const loadOptions = async (query: string) => {
  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();
  return data.options; // 返回 Option[] 数组
};

// 同步函数
const syncLoadOptions = (query: string) => {
  return mockOptions.filter(option => 
    option.label.toLowerCase().includes(query.toLowerCase())
  );
};

<JoeEnhancedSelect
  loadOptions={loadOptions}
  value={value}
  onChange={setValue}
  placeholder="搜索选项"
/>
```

### 多选模式

```tsx
<JoeEnhancedSelect
  options={options}
  value={multipleValue} // string[] | number[]
  onChange={setMultipleValue}
  multiple
  placeholder="请选择多个选项"
/>
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| options | `Option[]` | `[]` | 静态选项数组 |
| value | `string \| number \| (string \| number)[] \| null` | - | 当前选中值 |
| onChange | `(value: string \| number \| (string \| number)[] \| null) => void` | - | 值变化回调函数 |
| multiple | `boolean` | `false` | 是否为多选模式 |
| disabled | `boolean` | `false` | 是否禁用 |
| placeholder | `string` | `'请选择'` | 占位文本 |
| noResultsText | `string` | `'暂无数据'` | 无结果时的提示文本 |
| noMatchText | `string` | `'无匹配项'` | 无匹配项时的提示文本 |
| searchPlaceholder | `string` | `placeholder` | 搜索框占位文本 |
| loadOptions | `(inputValue: string) => Promise<Option[]> \| Option[]` | - | 异步加载选项的函数 |
| loadingText | `string` | `'加载中...'` | 加载中提示文本 |
| debounceTimeout | `number` | `300` | 防抖时间（毫秒） |
| highlightColor | `string` | `'#0066cc'` | 匹配文字高亮颜色 |
| normalTextColor | `string` | `'#333333'` | 正常文本颜色 |
| className | `string` | `''` | 自定义类名 |
| style | `React.CSSProperties` | `{}` | 自定义样式 |

## API

### Option 类型

```ts
interface Option {
  value: string | number;
  label: string;
  [key: string]: any; // 允许扩展字段
}
```

## 使用场景

1. **基础选择**：简单的下拉选择
2. **搜索选择**：带有搜索功能的选择器
3. **异步加载**：动态加载大量选项
4. **多选场景**：需要选择多个选项
5. **远程搜索**：连接后端API进行搜索建议

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT