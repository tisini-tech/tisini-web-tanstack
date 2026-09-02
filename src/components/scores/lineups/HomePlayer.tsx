type HomePlayerProps = {
  jersey: string
  name: string
}

const HomePlayer = ({ jersey, name }: HomePlayerProps) => {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="font-heading text-sm font-bold text-emerald-400">
        {jersey}
      </span>
      <span className="font-heading text-sm font-bold capitalize text-foreground">
        {name}
      </span>
    </div>
  )
}

export default HomePlayer
