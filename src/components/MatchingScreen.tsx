"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { calculateWeightedScore } from "../utils/scoring"

interface MatchingScreenProps {
  leftItems: string[]
  rightItems: string[]
  onComplete: (score: number, timeTaken: number) => void
}

interface TouchDragState {
  isDragging: boolean
  draggedItem: string | null
  draggedIndex: number | null
  touchStartPosition: { x: number; y: number } | null
  currentTouchPosition: { x: number; y: number } | null
  hoveredDropZone: number | null
}

interface DragPreviewProps {
  item: string
  position: { x: number; y: number }
  isVisible: boolean
}

const DragPreview: React.FC<DragPreviewProps> = ({ item, position, isVisible }) => {
  if (!isVisible) return null
  return (
    <div
      className="fixed pointer-events-none z-50 bg-white p-3 rounded-lg border-2 border-[#4A5FCC] shadow-lg transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="text-[#4A5FCC] text-lg font-bold">{item}</div>
    </div>
  )
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ leftItems, rightItems, onComplete }) => {
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([])
  const [matches, setMatches] = useState<{ [key: number]: string }>({})
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes timer
  const [showFeedback, setShowFeedback] = useState<{ [key: number]: "correct" | "wrong" }>({})
  const [gameCompleted, setGameCompleted] = useState(false)

  // Touch drag state
  const [touchDragState, setTouchDragState] = useState<TouchDragState>({
    isDragging: false,
    draggedItem: null,
    draggedIndex: null,
    touchStartPosition: null,
    currentTouchPosition: null,
    hoveredDropZone: null,
  })

  // Unified drag state that combines mouse and touch drag information
  const unifiedDragState = {
    isDragging: draggedItem !== null || touchDragState.isDragging,
    currentItem: draggedItem || touchDragState.draggedItem,
    currentIndex: draggedIndex ?? touchDragState.draggedIndex,
  }

  useEffect(() => {
    // Shuffle right items
    const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
    setShuffledRightItems(shuffled)
  }, [rightItems])

  useEffect(() => {
    if (gameCompleted) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameCompleted])

  // Check if game is completed whenever matches change
  useEffect(() => {
    if (Object.keys(matches).length === leftItems.length && !gameCompleted) {
      setGameCompleted(true)
      // Auto-submit after a short delay to show completion
      setTimeout(() => {
        handleSubmit()
      }, 1000)
    }
  }, [matches, leftItems.length, gameCompleted])

  const handleDragStart = (e: React.DragEvent, item: string, index: number) => {
    setDraggedItem(item)
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, leftIndex: number) => {
    e.preventDefault()
    if (draggedItem && draggedIndex !== null) {
      const correctAnswer = rightItems[leftIndex]
      const isCorrect = draggedItem === correctAnswer

      if (isCorrect) {
        setMatches((prev) => ({ ...prev, [leftIndex]: draggedItem }))
        setShowFeedback((prev) => ({ ...prev, [leftIndex]: "correct" }))
        // Only remove the item from the right side if it hasn't been matched yet
        // This ensures the block size on the left doesn't change due to removal
        setShuffledRightItems((prev) => prev.filter((_, index) => index !== draggedIndex));
      } else {
        setShowFeedback((prev) => ({ ...prev, [leftIndex]: "wrong" }))
        // Clear feedback after 1 second
        setTimeout(() => {
          setShowFeedback((prev) => {
            const newFeedback = { ...prev }
            delete newFeedback[leftIndex]
            return newFeedback
          })
        }, 1000)
      }
    }
    setDraggedItem(null)
    setDraggedIndex(null)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, item: string, index: number) => {
    try {
      e.preventDefault() // Prevent scrolling and text selection
      // Only handle single touch interactions
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      // Validate touch coordinates
      if (!touch || typeof touch.clientX !== "number" || typeof touch.clientY !== "number") return

      setTouchDragState({
        isDragging: true,
        draggedItem: item,
        draggedIndex: index,
        touchStartPosition: { x: touch.clientX, y: touch.clientY },
        currentTouchPosition: { x: touch.clientX, y: touch.clientY },
        hoveredDropZone: null,
      })
    } catch (error) {
      console.warn("Touch start error:", error)
      // Reset state on error
      setTouchDragState({
        isDragging: false,
        draggedItem: null,
        draggedIndex: null,
        touchStartPosition: null,
        currentTouchPosition: null,
        hoveredDropZone: null,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent scrolling
    if (!touchDragState.isDragging) return
    const touch = e.touches[0]

    // Find which drop zone is currently being hovered over
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const dropZone = elements.find((el) => el.hasAttribute("data-drop-zone-index"))
    const hoveredDropZone = dropZone ? Number.parseInt(dropZone.getAttribute("data-drop-zone-index") || "-1") : null

    setTouchDragState((prev) => ({
      ...prev,
      currentTouchPosition: { x: touch.clientX, y: touch.clientY },
      hoveredDropZone: hoveredDropZone !== null && hoveredDropZone >= 0 ? hoveredDropZone : null,
    }))
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchDragState.isDragging || !touchDragState.draggedItem || touchDragState.draggedIndex === null) {
      // Reset touch state
      setTouchDragState({
        isDragging: false,
        draggedItem: null,
        draggedIndex: null,
        touchStartPosition: null,
        currentTouchPosition: null,
        hoveredDropZone: null,
      })
      return
    }

    // Find drop zone at touch end position
    const touch = e.changedTouches[0]
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const dropZone = elements.find((el) => el.hasAttribute("data-drop-zone-index"))

    if (dropZone) {
      const leftIndex = Number.parseInt(dropZone.getAttribute("data-drop-zone-index") || "-1")
      if (leftIndex >= 0) {
        const correctAnswer = rightItems[leftIndex]
        const isCorrect = touchDragState.draggedItem === correctAnswer

        if (isCorrect) {
          setMatches((prev) => ({ ...prev, [leftIndex]: touchDragState.draggedItem! }))
          setShowFeedback((prev) => ({ ...prev, [leftIndex]: "correct" }))
          // Only remove the item from the right side if it hasn't been matched yet
          setShuffledRightItems((prev) => prev.filter((_, index) => index !== touchDragState.draggedIndex))
        } else {
          setShowFeedback((prev) => ({ ...prev, [leftIndex]: "wrong" }))
          // Clear feedback after 1 second
          setTimeout(() => {
            setShowFeedback((prev) => {
              const newFeedback = { ...prev }
              delete newFeedback[leftIndex]
              return newFeedback
            })
          }, 1000)
        }
      }
    }

    // Reset touch state
    setTouchDragState({
      isDragging: false,
      draggedItem: null,
      draggedIndex: null,
      touchStartPosition: null,
      currentTouchPosition: null,
      hoveredDropZone: null,
    })
  }

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault()
    // Reset touch state when touch is cancelled
    setTouchDragState({
      isDragging: false,
      draggedItem: null,
      draggedIndex: null,
      touchStartPosition: null,
      currentTouchPosition: null,
      hoveredDropZone: null,
    })
  }

  const handleSubmit = () => {
    const correctAnswers = Object.keys(matches).length // All matches in the matches object are correct
    const timeTaken = 120 - timeLeft
    
    // Calculate weighted score using the new scoring system
    const scoreResult = calculateWeightedScore({
      correctAnswers,
      totalQuestions: leftItems.length,
      timeTaken,
      timeLimit: 120
    });
    
    onComplete(scoreResult.totalScore, timeTaken)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isComplete = Object.keys(matches).length === leftItems.length

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-4" // Use min-h-screen for full height
      style={{
        backgroundImage: 'url("/s2.png")', // Background image added
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Keep background fixed when scrolling
      }}
    >
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-[650px] mb-4 w-full max-w-5xl"> {/* Increased gap for vertical spacing */}
        {/* Left Column - Questions with Answers */}
        <div className="bg-white rounded-lg border-2 border-[#4A5FCC] p-4 shadow-[inset_5px_0px_5px_-2px_rgba(0,0,0,0.1)] flex flex-col justify-evenly">
          {leftItems.map((item, index) => (
            <div key={index} className="group flex-grow flex-shrink-0">
              <div
                data-drop-zone-index={index}
                role="region"
                aria-label={`Drop zone for question: ${item}. ${
                  matches[index] ? `Matched with: ${matches[index]}` : "Available for matching"
                }`}
                aria-dropeffect={unifiedDragState.isDragging ? "move" : "none"}
                className={`py-4 transition-all duration-200 ${ // Consistent padding
                  showFeedback[index] === "wrong"
                    ? "bg-red-50"
                    : touchDragState.hoveredDropZone === index
                    ? "bg-green-50"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <p className="text-[#4A5FCC] text-lg font-bold">
                  {item}
                </p>
                {matches[index] && (
                  <p className="text-[#4A5FCC] text-base font-normal mt-2 pl-3 border-l-2 border-[#4A5FCC]">
                    {matches[index]}
                  </p>
                )}
              </div>
              {index < leftItems.length - 1 && <hr className="border-[#E0E6ED] my-3" />} {/* Increased vertical gap */}
            </div>
          ))}
        </div>

        {/* Right Column - Answer Options */}
        <div className="space-y-4"> {/* Increased vertical gap */}
          {shuffledRightItems.map((item, index) => (
            <div
              key={index}
              draggable
              role="button"
              tabIndex={0}
              aria-label={`Draggable answer: ${item}`}
              aria-grabbed={unifiedDragState.currentItem === item}
              onDragStart={(e) => handleDragStart(e, item, index)}
              onTouchStart={(e) => handleTouchStart(e, item, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              className="bg-white border-2 border-[#4A5FCC] rounded-lg px-4 py-3 text-[#4A5FCC] text-lg font-bold cursor-move hover:border-[#3d1df3] hover:shadow-md transition-all duration-150 shadow-[5px_0px_5px_-2px_rgba(0,0,0,0.1)]"
              style={{ touchAction: "none" }}
            >
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 mb-40">
        {/* Navigation and Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-[300px] h-[80px] rounded-full font-bold text-4xl transition-all duration-200 ${
              isComplete
                ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BF7] hover:to-[#7C3AED] text-white shadow-lg transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Matched
          </button>
        </div>
      </div>

      {/* Timer at bottom */}
      <div className="fixed bottom-0 left-0 right-0 py-2">
        <div
          className="absolute bottom-5 left-0 w-full px-5 z-10 flex items-center justify-center gap-2 text-4xl font-bold text-white"
          style={{
            background:
              'linear-gradient(to right, #30c5e5 0%, rgba(48,197,229,0.05) 45%, rgba(6,50,185,0.05) 55%, #0632b9 100%)',
          }}
        >
          <img src="/timer.png" alt="Timer" className="w-16 h-16" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Drag Preview for Touch */}
      <DragPreview
        item={touchDragState.draggedItem || ""}
        position={touchDragState.currentTouchPosition || { x: 0, y: 0 }}
        isVisible={touchDragState.isDragging && touchDragState.currentTouchPosition !== null}
      />
    </div>
  )
}