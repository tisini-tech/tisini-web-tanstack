import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  Loader2Icon,
  PlayIcon,
  TrophyIcon,
} from 'lucide-react'

import { cn } from '#/lib/utils'
import { submitQuizFn } from '#/data/quiz'
import { Button } from '#/components/ui/button'
import type { QuestionChoice, Engagement } from '#/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { EngagementSection } from './engagement-card'

type EngagementPlayProps = {
  engagement: Engagement
  type: EngagementSection
}

type QuizAnswer = {
  questionId: number
  choiceIds: number[]
  textAnswer: string
  responseMs: number
}

function isMultipleAnswerType(answerType: string): boolean {
  return answerType.toUpperCase() === 'MA'
}

function isFreeTextQuestion(
  question: { answer_type: string; choices?: unknown[] } | undefined,
): boolean {
  if (!question) return false
  return (
    question.answer_type.toUpperCase() === 'FT' ||
    (question.choices ?? []).length === 0
  )
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

export function EngagementHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="border-b border-border/60 bg-muted/15 px-4 py-2.5">
      <h2 className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-muted-foreground/75">{subtitle}</p>
      ) : null}
    </header>
  )
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function EngagementPlay({ engagement, type }: EngagementPlayProps) {
  const isPredictor = type === 'tanobora'
  const sectionLabel = isPredictor ? 'Tano Bora' : 'Quiz'
  const listLabel = isPredictor ? 'All Tano Bora' : 'All quizzes'
  // Shuffle once per play session so order can't be shared across players.
  const questions = useMemo(
    () =>
      shuffle(engagement.questions ?? []).map((question) => ({
        ...question,
        choices: shuffle(question.choices ?? []),
      })),
    [engagement.id],
  )

  const [hasStarted, setHasStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([])
  const [selectedText, setSelectedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const questionStartedAtRef = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const hasTimedQuestions = useMemo(
    () => questions.some((question) => question.timer_seconds > 0),
    [questions],
  )
  const hasFreeText = useMemo(
    () => questions.some((question) => isFreeTextQuestion(question)),
    [questions],
  )

  const isMultiple = isMultipleAnswerType(currentQuestion?.answer_type ?? '')
  const isFreeText = isFreeTextQuestion(currentQuestion)
  const trimmedAnswer = selectedText.trim()
  const canContinue = isFreeText
    ? trimmedAnswer.length > 0
    : selectedChoiceIds.length > 0

  const toggleChoice = useCallback(
    (choiceId: number) => {
      setSelectedChoiceIds((prev) => {
        if (isMultiple) {
          return prev.includes(choiceId)
            ? prev.filter((id) => id !== choiceId)
            : [...prev, choiceId]
        }

        return [choiceId]
      })
    },
    [isMultiple],
  )

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion) return

    const responseMs = Date.now() - questionStartedAtRef.current

    setAnswers((prev) => [
      ...prev.filter((answer) => answer.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        choiceIds: isFreeText ? [] : selectedChoiceIds,
        textAnswer: isFreeText ? selectedText.trim() : '',
        responseMs,
      },
    ])

    if (currentIndex >= totalQuestions - 1) {
      setIsComplete(true)
      return
    }

    setCurrentIndex((index) => index + 1)
  }, [
    currentIndex,
    currentQuestion,
    isFreeText,
    selectedChoiceIds,
    selectedText,
    totalQuestions,
  ])

  const handleSubmit = async () => {
    if (isSubmitting) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await submitQuizFn({
        data: {
          quizId: String(engagement.id),
          answers,
        },
      })

      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Could not submit your answers',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!hasStarted || !currentQuestion || isComplete) return

    if (currentQuestion.timer_seconds > 0) {
      setTimeLeft(currentQuestion.timer_seconds)
      return
    }

    setTimeLeft(null)
  }, [hasStarted, currentQuestion, isComplete])

  useEffect(() => {
    if (!hasStarted || timeLeft === null || isComplete) return

    if (timeLeft <= 0) {
      goToNextQuestion()
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => (value === null ? null : value - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [hasStarted, timeLeft, isComplete, goToNextQuestion])

  useEffect(() => {
    if (!hasStarted) return
    questionStartedAtRef.current = Date.now()
    setSelectedChoiceIds([])
    setSelectedText('')
  }, [hasStarted, currentIndex])

  if (totalQuestions === 0) {
    return (
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <EngagementHeader
          title={engagement.title}
          subtitle="No questions available"
        />

        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          This {isPredictor ? 'predictor' : 'quiz'} does not have any questions
          yet. Check back later.
        </p>
      </article>
    )
  }

  if (!hasStarted) {
    return (
      <>
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <EngagementHeader
            title={engagement.title}
            subtitle={`${totalQuestions} ${
              isPredictor
                ? totalQuestions === 1
                  ? 'event'
                  : 'events'
                : totalQuestions === 1
                  ? 'question'
                  : 'questions'
            }.`}
          />
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {isPredictor
                ? 'Read the instructions, then start when you are ready to call the match.'
                : 'Read the instructions, then start when you are ready.'}
            </p>
          </div>
        </article>

        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) return
          }}
        >
          <DialogContent showCloseButton={false} className="gap-5 sm:max-w-md">
            <DialogHeader className="gap-2">
              <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                {sectionLabel}
              </p>
              <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
                {isPredictor ? 'Ready to call them?' : 'Ready to play?'}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {engagement.description?.trim() ||
                  (isPredictor
                    ? 'Five events in the match. Call each one before you submit.'
                    : 'A few things to know before you start this quiz.')}
              </DialogDescription>
            </DialogHeader>

            <ul className="space-y-2">
              <Brief
                text={
                  isPredictor
                    ? `${totalQuestions} ${totalQuestions === 1 ? 'event' : 'events'} to call in this match.`
                    : `${totalQuestions} ${totalQuestions === 1 ? 'question' : 'questions'} in this quiz.`
                }
              />
              <Brief
                text={
                  isPredictor
                    ? 'Pick the outcome you expect. Some events ask for every option that applies.'
                    : 'Some questions are single choice. Others ask you to select every option that applies.'
                }
              />
              {hasTimedQuestions ? (
                <Brief text="When a timer hits zero, that question moves on. Answer before it runs out." />
              ) : null}
              {hasFreeText ? (
                <Brief text="Some questions ask you to type the answer instead of picking one." />
              ) : null}
              <Brief text="You can review at the end, then submit. Submitted answers cannot be changed." />
              {engagement.prize_description?.trim() ? (
                <Brief text={`Prize: ${engagement.prize_description.trim()}`} />
              ) : null}
            </ul>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => setHasStarted(true)}
                className="h-11 w-full text-sm font-bold"
              >
                <PlayIcon className="size-4 fill-current" aria-hidden />
                {isPredictor ? 'Start predicting' : 'Start quiz'}
              </Button>
              <Link
                to="/engagements/$engType"
                params={{ engType: type }}
                className="inline-flex h-10 items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden />
                {listLabel}
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (isComplete) {
    const answeredCount = answers.filter(
      (answer) =>
        answer.choiceIds.length > 0 || answer.textAnswer.trim() !== '',
    ).length

    if (isSubmitted) {
      return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <EngagementHeader
            title={`${sectionLabel} complete`}
            subtitle={`${answeredCount} of ${totalQuestions} answered.`}
          />

          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <TrophyIcon className="size-8" aria-hidden />
            </div>

            <h2 className="mt-5 font-heading text-2xl font-black tracking-tight uppercase">
              Well played
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your answers for {engagement.title} have been submitted.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                render={
                  <Link
                    to="/engagements/$engType/$engagementId/leaderboard"
                    params={{
                      engType: type,
                      engagementId: String(engagement.id),
                    }}
                  />
                }
                variant="secondary"
                size="lg"
                className="h-11 px-5 text-xs font-bold tracking-[0.08em] uppercase"
              >
                View leaderboard
              </Button>
              <Button
                type="button"
                render={
                  <Link to="/engagements/$engType" params={{ engType: type }} />
                }
                variant="outline"
                size="lg"
                className="h-11 px-5 text-xs font-bold tracking-[0.08em] uppercase"
              >
                {listLabel}
              </Button>
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <EngagementHeader
          title="Ready to submit"
          subtitle={`${answeredCount} of ${totalQuestions} answered`}
        />

        <div className="flex flex-col items-center px-6 py-12 text-center">
          <h2 className="font-heading text-2xl font-black tracking-tight uppercase">
            Review your {engagement.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            You have finished {engagement.title}. Submit your answers when you
            are ready — this cannot be changed afterwards.
          </p>

          {submitError ? (
            <p className="mt-4 max-w-sm text-sm text-destructive">
              {submitError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting || answeredCount === 0}
              onClick={() => void handleSubmit()}
              className="h-11 min-w-40 px-5 text-xs font-bold tracking-[0.08em] uppercase"
            >
              {isSubmitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                'Submit answers'
              )}
            </Button>
          </div>
        </div>
      </article>
    )
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const hasTimer = currentQuestion.timer_seconds > 0

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <EngagementHeader
        title={engagement.title}
        subtitle={`Question ${currentIndex + 1} of ${totalQuestions}`}
      />

      <div className="space-y-6 px-4 py-5 sm:px-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Progress
            </p>
            {hasTimer && timeLeft !== null ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
                  timeLeft <= 5
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-muted text-foreground/80',
                )}
              >
                <ClockIcon className="size-3.5" aria-hidden />
                {formatTimer(timeLeft)}
              </span>
            ) : null}
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-lg leading-snug font-semibold text-foreground">
              {currentQuestion.text}
            </p>

            {currentQuestion.image_url ? (
              <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
                <img
                  src={currentQuestion.image_url}
                  alt=""
                  className="max-h-56 w-full object-cover"
                />
              </div>
            ) : null}

            {currentQuestion.points > 0 ? (
              <p className="text-xs font-medium text-muted-foreground">
                {currentQuestion.points}{' '}
                {currentQuestion.points === 1 ? 'point' : 'points'}
                {isFreeText
                  ? ' · Type your answer'
                  : isMultiple
                    ? ' · Select all that apply'
                    : null}
              </p>
            ) : isFreeText ? (
              <p className="text-xs font-medium text-muted-foreground">
                Type your answer
              </p>
            ) : isMultiple ? (
              <p className="text-xs font-medium text-muted-foreground">
                Select all that apply
              </p>
            ) : null}
          </div>

          {isFreeText ? (
            <label className="block">
              <span className="sr-only">Your answer</span>
              <input
                type="text"
                value={selectedText}
                onChange={(event) => setSelectedText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && trimmedAnswer) {
                    event.preventDefault()
                    goToNextQuestion()
                  }
                }}
                placeholder="Type your answer"
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
              />
            </label>
          ) : (
            <div className="grid gap-3">
              {(currentQuestion.choices ?? []).map((choice) => (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  multiple={isMultiple}
                  selected={selectedChoiceIds.includes(choice.id)}
                  onSelect={() => toggleChoice(choice.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-5">
          <p className="text-xs text-muted-foreground">
            {canContinue
              ? isMultiple
                ? `${selectedChoiceIds.length} selected. Tap next to continue.`
                : 'Tap next to continue.'
              : isFreeText
                ? 'Type an answer to continue.'
                : isMultiple
                  ? 'Select one or more answers to continue.'
                  : 'Select an answer to continue.'}
          </p>

          <Button
            type="button"
            size="lg"
            disabled={!canContinue}
            onClick={goToNextQuestion}
            className="h-11 gap-1.5 px-5 text-xs font-bold tracking-[0.08em] uppercase"
          >
            {currentIndex >= totalQuestions - 1 ? 'Finish' : 'Next'}
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </article>
  )
}

function Brief({ text }: { text: string }) {
  return (
    <li className="flex gap-3 rounded-xl bg-muted/40 px-3.5 py-3 text-sm leading-snug text-foreground">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
      <span>{text}</span>
    </li>
  )
}

function ChoiceButton({
  choice,
  multiple,
  selected,
  onSelect,
}: {
  choice: QuestionChoice
  multiple: boolean
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors',
        selected
          ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500/30'
          : 'border-border bg-muted/30 text-foreground hover:border-emerald-500/40 hover:bg-muted/50',
      )}
    >
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center border transition-colors',
          multiple ? 'rounded-md' : 'rounded-full',
          selected
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-border bg-background text-transparent',
        )}
        aria-hidden
      >
        <CheckIcon className="size-3" />
      </span>
      <span className="leading-snug">{choice.text}</span>
    </button>
  )
}
