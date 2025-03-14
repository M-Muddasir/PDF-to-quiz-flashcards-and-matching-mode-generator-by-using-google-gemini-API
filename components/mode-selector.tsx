import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ListChecks, Layers } from "lucide-react";
import { LearningMode } from "@/lib/schemas";

type ModeSelectorProps = {
  onSelectMode: (mode: LearningMode) => void;
  title: string;
};

export default function ModeSelector({ onSelectMode, title }: ModeSelectorProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          {title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onSelectMode("quiz")}>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
                <ListChecks className="h-8 w-8" />
              </div>
              <CardTitle>Quiz Mode</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Test your knowledge with multiple-choice questions
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onSelectMode("flashcards")}>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle>Flashcards</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Study with interactive flashcards to memorize concepts
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onSelectMode("matching")}>
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
                <Layers className="h-8 w-8" />
              </div>
              <CardTitle>Matching Game</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Match terms with their definitions in a fun game
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
