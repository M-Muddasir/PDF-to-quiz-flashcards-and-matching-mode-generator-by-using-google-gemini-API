"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema, flashcardsSchema, matchingItemsSchema, LearningMode } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import Flashcards from "@/components/learning-modes/flashcards";
import Matching from "@/components/learning-modes/matching";
import ModeSelector from "@/components/mode-selector";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>([]);
  const [flashcards, setFlashcards] = useState<z.infer<typeof flashcardsSchema>>([]);
  const [matchingItems, setMatchingItems] = useState<z.infer<typeof matchingItemsSchema>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [selectedMode, setSelectedMode] = useState<LearningMode | null>(null);
  const [contentGenerated, setContentGenerated] = useState(false);

  const {
    submit: submitQuiz,
    object: partialQuestions,
    isLoading: isLoadingQuiz,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
      setContentGenerated(true);
    },
  });

  const {
    submit: submitFlashcards,
    object: partialFlashcards,
    isLoading: isLoadingFlashcards,
  } = experimental_useObject({
    api: "/api/generate-flashcards",
    schema: flashcardsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate flashcards. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setFlashcards(object ?? []);
      setContentGenerated(true);
    },
  });

  const {
    submit: submitMatching,
    object: partialMatching,
    isLoading: isLoadingMatching,
  } = experimental_useObject({
    api: "/api/generate-matching",
    schema: matchingItemsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate matching items. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setMatchingItems(object ?? []);
      setContentGenerated(true);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
    
    // Show mode selector after file is uploaded
    setSelectedMode("all"); // Default to all mode
    submitQuiz({ files: encodedFiles });
  };
  
  const handleModeSelect = (mode: LearningMode) => {
    setSelectedMode(mode);
    
    // We need to re-encode the files for each mode
    const getEncodedFiles = async () => {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        }))
      );
      
      if (mode === "quiz" && questions.length === 0) {
        submitQuiz({ files: encodedFiles });
      } else if (mode === "flashcards" && flashcards.length === 0) {
        submitFlashcards({ files: encodedFiles });
      } else if (mode === "matching" && matchingItems.length === 0) {
        submitMatching({ files: encodedFiles });
      }
    };
    
    getEncodedFiles();

  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
    setFlashcards([]);
    setMatchingItems([]);
    setSelectedMode(null);
    setContentGenerated(false);
  };

  const getProgress = () => {
    if (selectedMode === "quiz") {
      return partialQuestions ? (partialQuestions.length / 4) * 100 : 0;
    } else if (selectedMode === "flashcards") {
      return partialFlashcards ? (partialFlashcards.length / 8) * 100 : 0;
    } else if (selectedMode === "matching") {
      return partialMatching ? (partialMatching.length / 6) * 100 : 0;
    }
    return 0;
  };
  
  const progress = getProgress();

  if (contentGenerated && selectedMode) {
    if (selectedMode === "quiz" && questions.length === 4) {
      return (
        <Quiz 
          title={title ?? "Quiz"} 
          questions={questions} 
          clearPDF={clearPDF} 
        />
      );
    } else if (selectedMode === "flashcards" && flashcards.length > 0) {
      return (
        <Flashcards 
          title={title ?? "Flashcards"} 
          flashcards={flashcards} 
          clearPDF={clearPDF} 
          onChangeMode={(mode) => handleModeSelect(mode as LearningMode)}
        />
      );
    } else if (selectedMode === "matching" && matchingItems.length > 0) {
      return (
        <Matching 
          title={title ?? "Matching Game"} 
          matchingItems={matchingItems} 
          clearPDF={clearPDF} 
          onChangeMode={(mode) => handleModeSelect(mode as LearningMode)}
        />
      );
    } else if (selectedMode && !isLoadingQuiz && !isLoadingFlashcards && !isLoadingMatching) {
      return (
        <ModeSelector 
          title={title ?? "Choose Learning Mode"} 
          onSelectMode={handleModeSelect} 
        />
      );
    }
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        console.log(e.dataTransfer.files);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="rounded-full bg-primary/10 p-2">
              <FileUp className="h-6 w-6" />
            </div>
            <Plus className="h-4 w-4" />
            <div className="rounded-full bg-primary/10 p-2">
              <Loader2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              PDF Quiz Generator
            </CardTitle>
            <CardDescription className="text-base">
              Upload a PDF to generate an interactive quiz based on its content
              using the <Link href="https://sdk.vercel.ai">AI SDK</Link> and{" "}
              <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                Google&apos;s Gemini Pro
              </Link>
              .
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-foreground">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop your PDF here or click to browse.</span>
                )}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={files.length === 0}
            >
              {isLoadingQuiz || isLoadingFlashcards || isLoadingMatching ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Content...</span>
                </span>
              ) : (
                "Generate Learning Content"
              )}
            </Button>
          </form>
        </CardContent>
        {(isLoadingQuiz || isLoadingFlashcards || isLoadingMatching) && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="w-full space-y-2">
              <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLoadingQuiz || isLoadingFlashcards || isLoadingMatching ? "bg-yellow-500/50 animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
                  {selectedMode === "quiz" && partialQuestions
                    ? `Generating question ${partialQuestions.length + 1} of 4`
                    : selectedMode === "flashcards" && partialFlashcards
                    ? `Generating flashcard ${partialFlashcards.length + 1} of 8`
                    : selectedMode === "matching" && partialMatching
                    ? `Generating matching item ${partialMatching.length + 1} of 6`
                    : "Analyzing PDF content"}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      <motion.div
        className="flex flex-row gap-4 items-center justify-between fixed bottom-6 text-xs "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
        <NextLink
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-pdf-support"
          className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <GitIcon />
          View Source Code
        </NextLink>
      </motion.div>
    </div>
  );
}
