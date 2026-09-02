import type { TopPlayer } from '#/lib/types'

type FootballTopScorersProps = {
  players: TopPlayer[]
}

export function FootballTopScorers({ players }: FootballTopScorersProps) {
  const scorers = players.filter((p) => p.name.trim() !== 'Own Goal')

  if (scorers.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center font-heading text-sm text-muted-foreground">
        No scorers data yet.
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-heading text-xs font-semibold tracking-wide text-accent-foreground uppercase sm:px-6">
                  Player
                </th>
                <th className="px-4 py-3 text-right font-heading text-xs font-semibold tracking-wide text-accent-foreground uppercase sm:px-6">
                  Goals
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scorers.map((player) => (
                <tr
                  key={player.player_id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 whitespace-nowrap sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-heading text-sm font-bold text-accent-foreground">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-heading text-sm font-medium capitalize text-foreground">
                          {player.name}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                          {player.team_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-heading text-base font-bold text-accent-foreground sm:px-6 sm:py-4">
                    {player.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
