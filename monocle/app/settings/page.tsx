'use client';

import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseButton } from "@/components/ui/PulseButton";
import { useUserStore } from "@/lib/store";
import { useAudioSettings } from "@/hooks/useAudioSettings";
import { Trash2, Volume2, VolumeX, Save, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const resetStore = useUserStore((state) => state.reset);
    const level = useUserStore((state) => state.level);
    const setLevel = useUserStore((state) => state.setLevel);
    const { isEnabled, volume, mode, toggleAudio, setVolume, setMode } = useAudioSettings();
    const router = useRouter();

    // For now, manually clearing local storage since reset might not be in store yet
    const handleReset = () => {
        if (confirm("Are you sure you want to wipe all progress? This cannot be undone.")) {
            localStorage.removeItem('monocle-storage');
            window.location.reload();
        }
    };

    return (
        <DashboardLayout>
            <header className="mb-12">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-4">Settings</h1>
                <p className="text-muted text-lg">Configure your training environment.</p>
            </header>

            <div className="space-y-6 max-w-2xl">
                <GlassCard>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <Activity className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Visual Acuity Protocol</h3>
                                <p className="text-sm text-muted">Manually adjust your training complexity.</p>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-secondary">Lvl {useUserStore.getState().level}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => useUserStore.getState().setLevel(lvl)}
                                className={cn(
                                    "p-3 rounded-lg border text-center transition-all hover:bg-white/5",
                                    useUserStore.getState().level === lvl
                                        ? "bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(112,0,255,0.3)]"
                                        : "bg-black/20 border-white/5 text-muted hover:text-white"
                                )}
                            >
                                <span className="block text-xl font-bold mb-1">{lvl}</span>
                                <span className="text-[10px] uppercase tracking-wider block">
                                    {lvl === 1 ? 'Aphant' : lvl === 5 ? 'Prophant' : '....'}
                                </span>
                            </button>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {isEnabled ? <Volume2 className="w-6 h-6 text-primary" /> : <VolumeX className="w-6 h-6 text-muted" />}
                            <div>
                                <h3 className="text-lg font-bold text-white">Binaural Biofeedback</h3>
                                <p className="text-sm text-muted">Aural priming for cortical synchronization.</p>
                            </div>
                        </div>
                        <PulseButton
                            onClick={toggleAudio}
                            className={cn("px-4 py-1 text-xs", isEnabled ? "bg-primary text-black hover:bg-primary/90" : "bg-white/5 text-muted hover:bg-white/10")}
                        >
                            {isEnabled ? "ACTIVE" : "DISABLED"}
                        </PulseButton>
                    </div>

                    <div className={cn("space-y-6 transition-opacity duration-300", isEnabled ? "opacity-100" : "opacity-30 pointer-events-none")}>
                        {/* Mode Select */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode('alpha')}
                                className={cn(
                                    "flex-1 p-3 rounded-lg border text-left transition-all",
                                    mode === 'alpha' ? "border-primary bg-primary/10" : "border-white/5 bg-black/20"
                                )}
                            >
                                <span className={cn("block text-xs font-bold uppercase tracking-widest mb-1", mode === 'alpha' ? "text-primary" : "text-muted")}>Alpha (10Hz)</span>
                                <span className="text-sm text-white">Relaxation & Priming</span>
                            </button>
                            <button
                                onClick={() => setMode('gamma')}
                                className={cn(
                                    "flex-1 p-3 rounded-lg border text-left transition-all",
                                    mode === 'gamma' ? "border-accent-1 bg-accent-1/10" : "border-white/5 bg-black/20"
                                )}
                            >
                                <span className={cn("block text-xs font-bold uppercase tracking-widest mb-1", mode === 'gamma' ? "text-accent-1" : "text-muted")}>Gamma (40Hz)</span>
                                <span className="text-sm text-white">Deep Focus & Binding</span>
                            </button>
                        </div>

                        {/* Volume Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-muted uppercase tracking-widest">Volume Level</span>
                                <span className="text-xs text-primary font-mono">{Math.round(volume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.5"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <p className="text-xs text-muted/50 italic">
                            * Headphones required for binaural effect.
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="border-cyan-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Save className="w-6 h-6 text-cyan-500" />
                            <div>
                                <h3 className="text-lg font-bold text-white">Data Management</h3>
                                <p className="text-sm text-muted">Backup or transfer your neural profile.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <PulseButton
                            onClick={() => {
                                const data = localStorage.getItem('monocle-storage');
                                if (!data) return;
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `monocle-backup-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                            }}
                            className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                        >
                            EXPORT DATA
                        </PulseButton>

                        <div className="relative flex-1">
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const json = event.target?.result as string;
                                            const parsed = JSON.parse(json);

                                            // Basic validation
                                            if (!parsed.state || typeof parsed.state.level !== 'number') {
                                                throw new Error("Invalid Monocle data file");
                                            }

                                            if (confirm("This will overwrite your current progress. Continue?")) {
                                                localStorage.setItem('monocle-storage', json);
                                                window.location.reload();
                                            }
                                        } catch (err) {
                                            alert("Failed to import: Invalid file format.");
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <PulseButton className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                IMPORT DATA
                            </PulseButton>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="border-red-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            <div>
                                <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
                                <p className="text-sm text-muted">Reset all progress and diagnostic data.</p>
                            </div>
                        </div>
                        <PulseButton onClick={handleReset} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                            RESET DATA
                        </PulseButton>
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
