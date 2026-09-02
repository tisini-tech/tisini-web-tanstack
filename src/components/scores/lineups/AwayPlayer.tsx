type AwayPlayerProps = {
  name: string
  jersey: string
}

const AwayPlayer = ({ name, jersey }: AwayPlayerProps) => {
  return (
    <div className="flex items-center justify-end gap-2 py-0.5">
      <span className="font-heading text-sm font-bold capitalize text-foreground">
        {name}
      </span>
      <span className="font-heading text-sm font-bold text-emerald-400">
        {jersey}
      </span>
    </div>
  )
}

export default AwayPlayer
