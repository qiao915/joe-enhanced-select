export interface Option {
  value: string | number;
  label: string;
  [key: string]: any; // 允许扩展字段
}

export interface JoeEnhancedSelectProps {
  // 基础配置
  options?: Option[];                     // 静态选项列表（与 loadOptions 二选一）
  value?: string | number | (string | number)[] | null; // 当前选中值
  onChange: (value: string | number | (string | number)[] | null) => void;

  // 行为控制
  multiple?: boolean;                     // 是否多选，默认单选
  disabled?: boolean;                     // 是否禁用，默认 false
  clearable?: boolean;                    // 是否可清空，默认 false
  placeholder?: string;                   // 输入框占位符
  noResultsText?: string;                 // 无结果提示，默认 "暂无数据"
  noMatchText?: string;                   // 无匹配项提示，默认 "无匹配项"
  searchPlaceholder?: string;             // 搜索框提示，默认同 placeholder

  // 异步加载（推荐方式）
  loadOptions?: (inputValue: string) => Promise<Option[]> | Option[]; // 异步获取选项，支持返回Promise或直接返回结果

  // 高级控制（可选）
  loadingText?: string;                      // 【可选】自定义加载中提示，默认 "加载中..."
  debounceTimeout?: number;                  // 【可选】防抖时间，默认 300ms

  // 高亮颜色自定义
  highlightColor?: string;                // 匹配文字高亮颜色，默认 "#0066cc"

  // 扩展
  className?: string;                     // 外部根容器类名
  style?: React.CSSProperties;            // 外部样式
}