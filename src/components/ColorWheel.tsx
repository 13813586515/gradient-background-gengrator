'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { 
  getAngleFromWheelPosition, 
  getColorFromWheelAngle, 
  getWheelPosition,
  getAllColorHarmonies,
  ColorHarmony,
  hexToHSL
} from '@/lib/colorUtils';

import { cn } from '@/lib/utils';
import { Sparkles, MousePointer2, Wand2 } from 'lucide-react';

type SelectionMode = 'free' | 'recommend';
type HarmonyType = 'Complementary' | 'Analogous' | 'Triadic' | 'Split Complementary' | 'Tetradic' | 'Square' | 'Monochromatic';

interface ColorWheelProps {
  initialColors?: string[];
  onColorsChange: (colors: string[]) => void;
  maxColors?: number;
}

const HARMONY_TYPES: { type: HarmonyType; label: string; description: string }[] = [
  { type: 'Complementary', label: '互补色', description: '高对比度，视觉冲击力强' },
  { type: 'Analogous', label: '类似色', description: '和谐统一，视觉舒适' },
  { type: 'Triadic', label: '三色组', description: '色彩丰富，平衡和谐' },
  { type: 'Split Complementary', label: '分裂互补', description: '对比强烈但不刺眼' },
  { type: 'Tetradic', label: '四色组', description: '丰富多彩，需平衡使用' },
  { type: 'Square', label: '方形配色', description: '四种颜色均衡分布' },
  { type: 'Monochromatic', label: '单色系', description: '简洁优雅，层次分明' },
];

// 使用深度比较来避免不必要的更新
function colorsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((color, i) => color.toLowerCase() === b[i].toLowerCase());
}

