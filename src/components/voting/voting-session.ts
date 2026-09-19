const SESSION_ID_KEY = 'voting_browser_session_id'
const VOTED_CAUSES_KEY = 'voting_browser_voted_causes'
const BALLOT_PICKS_KEY = 'voting_browser_ballot_picks'

function assertBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Voting session is only available in the browser')
  }
}

function generateVotingSessionId() {
  const c = globalThis.crypto as Crypto | undefined

  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID()
  }

  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    c.getRandomValues(bytes)

    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16,
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  return `voting-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readJson<T>(key: string, fallback: T): T {
  assertBrowser()

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  assertBrowser()
  localStorage.setItem(key, JSON.stringify(value))
}

/** Stable anonymous session id for this browser (sent to the cast-vote API). */
export function getOrCreateVotingSessionId() {
  assertBrowser()

  const existing = localStorage.getItem(SESSION_ID_KEY)?.trim()
  if (existing) return existing

  const id = generateVotingSessionId()
  localStorage.setItem(SESSION_ID_KEY, id)
  return id
}

function readVotedCauseIds(): number[] {
  const list = readJson<unknown>(VOTED_CAUSES_KEY, [])
  if (!Array.isArray(list)) return []
  return list
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
}

export function hasVotedForCause(causeId: number) {
  return readVotedCauseIds().includes(causeId)
}

export function markCauseVoted(causeId: number) {
  const next = new Set(readVotedCauseIds())
  next.add(causeId)
  writeJson(VOTED_CAUSES_KEY, [...next])
}

/** True if this browser already voted (localStorage) or the server says so. */
export function resolveHasVoted(causeId: number, serverHasVoted?: boolean) {
  const local = hasVotedForCause(causeId)
  const server = Boolean(serverHasVoted)

  if (server && !local) {
    markCauseVoted(causeId)
  }

  return local || server
}

export type StoredBallotPick = {
  slot: number
  number: number
  label: string
  participantId: number
  name: string
  teamName: string | null
}

export function saveBallotPicks(causeId: number, picks: StoredBallotPick[]) {
  try {
    const all = readJson<Record<string, StoredBallotPick[]>>(BALLOT_PICKS_KEY, {})
    all[String(causeId)] = picks
    writeJson(BALLOT_PICKS_KEY, all)
  } catch {
    // ignore quota / private mode
  }
}

export function loadBallotPicks(causeId: number): StoredBallotPick[] | null {
  try {
    const all = readJson<Record<string, StoredBallotPick[]>>(BALLOT_PICKS_KEY, {})
    const picks = all[String(causeId)]
    return Array.isArray(picks) && picks.length > 0 ? picks : null
  } catch {
    return null
  }
}
