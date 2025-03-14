import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, FileText, Moon, Sun, Maximize, Minimize, RefreshCw } from "lucide-react";
import { Flashcard } from "@/lib/schemas";
import { useTheme } from "next-themes";

type FlashcardsProps = {
  flashcards: Flashcard[];
  clearPDF: () => void;
  title: string;
  onChangeMode: (mode: string) => void;
};

export default function Flashcards({
  flashcards,
  clearPDF,
  title,
  onChangeMode,
}: FlashcardsProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Loop back to the first card if we're at the end
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    } else {
      // Loop to the last card if we're at the beginning
      setCurrentCardIndex(flashcards.length - 1);
      setIsFlipped(false);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !completedCards.includes(currentCardIndex)) {
      setCompletedCards([...completedCards, currentCardIndex]);
    }
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCompletedCards([]);
  };

  const currentFlashcard = flashcards[currentCardIndex];
  const progress = (completedCards.length / flashcards.length) * 100;

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide hint after 5 seconds
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      <main className={`container mx-auto px-4 py-12 ${isFullScreen ? 'max-w-6xl h-full flex flex-col' : 'max-w-4xl'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <div className="flex gap-2 items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-9 h-9"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullScreen}
              className="rounded-full w-9 h-9 mr-2"
              aria-label="Toggle fullscreen"
            >
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={() => onChangeMode("quiz")}>
              Quiz Mode
            </Button>
            <Button variant="outline" onClick={() => onChangeMode("matching")}>
              Matching Mode
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm font-medium">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm font-medium">
            {completedCards.length} of {flashcards.length} reviewed
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className={`relative ${isFullScreen ? 'flex-grow' : 'min-h-[300px]'} mb-8 perspective-1000`}>
          {/* Hint overlay */}
          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Click card to flip</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div 
            className={`relative w-full ${isFullScreen ? 'h-full min-h-[500px]' : 'h-[300px]'} transition-all duration-500 transform-style-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlipCard}
          >
            {/* Front of card */}
            <div 
              className={`absolute w-full h-full backface-hidden rounded-xl border border-border shadow-lg ${
                theme === 'dark' ? 'bg-card text-card-foreground' : 'bg-white'
              } p-8 flex flex-col items-center justify-center`}
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Term
              </div>
              <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">
                {currentCardIndex + 1} / {flashcards.length}
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-[80%]"
              >
                <p className={`${isFullScreen ? 'text-4xl' : 'text-2xl'} font-bold mb-4`}>{currentFlashcard.term}</p>
                <div className="flex items-center justify-center mt-8 text-muted-foreground">
                  <span className="text-sm">Click to see definition</span>
                </div>
              </motion.div>
            </div>
            
            {/* Back of card */}
            <div 
              className={`absolute w-full h-full backface-hidden rounded-xl border border-border shadow-lg ${
                theme === 'dark' ? 'bg-card text-card-foreground' : 'bg-white'
              } p-8 flex flex-col items-center justify-center rotate-y-180`}
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Definition
              </div>
              <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">
                {currentCardIndex + 1} / {flashcards.length}
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-[80%]"
              >
                <p className={`${isFullScreen ? 'text-2xl' : 'text-xl'}`}>{currentFlashcard.definition}</p>
                <div className="flex items-center justify-center mt-8 text-muted-foreground">
                  <span className="text-sm">Click to see term</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetCards}
              className="flex items-center gap-1"
              title="Reset progress"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={clearPDF}
              className="flex items-center gap-1"
              title="Upload a new PDF"
            >
              <FileText className="h-4 w-4" />
              New PDF
            </Button>
          </div>

          <Button
            variant={currentCardIndex === flashcards.length - 1 ? "primary" : "outline"}
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
