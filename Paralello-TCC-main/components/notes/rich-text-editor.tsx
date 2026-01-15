"use client"

import { useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      // Only set content if it's different to avoid cursor jumping
      // This is a simple check, for a full editor a more robust solution is needed
      if (editorRef.current.innerHTML === "" || content !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = content
      }
    }
  }, [])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h1>")}>
          <span className="text-xs font-bold">H1</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("formatBlock", "<h2>")}>
          <span className="text-xs font-bold">H2</span>
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Toggle size="sm" onPressedChange={() => execCommand("bold")}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("italic")}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("underline")}>
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("strikeThrough")}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Toggle size="sm" onPressedChange={() => execCommand("justifyLeft")}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("justifyCenter")}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("justifyRight")}>
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Toggle size="sm" onPressedChange={() => execCommand("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => execCommand("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-4 overflow-auto focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight: "300px" }}
      />
    </div>
  )
}