export function ColorWheel({ initialColors = ['#FF5828'], onColorsChange, maxColors = 4 }: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('Complementary');
  const [colors, setColors] = useState<string[]>(initialColors);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<ColorHarmony[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelCenter, setWheelCenter] = useState({ x: 140, y: 140 });
  const wheelRadius = 120;
  
  // 用于跟踪上一次通知父组件的颜色值
  const lastNotifiedColors = useRef<string[]>(initialColors);

  // 更新色轮中心位置
  useEffect(() => {
    const updateCenter = () => {
      if (wheelRef.current) {
        const rect = wheelRef.current.getBoundingClientRect();
        setWheelCenter({
          x: rect.width / 2,
          y: rect.height / 2
        });
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // 当初始颜色变化时更新（仅在初始加载时）
  useEffect(() => {
    setColors(prev => {
      if (!colorsEqual(prev, initialColors)) {
        lastNotifiedColors.current = initialColors;
        return initialColors;
      }
      return prev;
    });
  }, [initialColors]);

  // 计算推荐方案（只在组件挂载时计算一次）
  useEffect(() => {
    setColors(prev => {
      if (prev.length > 0) {
        const harmonies = getAllColorHarmonies(prev[0]);
        setRecommendations(harmonies);
      }
      return prev;
    });
  }, []);

  // 通知父组件颜色变化（使用深度比较避免重复通知）
  useEffect(() => {
    if (!colorsEqual(colors, lastNotifiedColors.current)) {
      lastNotifiedColors.current = [...colors];
      onColorsChange(colors);
    }
  });

  // 获取颜色在色轮上的位置
  const getColorPosition = useCallback((color: string) => {
    const hsl = hexToHSL(color);
    const angle = hsl.h;
    const distance = (hsl.s / 100) * wheelRadius * 0.85;
    return getWheelPosition(angle, distance, wheelCenter.x, wheelCenter.y);
  }, [wheelCenter.x, wheelCenter.y]);

  // 处理色轮点击/拖拽
  const handleWheelInteraction = useCallback((clientX: number, clientY: number, index?: number) => {
    if (!wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const dx = x - wheelCenter.x;
    const dy = y - wheelCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const clampedDistance = Math.min(distance, wheelRadius * 0.9);
    const angle = getAngleFromWheelPosition(x, y, wheelCenter.x, wheelCenter.y);
    
    const saturation = Math.round((clampedDistance / wheelRadius) * 100);
    const newColor = getColorFromWheelAngle(angle, Math.max(20, saturation), 50);
    
    setColors(prevColors => {
      if (mode === 'free') {
        // 自由模式：只修改指定索引的颜色
        if (index !== undefined && index >= 0 && index < prevColors.length) {
          const newColors = [...prevColors];
          newColors[index] = newColor;
          return newColors;
        } else if (prevColors.length < maxColors) {
          return [...prevColors, newColor];
        }
        return prevColors;
      } else {
        // 推荐模式：也只修改被拖拽的那个颜色，不重新生成整套方案
        if (index !== undefined && index >= 0 && index < prevColors.length) {
          const newColors = [...prevColors];
          newColors[index] = newColor;
          return newColors;
        }
        return prevColors;
      }
    });
  }, [mode, maxColors, wheelCenter.x, wheelCenter.y]);

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggedIndex(index ?? null);
    handleWheelInteraction(e.clientX, e.clientY, index);
  }, [handleWheelInteraction]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && draggedIndex !== null) {
      handleWheelInteraction(e.clientX, e.clientY, draggedIndex);
    }
  }, [isDragging, draggedIndex, handleWheelInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedIndex(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 处理色轮背景点击
  const handleWheelBackgroundClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.color-indicator')) {
      return;
    }
    handleMouseDown(e, undefined);
  }, [handleMouseDown]);

  // 移除颜色
  const removeColor = useCallback((index: number) => {
    setColors(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  // 应用推荐配色
  const applyRecommendation = useCallback((harmony: ColorHarmony) => {
    setColors(harmony.colors.slice(0, maxColors));
    setSelectedHarmony(harmony.name as HarmonyType);
  }, [maxColors]);

  // 预计算颜色位置
  const colorPositions = useMemo(() => {
    return colors.map(color => getColorPosition(color));
  }, [colors, getColorPosition]);

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setMode('free')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
            mode === 'free' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MousePointer2 className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => setMode('recommend')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
            mode === 'recommend' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="w-4 h-4" />
          推荐选择
        </button>
      </div>

      {/* 色轮区域 */}
      <div className="flex flex-col items-center gap-6">
        <div 
          ref={wheelRef}
          className="relative w-[280px] h-[280px] cursor-crosshair select-none"
          onMouseDown={handleWheelBackgroundClick}
        >
          {/* 色轮背景 - 使用CSS渐变实现平滑过渡 */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                hsl(0, 100%, 50%),
                hsl(30, 100%, 50%),
                hsl(60, 100%, 50%),
                hsl(90, 100%, 50%),
                hsl(120, 100%, 50%),
                hsl(150, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(210, 100%, 50%),
                hsl(240, 100%, 50%),
                hsl(270, 100%, 50%),
                hsl(300, 100%, 50%),
                hsl(330, 100%, 50%),
                hsl(360, 100%, 50%)
              )`
            }}
          />
          
          {/* 饱和度渐变层 - 从中心白色渐变到边缘透明，覆盖整个色轮 */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at center, 
                white 0%, 
                rgba(255,255,255,0.3) 30%,
                transparent 70%
              )`
            }}
          />

          {/* 颜色指示器 */}
          {colors.map((color, index) => {
            const pos = colorPositions[index];
            return (
              <div
                key={index}
                className="color-indicator absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                style={{
                  left: pos.x,
                  top: pos.y,
                  backgroundColor: color,
                  zIndex: draggedIndex === index ? 10 : 5
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            );
          })}

          {/* 点击添加提示 */}
          {colors.length < maxColors && mode === 'free' && !isDragging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                点击添加颜色
              </span>
            </div>
          )}
        </div>

        {/* 已选颜色列表 */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              已选颜色 ({colors.length}/{maxColors})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
              >
                <div 
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono">{color}</span>
                <button
                  onClick={() => removeColor(index)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={colors.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 推荐模式下的配色方案选择 */}
        {mode === 'recommend' && recommendations.length > 0 && (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">配色方案推荐</span>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
              {recommendations.map((harmony) => (
                <button
                  key={harmony.name}
                  onClick={() => applyRecommendation(harmony)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                    selectedHarmony === harmony.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex -space-x-1">
                    {harmony.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-background"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {HARMONY_TYPES.find(h => h.type === harmony.name)?.label || harmony.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {HARMONY_TYPES.find(h => h.type === harmony.name)?.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 自由模式下的提示 */}
        {mode === 'free' && (
          <div className="text-xs text-muted-foreground text-center">
            <p>在色轮上点击或拖拽来添加/移动颜色</p>
            <p>靠近中心 = 低饱和度，边缘 = 高饱和度</p>
          </div>
        )}
      </div>
    </div>
  );
}
