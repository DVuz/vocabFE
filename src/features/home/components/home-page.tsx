import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  Chrome,
  Copy,
  Download,
  Folder,
  Globe,
  Layers,
  Languages,
  MousePointerClick,
  Play,
  Puzzle,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '../../../shared/constants/routes'

interface HomePageProps {
  isLoggedIn: boolean
  query: string
  suggestions: readonly string[]
  onQueryChange: (value: string) => void
  onSearch: (event?: FormEvent) => void
  onSuggestionClick: (word: string) => void
}

type ExtensionDemoTab = 'lookup' | 'translate' | 'sync'

export function HomePage({
  isLoggedIn,
  query,
  suggestions,
  onQueryChange,
  onSearch,
  onSuggestionClick,
}: HomePageProps) {
  const [activeDemoTab, setActiveDemoTab] = useState<ExtensionDemoTab>('lookup')
  const [copiedChromeUrl, setCopiedChromeUrl] = useState(false)
  const [savedDemoWord, setSavedDemoWord] = useState(false)

  const handleCopyChromeExtensions = () => {
    void navigator.clipboard?.writeText('chrome://extensions')
    setCopiedChromeUrl(true)
    setTimeout(() => setCopiedChromeUrl(false), 2200)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-x-hidden bg-white text-slate-900">
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION (Full viewport height so no bottom section peeks in)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden border-b border-slate-200/70 bg-white px-4 py-12 sm:px-6 lg:px-10">
        {/* Subtle ambient background gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-100/70 via-teal-50/50 to-amber-50/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Top Extension Announcement Pill using shadcn Badge */}
          <a
            href="#extension"
            className="group mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs backdrop-blur-xs transition-all hover:border-emerald-300 hover:bg-emerald-100/80 hover:shadow-sm"
          >
            <Badge className="bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-emerald-600">
              <Chrome size={11} /> Extension
            </Badge>
            <span>
              Tiện ích <strong>VocabPro</strong> cho Chrome: Tra &amp; lưu từ trực tiếp khi đọc báo
            </span>
            <ArrowRight
              size={13}
              className="text-emerald-600 transition-transform group-hover:translate-x-0.5"
            />
          </a>

          {/* Main Headline */}
          <h1 className="font-display max-w-3xl text-3xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Tra từ <span className="text-emerald-600">thông minh</span>,{' '}
            <br className="hidden sm:inline" />
            ghi nhớ dài lâu cùng{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              VocabPro
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base lg:text-lg">
            Hệ sinh thái học từ vựng toàn diện: Tra từ điển chuyên sâu trên web, bắt từ mới tức thì trên mọi trang báo với{' '}
            <a
              href="#extension"
              className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
            >
              VocabPro Extension
            </a>{' '}
            và ôn tập tự động theo chu kỳ lặp lại ngắt quãng.
          </p>

          {/* Search Box using shadcn Input & Button */}
          <form
            onSubmit={onSearch}
            className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-2xl border-2 border-slate-200/90 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all focus-within:border-emerald-500 focus-within:shadow-[0_12px_40px_rgba(16,185,129,0.14)] sm:mt-9"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 pl-2.5 sm:pl-3.5">
              <Search size={19} className="shrink-0 text-slate-400" />
              <Input
                value={query}
                onChange={event => onQueryChange(event.target.value)}
                placeholder="Nhập từ tiếng Anh cần tra (vd: accommodation, serendipity)..."
                className="h-10 flex-1 border-0 bg-transparent px-1 text-sm text-slate-900 shadow-none focus-visible:ring-0 sm:text-base"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onQueryChange('')}
                  aria-label="Xóa từ khóa"
                  className="text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={15} />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 sm:px-6"
            >
              <span>Tra từ</span>
              <ArrowRight size={15} className="hidden sm:inline" />
            </Button>
          </form>

          {/* Suggested Words using shadcn Button */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Sparkles size={12} className="text-amber-500" /> Từ nổi bật:
            </span>
            {suggestions.map(suggestion => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className="rounded-full border-slate-200 bg-slate-50/80 px-3 text-xs font-semibold text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Quick Action / Ecosystem Strip */}
          <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <a
              href="#extension"
              className="group flex items-center gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                <Puzzle size={17} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Extension Chrome
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Tra từ trên mọi web
                </p>
              </div>
            </a>

            <Link
              to={isLoggedIn ? ROUTES.VOCABULARY : ROUTES.LOGIN}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-2xs transition hover:border-emerald-300"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookMarked size={17} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Kho từ của tôi
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Quản lý &amp; phân loại
                </p>
              </div>
            </Link>

            <Link
              to={isLoggedIn ? ROUTES.REVIEW : ROUTES.LOGIN}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-2xs transition hover:border-emerald-300"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Layers size={17} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Flashcard 3D
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Lật thẻ &amp; Gõ từ
                </p>
              </div>
            </Link>

            <Link
              to={isLoggedIn ? ROUTES.DRIVE : ROUTES.LOGIN}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-2xs transition hover:border-emerald-300"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Folder size={17} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  Bài học Drive
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  IELTS Speaking &amp; Writing
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. VOCABPRO CHROME EXTENSION SHOWCASE (#extension) - Clean Light Theme
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="extension"
        className="relative scroll-mt-16 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-emerald-50/30 to-white px-4 py-16 sm:px-6 sm:py-24 lg:px-10"
      >
        {/* Ambient soft glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200/80 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 h-auto border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase"
              >
                <Chrome size={14} className="text-emerald-600" />
                <span>Tiện ích mở rộng trình duyệt • VocabPro Extension</span>
              </Badge>
              <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Biến mọi trang web tiếng Anh thành{' '}
                <span className="text-emerald-600">lớp học từ vựng</span> của riêng bạn
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Không còn cảnh phải chuyển tab liên tục để tra từ khi đang đọc báo quốc tế hay tài liệu chuyên ngành.{' '}
                <strong className="text-slate-900">VocabPro Extension</strong> tích hợp trực tiếp vào trình duyệt Chrome/Edge, giúp bạn tra nghĩa, nghe phát âm chuẩn và lưu từ vào kho ôn tập chỉ với một cú nhấp chuột.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/DVuz/extension_Dicionary"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                <Download size={17} />
                <span>Tải miễn phí trên GitHub</span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href="#install-guide"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <Terminal size={16} className="text-emerald-600" />
                <span>Hướng dẫn cài đặt (30s)</span>
              </a>
            </div>
          </div>

          {/* Interactive Showcase Grid: Left Feature Tabs + Right Live Browser Mockup */}
          <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Interactive Feature Selector (5 cols) */}
            <div className="flex flex-col gap-3 lg:col-span-5">
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Bấm để xem mô phỏng trực tiếp:
              </p>

              {/* Tab 1: Double-click lookup */}
              <button
                type="button"
                onClick={() => setActiveDemoTab('lookup')}
                className={`group flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  activeDemoTab === 'lookup'
                    ? 'border-emerald-400 bg-white shadow-md ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        activeDemoTab === 'lookup'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <MousePointerClick size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                        Tính năng 01
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Double-click tra từ tức thì
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      activeDemoTab === 'lookup'
                        ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Nhấp đúp vào bất kỳ từ tiếng Anh nào trên trang web để mở thẻ Popover hiển thị phiên âm IPA (UK/US), cấp độ CEFR, từ loại, nghĩa tiếng Việt và câu ví dụ.
                </p>
              </button>

              {/* Tab 2: Paragraph translation & TTS */}
              <button
                type="button"
                onClick={() => setActiveDemoTab('translate')}
                className={`group flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  activeDemoTab === 'translate'
                    ? 'border-emerald-400 bg-white shadow-md ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        activeDemoTab === 'translate'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <Languages size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                        Tính năng 02
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Dịch đoạn văn EN ↔ VI &amp; Đọc AI
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      activeDemoTab === 'translate'
                        ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Bôi đen cả câu hoặc đoạn văn dài, nhấn <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700">Ctrl+C</kbd> hoặc nút nổi để dịch song ngữ tự nhiên và nghe đọc bằng giọng AI ElevenLabs / Web Speech.
                </p>
              </button>

              {/* Tab 3: 1-Click Cloud Sync */}
              <button
                type="button"
                onClick={() => setActiveDemoTab('sync')}
                className={`group flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  activeDemoTab === 'sync'
                    ? 'border-emerald-400 bg-white shadow-md ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        activeDemoTab === 'sync'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <Zap size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                        Tính năng 03
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Đồng bộ 1-chạm về Flashcard &amp; Quiz
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      activeDemoTab === 'sync'
                        ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Lưu từ yêu thích ngay trên popup extension. Từ vựng tự động đồng bộ vào tài khoản Dylan Dictionary để nhắc ôn tập đúng thời điểm vàng.
                </p>
              </button>
            </div>

            {/* Right Column: Realistic Light Browser Window Mockup (7 cols) */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl">
                {/* Browser Top Chrome Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-100/90 px-3.5 py-2.5 sm:px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>

                  {/* Fake URL Bar */}
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 sm:mx-4">
                    <Globe size={12} className="shrink-0 text-emerald-600" />
                    <span className="truncate font-mono text-[11px]">
                      https://www.theguardian.com/technology/artificial-intelligence
                    </span>
                  </div>

                  {/* Pinned Extension Badge in Toolbar */}
                  <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <BookOpen size={12} className="text-emerald-600" />
                    <span className="hidden sm:inline">VocabPro</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Browser Page Viewport */}
                <div className="relative bg-slate-50/60 p-4 sm:p-6">
                  {/* Simulated Article Background */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                      Science &amp; Technology • Reading Article
                    </p>
                    <h4 className="mb-2 font-display text-base font-bold text-slate-900 sm:text-lg">
                      How modern tools reshape language acquisition
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                      In an era where digital content is{' '}
                      <span
                        onClick={() => setActiveDemoTab('lookup')}
                        className={`cursor-pointer rounded px-1.5 py-0.5 font-semibold transition ${
                          activeDemoTab === 'lookup'
                            ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-400'
                            : 'bg-slate-100 text-slate-800 hover:bg-emerald-50'
                        }`}
                      >
                        ubiquitous
                      </span>
                      , learners no longer rely solely on static word lists.{' '}
                      <span
                        onClick={() => setActiveDemoTab('translate')}
                        className={`cursor-pointer rounded px-1 py-0.5 transition ${
                          activeDemoTab === 'translate'
                            ? 'bg-blue-100/80 text-blue-950 ring-1 ring-blue-300'
                            : 'hover:text-slate-900'
                        }`}
                      >
                        Encountering vocabulary within authentic contexts strengthens long-term retention significantly.
                      </span>
                    </p>
                  </div>

                  {/* Floating Extension Popover Mockup based on activeDemoTab */}
                  <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-white p-4 shadow-lg sm:p-5">
                    {activeDemoTab === 'lookup' && (
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                ubiquitous
                              </span>
                              <Badge
                                variant="outline"
                                className="border-purple-200 bg-purple-50 text-[10px] font-bold text-purple-700"
                              >
                                C1
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-emerald-50 text-xs font-semibold text-emerald-700"
                              >
                                adjective
                              </Badge>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1 text-blue-600">
                                UK /juːˈbɪk.wɪ.təs/ <Volume2 size={13} />
                              </span>
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                US /juːˈbɪk.wə.t̬əs/ <Volume2 size={13} />
                              </span>
                            </div>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setSavedDemoWord(v => !v)}
                            className={`rounded-xl px-3.5 text-xs font-bold ${
                              savedDemoWord
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {savedDemoWord ? (
                              <>
                                <Check size={14} /> Đã lưu vào VocabPro
                              </>
                            ) : (
                              <>+ Lưu từ để ôn tập</>
                            )}
                          </Button>
                        </div>

                        <div className="mt-3 space-y-2 text-xs sm:text-sm">
                          <p className="font-semibold text-slate-800">
                            seeming to be everywhere or in several places at the same time; very common
                          </p>
                          <p className="font-medium text-emerald-700">
                            ✦ Có mặt ở khắp mọi nơi, phổ biến rộng rãi
                          </p>
                          <p className="border-l-2 border-emerald-400 pl-2.5 text-xs italic text-slate-500">
                            "Smartphones have become ubiquitous in daily life."
                          </p>
                        </div>
                      </div>
                    )}

                    {activeDemoTab === 'translate' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <Languages size={15} /> Dịch đoạn văn nhanh (EN → VI)
                          </span>
                          <Badge className="bg-emerald-50 text-[11px] font-semibold text-emerald-700">
                            <Play size={11} fill="currentColor" /> Đang đọc bằng ElevenLabs AI
                          </Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-500 italic sm:text-sm">
                          "Encountering vocabulary within authentic contexts strengthens long-term retention significantly."
                        </p>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs leading-relaxed font-medium text-emerald-950 sm:text-sm">
                          Việc bắt gặp từ vựng trong các ngữ cảnh thực tế giúp củng cố khả năng ghi nhớ dài hạn một cách đáng kể.
                        </div>
                      </div>
                    )}

                    {activeDemoTab === 'sync' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <RotateCcw size={14} /> Đồng bộ tức thì với Dylan Dictionary
                          </span>
                          <Badge className="bg-emerald-50 text-[11px] font-bold text-emerald-700">
                            Đã đồng bộ 3 từ mới
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {[
                            { word: 'ubiquitous', level: 'C1', status: 'Mới lưu' },
                            { word: 'serendipity', level: 'C1', status: 'Đến hạn hôm nay' },
                            { word: 'eloquent', level: 'B2', status: 'Đang ôn tập' },
                          ].map(item => (
                            <div
                              key={item.word}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">
                                  {item.word}
                                </span>
                                <Badge className="bg-emerald-100 px-1.5 py-0 text-[10px] font-bold text-emerald-700">
                                  {item.level}
                                </Badge>
                              </div>
                              <p className="mt-1 text-[11px] text-slate-500">
                                {item.status}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Installation Guide (#install-guide) */}
          <div
            id="install-guide"
            className="mt-12 scroll-mt-20 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
                  Cài đặt nhanh chóng trong 3 bước
                </span>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Hướng dẫn cài đặt VocabPro Extension trên Chrome / Edge / Brave
                </h3>
              </div>
              <a
                href="https://github.com/DVuz/extension_Dicionary"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 sm:text-sm"
              >
                <span>Mở kho mã nguồn GitHub</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-700">
                      01
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Tải mã nguồn
                    </span>
                  </div>
                  <h4 className="mb-1.5 text-sm font-bold text-slate-900 sm:text-base">
                    Tải &amp; giải nén thư mục Extension
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Truy cập GitHub repository chính thức, chọn <strong className="text-slate-800">Code → Download ZIP</strong> (hoặc <code className="text-emerald-700">git clone</code>) và giải nén ra máy tính.
                  </p>
                </div>
                <a
                  href="https://github.com/DVuz/extension_Dicionary"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-400 hover:text-emerald-700"
                >
                  <Download size={13} /> Tải từ GitHub
                </a>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-700">
                      02
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Bật Developer Mode
                    </span>
                  </div>
                  <h4 className="mb-1.5 text-sm font-bold text-slate-900 sm:text-base">
                    Mở trang quản lý tiện ích trình duyệt
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Dán đường dẫn bên dưới vào thanh địa chỉ Chrome và bật công tắc <strong className="text-slate-800">Developer mode</strong> ở góc trên bên phải.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                  <code className="font-mono text-xs font-semibold text-emerald-700">
                    chrome://extensions
                  </code>
                  <Button
                    type="button"
                    size="xs"
                    variant="secondary"
                    onClick={handleCopyChromeExtensions}
                    className="text-[11px] font-semibold"
                  >
                    {copiedChromeUrl ? (
                      <>
                        <Check size={12} className="text-emerald-600" /> Đã chép
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Sao chép
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-700">
                      03
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Hoàn tất &amp; Sử dụng
                    </span>
                  </div>
                  <h4 className="mb-1.5 text-sm font-bold text-slate-900 sm:text-base">
                    Chọn "Load unpacked" &amp; Ghim tiện ích
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Nhấn nút <strong className="text-slate-800">Load unpacked (Tải tiện ích đã giải nén)</strong>, chọn thư mục vừa giải nén và ghim VocabPro lên thanh công cụ!
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} /> Sẵn sàng tra &amp; lưu từ trên mọi trang web
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SMART DICTIONARY & LEARNING ECOSYSTEM SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Badge
              variant="outline"
              className="mb-3 h-auto border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase"
            >
              <Sparkles size={13} /> Từ điển &amp; Hệ thống Ôn tập
            </Badge>
            <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Định nghĩa chuyên sâu,{' '}
              <span className="text-emerald-600">ôn tập khoa học</span>
            </h2>
            <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
              Mỗi từ vựng bạn tra cứu hoặc lưu từ Extension đều được phân tích chi tiết với phiên âm IPA Anh–Anh / Anh–Mỹ, định nghĩa song ngữ, cấp độ CEFR và tự động lên lịch ôn tập.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Phiên âm IPA chuẩn kèm âm thanh phát âm UK / US & đọc định nghĩa',
                'Ôn tập đa phương thức: Lật thẻ Flashcard 3D, Gõ từ (Typing) và Trắc nghiệm (Quiz)',
                'Theo dõi lịch sử kiểm tra, chuỗi ghi nhớ (Streak) và chu kỳ lặp lại của từng từ',
                'Đồng bộ trực tiếp các bài học IELTS Speaking & Writing từ Google Drive',
              ].map(feature => (
                <div key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to={ROUTES.REVIEW}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <span>Vào ôn tập ngay</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to={ROUTES.DRIVE}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    <Folder size={16} className="text-amber-500" />
                    <span>Học bài từ Drive</span>
                  </Link>
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700"
                >
                  <span>Đăng nhập để lưu &amp; ôn tập từ vựng</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* Interactive Word Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    serendipity
                  </span>
                  <Badge className="bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-50">
                    noun
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-200 bg-purple-50 text-xs font-bold text-purple-700"
                  >
                    C1
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => onSuggestionClick('serendipity')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <span>Xem chi tiết</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                  <span className="text-[10px] font-extrabold text-blue-500">UK</span>
                  /ˌser.ənˈdɪp.ə.ti/
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                  <span className="text-[10px] font-extrabold text-amber-500">US</span>
                  /ˌser.ənˈdɪp.ə.t̬i/
                </span>
              </div>

              <div className="mt-5 space-y-2.5">
                <p className="text-base font-bold leading-relaxed text-slate-800">
                  the fact of finding interesting or valuable things by chance
                </p>
                <p className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2 text-sm font-medium text-emerald-900">
                  Khả năng tình cờ tìm thấy những điều tốt đẹp, giá trị mà không có chủ đích trước.
                </p>
              </div>

              <p className="mt-4 border-l-2 border-emerald-400 pl-3.5 text-xs italic leading-relaxed text-slate-500 sm:text-sm">
                "The discovery of penicillin was a classic case of serendipity in science."
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {['IELTS Speaking', 'Academic', 'Spaced Repetition'].map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => onSuggestionClick('serendipity')}
                  className="rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Tra thử từ này →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-xs text-slate-500 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <BookOpen size={14} />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              Dylan <span className="text-emerald-600">Dictionary</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <a
              href="#extension"
              className="transition-colors hover:text-emerald-600"
            >
              VocabPro Extension
            </a>
            <a
              href="https://github.com/DVuz/extension_Dicionary"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-emerald-600"
            >
              GitHub Extension
            </a>
            <Link
              to={isLoggedIn ? ROUTES.VOCABULARY : ROUTES.LOGIN}
              className="transition-colors hover:text-emerald-600"
            >
              Từ vựng của tôi
            </Link>
            <Link
              to={isLoggedIn ? ROUTES.DRIVE : ROUTES.LOGIN}
              className="transition-colors hover:text-emerald-600"
            >
              Bài học Drive
            </Link>
          </div>

          <span>© 2026 Dylan Dictionary &amp; VocabPro</span>
        </div>
      </footer>
    </div>
  )
}
