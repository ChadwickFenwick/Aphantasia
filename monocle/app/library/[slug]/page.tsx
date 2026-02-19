import { getArticleBySlug } from "@/lib/content";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
// import ReactMarkdown from 'react-markdown'; // Removed to avoid dependency error

// Simple Markdown Renderer (if package not installed, we can use a basic replacement or just pre-wrap)
// For now, let's assume we might not have 'react-markdown' installed, so I'll write a basic parser.
// Actually, let's just use whitespace-pre-wrap for now to be safe and simple.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <Link href="/library" className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Library
            </Link>

            <GlassCard className="p-8 md:p-12">
                <header className="mb-8 border-b border-white/10 pb-8">
                    <div className="text-sm font-mono text-primary uppercase tracking-widest mb-2">{article.category}</div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{article.title}</h1>
                    <p className="text-xl text-muted font-light">{article.description}</p>
                </header>

                <article className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </article>
            </GlassCard>
        </div>
    );
}
