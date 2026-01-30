import JoeEnhancedSelect from '../index';
import type { Option } from '../index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof JoeEnhancedSelect> = {
  title: 'JoeEnhancedSelect',
  component: JoeEnhancedSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JoeEnhancedSelect>;

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

export const Basic: Story = {
  args: {
    options: staticOptions,
    value: null,
    onChange: (value) => console.log('Selected:', value),
    placeholder: '请选择品牌',
  },
};

export const Async: Story = {
  args: {
    loadOptions,
    value: null,
    onChange: (value) => console.log('Selected:', value),
    placeholder: '异步搜索品牌',
  },
};

export const Multiple: Story = {
  args: {
    options: staticOptions,
    value: [],
    onChange: (value) => console.log('Selected:', value),
    placeholder: '请选择品牌（多选）',
    multiple: true,
  },
};

export const AsyncMultiple: Story = {
  args: {
    loadOptions,
    value: [],
    onChange: (value) => console.log('Selected:', value),
    placeholder: '异步搜索品牌（多选）',
    multiple: true,
  },
};

export const CustomHighlight: Story = {
  args: {
    options: staticOptions,
    value: null,
    onChange: (value) => console.log('Selected:', value),
    placeholder: '自定义高亮颜色',
    highlightColor: '#ff6600',
    normalTextColor: '#666666',
  },
};

export const Disabled: Story = {
  args: {
    options: staticOptions,
    value: null,
    onChange: (value) => console.log('Selected:', value),
    placeholder: '禁用状态',
    disabled: true,
  },
};