import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  X, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Eye,
  Calendar
} from 'lucide-react';
import { ScreenType, BlogPost } from '../types';
import { blog as blogApi } from '../lib/api';

interface BlogScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenServiceQuote?: (serviceSlug: string) => void;
}

export const BlogScreen: React.FC<BlogScreenProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAll(false);
      setPosts(data as BlogPost[]);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const categories = [
    'All',
    'Machinery & Equipment',
    'Pest Control & Fumigation',
    'Real Estate & Properties',
    'Industry News',
    'Company Updates'
  ];

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase().trim())));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    // Increment view count locally
    setPosts((prev) =>
      prev.map((item) => (item.id === post.id ? { ...item, views: (item.views || 0) + 1 } : item))
    );
  };

  const handleSharePost = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* ── Top Hero Header ─────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-12 sm:py-16 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Akwasi Insights &amp; Knowledge Hub</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Market Intelligence, Technical Guides &amp; Industry Updates
            </h1>
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
              Stay ahead with expert articles on heavy equipment maintenance, commercial property trends, EPA fumigation compliance, and industrial asset management in Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ──────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 space-y-10">

        {/* Featured Article Card */}
        {featuredPost && !searchQuery && selectedCategory === 'All' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden hover:border-orange-500/50 transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-950">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-md shadow-md tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Featured Article</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-bold">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredPost.readTime || '5 min read'}</span>
                    </div>
                  </div>

                  <h2 
                    onClick={() => handleOpenPost(featuredPost)}
                    className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 leading-snug hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    {featuredPost.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-sans">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {featuredPost.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{featuredPost.author}</div>
                      <div className="text-[10px] text-slate-500">{formatDate(featuredPost.publishedAt)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPost(featuredPost)}
                    className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search articles, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading Articles &amp; Updates...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Articles Found</h3>
            <p className="text-xs text-slate-500">
              No matching articles were found for your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-500/50 transition-all flex flex-col overflow-hidden group"
              >
                {/* Image Cover */}
                <div className="h-52 w-full overflow-hidden bg-slate-900 relative shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {post.category}
                  </div>
                  {post.readTime && (
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2.5">
                    <h3
                      onClick={() => handleOpenPost(post)}
                      className="font-heading text-lg font-bold text-slate-900 leading-snug hover:text-orange-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    <button
                      onClick={() => handleOpenPost(post)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Article Reader Modal ─────────────────────────────────────────── */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• {selectedPost.readTime || '4 min read'}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-grow font-sans">
              
              {/* Article Title */}
              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {selectedPost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedPost.author}</div>
                    <div className="text-slate-500 text-[11px]">{selectedPost.authorRole || 'Author'} • Published {formatDate(selectedPost.publishedAt)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSharePost(selectedPost)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
                  </button>
                </div>
              </div>

              {/* Main Cover Photo */}
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 relative shadow-sm">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt Lead Box */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl text-slate-800 font-medium text-sm leading-relaxed italic">
                "{selectedPost.excerpt}"
              </div>

              {/* Article Content Paragraphs */}
              <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
                {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-heading text-lg sm:text-xl font-bold text-slate-900 pt-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Attached Extra Gallery Photos */}
              {selectedPost.gallery && selectedPost.gallery.length > 0 && (
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>Attached Photos &amp; Diagrams</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.gallery.map((photoUrl, i) => (
                      <div key={i} className="h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                        <img src={photoUrl} alt={`Article attachment ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {selectedPost.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500">
                Found this informative? Explore equipment listings &amp; enterprise services on AkwasiJob.
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
