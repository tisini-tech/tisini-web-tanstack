type LineupsTitleProps = {
  title: string
}

const LineupsTitle = ({ title }: LineupsTitleProps) => {
  return (
    <div className="flex h-10 items-center justify-center border border-border bg-muted/40 font-heading text-base font-bold text-foreground md:text-xl">
      {title}
    </div>
  )
}

export default LineupsTitle
