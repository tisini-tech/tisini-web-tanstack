import { createFileRoute } from '@tanstack/react-router'
import { getEngagementsFn } from '#/data/quiz'
import { QuizList } from '#/components/quiz/quiz-list'

export const Route = createFileRoute('/quiz/')({
  loader: async () => {
    const quizzes = await getEngagementsFn()
    return { quizzes }
  },
  component: QuizPage,
  head: () => ({
    title: 'Quiz | Tisini',
    description: 'Play matchday quizzes to test your knowledge.',
    links: [
      {
        rel: 'canonical',
        href: 'https://tisini.com/quiz',
      },
    ],
    meta: [
      {
        name: 'description',
        content: 'Play matchday quizzes to test your knowledge.',
      },
    ],
  }),
})

function QuizPage() {
  const { quizzes } = Route.useLoaderData()

  return (
    <div>
      <section className="-mx-4 border-b border-border bg-card sm:-mx-6">
        <div className="border-b border-border/60 bg-muted/15 px-4 py-4 sm:px-6 sm:py-5">
          <h1 className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Quiz
          </h1>
          <p className="mt-1 text-sm text-foreground/90">
            Play matchday quizzes or check the leaderboard.
          </p>
        </div>
      </section>

      <section className="py-8">
        <QuizList quizzes={quizzes} />
      </section>
    </div>
  )
}
