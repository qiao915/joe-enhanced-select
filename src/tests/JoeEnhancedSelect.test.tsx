import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JoeEnhancedSelect from '../components/JoeEnhancedSelect/index.tsx';

const mockOptions = [
  { value: 'mc', label: '名创优品' },
  { value: 'ml', label: '名龙堂' },
  { value: 'mx', label: '名校堂' },
  { value: 'ms', label: '名彩' },
  { value: 'md', label: '名寇' },
];

describe('JoeEnhancedSelect', () => {
  it('renders correctly', () => {
    render(
      <JoeEnhancedSelect
        options={mockOptions}
        value={null}
        onChange={() => {}}
        placeholder="请选择品牌"
      />
    );
    expect(screen.getByText('请选择品牌')).toBeInTheDocument();
  });

  it('shows options when input is focused', () => {
    render(
      <JoeEnhancedSelect
        options={mockOptions}
        value={null}
        onChange={() => {}}
        placeholder="请选择品牌"
      />
    );
    // 点击选择框，展开下拉菜单
    const select = screen.getByText('请选择品牌');
    fireEvent.click(select);
    
    // 在搜索框中输入关键词
    const searchInput = screen.getByPlaceholderText('请选择品牌');
    fireEvent.change(searchInput, { target: { value: '名' } });
    
    // 检查是否显示匹配的选项
    expect(screen.getByText('名创优品')).toBeInTheDocument();
    expect(screen.getByText('名龙堂')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    const onChange = jest.fn();
    render(
      <JoeEnhancedSelect
        options={mockOptions}
        value={null}
        onChange={onChange}
        placeholder="请选择品牌"
      />
    );
    // 点击选择框，展开下拉菜单
    const select = screen.getByText('请选择品牌');
    fireEvent.click(select);
    
    // 在搜索框中输入关键词
    const searchInput = screen.getByPlaceholderText('请选择品牌');
    fireEvent.change(searchInput, { target: { value: '名' } });
    
    // 点击选项
    fireEvent.click(screen.getByText('名创优品'));
    
    // 检查是否调用了 onChange 函数
    expect(onChange).toHaveBeenCalledWith('mc');
  });

  it('handles multiple selection', () => {
    const onChange = jest.fn();
    render(
      <JoeEnhancedSelect
        options={mockOptions}
        value={[]}
        onChange={onChange}
        placeholder="请选择品牌"
        multiple
      />
    );
    // 点击选择框，展开下拉菜单
    const select = screen.getByText('请选择品牌');
    fireEvent.click(select);
    
    // 在搜索框中输入关键词
    const searchInput = screen.getByPlaceholderText('请选择品牌');
    fireEvent.change(searchInput, { target: { value: '名' } });
    
    // 点击选项
    fireEvent.click(screen.getByText((_, element) => {
      return element ? element.textContent === '名创优品' : false;
    }));
    fireEvent.click(screen.getByText((_, element) => {
      return element ? element.textContent === '名龙堂' : false;
    }));
    
    // 检查是否调用了 onChange 函数
    expect(onChange).toHaveBeenCalledTimes(2);
    // 检查第一次调用是否传递了 ['mc']
    expect(onChange).toHaveBeenNthCalledWith(1, ['mc']);
    // 检查第二次调用是否传递了 ['ml']（因为在多选模式下，每次点击都会切换选项的选中状态）
    expect(onChange).toHaveBeenNthCalledWith(2, ['ml']);
  });

  it('handles async options', async () => {
    const loadOptions = jest.fn().mockResolvedValue(mockOptions);
    const onChange = jest.fn();
    render(
      <JoeEnhancedSelect
        loadOptions={loadOptions}
        value={null}
        onChange={onChange}
        placeholder="请选择品牌"
      />
    );
    // 点击选择框，展开下拉菜单
    const select = screen.getByText('请选择品牌');
    fireEvent.click(select);
    
    // 在搜索框中输入关键词
    const searchInput = screen.getByPlaceholderText('请选择品牌');
    fireEvent.change(searchInput, { target: { value: '名' } });
    
    // 等待异步操作完成
    await waitFor(() => {
      expect(loadOptions).toHaveBeenCalledWith('名');
    });
    
    // 等待选项加载完成
    await waitFor(() => {
      // 检查是否显示了加载完成后的选项
      expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
    });
  });
});