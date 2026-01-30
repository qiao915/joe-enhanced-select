# JoeEnhancedSelect

JoeEnhancedSelect 是一个增强型 React 下拉选择组件，专为支持 **模糊搜索 + 精确匹配优先 + 匹配文本高亮** 的业务场景设计。适用于商品品牌、标签、分类等需要智能筛选的输入场景。

## 核心功能

- ✅ 支持实时模糊搜索（含精确匹配优先排序）
- ✅ 匹配文本高亮显示，颜色可自定义（默认：高亮色 #0066cc，正常色 #333333）
- ✅ 支持单选 / 多选模式（通过 multiple 配置项控制，默认单选）
- ✅ 支持异步加载选项（通过 loadOptions 函数）
- ✅ 自动处理“无结果”状态，显示友好提示
- ✅ 不依赖原生 `<select>`，完全自定义 UI
- ✅ 无需键盘导航支持（简化交互）
- ✅ 样式类名带前缀 joe-enhanced-select-，避免全局冲突
- ✅ 兼容 React 函数组件 & 类组件
- ✅ 自动管理异步 loading 状态（用户无需手动传 loading）

## 安装

```bash
npm install @your-org/joe-enhanced-select
# 或
yarn add @your-org/joe-enhanced-select
```

## 基本用法

### 函数组件：基础单选

```tsx
import React, { useState } from 'react';
import { JoeEnhancedSelect } from '@your-org/joe-enhanced-select';

const options = [
  { value: 'mc', label: '名创优品' },
  { value: 'ml', label: '名龙堂' },
  { value: 'mx', label: '名校堂' },
  { value: 'ms', label: '名彩' },
  { value: 'md', label: '名寇' },
];

export default function SingleSelectExample() {
  const [value, setValue] = useState(null);

  return (
    <JoeEnhancedSelect
      options={options}
      value={value}
      onChange={(v) => setValue(v as string | null)}
      placeholder="请选择品牌"
    />
  );
}
```

### 函数组件：异步单选

```tsx
import React, { useState } from 'react';
import { JoeEnhancedSelect, Option } from '@your-org/joe-enhanced-select';

async function loadBrands(query: string): Promise<Option[]> {
  if (!query.trim()) return [];
  await new Promise((r) => setTimeout(r, 400)); // 模拟网络延迟
  return [
    { value: 'brand-' + query, label: `品牌-${query}` }
  ];
}

export default function AsyncSingleSelect() {
  const [value, setValue] = useState(null);

  return (
    <JoeEnhancedSelect
      loadOptions={loadBrands}
      value={value}
      onChange={(v) => setValue(v as string | null)}
      placeholder="异步搜索品牌（单选）"
    />
  );
}
```

### 函数组件：异步多选

```tsx
import React, { useState } from 'react';
import { JoeEnhancedSelect, Option } from '@your-org/joe-enhanced-select';

async function loadTags(query: string): Promise<Option[]> {
  if (!query.trim()) return [];
  await new Promise((r) => setTimeout(r, 300));
  return [
    { value: 't1', label: `${query}-标签1` },
    { value: 't2', label: `${query}-标签2` },
  ];
}

export default function AsyncMultiSelect() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <JoeEnhancedSelect
      loadOptions={loadTags}
      value={value}
      onChange={(v) => setValue(Array.isArray(v) ? v : [])}
      placeholder="异步搜索标签（多选）"
      multiple
    />
  );
}
```

### 类组件：基础单选

```tsx
import React from 'react';
import { JoeEnhancedSelect, Option } from '@your-org/joe-enhanced-select';

const staticOptions: Option[] = [
  { value: 'a', label: '选项A' },
  { value: 'b', label: '选项B' },
];

export class ClassSingleSelect extends React.Component {
  state = { value: null as string | null };

  handleChange = (newValue: any) => {
    this.setState({ value: newValue as string | null });
  };

  render() {
    return (
      <JoeEnhancedSelect
        options={staticOptions}
        value={this.state.value}
        onChange={this.handleChange}
        placeholder="请选择选项"
      />
    );
  }
}
```

## Props 定义

| Prop | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `options` | `Option[]` | `[]` | 静态选项列表（与 loadOptions 二选一） |
| `value` | `string \| number \| (string \| number)[] \| null` | `null` | 当前选中值 |
| `onChange` | `(value: string \| number \| (string \| number)[] \| null) => void` | 必填 | 值变化回调函数 |
| `multiple` | `boolean` | `false` | 是否多选，默认单选 |
| `disabled` | `boolean` | `false` | 是否禁用，默认 false |
| `placeholder` | `string` | `"请选择"` | 输入框占位符 |
| `noResultsText` | `string` | `"暂无数据"` | 无结果提示 |
| `searchPlaceholder` | `string` | 同 placeholder | 搜索框提示 |
| `loadOptions` | `(inputValue: string) => Promise<Option[]>` | - | 异步获取选项的函数 |
| `loadingText` | `string` | `"加载中..."` | 自定义加载中提示 |
| `highlightColor` | `string` | `"#0066cc"` | 匹配文字高亮颜色 |
| `normalTextColor` | `string` | `"#333333"` | 正常文本颜色 |
| `className` | `string` | `""` | 外部根容器类名 |
| `style` | `React.CSSProperties` | `{}` | 外部样式 |

## 匹配与排序逻辑

### 匹配规则（按优先级排序）
| 优先级 | 匹配类型 | 判断条件 |
| :---: | :---: | :---: |
| 1 | 精确匹配 | `option.label === query` |
| 2 | 前缀匹配 | `option.label.startsWith(query)` |
| 3 | 包含匹配 | `option.label.includes(query)` |

所有匹配项按上述顺序排列，非匹配项不显示。

### 高亮实现

- 使用正则表达式提取所有匹配片段（忽略大小写）；
- 将匹配部分包裹在 `<span>` 中，并应用 `color: highlightColor`；
- 非匹配部分使用 `normalTextColor`。

## 异步加载逻辑

- 用户输入 → 触发 `loadOptions(inputValue)`（防抖 300ms）；
- 调用期间，组件内部 `isLoading = true`；
- 显示“加载中…”提示；
- 请求完成 → 更新选项列表，`isLoading = false`；
- 若 `loadOptions` 抛出异常，应降级为“暂无数据”并记录警告（不崩溃）。

## 多选模式行为

- 选中项以标签形式展示在输入框内；
- 点击标签 × 可删除（触发 onChange 移除对应值）；
- 下拉列表中点击已选项可取消（多选）；
- onChange 返回数组（如 `['a', 'b']`）。

## 技术栈

- React ≥ 16.8
- TypeScript
- CSS Modules（scoped）
- Vite（构建工具）
- Jest + React Testing Library（测试）
- Storybook（文档）

## 运行示例

```bash
# 安装依赖
npm install

# 启动 Storybook
npm run storybook

# 运行测试
npm test

# 构建项目
npm run build
```

## 注意事项

- ❌ 不支持键盘导航；
- ✅ 异步 loading 由组件内部管理，用户无需传 loading；
- ✅ 类组件中 loadOptions 必须为箭头函数或正确绑定；
- ✅ 高亮使用 inline style，支持动态颜色；
- ✅ 所有示例均可直接运行，无类型或逻辑错误。

## 第二期规划

- 虚拟滚动
- 选项分组