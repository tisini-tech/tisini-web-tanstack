const halves = ['All', '1ST', '2ND'] as const

const StatsHalf = () => {
  return (
    <div className="my-2 flex justify-center">
      <div className="flex gap-4 sm:gap-6">
        {halves.map((label) => (
          <span
            key={label}
            className="font-heading text-base font-bold text-foreground sm:text-lg"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default StatsHalf
