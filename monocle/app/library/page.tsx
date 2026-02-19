import { getAllArticles } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { BookOpen, FileText, Lightbulb, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const CategoryIcon: Record<string, any> = {
    'Theory': Brain,
    'Techniques': Lightbulb,
    'General': FileText
};

export default function LibraryPage() {
    const articles = getAllArticles();
    const categories = Array.from(new Set(articles.map(a => a.category)));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <BookOpen className="w-10 h-10 text-primary" />
                    Library
                </h1>
                <p className="text-muted text-lg">Essential reading for visualization development.</p>
            </header>

            {categories.map(cat => {
                const Icon = CategoryIcon[cat] || FileText;
                return (
                    <section key={cat} className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Icon className="w-6 h-6 text-secondary" />
                            {cat}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articles.filter(a => a.category === cat).map(article => (
                                <Link key={article.slug} href={`/library/${article.slug}`} className="group">
                                    <GlassCard className="h-full hover:bg-white/10 transition-all border-l-4 border-l-primary/50 hover:border-l-primary">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted line-clamp-2">
                                            {article.description}
                                        </p>
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
