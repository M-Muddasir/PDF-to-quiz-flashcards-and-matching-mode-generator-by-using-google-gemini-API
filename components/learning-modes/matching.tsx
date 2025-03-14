import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, RotateCcw, Check, Moon, Sun, Trophy, Maximize, Minimize } from "lucide-react";
import { MatchingItem } from "@/lib/schemas";
import { useTheme } from "next-themes";

type MatchingProps = {
  matchingItems: MatchingItem[];
  clearPDF: () => void;
  title: string;
  onChangeMode: (mode: string) => void;
};

export default function Matching({
  matchingItems,
  clearPDF,
  title,
  onChangeMode,
}: MatchingProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shuffledTerms, setShuffledTerms] = useState<MatchingItem[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<MatchingItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Shuffle the terms and definitions
  useEffect(() => {
    const shuffleArray = (array: MatchingItem[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledTerms(shuffleArray(matchingItems));
    setShuffledDefinitions(shuffleArray(matchingItems));
  }, [matchingItems]);

  // Check if the game is complete
  useEffect(() => {
    if (matchedPairs.length === matchingItems.length) {
      setIsComplete(true);
    }
  }, [matchedPairs, matchingItems]);

  const handleTermClick = (item: MatchingItem) => {
    if (matchedPairs.includes(item.id)) return;
    setSelectedTerm(item.id);
  };

  const handleDefinitionClick = (item: MatchingItem) => {
    if (matchedPairs.includes(item.id)) return;
    setSelectedDefinition(item.id);
  };

  // Check for matches
  useEffect(() => {
    if (selectedTerm && selectedDefinition) {
      setAttempts(attempts + 1);
      
      // Find the matching items
      const termItem = matchingItems.find(item => item.id === selectedTerm);
      const defItem = matchingItems.find(item => item.id === selectedDefinition);
      
      // Check if they match (same ID means they're from the same pair)
      if (selectedTerm === selectedDefinition) {
        // Correct match
        setMatchedPairs([...matchedPairs, selectedTerm]);
        setCorrectMatches(correctMatches + 1);
      }
      
      // Reset selections after a short delay
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDefinition(null);
      }, 1000);
    }
  }, [selectedTerm, selectedDefinition]);

  const handleReset = () => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setMatchedPairs([]);
    setIsComplete(false);
    setAttempts(0);
    setCorrectMatches(0);
    
    // Reshuffle
    const shuffleArray = (array: MatchingItem[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledTerms(shuffleArray(matchingItems));
    setShuffledDefinitions(shuffleArray(matchingItems));
  };

  const accuracy = attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 0;

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
            <Button variant="outline" onClick={() => onChangeMode("flashcards")}>
              Flashcard Mode
            </Button>
          </div>
        </div>

        {isComplete ? (
          <Card className="w-full mb-8 border-2 border-primary/20">
            <CardContent className="space-y-4 p-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Trophy className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-4xl font-bold">Complete!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You matched all {matchingItems.length} pairs
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{attempts}</p>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{accuracy}%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Matched: {matchedPairs.length} of {matchingItems.length}
              </span>
              <span className="text-sm font-medium">
                Attempts: {attempts}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-in-out" 
                style={{ width: `${(matchedPairs.length / matchingItems.length) * 100}%` }}
              ></div>
            </div>
            {/* Show hint for matching */}
            {matchedPairs.length === 0 && attempts === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-center text-muted-foreground mb-4"
              >
                Select a term and then its matching definition
              </motion.div>
            )}
          </div>
        )}

        <div className={`grid grid-cols-2 gap-8 mb-8 ${isFullScreen ? 'flex-grow' : ''}`}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Terms</h2>
            {shuffledTerms.map((item) => (
              <Card
                key={`term-${item.id}`}
                className={`cursor-pointer transition-all ${
                  matchedPairs.includes(item.id)
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                    : selectedTerm === item.id
                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
                    : ""
                }`}
                onClick={() => handleTermClick(item)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <span>{item.term}</span>
                  {matchedPairs.includes(item.id) && (
                    <Check className="text-green-600 dark:text-green-400" size={20} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Definitions</h2>
            {shuffledDefinitions.map((item) => (
              <Card
                key={`def-${item.id}`}
                className={`cursor-pointer transition-all ${
                  matchedPairs.includes(item.id)
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                    : selectedDefinition === item.id
                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
                    : ""
                }`}
                onClick={() => handleDefinitionClick(item)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <span>{item.definition}</span>
                  {matchedPairs.includes(item.id) && (
                    <Check className="text-green-600 dark:text-green-400" size={20} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-muted hover:bg-muted/80 w-full transition-all duration-300"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
          </Button>
          <Button
            onClick={clearPDF}
            className="bg-primary hover:bg-primary/90 w-full transition-all duration-300"
          >
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </main>
    </div>
  );
}
