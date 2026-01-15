"use client"

import { useState } from "react"
import { usePomodoro } from "@/contexts/pomodoro-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Minimize2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PomodoroWidget() {
  const { state, startTimer, pauseTimer, resetTimer, skipPhase, formatTime, hideWidget, showWidget } = usePomodoro()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!state.widgetVisible) {
    if (state.isRunning || state.timeLeft !== 25 * 60) {
      return (
        <Button
          onClick={showWidget}
          className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 h-12 w-12"
          size="icon"
        >
          <Play className="h-5 w-5" />
        </Button>
      )
    }
    return null
  }

  const phaseColors = {
    pomodoro: "from-[#FC1F69] to-[#FF6B9D]",
    shortBreak: "from-[#38B6FF] to-[#7DD3FF]",
    longBreak: "from-[#FFDE59] to-[#FFE999]",
  }

  const phaseNames = {
    pomodoro: "Pomodoro",
    shortBreak: "Pequena Pausa",
    longBreak: "Longa Pausa",
  }

  const progress = (state.timeLeft / (25 * 60)) * 100

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={cn("shadow-2xl border-2 overflow-hidden transition-all duration-300", isExpanded ? "w-80" : "w-64")}
      >
        <div className={`bg-gradient-to-br ${phaseColors[state.phase]} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-medium">Ciclo {state.currentCycle}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={hideWidget}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="text-center mb-3">
            <p className="text-white/80 text-xs mb-1">{phaseNames[state.phase]}</p>
            <p className="text-white text-3xl font-bold tracking-tight">{formatTime(state.timeLeft)}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${100 - progress}%` }} />
          </div>

          {/* Pomodoro progress dots */}
          <div className="flex justify-center gap-1 mb-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn("h-2 w-2 rounded-full", i < state.pomodorosCompleted ? "bg-white" : "bg-white/30")}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20 rounded-full bg-white/10"
              onClick={state.isRunning ? pauseTimer : startTimer}
            >
              {state.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={skipPhase}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-white/20">
              {state.activeTaskId && state.tasks.length > 0 && (
                <div className="mb-2">
                  {(() => {
                    const activeTask = state.tasks.find((t) => t.id === state.activeTaskId)
                    if (!activeTask) return null
                    return (
                      <div className="text-white/90 text-xs">
                        <p className="font-medium mb-1 truncate">{activeTask.text}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {Array.from({ length: activeTask.totalCycles }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  i < activeTask.completedCycles ? "bg-white" : "bg-white/30",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-white/70 text-xs">
                            {activeTask.completedCycles}/{activeTask.totalCycles}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
              <p className="text-white/80 text-xs text-center">
                {state.phase === "pomodoro"
                  ? "Foco total! Mantenha a concentração."
                  : "Aproveite sua pausa para descansar."}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
