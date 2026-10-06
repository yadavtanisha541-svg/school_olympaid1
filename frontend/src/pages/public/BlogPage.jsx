import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/olympiadHubData';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const BlogPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Olympiad Insights &amp; Prep Articles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Academic Blog &amp; Topper Preparation Strategies
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-2xl mx-auto leading-relaxed">
            Expert insights on cracking competitive examinations, time management, conceptual learning techniques, and international competitions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 border border-[#edd6ed] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#f4ebf4] text-[#6d3a68] uppercase tracking-wider text-[10px] font-black">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-[#4e2a4a] leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f4ebf4] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{post.date}</span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-bold text-[#d9775b] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#edd6ed] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f4ebf4] pb-4">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#f4ebf4] text-[#6d3a68]">
                {selectedPost.category}
              </span>
              <span className="text-xs text-slate-400">{selectedPost.date}</span>
            </div>

            <h2 className="text-xl font-black text-[#4e2a4a]">{selectedPost.title}</h2>
            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p className="font-semibold text-slate-800">{selectedPost.summary}</p>
              <p>
                Excelling in National and International Olympiads requires a shift from routine school curriculum memorization to rigorous conceptual reasoning and non-routine problem solving.
              </p>
              <p>
                Toppers consistently adopt daily timed practice, deep error analysis, and sectional pacing strategies to master tricky Achievers section questions.
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 bg-[#faf5fa] text-slate-700 hover:bg-[#f4ebf4] border border-[#edd6ed] rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPost(null);
                  onNavigatePublic('practice-hub');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#5c3158]"
              >
                Start Practice Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
