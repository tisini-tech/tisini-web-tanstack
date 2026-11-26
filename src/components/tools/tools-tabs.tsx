type ToolsTab = 'merge' | 'download'

type ToolsTabsProps = {
  activeTab: ToolsTab
  onTabChange: (tab: ToolsTab) => void
}

export function ToolsTabs({
  activeTab,
  onTabChange,
}: ToolsTabsProps) {
  const tabs: { id: ToolsTab; label: string }[] = [
    { id: 'merge', label: 'Merge Videos' },
    { id: 'download', label: 'Download Videos' },
  ]

  return (
    <div
      role="tablist"
      aria-label="Video tools"
      className="flex gap-2 border-b"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}