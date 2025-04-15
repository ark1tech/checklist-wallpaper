"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.click()
    }
  }, [isOpen])

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-10 h-10 rounded-md border border-input"
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 h-32 cursor-pointer"
          />
        </PopoverContent>
      </Popover>
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2 py-1 border rounded-md"
      />
    </div>
  )
}
