import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_FIXTURE_TYPE } from '@/lib/scores'

export const Route = createFileRoute('/glossary/')({
  beforeLoad: () => {
    throw redirect({
      to: '/glossary/$fixtype',
      params: { fixtype: DEFAULT_FIXTURE_TYPE },
      replace: true,
    })
  },
})
