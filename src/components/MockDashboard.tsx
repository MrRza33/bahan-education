import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, 
  PlusSquare, Film, User, LogOut, ArrowLeft, SendHorizontal, Play, X 
} from 'lucide-react';
import { MOCK_POSTS, MOCK_STORIES, MockPost, MockStory, MockComment } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';

interface MockDashboardProps {
  currentUsername: string;
  onLogout: () => void;
  darkMode: boolean;
}

export default function MockDashboard({ currentUsername, onLogout, darkMode }: MockDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reels' | 'profile'>('home');
  const [posts, setPosts] = useState<MockPost[]>(MOCK_POSTS);
  const [stories, setStories] = useState<MockStory[]>(MOCK_STORIES);
  
  // States for comments modal sheet
  const [selectedPostComments, setSelectedPostComments] = useState<MockPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // States for active story slider modal
  const [activeStory, setActiveStory] = useState<MockStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // States for double-tap pop heart animations
  const [popHeartPostId, setPopHeartPostId] = useState<string | null>(null);

  // States for search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Story progress bar effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveStory(null);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLikedCount ? post.likes - 1 : post.likes + 1,
            isLikedCount: !post.isLikedCount
          };
        }
        return post;
      })
    );
  };

  const handleDoubleTap = (postId: string) => {
    setPopHeartPostId(postId);
    setTimeout(() => setPopHeartPostId(null), 800);

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId && !post.isLikedCount) {
          return {
            ...post,
            likes: post.likes + 1,
            isLikedCount: true
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const newComment: MockComment = {
      id: `comment_${Date.now()}`,
      username: currentUsername,
      text: newCommentText,
      time: '1d'
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = [...post.comments, newComment];
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: updatedComments
          };
        }
        return post;
      })
    );

    // Update active comments modal list reference
    setSelectedPostComments(prev => {
      if (!prev) return null;
      return {
        ...prev,
        commentsCount: prev.commentsCount + 1,
        comments: [...prev.comments, newComment]
      };
    });

    setNewCommentText('');
  };

  const handleSeeStory = (story: MockStory) => {
    setActiveStory(story);
    setStories(prev => 
      prev.map(s => s.id === story.id ? { ...s, isSeen: true } : s)
    );
  };

  // Profile generated initial avatar
  const profileAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUsername}&backgroundColor=0095f6&fontFamily=Arial,sans-serif`;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-black font-sans relative select-none">
      
      {/* 1. HOME SCREEN VIEW */}
      {activeTab === 'home' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-14">
          {/* Top Home Nav Bar */}
          <div className="h-11 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between px-4 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-30 select-none">
            {/* Instagram logo text */}
            <div className="text-black dark:text-white font-serif font-semibold text-lg tracking-wide">
              Instagram
            </div>

            {/* Direct Message Header Controls */}
            <div className="flex items-center gap-4 text-black dark:text-white">
              <PlusSquare className="h-6 w-6 cursor-pointer hover:opacity-75" />
              <Heart className="h-6 w-6 cursor-pointer hover:opacity-75" />
              <div className="relative">
                <Send className="h-5 w-5 cursor-pointer -rotate-18" />
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  2
                </span>
              </div>
            </div>
          </div>

          {/* Stories row */}
          <div className="py-2 border-b border-gray-100 dark:border-zinc-900 flex items-center gap-3.5 px-4 overflow-x-auto scrollbar-hide">
            {/* Current user's story launcher */}
            <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
              <div className="relative">
                <img
                  src={profileAvatar}
                  alt="Your story"
                  className="h-14 w-14 rounded-full border border-gray-200 dark:border-zinc-800 object-cover"
                />
                <span className="absolute bottom-0 right-0 h-4.5 w-4.5 bg-[#0095f6] text-white border-2 border-white dark:border-black rounded-full flex items-center justify-center text-xs font-bold leading-none">
                  +
                </span>
              </div>
              <span className="text-[10px] text-gray-500 max-w-[62px] truncate">Cerita Anda</span>
            </div>

            {/* Stories mockup loops */}
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                onClick={() => handleSeeStory(story)}
              >
                <div className={`p-[1.5px] rounded-full ${story.isSeen ? 'bg-gray-300 dark:bg-zinc-800' : 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]'}`}>
                  <img
                    src={story.avatarUrl}
                    alt={story.username}
                    referrerPolicy="no-referrer"
                    className="h-[52px] w-[52px] rounded-full object-cover border-2 border-white dark:border-black"
                  />
                </div>
                <span className="text-[10px] text-gray-700 dark:text-zinc-400 max-w-[62px] truncate">
                  {story.username}
                </span>
              </div>
            ))}
          </div>

          {/* Scrollable posts listing */}
          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {posts.map((post) => (
              <article key={post.id} className="pb-4">
                {/* Header info user */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5 hover:opacity-85 cursor-pointer">
                        {post.username}
                        <span className="inline-block h-3 w-3 bg-[#0095f6] rounded-full border border-white dark:border-black text-[7px] text-white flex items-center justify-center font-black">✓</span>
                      </h4>
                      {post.location && (
                        <p className="text-[10px] text-gray-500 dark:text-zinc-500">{post.location}</p>
                      )}
                    </div>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-gray-400 dark:text-zinc-500 cursor-pointer hover:text-black dark:hover:text-white" />
                </div>

                {/* Main post image relative double handler */}
                <div 
                  className="relative aspect-square w-full overflow-hidden select-none cursor-pointer bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Popping Heart double tap overlay */}
                  <AnimatePresence>
                    {popHeartPostId === post.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                        exit={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute z-10 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-2xl"
                      >
                        <Heart className="h-16 w-16 fill-red-500 text-red-500 drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action buttons toolbar logo */}
                <div className="flex items-center justify-between px-4 py-2 text-black dark:text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(post.id)} className="cursor-pointer hover:scale-105 active:scale-95">
                      <Heart className={`h-6 w-6 ${post.isLikedCount ? 'fill-red-500 text-red-500' : 'text-black dark:text-white'}`} />
                    </button>
                    <button onClick={() => setSelectedPostComments(post)} className="cursor-pointer hover:scale-105 active:scale-95">
                      <MessageCircle className="h-6 w-6 text-black dark:text-white" />
                    </button>
                    <Send className="h-5.5 w-5.5 text-black dark:text-white cursor-pointer -rotate-18" />
                  </div>
                  <Bookmark className="h-6 w-6 text-black dark:text-white cursor-pointer" />
                </div>

                {/* Engagement counts standard */}
                <div className="px-4 space-y-1 font-sans">
                  <p className="text-xs font-bold text-black dark:text-white">
                    {post.likes.toLocaleString('id-ID')} suka
                  </p>
                  
                  {/* Caption block */}
                  <div className="text-xs leading-relaxed text-black dark:text-white">
                    <span className="font-bold mr-1.5 hover:opacity-85 cursor-pointer">{post.username}</span>
                    {post.caption}
                  </div>

                  {/* Comments counter trigger */}
                  {post.commentsCount > 0 && (
                    <button
                      onClick={() => setSelectedPostComments(post)}
                      className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium block hover:opacity-85"
                    >
                      Lihat semua {post.commentsCount} komentar
                    </button>
                  )}

                  {/* Fresh comment row */}
                  {post.comments.length > 0 && (
                    <div className="space-y-0.5">
                      {post.comments.slice(-1).map((comm) => (
                        <p key={comm.id} className="text-xs text-black dark:text-white">
                          <span className="font-bold mr-1.5">{comm.username}</span>
                          {comm.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Time ago footer */}
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-zinc-600 pt-0.5">
                    {post.timeAgo}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* 2. EXPLORE VIEW PORT */}
      {activeTab === 'search' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-14">
          <div className="p-3 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-10 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-600" />
              <input
                type="text"
                placeholder="Cari pengguna atau tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-zinc-900 border-none outline-none rounded-lg py-1.5 pl-9 pr-4 text-xs text-black dark:text-white"
              />
            </div>
          </div>

          {/* Explore grid items mock selection */}
          <div className="grid grid-cols-3 gap-0.5 px-0.5">
            {[
              'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&h=400&q=80'
            ].filter(() => !searchQuery || 'explorer'.includes(searchQuery.toLowerCase())).map((imageUrl, idx) => (
              <div 
                key={idx} 
                className="aspect-square relative bg-slate-200 overflow-hidden cursor-pointer group hover:opacity-90"
              >
                <img
                  src={imageUrl}
                  alt="Explore"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REELS PREVIEW TAB */}
      {activeTab === 'reels' && (
        <div className="flex-1 bg-black text-white relative flex flex-col justify-between pb-14 overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />
          
          <img
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&h=800&q=80"
            alt="Reels video cover mockup"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="z-20 p-4 pt-10 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
            <h3 className="font-bold text-lg text-white">Reels</h3>
            <PlusSquare className="h-6 w-6 cursor-pointer" />
          </div>

          <div className="z-20 p-4 space-y-3 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#0095f6] rounded-full border border-white flex items-center justify-center font-bold text-xs text-white">I</div>
                <span className="font-bold text-xs text-white">{currentUsername}</span>
                <span className="bg-white/10 text-[10px] items-center justify-center px-1.5 py-0.5 rounded border border-white/20 select-none">Ikuti</span>
              </div>
              <p className="text-xs text-white line-clamp-2 pr-6">
                Belajar nge-clone Instagram mobile 100% mirip UI asli. Gimana menurut kalian? Komentar di bawah ya! 💻🔥 #coding #css #frontend
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-white">
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
                <span className="text-[10px]">10.5K</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                <MessageCircle className="h-6 w-6" />
                <span className="text-[10px]">342</span>
              </div>
              <Send className="h-5.5 w-5.5 -rotate-18 cursor-pointer" />
              <Bookmark className="h-5.5 w-5.5 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* 4. PROFILE SCREEN & LOGOUT HOOKS */}
      {activeTab === 'profile' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-14">
          {/* Top profile actions and setting header */}
          <div className="h-12 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between px-4 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-30 select-none text-black dark:text-white">
            <h3 className="font-bold text-sm tracking-tight">{currentUsername}</h3>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Bio stats card */}
            <div className="flex items-center justify-between gap-4">
              <div className="p-0.5 rounded-full border border-gray-200 dark:border-zinc-800 shrink-0">
                <img
                  src={profileAvatar}
                  alt={currentUsername}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 flex items-center justify-around py-1 text-center font-sans">
                <div>
                  <h4 className="font-bold text-sm text-black dark:text-white">3</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">Postingan</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black dark:text-white">1,502</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">Pengikut</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black dark:text-white">321</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">Mengikuti</p>
                </div>
              </div>
            </div>

            {/* Title bio info description text */}
            <div className="text-xs space-y-0.5">
              <h4 className="font-bold text-black dark:text-white">Mock Profile Account</h4>
              <p className="text-gray-500 dark:text-zinc-400">Created for visual confirmation mockup.</p>
              <a href="#" className="font-semibold text-blue-900 dark:text-blue-400">site-preview.run/build</a>
            </div>

            {/* Profile actions bar */}
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-100 dark:bg-zinc-900 py-1.5 rounded-lg text-xs font-semibold text-center hover:opacity-90 text-black dark:text-white cursor-pointer">
                Edit Profil
              </button>
              <button className="flex-1 bg-slate-100 dark:bg-zinc-900 py-1.5 rounded-lg text-xs font-semibold text-center hover:opacity-90 text-black dark:text-white cursor-pointer">
                Bagikan Profil
              </button>
            </div>
          </div>

          {/* Grid filter options */}
          <div className="grid grid-cols-3 border-t border-gray-100 dark:border-zinc-900 text-center text-sm py-2 select-none font-bold text-black dark:text-white">
            <button className="flex items-center justify-center p-1 border-b-2 border-black dark:border-white">
              Grid
            </button>
            <button className="flex items-center justify-center p-1 text-gray-400 dark:text-zinc-500">
              Reels
            </button>
            <button className="flex items-center justify-center p-1 text-gray-400 dark:text-zinc-500">
              Ditandai
            </button>
          </div>

          {/* Dynamic grid item collection */}
          <div className="grid grid-cols-3 gap-0.5 px-0.5">
            {[
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&w=400&h=400&q=80',
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=400&q=80'
            ].map((imageUrl, idx) => (
              <div key={idx} className="aspect-square bg-slate-100 overflow-hidden cursor-pointer group">
                <img
                  src={imageUrl}
                  alt="Post profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BOTTOM NAVIGATION BAR BAR PANEL */}
      <nav className="h-12 border-t border-gray-100 dark:border-zinc-950 flex items-center justify-around px-4 bg-white dark:bg-black fixed bottom-0 left-0 right-0 max-w-sm sm:max-w-md mx-auto z-40 shrink-0">
        <button onClick={() => setActiveTab('home')} className={`p-1.5 cursor-pointer ${activeTab==='home' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Home className={`h-5 w-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
        </button>
        <button onClick={() => setActiveTab('search')} className={`p-1.5 cursor-pointer ${activeTab==='search' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Search className={`h-5 w-5 ${activeTab==='search' ? 'stroke-[2.5]' : ''}`} />
        </button>
        <button onClick={() => setActiveTab('reels')} className={`p-1.5 cursor-pointer ${activeTab==='reels' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Film className="h-5 w-5" />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-1 flex items-center justify-center cursor-pointer`}>
          <div className={`h-6 w-6 rounded-full overflow-hidden border ${activeTab === 'profile' ? 'border-black dark:border-white p-[1.5px]' : 'border-gray-200 dark:border-zinc-800'}`}>
            <img src={profileAvatar} alt="Avatar profile small" className="h-full w-full rounded-full object-cover" />
          </div>
        </button>
      </nav>

      {/* 6. MODAL BOTTOM SHEET: COMMENTS DRAWER */}
      <AnimatePresence>
        {selectedPostComments && (
          <div className="absolute inset-0 bg-black/50 z-[99] flex items-end font-sans">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 w-full rounded-t-[20px] max-h-[75%] flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full mx-auto my-3 shrink-0" />
              
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 dark:border-zinc-900 shrink-0">
                <span className="font-bold text-xs text-black dark:text-white">Komentar</span>
                <button 
                  onClick={() => setSelectedPostComments(null)}
                  className="font-semibold text-xs text-gray-500 hover:text-black dark:hover:text-white"
                >
                  Tutup
                </button>
              </div>

              {/* Scrolling comments list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedPostComments.comments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 items-start">
                    <div className="h-7 w-7 rounded-full bg-[#0095f6] text-white font-bold flex items-center justify-center text-xs shrink-0 select-none uppercase">
                      {comm.username.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs text-black dark:text-white">
                        <span className="font-bold mr-1.5">{comm.username}</span>
                        {comm.text}
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{comm.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment submission bar */}
              <div className="p-3 border-t border-gray-100 dark:border-zinc-900 flex gap-2 items-center shrink-0 bg-white dark:bg-zinc-950">
                <input
                  type="text"
                  placeholder="Tambahkan komentar..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-zinc-900 border-none outline-none rounded-lg px-3 py-2 text-xs text-black dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(selectedPostComments.id);
                  }}
                />
                <button
                  onClick={() => handleAddComment(selectedPostComments.id)}
                  disabled={!newCommentText.trim()}
                  className="text-blue-500 text-xs font-bold px-2 disabled:opacity-50"
                >
                  Kirim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. FULL-SCREEN STORY VIEWER OVERLAY */}
      <AnimatePresence>
        {activeStory && (
          <div className="absolute inset-0 bg-black z-[999] flex flex-col justify-between p-4 font-sans select-none">
            {/* Top timer progress bar slot */}
            <div className="w-full flex gap-1 pt-4 px-2">
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all ease-linear"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>
            </div>

            {/* Story user banner header */}
            <div className="flex justify-between items-center px-2 py-4 z-10 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.avatarUrl}
                  alt={activeStory.username}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full object-cover border border-white/40"
                />
                <span className="font-bold text-xs">{activeStory.username}</span>
                <span className="text-[10px] text-white/50">3j</span>
              </div>
              <button 
                onClick={() => setActiveStory(null)}
                className="p-1 text-white hover:opacity-75"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Immersive story background image display */}
            <div className="flex-1 rounded-xl overflow-hidden relative mb-4 bg-zinc-950 flex items-center justify-center">
              <img
                src={activeStory.storyImage}
                alt="Story image content"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Direct quick message interaction */}
            <div className="flex gap-3 px-2 pb-6 shrink-0 z-10 items-center">
              <input
                type="text"
                placeholder={`Balas ${activeStory.username}...`}
                className="flex-1 bg-transparent border border-white/40 outline-none rounded-full px-4 py-2 text-xs text-white placeholder-white/60 focus:border-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                onClick={() => setActiveStory(null)}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20"
              >
                <Send className="h-4.5 w-4.5 -rotate-18" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
