

import { Card, CardContent } from "../ui/card";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { footballDefinitions, rugbyDefinitions, basketballDefinitions } from "@/lib/data";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const sportsDefinition = {
    "football": footballDefinitions,
    "rugby": rugbyDefinitions,
    "basketball": basketballDefinitions,
} as const;

type Sport = keyof typeof sportsDefinition;

const sportConfig: Record<Sport, { label: string; emoji: string }> = {
    football: { label: "Football", emoji: "⚽" },
    rugby: { label: "Rugby", emoji: "🏉" },
    basketball: { label: "Basketball", emoji: "🏀" },
};

// ─── Types ───
interface VideoData {
    videoId: string;
    start: number;
    end: number;
}

interface SubEvent {
    title: string;
    description: string;
    video?: VideoData;
}

interface DefinitionItem {
    name: string;
    definition: string;
    subEvents?: SubEvent[];
    video?: VideoData;
}

// ─── Highlight matching text ───
const HighlightText = ({ text, query }: { text: string; query: string }) => {
    if (!query.trim()) return <>{text}</>;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

// ─── YouTube Player (direct iframe, no lazy observer) ───
const YouTubePlayer = ({ videoId, start, end, title }: { videoId: string; start: number; end: number; title: string }) => {
    return (
        <div className="rounded-lg overflow-hidden border border-border/50">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=1&rel=0`}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Video for ${title}`}
            />
        </div>
    );
};

// ─── Video Thumbnail (click to play) ───
const VideoThumbnail = ({ 
    videoId, 
    start, 
    end, 
    title 
}: { 
    videoId: string; 
    start: number; 
    end: number; 
    title: string;
}) => {
    return (
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 w-full sm:w-[240px]">
            <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt={`Thumbnail for ${title}`}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-2 py-1 rounded font-mono">
                {Math.floor(start / 60)}:{String(start % 60).padStart(2, '0')} - {Math.floor(end / 60)}:{String(end % 60).padStart(2, '0')}
            </div>
        </div>
    );
};

