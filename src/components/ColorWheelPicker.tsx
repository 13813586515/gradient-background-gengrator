'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { hslToHex, hexToHsl, getBestRecommendations, ColorRecommendation } from '@/lib/colorTheory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorWheelPickerProps {
  colors: string[]
  onColorsChange: (colors: string[]) => void
}

type SelectionMode = 'free' | 'recommended'

export function ColorWheelPicker({ colors, onColorsChange }: ColorWheelPickerProps) {
  const [mode, setMode] = useState<SelectionMode>('free')
  const [baseColor, setBaseColor] = useState<string>(colors[0] || '#5135FF')
  const [recommendations, setRecommendations] = useState<ColorRecommendation[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    drawColorWheel()
  }, [])

  useEffect(() => {
    drawColorWheel()
  }, [mode])

  useEffect(() => {
    if (mode === 'recommended') {
      const recs = getBestRecommendations(baseColor)
      setRecommendations(recs)
    }
  }, [mode, baseColor])

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 280
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 0.5) * (Math.PI / 180)
      const endAngle = (angle + 0.5) * (Math.PI / 180)

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, hslToHex(angle, 0, 100))
      gradient.addColorStop(1, hslToHex(angle, 100, 50))

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }, [])

  const getColorFromPosition = useCallback((x: number, y: number): string => {
    const canvas = canvasRef.current
    if (!canvas) return '#000000'

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const canvasX = (x - rect.left) * scaleX
    const canvasY = (y - rect.top) * scaleY

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const dx = canvasX - centerX
    const dy = canvasY - centerY

    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    angle = (angle + 360) % 360

    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), centerX - 10)
    const saturation = (distance / (centerX - 10)) * 100
    const lightness = 50 + (1 - distance / (centerX - 10)) * 50

    return hslToHex(angle, saturation, lightness)
  }, [])

  const getPositionFromColor = useCallback((color: string) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const hsl = hexToHsl(color)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const distance = (hsl.s / 100) * (centerX - 10)
    const angle = hsl.h * (Math.PI / 180)

    const x = centerX + distance * Math.cos(angle)
    const y = centerY + distance * Math.sin(angle)

    const rect = canvas.getBoundingClientRect()
    const scaleX = rect.width / canvas.width
    const scaleY = rect.height / canvas.height

    return { x: x * scaleX, y: y * scaleY }
  }, [])

  const handleMarkerMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedIndex(index)
  }, [])

  const handleCanvasMouseUp = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedIndex === null) return

    const color = getColorFromPosition(e.clientX, e.clientY)

    if (mode === 'free') {
      const newColors = [...colors]
      newColors[draggedIndex] = color
      onColorsChange(newColors)
    } else {
      setBaseColor(color)
    }
  }, [mode, colors, onColorsChange, getColorFromPosition, draggedIndex])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (draggedIndex !== null) return

    const color = getColorFromPosition(e.clientX, e.clientY)

    if (mode === 'free') {
      onColorsChange([color, ...colors.filter(c => c !== color)].slice(0, 8))
    } else {
      setBaseColor(color)
    }
  }, [mode, colors, onColorsChange, getColorFromPosition, draggedIndex])

  const addColor = () => {
    if (colors.length < 8) {
      onColorsChange([...colors, '#ffffff'])
    }
  }

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index)
      onColorsChange(newColors)
    }
  }

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    onColorsChange(newColors)
  }

  const handleRecommendationClick = useCallback((recommendation: ColorRecommendation) => {
    onColorsChange(recommendation.colors.slice(0, 8))
  }, [onColorsChange])

  const displayColors = mode === 'free' ? colors : [baseColor]

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={mode === 'free' ? 'default' : 'outline'}
          onClick={() => setMode('free')}
          className="flex-1"
        >
          自由选择
        </Button>
        <Button
          variant={mode === 'recommended' ? 'default' : 'outline'}
          onClick={() => setMode('recommended')}
          className="flex-1"
        >
          推荐选择
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
            className="cursor-pointer rounded-full shadow-lg"
            style={{ width: 280, height: 280 }}
          />
          {displayColors.map((color, index) => {
            const pos = getPositionFromColor(color)
            return (
              <div
                key={index}
                className={cn(
                  "absolute w-6 h-6 rounded-full border-4 border-white shadow-lg z-10",
                  draggedIndex === index ? "cursor-grabbing" : "cursor-grab"
                )}
                style={{
                  left: pos.x - 12,
                  top: pos.y - 12,
                  backgroundColor: color,
                  zIndex: 10 + index,
                }}
                onMouseDown={(e) => handleMarkerMouseDown(e, index)}
              />
            )
          })}
        </div>

        {mode === 'free' && (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">已选择的颜色</h3>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
                {colors.length}/8
              </span>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl cursor-pointer border-2 hover:border-primary transition-colors"
                    />
                  </div>
                  <Input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="font-mono text-sm tracking-wider uppercase"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(index)}
                    disabled={colors.length <= 1}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {colors.length < 8 && (
              <Button onClick={addColor} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                <Plus className="w-4 h-4 mr-2" />
                添加颜色
              </Button>
            )}
          </div>
        )}

        {mode === 'recommended' && (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: baseColor }}
                />
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-12 p-0 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-sm">{baseColor.toUpperCase()}</span>
              </div>
              <p className="text-xs text-muted-foreground">在色轮上点击或拖拽选择基础颜色</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">推荐配色方案</h3>
              <div className="grid grid-cols-1 gap-3">
                {recommendations.map((rec) => (
                  <button
                    key={rec.type}
                    onClick={() => handleRecommendationClick(rec)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border border-border p-4 text-left transition-all hover:shadow-md",
                      colors.length === rec.colors.length && colors.every((c, i) => c === rec.colors[i])
                        ? "ring-2 ring-primary"
                        : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{rec.name}</span>
                      <div className="flex gap-1">
                        {rec.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-md border border-border/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className="mt-3 h-8 rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, ${rec.colors.join(', ')})`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
