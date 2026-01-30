import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Option, JoeEnhancedSelectProps } from "../../types";
import "./styles.css"

/**
 * 增强型选择组件
 * 
 * @param options 静态选项数组，默认为空数组
 * @param value 当前选中的值，单选时为单个值，多选时为数组
 * @param onChange 值变化回调函数
 * @param multiple 是否为多选模式，默认为 false
 * @param disabled 是否禁用，默认为 false
 * @param placeholder 占位文本，默认为 "请选择"
 * @param noResultsText 无结果时的提示文本，默认为 "暂无数据"
 * @param noMatchText 无匹配项时的提示文本，默认为 "无匹配项"
 * @param searchPlaceholder 搜索框占位文本，默认为 placeholder
 * @param loadOptions 异步加载选项的函数，返回 Promise
 * @param loadingText 加载中提示文本，默认为 "加载中..."
 * @param highlightColor 高亮文本颜色，默认为 "#0066cc"
 * @param normalTextColor 普通文本颜色，默认为 "#333333"
 * @param debounceTimeout 防抖时间，默认为 300ms
 * @param className 自定义类名
 * @param style 自定义样式
 */
const JoeEnhancedSelect: React.FC<JoeEnhancedSelectProps> = ({
  options: staticOptions = [],
  value,
  onChange,
  multiple = false,
  disabled = false,
  placeholder = "请选择",
  noResultsText = "暂无数据",
  noMatchText = "无匹配项",
  searchPlaceholder = placeholder,
  loadOptions,
  loadingText = "加载中...",
  highlightColor = "#0066cc",
  normalTextColor = "#333333",
  debounceTimeout = 300, // 防抖时间，默认为 300ms
  className = "",
  style = {}
}) => {
  // 输入框的值
  const [inputValue, setInputValue] = useState("");
  // 下拉菜单是否打开
  const [isOpen, setIsOpen] = useState(false);
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false);
  // 过滤后的选项
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(staticOptions);
  // 防抖处理后的输入值
  const [debouncedInput, setDebouncedInput] = useState("");
  // 最后一次搜索的输入值
  const lastSearchInput = React.useRef("");
  // 搜索请求ID，用于取消过期的请求
  const searchRequestId = React.useRef(0);

  // 选择器容器的引用
  const selectRef = React.useRef<HTMLDivElement>(null);
  // 加载选项函数的引用，用于在 useEffect 中访问最新的 loadOptions
  const loadOptionsRef = React.useRef(loadOptions);
  // 静态选项的引用，用于在函数中访问最新的 staticOptions
  const staticOptionsRef = React.useRef(staticOptions);
  // 已选中选项标签的映射，用于记住已选中选项的标签
  const selectedLabelsMapRef = React.useRef<Record<string | number, string>>({});
  // 组件是否已挂载的引用，用于在异步操作后检查组件是否仍在挂载
  const isMountedRef = React.useRef(true);

  /**
   * 更新 loadOptionsRef 和 staticOptionsRef 当它们变化时
   * 
   * @description 当 loadOptions 函数或 staticOptions 数组变化时，更新对应 ref 的值，
   * 以便在其他函数中能够访问到最新的值，而不需要将它们添加到依赖数组中。
   * 
   * @dependency loadOptions - 当 loadOptions 函数变化时，更新 ref
   * @dependency staticOptions - 当静态选项数组变化时，更新 ref
   */
  useEffect(() => {
    loadOptionsRef.current = loadOptions;
    staticOptionsRef.current = staticOptions;
  }, [loadOptions, staticOptions]);

  /**
   * 组件挂载和卸载时的处理
   * 
   * @description 组件挂载时设置 isMountedRef.current 为 true，
   * 组件卸载时设置 isMountedRef.current 为 false，
   * 用于在异步操作后检查组件是否仍在挂载，避免内存泄漏。
   * 
   * @dependency 无 - 仅在组件挂载和卸载时执行
   */
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 过滤和排序选项
   * 
   * @description 根据搜索关键词过滤选项，并按照匹配程度排序：
   * 1. 精确匹配优先
   * 2. 前缀匹配优先
   * 3. 包含匹配
   * 
   * @param options 选项数组
   * @param query 搜索关键词
   * @returns 过滤和排序后的选项数组
   * 
   * @dependency 无 - 函数内部逻辑不依赖外部状态
   */
  const filterAndSortOptions = useCallback((options: Option[], query: string): Option[] => {
    if (!query || query.trim() === "") return options;

    return options
      .filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase();
        const bLabel = b.label.toLowerCase();
        const q = query.toLowerCase();

        // 精确匹配优先
        if (aLabel === q && bLabel !== q) return -1;
        if (aLabel !== q && bLabel === q) return 1;

        // 前缀匹配优先
        if (aLabel.startsWith(q) && !bLabel.startsWith(q)) return -1;
        if (!aLabel.startsWith(q) && bLabel.startsWith(q)) return 1;

        // 包含匹配
        return 0;
      });
  }, []);

  /**
   * 防抖处理
   * 
   * @description 当输入值变化时，延迟 debounceTimeout 毫秒后更新 debouncedInput，
   * 只有当输入值发生变化时才更新，
   * 用于减少频繁的搜索请求。
   * 
   * @dependency inputValue - 当输入值变化时，重新执行防抖逻辑
   * @dependency debounceTimeout - 当防抖时间变化时，重新执行防抖逻辑
   */
  useEffect(() => {
    if (debounceTimeout > 0) {
      const timer = setTimeout(() => {
        setDebouncedInput(inputValue);
      }, debounceTimeout);
      return () => clearTimeout(timer);
    } else {
      setDebouncedInput(inputValue);
    }
  }, [inputValue, debounceTimeout]);

  /**
   * 当打开下拉菜单时，初始化输入值
   * 
   * @description 当打开下拉菜单时，设置 inputValue 为空字符串，
   * 并设置 isInitializing 为 true，
   * 用于确保在打开下拉菜单时不会触发异步搜索。
   * 
   * @dependency isOpen - 当下拉菜单状态变化时，重新执行此副作用
   */// 当打开下拉菜单时，初始化输入值
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setDebouncedInput(""); // 直接设置debouncedInput为空，避免触发异步搜索
      // 不设置isInitializing，因为我们要在用户实际输入时才开始搜索
    }
  }, [isOpen]);

  /**
   * 异步加载选项
   * 
   * @description 当 debouncedInput 变化时，根据是否有 loadOptions 函数来决定是异步加载还是静态过滤：
   * 1. 如果有 loadOptions 函数，则调用它来异步加载选项
   * 2. 如果没有 loadOptions 函数，则使用 filterAndSortOptions 来静态过滤选项
   * 
   * @dependency debouncedInput - 当防抖处理后的输入值变化时，重新执行此副作用
   * @dependency filterAndSortOptions - 当过滤和排序函数变化时，重新执行此副作用
   * @dependency loadOptions - 当异步加载函数变化时，重新执行此副作用
   */
  useEffect(() => {
    // 在异步模式下，如果输入为空，显示空数组
    if (debouncedInput.trim() === "" && loadOptions) {
      setFilteredOptions([]);
      lastSearchInput.current = "";
      return;
    }
    
    const currentLoadOptions = loadOptionsRef.current;
    if (currentLoadOptions) {
      // 递增请求ID，用于标识当前请求
      searchRequestId.current += 1;
      const currentRequestId = searchRequestId.current;
      
      // 记录当前搜索的输入值
      lastSearchInput.current = debouncedInput;
      // 立即设置加载状态，确保在渲染时显示加载指示器
      setIsLoading(true);
      
      const fetchOptions = async () => {
        try {
          // 确保 loadOptions 返回的是 Promise
          const results = await Promise.resolve(currentLoadOptions(debouncedInput));
          // 只有当这个请求仍然是最新的请求时，才更新状态
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setFilteredOptions(results);
          }
        } catch (error) {
          console.warn("Error loading options:", error);
          // 只有当这个请求仍然是最新的请求时，才更新状态
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setFilteredOptions([]);
          }
        } finally {
          // 只有当这个请求仍然是最新的请求时，才重置状态
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setIsLoading(false);
          }
        }
      };

      fetchOptions();
    } else {
      // 静态选项过滤
      const filtered = filterAndSortOptions(staticOptionsRef.current, debouncedInput);
      if (isMountedRef.current) {
        setFilteredOptions(filtered);
      }
    }
  }, [debouncedInput, filterAndSortOptions, loadOptions]); // 移除staticOptions依赖，使用ref访问最新值

  /**
   * 高亮处理
   * 
   * @description 根据搜索关键词高亮选项标签中的匹配部分，
   * 用于提高用户体验。
   * 
   * @param label 选项标签
   * @param query 搜索关键词
   * @returns 带有高亮标记的标签
   * 
   * @dependency highlightColor - 当高亮颜色变化时，重新创建此函数
   * @dependency normalTextColor - 当普通文本颜色变化时，重新创建此函数
   */
  const highlightLabel = useCallback((label: string, query: string) => {
    if (!query) return label;

    const parts = label.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{ color: highlightColor }}>
              {part}
            </span>
          ) : (
            <span key={index} style={{ color: normalTextColor }}>
              {part}
            </span>
          )
        )}
      </>
    );
  }, [highlightColor, normalTextColor]);

  /**
   * 处理选项点击
   * 
   * @description 当用户点击选项时，根据是否为多选模式来处理：
   * 1. 如果是多选模式，则切换选项的选中状态
   * 2. 如果是单选模式，则选择该选项并关闭下拉菜单
   * 
   * @param option 点击的选项
   * 
   * @dependency value - 当选中值变化时，重新创建此函数
   * @dependency onChange - 当值变化回调函数变化时，重新创建此函数
   * @dependency multiple - 当多选模式变化时，重新创建此函数
   */
  const handleOptionClick = useCallback((option: Option) => {
    if (multiple) {
      // 直接调用 onChange，传递新的值
      if (Array.isArray(value)) {
        const isSelected = value.includes(option.value);
        if (isSelected) {
          onChange(value.filter(v => v !== option.value));
        } else {
          onChange([...value, option.value]);
        }
      } else {
        onChange([option.value]);
      }
    } else {
      onChange(option.value);
      setInputValue("");
      setIsOpen(false);
    }
  }, [value, onChange, multiple]);

  /**
   * 处理标签删除
   * 
   * @description 当用户点击删除标签按钮时，从选中值中移除该标签对应的值
   * 
   * @param removedValue 要删除的值
   * 
   * @dependency value - 当选中值变化时，重新创建此函数
   * @dependency onChange - 当值变化回调函数变化时，重新创建此函数
   */
  const handleTagRemove = useCallback((removedValue: string | number) => {
    if (Array.isArray(value)) {
      onChange(value.filter(v => v !== removedValue));
    }
  }, [value, onChange]);

  /**
   * 处理输入框点击
   * 
   * @description 当用户点击输入框时，切换下拉菜单的打开状态，
   * 当打开下拉菜单时，重置搜索输入并加载所有选项
   * 
   * @dependency disabled - 当禁用状态变化时，重新创建此函数
   * @dependency isOpen - 当下拉菜单状态变化时，重新创建此函数
   * @dependency loadOptions - 当异步加载函数变化时，重新创建此函数
   */
  const handleInputClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      // 当打开时，重置搜索输入并加载所有选项
      if (!isOpen) {
        setInputValue("");
        setDebouncedInput("");
        if (!loadOptions) {
          setFilteredOptions(staticOptionsRef.current);
        }
      }
    }
  }, [disabled, isOpen, loadOptions]); // 使用ref来访问staticOptions，避免不必要的重渲染

  /**
   * 处理外部点击
   * 
   * @description 当用户点击下拉菜单外部时，关闭下拉菜单
   * 
   * @dependency 无 - 仅在组件挂载和卸载时执行
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && event.target && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * 获取选中的选项
   * 
   * @description 根据当前选中的值，从静态选项或过滤后的选项中获取对应的选项对象
   * 在异步模式下，如果选项不在静态选项中，也要尝试从过滤后的选项中查找
   * 如果找不到对应的选项，仍然需要保留已选中值的显示
   * 
   * @returns 选中的选项数组
   * 
   * @dependency value - 当选中值变化时，重新计算选中的选项
   * @dependency multiple - 当多选模式变化时，重新计算选中的选项
   * @dependency staticOptions - 当静态选项变化时，重新计算选中的选项
   * @dependency filteredOptions - 当过滤后的选项变化时，重新计算选中的选项
   * @dependency loadOptions - 当是否为异步模式变化时，重新计算选中的选项
   */
  const selectedOptions = useMemo(() => {
    if (!value) return [];
    
    // 当value变化时，更新标签映射
    const selectedLabelsMap = selectedLabelsMapRef.current;
    
    if (multiple && Array.isArray(value)) {
      value.forEach(val => {
        const strVal = typeof val === "string" ? val : String(val);
        // 如果当前值不在标签映射中，尝试查找其标签
        if (!selectedLabelsMap[strVal]) {
          const option = staticOptionsRef.current.find(opt => opt.value === val) || 
                         filteredOptions.find(opt => opt.value === val);
          if (option) {
            selectedLabelsMap[strVal] = option.label;
          } else {
            // 如果找不到，使用值作为标签（最坏情况）
            selectedLabelsMap[strVal] = String(val);
          }
        }
      });
    } else if (!multiple && value !== null) {
      const strVal = typeof value === "string" ? value : String(value);
      const strValKey = strVal;
      if (!selectedLabelsMap[strValKey]) {
        const option = staticOptionsRef.current.find(opt => opt.value === value) || 
                       filteredOptions.find(opt => opt.value === value);
        if (option) {
          selectedLabelsMap[strValKey] = option.label;
        } else {
          // 如果找不到，使用值作为标签（最坏情况）
          selectedLabelsMap[strValKey] = String(value);
        }
      }
    }
    
    // 辅助函数：根据值查找选项
    const findOptionByValue = (val: string | number) => {
      // 优先在静态选项中查找
      const staticOption = staticOptionsRef.current.find(option => option.value === val);
      if (staticOption) return staticOption;
      
      // 如果在异步模式下，也在过滤后的选项中查找
      if (loadOptions) {
        const filteredOption = filteredOptions.find(option => option.value === val);
        if (filteredOption) return filteredOption;
      }
      
      // 如果没找到，为了显示目的，使用已知的标签或默认值
      const strVal = typeof val === "string" ? val : String(val);
      const savedLabel = selectedLabelsMap[strVal];
      
      return { 
        value: val, 
        label: savedLabel || String(val) // 优先使用保存的标签，否则使用值本身
      };
    };
    
    if (multiple && Array.isArray(value)) {
      return value.map(val => findOptionByValue(val as string | number)) as Option[];
    } else if (!multiple && value !== null) {
      const option = findOptionByValue(value as string | number);
      return [option];
    }
    return [];
  }, [value, multiple, filteredOptions, loadOptions]); // 移除了对staticOptions的依赖，改用staticOptionsRef

  /**
   * 获取选中的标签文本
   * 
   * @description 根据当前选中的值，生成显示在输入框中的标签文本：
   * 1. 如果是多选模式且有选中值，则显示 "N 项已选择"
   * 2. 如果是单选模式且有选中值，则显示选中选项的标签
   * 3. 否则显示空字符串
   * 
   * @returns 选中的标签文本
   * 
   * @dependency value - 当选中值变化时，重新计算选中的标签文本
   * @dependency multiple - 当多选模式变化时，重新计算选中的标签文本
   * @dependency selectedOptions - 当选中的选项变化时，重新计算选中的标签文本
   */
  const selectedLabel = useMemo(() => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return `${value.length} 项已选择`;
    } else if (!multiple && selectedOptions.length > 0) {
      return selectedOptions[0].label;
    }
    return "";
  }, [value, multiple, selectedOptions]);

  return (
    <div 
      ref={selectRef}
      className={`joe-enhanced-select ${className} ${disabled ? "joe-enhanced-select--disabled" : ""}`}
      style={style}
    >
      <div className="joe-enhanced-select__input-container" onClick={handleInputClick}>
        {multiple && Array.isArray(value) && value.length > 0 ? (
          <div className="joe-enhanced-select__tags">
            {selectedOptions.map(option => (
              <div key={option.value} className="joe-enhanced-select__tag">
                <span>{option.label}</span>
                <button 
                  className="joe-enhanced-select__tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagRemove(option.value);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="joe-enhanced-select__selected-value">
            {selectedLabel || placeholder}
          </div>
        )}
        <div className={`joe-enhanced-select__arrow ${isOpen ? "joe-enhanced-select__arrow--open" : ""}`}>
          <div className="joe-enhanced-select__arrow-icon"></div>
        </div>
      </div>

      {isOpen && (
        <div className="joe-enhanced-select__menu">
          <div className="joe-enhanced-select__search-container">
            <input
                type="text"
                className="joe-enhanced-select__search-input"
                placeholder={searchPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={disabled}
                autoFocus
              />
            <div className="joe-enhanced-select__search-icon">
              🔍
            </div>
          </div>
          <div className="joe-enhanced-select__menu-content">
            {isLoading || (loadOptions && inputValue.trim() !== "" && lastSearchInput.current !== inputValue) ? (
            <div className="joe-enhanced-select__loading">
              {loadingText}
            </div>
          ) : (
            filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`joe-enhanced-select__option ${(Array.isArray(value) ? value.includes(option.value) : value === option.value) ? "joe-enhanced-select__option--selected" : ""}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {highlightLabel(option.label, inputValue)}
                </div>
              ))
            ) : (
              <div className="joe-enhanced-select__no-results">
                {inputValue.trim() !== "" ? noMatchText : noResultsText}
              </div>
            )
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoeEnhancedSelect;