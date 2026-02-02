import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Option, JoeEnhancedSelectProps } from "../../types";

/**
 * 增强型选择组件
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
  debounceTimeout = 300, 
  className = "",
  style = {}
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(staticOptions);
  const [debouncedInput, setDebouncedInput] = useState("");
  const lastSearchInput = React.useRef("");
  const searchRequestId = React.useRef(0);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const loadOptionsRef = React.useRef(loadOptions);
  const staticOptionsRef = React.useRef(staticOptions);
  const selectedLabelsMapRef = React.useRef<Record<string | number, string>>({});
  const isMountedRef = React.useRef(true);
  useEffect(() => {
    const styleId = 'joe-enhanced-select-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .joe-enhanced-select {
          position: relative;
          width: 100%;
          max-width: 300px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .joe-enhanced-select__input-container {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          padding: 2px 8px;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          background-color: #fff;
          box-sizing: border-box;
        }
        .joe-enhanced-select__input-container:hover {
          border-color: rgb(64, 150, 255)
        }
        .joe-enhanced-select--disabled .joe-enhanced-select__input-container {
          background-color: #f5f5f5;
          cursor: not-allowed;
          border-color: #d9d9d9;
        }
        .joe-enhanced-select__selected-value {
          flex: 1;
          padding: 4px 0;
          font-size: 14px;
          color: #333;
        }
        .joe-enhanced-select__arrow {
          margin-left: 8px;
        }
        .joe-enhanced-select__arrow .joe-enhanced-select__arrow-icon {
          width: 10px;
          height: 10px;
          position: relative;
          transition: transform 0.3s ease;
          transform: rotate(45deg) translate(2px, 2px);
        }
        .joe-enhanced-select__arrow .joe-enhanced-select__arrow-icon::before,
        .joe-enhanced-select__arrow .joe-enhanced-select__arrow-icon::after {
          content: '';
          position: absolute;
          background-color: #999;
          transition: all 0.3s ease;
        }
        .joe-enhanced-select__arrow .joe-enhanced-select__arrow-icon::before {
          width: 1px;
          height: 8px;
          top: -2px;
          left: 50%;
          border-radius: 1px;
        }
        .joe-enhanced-select__arrow .joe-enhanced-select__arrow-icon::after {
          width: 8px;
          height: 1px;
          top: 50%;
          left: -2px;
          border-radius: 1px;
        }
        .joe-enhanced-select__arrow--open .joe-enhanced-select__arrow-icon {
          transform: rotate(225deg) translate(2px, 2px);
          transform-origin: center center;
        }
        .joe-enhanced-select__menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 10;
          margin-top: 2px;
        }
        .joe-enhanced-select__menu-content {
          max-height: 150px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .joe-enhanced-select__search-container {
          position: relative;
          padding: 8px;
          border-bottom: 1px solid #f0f0f0;
          box-sizing: border-box;
        }
        .joe-enhanced-select__search-input {
          width: 100%;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 6px 12px;
          padding-right: 32px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .joe-enhanced-select__search-input:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .joe-enhanced-select__search-icon {
          position: absolute;
          right: 16px;
          top: 52%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #999;
          pointer-events: none;
        }
        .joe-enhanced-select__option {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
        }
        .joe-enhanced-select__option:hover {
          background-color: #f5f5f5;
        }
        .joe-enhanced-select__option--disabled {
          color: #ccc;
          cursor: not-allowed;
          background-color: #fafafa !important;
        }
        .joe-enhanced-select__option--disabled:hover {
          background-color: #fafafa !important;
          cursor: not-allowed;
        }
        .joe-enhanced-select__no-results,
        .joe-enhanced-select__loading {
          padding: 12px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        .joe-enhanced-select__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
          flex: 1;
        }
        .joe-enhanced-select__tag {
          display: inline-flex;
          align-items: center;
          background-color: #f0f0f0;
          border-radius: 12px;
          padding: 2px 2px 2px 6px;
          font-size: 12px;
          color: #333;
        }
        .joe-enhanced-select__tag-remove {
          background: none;
          border: none;
          transform: scale(0.8);
          cursor: pointer;
          margin-left: 2px;
          color: #999;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .joe-enhanced-select__tag-remove:hover {
          color: #333;
        }
        .joe-enhanced-select__highlight {
          color: #0066cc;
        }
        .joe-enhanced-select__menu::-webkit-scrollbar {
          width: 4px;
        }
        .joe-enhanced-select__menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .joe-enhanced-select__menu::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .joe-enhanced-select__menu::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .joe-enhanced-select__menu {
          border: 1px solid #d9d9d9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .joe-enhanced-select__option {
          padding: 5px 12px;
          line-height: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .joe-enhanced-select__option:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .joe-enhanced-select__option--selected {
          background-color: rgb(230, 244, 255);
          color: #1890ff;
          position: relative;
          z-index: 1;
        }
        .joe-enhanced-select__option-selected-icon{
          position: absolute;
          right: 8px;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .joe-enhanced-select__search-input {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
        }
        .joe-enhanced-select__search-input:focus {
          border-color: #1890ff;
          outline: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    loadOptionsRef.current = loadOptions;
    staticOptionsRef.current = staticOptions;
  }, [loadOptions, staticOptions]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const filterAndSortOptions = useCallback((options: Option[], query: string): Option[] => {
    if (!query || query.trim() === "") return options;
    return options
      .filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase();
        const bLabel = b.label.toLowerCase();
        const q = query.toLowerCase();
        if (aLabel === q && bLabel !== q) return -1;
        if (aLabel !== q && bLabel === q) return 1;
        if (aLabel.startsWith(q) && !bLabel.startsWith(q)) return -1;
        if (!aLabel.startsWith(q) && bLabel.startsWith(q)) return 1;
        return 0;
      });
  }, []);

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

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setDebouncedInput(""); 
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedInput.trim() === "" && loadOptions) {
      setFilteredOptions([]);
      lastSearchInput.current = "";
      return;
    }
    const currentLoadOptions = loadOptionsRef.current;
    if (currentLoadOptions) {
      searchRequestId.current += 1;
      const currentRequestId = searchRequestId.current;
      lastSearchInput.current = debouncedInput;
      setIsLoading(true);
      const fetchOptions = async () => {
        try {
          const results = await Promise.resolve(currentLoadOptions(debouncedInput));
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setFilteredOptions(results);
          }
        } catch (error) {
          console.warn("Error loading options:", error);
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setFilteredOptions([]);
          }
        } finally {
          if (isMountedRef.current && currentRequestId === searchRequestId.current) {
            setIsLoading(false);
          }
        }
      };
      fetchOptions();
    } else {
      const filtered = filterAndSortOptions(staticOptionsRef.current, debouncedInput);
      if (isMountedRef.current) {
        setFilteredOptions(filtered);
      }
    }
  }, [debouncedInput, filterAndSortOptions, loadOptions]); // 移除staticOptions依赖，使用ref访问最新值

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
          ) : part 
        )}
      </>
    );
  }, [highlightColor]);

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

  const handleTagRemove = useCallback((removedValue: string | number) => {
    if (Array.isArray(value)) {
      onChange(value.filter(v => v !== removedValue));
    }
  }, [value, onChange]);

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
  }, [disabled, isOpen, loadOptions]); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && event.target && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptions = useMemo(() => {
    if (!value) return [];
    const selectedLabelsMap = selectedLabelsMapRef.current;
    if (multiple && Array.isArray(value)) {
      value.forEach(val => {
        const strVal = typeof val === "string" ? val : String(val);
        if (!selectedLabelsMap[strVal]) {
          const option = staticOptionsRef.current.find(opt => opt.value === val) || 
                         filteredOptions.find(opt => opt.value === val);
          if (option) {
            selectedLabelsMap[strVal] = option.label;
          } else {
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
          selectedLabelsMap[strValKey] = String(value);
        }
      }
    }
    
    const findOptionByValue = (val: string | number) => {
      const staticOption = staticOptionsRef.current.find(option => option.value === val);
      if (staticOption) return staticOption;
      if (loadOptions) {
        const filteredOption = filteredOptions.find(option => option.value === val);
        if (filteredOption) return filteredOption;
      }
      const strVal = typeof val === "string" ? val : String(val);
      const savedLabel = selectedLabelsMap[strVal];
      return { 
        value: val, 
        label: savedLabel || String(val)
      };
    };
    
    if (multiple && Array.isArray(value)) {
      return value.map(val => findOptionByValue(val as string | number)) as Option[];
    } else if (!multiple && value !== null) {
      const option = findOptionByValue(value as string | number);
      return [option];
    }
    return [];
  }, [value, multiple, filteredOptions, loadOptions]); 

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
                  <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
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
              <svg viewBox="64 64 896 896" focusable="false" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>
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
                  title={option.label}
                  className={`joe-enhanced-select__option ${option.disabled ? "joe-enhanced-select__option--disabled" : ""} ${(Array.isArray(value) ? value.includes(option.value) : value === option.value) ? "joe-enhanced-select__option--selected" : ""}`}
                  onClick={() => !option.disabled && handleOptionClick(option)}
                >
                  {highlightLabel(option.label, inputValue)}
                  {
                    (Array.isArray(value) ? value.includes(option.value) : value === option.value) 
                    ? <div className="joe-enhanced-select__option-selected-icon">
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg>
                    </div>
                    : null
                  }
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