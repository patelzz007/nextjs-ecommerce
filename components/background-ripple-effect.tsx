"use client"
import type React from "react"
import { useMemo, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export const BackgroundRippleEffect = ({
  cols = 27,
  cellSize = 56,
}: {
  rows?: number
  cols?: number
  cellSize?: number
}) => {
  const [rows, setRows] = useState(8)

  useEffect(() => {
    const calculateRows = () => {
      const viewportHeight = window.innerHeight
      const calculatedRows = Math.ceil(viewportHeight / cellSize) + 1
      setRows(calculatedRows)
    }

    calculateRows()
    window.addEventListener("resize", calculateRows)
    return () => window.removeEventListener("resize", calculateRows)
  }, [cellSize])

  const [clickedCell, setClickedCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [rippleKey, setRippleKey] = useState(0)
  const ref = useRef<any>(null)

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none",
        "[--cell-border-color:rgba(255,255,255,0.25)] [--cell-fill-color:rgba(59,130,246,0.15)] [--cell-shadow-color:rgba(59,130,246,0.4)]",
      )}
    >
      <div className="relative h-full w-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-2 h-full w-full overflow-hidden" />
        <DivGrid
          key={`base-${rippleKey}`}
          className="mask-radial-from-20% mask-radial-at-top opacity-600"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col })
            setRippleKey((k) => k + 1)
          }}
          interactive
        />
      </div>
    </div>
  )
}

type DivGridProps = {
  className?: string
  rows: number
  cols: number
  cellSize: number // in pixels
  borderColor: string
  fillColor: string
  clickedCell: { row: number; col: number } | null
  onCellClick?: (row: number, col: number) => void
  interactive?: boolean
}

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string
  ["--duration"]?: string
}

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "rgba(0,0,0,0.08)",
  fillColor = "rgba(59,130,246,0.05)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(() => Array.from({ length: rows * cols }, (_, idx) => idx), [rows, cols])

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  }

  return (
    <div className={cn("relative z-3", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols)
        const colIdx = idx % cols
        const distance = clickedCell ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx) : 0
        const delay = clickedCell ? Math.max(0, distance * 55) : 0 // ms
        const duration = 200 + distance * 80 // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {}

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-60 transition-opacity duration-150 will-change-transform hover:opacity-100 shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
              clickedCell && "animate-cell-ripple fill-mode-[none]",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        )
      })}
    </div>
  )
}
