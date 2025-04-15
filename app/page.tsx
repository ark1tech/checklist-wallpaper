"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Download, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ColorPicker } from "@/components/color-picker"

export default function ChecklistWallpaper() {
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")
  const [title, setTitle] = useState("My Checklist")
  const [backgroundColor, setBackgroundColor] = useState("#1e293b")
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(24)
  const [showTitle, setShowTitle] = useState(true)
  const [fontFamily, setFontFamily] = useState("Inter")
  const [imageUrl, setImageUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()])
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem()
    }
  }

  const generateImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // iPhone dimensions (using iPhone 12/13/14 dimensions)
    canvas.width = 1170
    canvas.height = 2532

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set text properties
    ctx.fillStyle = textColor
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.textAlign = "left"

    // Start 110 pts from the top
    const topMargin = 110
    const bottomMargin = 70
    let yPosition = topMargin
    const padding = 80

    // Draw title
    if (showTitle) {
      ctx.font = `bold ${fontSize * 1.5}px ${fontFamily}`
      ctx.fillText(title, padding, yPosition)
      yPosition += fontSize * 2.5
    }

    // Reset font for items
    ctx.font = `${fontSize}px ${fontFamily}`

    // Calculate available space
    const availableHeight = canvas.height - topMargin - bottomMargin
    const itemHeight = fontSize * 1.8

    // Adjust font size if needed to fit all items
    let adjustedFontSize = fontSize
    let adjustedItemHeight = itemHeight

    if (items.length > 0) {
      const requiredHeight = items.length * itemHeight
      if (requiredHeight > availableHeight) {
        const ratio = availableHeight / requiredHeight
        adjustedFontSize = Math.max(16, Math.floor(fontSize * ratio))
        adjustedItemHeight = adjustedFontSize * 1.8
        ctx.font = `${adjustedFontSize}px ${fontFamily}`
      }
    }

    // Draw checklist items
    items.forEach((item, index) => {
      // Ensure we don't exceed the bottom margin
      if (yPosition + adjustedItemHeight > canvas.height - bottomMargin) {
        return
      }

      // Draw checkbox
      ctx.strokeStyle = textColor
      ctx.lineWidth = 3
      ctx.strokeRect(padding, yPosition - adjustedFontSize + 5, adjustedFontSize, adjustedFontSize)

      // Draw text
      ctx.fillText(item, padding + adjustedFontSize * 1.5, yPosition)
      yPosition += adjustedItemHeight
    })

    // Convert canvas to image URL
    setImageUrl(canvas.toDataURL("image/png"))
  }

  const downloadImage = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "checklist-wallpaper.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Generate image when any customization option changes
  useEffect(() => {
    if (items.length > 0 || showTitle) {
      generateImage()
    }
  }, [items, title, backgroundColor, textColor, fontSize, showTitle, fontFamily])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Checklist Wallpaper Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="items">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="items">Checklist Items</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Checklist</CardTitle>
                  <CardDescription>Add items to your checklist wallpaper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new item..."
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button onClick={addItem} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mt-4">
                    {items.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No items yet. Add some items to your checklist.
                      </p>
                    ) : (
                      items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{item}</span>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customize" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Appearance</CardTitle>
                  <CardDescription>Adjust how your wallpaper looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={!showTitle}
                      />
                      <div className="flex items-center gap-2">
                        <Switch checked={showTitle} onCheckedChange={setShowTitle} id="show-title" />
                        <Label htmlFor="show-title">Show</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <ColorPicker color={textColor} onChange={setTextColor} />
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider
                      value={[fontSize]}
                      min={16}
                      max={48}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your checklist wallpaper preview</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative border rounded-xl overflow-hidden" style={{ width: 270, height: 584 }}>
                {imageUrl ? (
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Checklist Wallpaper"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                    Add items to see preview
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={downloadImage} disabled={!imageUrl} size="lg">
                <Download className="mr-2 h-4 w-4" /> Download Wallpaper
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
