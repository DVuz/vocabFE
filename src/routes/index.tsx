import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

const SUGGESTIONS = ['accommodation', 'perseverance', 'eloquent', 'ephemeral', 'serendipity'];

function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate({ to: '/search/$word', params: { word: trimmed } });
    }
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center
                          text-center px-6 py-20 overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-[60%] h-[50%] 
                          bg-radial-[ellipse_60%_50%_at_20%_10%] from-emerald-100/70 to-transparent"
          />
          <div
            className="absolute bottom-0 right-0 w-[50%] h-[50%]
                          bg-radial-[ellipse_50%_40%_at_80%_80%] from-amber-100/50 to-transparent"
          />
        </div>

        {/* Badge */}
        <div
          className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 mb-7
                        bg-emerald-50 border border-emerald-200/60 rounded-full
                        text-xs font-semibold text-emerald-700 tracking-widest uppercase
                        animate-[fadeDown_.6s_ease_both]"
        >
          <span>✦</span> Từ điển thông minh
        </div>

        {/* Heading */}
        <h1
          className="font-display relative z-10 font-extrabold tracking-tight leading-[1.1]
                       text-5xl sm:text-6xl lg:text-7xl text-zinc-900 max-w-3xl mb-5
                       animate-[fadeDown_.6s_.1s_ease_both]"
        >
          Tra từ <em className="not-italic text-emerald-600">thông minh</em>,<br />
          học từ hiệu quả
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed mb-10
                      animate-[fadeDown_.6s_.2s_ease_both]"
        >
          Tra từ ngay lập tức, lưu từ yêu thích và xây dựng bộ từ vựng của riêng bạn.
        </p>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="relative z-10 flex items-center w-full max-w-xl
                        bg-white border-2 border-zinc-200 rounded-2xl overflow-hidden
                        shadow-[0_8px_32px_rgba(0,0,0,.08)]
                        focus-within:border-emerald-500 focus-within:shadow-[0_8px_32px_rgba(22,163,74,.12)]
                        transition-all duration-200
                        animate-[fadeUp_.6s_.3s_ease_both]"
        >
          <span className="px-4 text-zinc-400 text-lg pointer-events-none select-none">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Nhập từ cần tra (vd: accommodation)..."
            className="flex-1 py-4 text-base text-zinc-900 placeholder:text-zinc-400
                       bg-transparent border-none outline-none"
          />
          <button
            type="submit"
            className="m-2 px-5 py-3 bg-emerald-600 text-white text-sm font-semibold
                             rounded-xl hover:bg-emerald-700 hover:scale-[1.02] transition-all"
          >
            Tra từ
          </button>
        </form>

        {/* Suggestion chips */}
        <div
          className="relative z-10 flex items-center gap-2 flex-wrap justify-center mt-4
                        animate-[fadeUp_.6s_.4s_ease_both]"
        >
          <span className="text-xs text-zinc-400 font-medium">Thử:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                navigate({ to: '/search/$word', params: { word: s } });
              }}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full
                         border-[1.5px] border-zinc-200 text-zinc-700
                         hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50
                         transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <div
          className="relative z-10 flex items-center divide-x divide-zinc-200 mt-12 pt-9
                        border-t border-zinc-200 w-full max-w-xl
                        animate-[fadeUp_.6s_.5s_ease_both]"
        >
          {[
            { num: '250K+', label: 'Từ vựng tiếng Anh' },
            { num: '1.2M', label: 'Người dùng' },
            { num: '98%', label: 'Hài lòng' },
          ].map(s => (
            <div key={s.label} className="flex-1 text-center px-4">
              <div className="font-display text-3xl font-extrabold text-zinc-900 leading-none tracking-tight">
                {s.num.split(/(\d[\d.]*)/g).map((part, j) =>
                  /\d/.test(part) ? (
                    <span key={j}>{part}</span>
                  ) : (
                    <span key={j} className="text-emerald-600">
                      {part}
                    </span>
                  )
                )}
              </div>
              <div className="text-xs text-zinc-400 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORD PREVIEW ── */}
      <section className="relative bg-zinc-900 px-6 py-20 overflow-hidden">
        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 top-0 w-1/2 h-full opacity-20
                          bg-radial-[ellipse_50%_60%_at_10%_50%] from-emerald-500 to-transparent"
          />
          <div
            className="absolute right-0 top-0 w-2/5 h-full opacity-10
                          bg-radial-[ellipse_40%_50%_at_90%_30%] from-amber-400 to-transparent"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div
              className="inline-block px-3.5 py-1 mb-5 text-xs font-bold tracking-[.08em] uppercase
                            text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 rounded-full"
            >
              ✦ Kết quả tra từ
            </div>
            <h2 className="font-display text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Định nghĩa chi tiết
              <br />
              &amp; <em className="not-italic text-emerald-400">sinh động</em>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Mỗi từ đi kèm phiên âm, từ loại, định nghĩa đầy đủ, ví dụ thực tế và từ đồng nghĩa –
              tất cả trong một trang.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Phiên âm IPA chuẩn, nghe phát âm trực tiếp',
                'Ví dụ câu thực tế từ văn phong học thuật & hội thoại',
                'Từ đồng nghĩa, trái nghĩa và cách dùng liên quan',
                'Gợi ý từ phù hợp theo ngữ cảnh IELTS, TOEIC',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {!isLoggedIn && (
              <Link
                to="/login"
                className="inline-flex items-center mt-8 px-5 py-2.5 bg-emerald-600 text-white
                           text-sm font-semibold rounded-full hover:bg-emerald-500 transition-all
                           hover:-translate-y-px"
              >
                Đăng nhập để lưu từ →
              </Link>
            )}
          </div>

          {/* Right: word card */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-display text-4xl font-extrabold text-white tracking-tight">
                serendipity
              </span>
              <span
                className="text-xs font-semibold text-emerald-400 bg-emerald-400/10
                               border border-emerald-400/20 rounded-md px-2 py-1"
              >
                noun
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono mb-5">
              /ˌser.ənˈdɪp.ɪ.ti/
              <button
                className="w-7 h-7 rounded-full border border-emerald-400/20 bg-emerald-400/10
                                 text-emerald-400 text-xs flex items-center justify-center
                                 hover:bg-emerald-500 hover:text-white transition-all"
              >
                ▶
              </button>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-5 pb-5 border-b border-zinc-700">
              Khả năng tìm thấy những điều tốt đẹp, thú vị một cách tình cờ, không có chủ ý trước.
            </p>
            <p
              className="text-zinc-500 text-xs italic leading-relaxed mb-5
                          border-l-2 border-emerald-600 pl-4"
            >
              "The discovery was a happy serendipity — he hadn't planned to be there at all."
            </p>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['IELTS Writing', 'Academic', 'C1 Level'].map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-md bg-zinc-700 text-zinc-400 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold
                                 hover:bg-emerald-500 transition-all hover:-translate-y-px"
              >
                ♡ Lưu từ
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-zinc-700 text-zinc-400 text-sm font-semibold
                                 border border-zinc-600 hover:border-zinc-500 hover:text-white transition-all"
              >
                + Danh sách
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="bg-zinc-900 border-t border-zinc-800 px-6 py-8
                         flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600"
      >
        <span className="font-display font-extrabold text-zinc-500">
          Dylan <span className="text-emerald-600">Dictionary</span>
        </span>
        <div className="flex gap-6">
          {['Về chúng tôi', 'Hỗ trợ', 'Điều khoản', 'Liên hệ'].map(l => (
            <a key={l} href="#" className="hover:text-emerald-400 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <span>© 2026 Dylan Dictionary</span>
      </footer>
    </div>
  );
}