// ─── Sub-Event Card with Video ───
const SubEventCard = ({ 
    title, 
    description, 
    query, 
    video,
    isPlaying,
    onPlay
}: { 
    title: string; 
    description: string; 
    query: string;
    video?: VideoData;
    isPlaying: boolean;
    onPlay: () => void;
}) => {
    const hasVideo = video?.videoId?.trim();

    return (
        <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-all">
            <div className={cn(
                "gap-4",
                hasVideo ? "flex flex-col sm:flex-row items-start" : "block"
            )}>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <HighlightText text={title} query={query} />
                    </h4>
                    <p className="text-sm text-slate-900 dark:text-slate-300 leading-relaxed">
                        <HighlightText text={description} query={query} />
                    </p>
                </div>

                {hasVideo && (
                    <div 
                        className="flex-shrink-0 w-full sm:w-[240px] cursor-pointer"
                        onClick={onPlay}
                    >
                        {isPlaying ? (
                            <YouTubePlayer
                                videoId={video!.videoId}
                                start={video!.start}
                                end={video!.end}
                                title={title}
                            />
                        ) : (
                            <VideoThumbnail
                                videoId={video!.videoId}
                                start={video!.start}
                                end={video!.end}
                                title={title}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Toast ───
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 toast-enter">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                {message}
            </div>
        </div>
    );
};

// ─── Main Definition Card ───
const DefinitionCard = ({ 
    item, 
    idx, 
    sectionName, 
    expandedSections, 
    playingVideos,
    searchQuery,
    onCopy, 
    onVideoPlay
}: { 
    item: DefinitionItem; 
    idx: number; 
    sectionName: string;
    expandedSections: Record<string, boolean>;
    playingVideos: Record<string, boolean>;
    searchQuery: string;
    onCopy: (name: string, definition: string, e: React.MouseEvent) => void;
    onVideoPlay: (key: string) => void;
}) => {
    const videoKey = `${sectionName}-${idx}`;
    const isEventVideoPlaying = playingVideos[videoKey];
    const hasEventVideo = item.video?.videoId?.trim();
    const hasSubEvents = item.subEvents && item.subEvents.length >= 1;

    return (
        <details
            key={idx}
            open={expandedSections[sectionName] || undefined}
            className="group border border-border/50 rounded-xl overflow-hidden bg-muted/30 hover:border-primary/30 transition-all duration-200 open:shadow-lg open:shadow-primary/5 open:bg-card"
        >
            {/* ─── HEADER ─── */}
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-card-foreground p-5">
                <span className="pr-4 text-lg">
                    <HighlightText text={item.name} query={searchQuery} />
                </span>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={(e) => onCopy(item.name, item.definition, e)}
                        className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Copy definition"
                        aria-label="Copy definition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <span className="text-muted-foreground group-open:text-primary group-open:rotate-180 transition-all duration-200">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </div>
            </summary>

            {/* ─── CONTENT ─── */}
            <div className={cn(
                "px-5 pb-5 gap-6",
                hasEventVideo && !hasSubEvents ? "grid lg:grid-cols-2" : "block"
            )}>
                {/* TEXT CONTENT */}
                <div className="leading-7 text-slate-900 dark:text-slate-300">
                    {hasSubEvents ? (
                        <div className="space-y-3">
                            <p className="text-sm mb-3">
                                {item.definition}
                            </p>
                            <div className="grid gap-3">
                                {item.subEvents!.map((sub, i) => (
                                    <SubEventCard 
                                        key={i} 
                                        title={sub.title} 
                                        description={sub.description} 
                                        query={searchQuery}
                                        video={sub.video}
                                        isPlaying={playingVideos[`${videoKey}-sub-${i}`] || false}
                                        onPlay={() => onVideoPlay(`${videoKey}-sub-${i}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <HighlightText text={item.definition} query={searchQuery} />
                    )}
                </div>

                {/* EVENT-LEVEL VIDEO (only when no sub-events) */}
                {hasEventVideo && !hasSubEvents && (
                    <div 
                        className="rounded-lg overflow-hidden border border-border/50 lg:mt-0 cursor-pointer"
                        onClick={() => onVideoPlay(videoKey)}
                    >
                        {isEventVideoPlaying ? (
                            <YouTubePlayer
                                videoId={item.video!.videoId}
                                start={item.video!.start}
                                end={item.video!.end}
                                title={item.name}
                            />
                        ) : (
                            <VideoThumbnail
                                videoId={item.video!.videoId}
                                start={item.video!.start}
                                end={item.video!.end}
                                title={item.name}
                            />
                        )}
                    </div>
                )}
            </div>
        </details>
    );
};

// ─── MAIN METRICS COMPONENT ───
const Metrics = () => {
    const [selectedSport, setSelectedSport] = useState<Sport>("football");
    const [searchQuery, setSearchQuery] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentDefinition = sportsDefinition[selectedSport];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSportChange = (sport: Sport) => {
        if (sport === selectedSport) return;
        setIsTransitioning(true);
        setSearchQuery("");
        setExpandedSections({});
        setPlayingVideos({});
        setTimeout(() => {
            setSelectedSport(sport);
            setIsTransitioning(false);
        }, 150);
    };

    const filteredDefinition = useMemo(() => {
        return Object.entries(currentDefinition).map(([sectionName, items]) => ({
            sectionName,
            items: Array.isArray(items) ? items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.subEvents?.some(sub => 
                    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sub.description.toLowerCase().includes(searchQuery.toLowerCase())
                ) ?? false)
            ) : []
        })).filter(section => section.items.length > 0);
    }, [currentDefinition, searchQuery]);

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const handleCopy = (name: string, definition: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${name}: ${definition}`);
        setToast("Copied to clipboard!");
    };

    const handleVideoPlay = useCallback((key: string) => {
        setPlayingVideos(prev => ({ ...prev, [key]: true }));
    }, []);

    const totalTerms = Object.values(currentDefinition).reduce((acc, items) => 
        acc + (Array.isArray(items) ? items.length : 0), 0
    );

    return (
        <div id="definitions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-6">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    className="pl-10 pr-20 h-12 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-xl"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-background/50 rounded text-xs text-muted-foreground font-mono border border-border/30">
                    ⌘K
                </kbd>
            </div>

            {/* Sport Selector */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {(Object.keys(sportsDefinition) as Sport[]).map((sport) => (
                    <Button
                        key={sport}
                        onClick={() => handleSportChange(sport)}
                        className={cn(
                            "h-12 sm:h-14 md:h-16 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 border-2",
                            selectedSport === sport
                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                                : "bg-secondary border-transparent text-secondary-foreground hover:bg-white/20 hover:border-white/20 hover:scale-[1.01]"
                        )}
                    >
                        <span className="mr-1 sm:mr-2 text-lg sm:text-xl">{sportConfig[sport].emoji}</span>
                        <span className="hidden sm:inline">{sportConfig[sport].label}</span>
                    </Button>
                ))}
            </div>

            {/* Hero */}
            <section className="mt-12 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Globally Consistent Definitions
                </h2>
                <p className="mt-6 leading-8 text-muted-foreground text-lg">
                    Tisini data&apos;s key strength is the ability to provide in-depth, accessible data that is
                    consistent across the globe. Without this certainty, our player and team statistics can
                    be far less valuable and there would be a danger that different leagues would be
                    analysed in conflicting ways, rendering proper player comparison invalid.
                </p>
            </section>

            {/* Definitions Card */}
            <Card className="mt-14 bg-card text-card-foreground border-0 shadow-2xl shadow-black/10">
                <CardContent className="p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl">{sportConfig[selectedSport].emoji}</span>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {selectedSport.toUpperCase()}
                        </h1>
                    </div>

                    <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-4" />

                    <p className="text-center text-sm text-slate-500 mt-3">
                        {Object.keys(currentDefinition).length} sections &bull; {totalTerms} terms
                        {searchQuery && ` &bull; ${filteredDefinition.reduce((a, s) => a + s.items.length, 0)} matches`}
                    </p>

                    <div className={cn(
                        "grid gap-14 mt-12 transition-opacity duration-150",
                        isTransitioning ? "opacity-0" : "opacity-100"
                    )}>
                        {filteredDefinition.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-lg text-slate-400">No terms match your search.</p>
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="mt-2 text-primary hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            filteredDefinition.map(({sectionName, items}) => (
                                <section key={sectionName} className="grid gap-8">
                                    <div className="sticky top-20 z-10 bg-card/95 backdrop-blur-sm py-3 rounded-lg -mx-2 px-2">
                                        <div className="flex items-center justify-center gap-3">
                                            <h2 className="text-2xl font-semibold text-center text-card-foreground">
                                                {sectionName
                                                    .split("-")
                                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(" ")}
                                            </h2>
                                            <button
                                                onClick={() => toggleSection(sectionName)}
                                                className="text-xs text-primary hover:underline font-medium"
                                            >
                                                {expandedSections[sectionName] ? "Collapse All" : "Expand All"}
                                            </button>
                                        </div>
                                    </div>

                                    <dl className="grid gap-4 sm:gap-6 items-start">
                                        {Array.isArray(items) && items.map((item, idx) => (
                                            <DefinitionCard
                                                key={idx}
                                                item={item}
                                                idx={idx}
                                                sectionName={sectionName}
                                                expandedSections={expandedSections}
                                                playingVideos={playingVideos}
                                                searchQuery={searchQuery}
                                                onCopy={handleCopy}
                                                onVideoPlay={handleVideoPlay}
                                            />
                                        ))}
                                    </dl>
                                </section>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default Metrics;
