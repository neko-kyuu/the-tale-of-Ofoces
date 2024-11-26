export const hexToRgb = (hex) => {
    // 去除可能存在的 # 符号
    hex = hex.replace('#', '');
    
    // 确保十六进制颜色值长度为6
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    // 分割成红色、绿色和蓝色三个部分
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // 返回RGB格式的颜色值
    return `rgb(${r}, ${g}, ${b})`;
}