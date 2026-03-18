import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { ROUTES } from '../../../shared/constants/routes'

interface HomePageProps {
  isLoggedIn: boolean
  query: string
  suggestions: readonly string[]
  onQueryChange: (value: string) => void
  onSearch: (event?: FormEvent) => void
  onSuggestionClick: (word: string) => void
}

export function HomePage({
  isLoggedIn,
  query,
  suggestions,
  onQueryChange,
  onSearch,
  onSuggestionClick,
}: HomePageProps) {
  return (
    <div className="overflow-x-hidden">
      <section
        className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-0 h-[50%] w-[60%]
                          bg-radial-[ellipse_60%_50%_at_20%_10%] from-emerald-100/70 to-transparent"
          />
          <div
            className="absolute right-0 bottom-0 h-[50%] w-[50%]
                          bg-radial-[ellipse_50%_40%_at_80%_80%] from-amber-100/50 to-transparent"
          />
        </div>

        <div
          className="animate-[fadeDown_.6s_ease_both] relative z-10 mb-7 inline-flex items-center gap-1.5 rounded-full
                        border border-emerald-200/60 bg-emerald-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-700 uppercase"
        >
          <span>✦</span> Từ điển thông minh
        </div>

        <h1
          className="font-display animate-[fadeDown_.6s_.1s_ease_both] relative z-10 mb-5 max-w-3xl
                       text-5xl leading-[1.1] font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl"
        >
          Tra từ <em className="not-italic text-emerald-600">thông minh</em>,<br />
          học từ hiệu quả
        </h1>

        <p
          className="animate-[fadeDown_.6s_.2s_ease_both] relative z-10 mb-10 max-w-md
                      text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Tra từ ngay lập tức, lưu từ yêu thích và xây dựng bộ từ vựng của riêng bạn.
        </p>

        <form
          onSubmit={onSearch}
          className="animate-[fadeUp_.6s_.3s_ease_both] relative z-10 flex w-full max-w-xl items-center overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white
                        shadow-[0_8px_32px_rgba(0,0,0,.08)] transition-all duration-200
                        focus-within:border-emerald-500 focus-within:shadow-[0_8px_32px_rgba(22,163,74,.12)]"
        >
          <span className="pointer-events-none select-none px-4 text-lg text-zinc-400">🔍</span>
          <input
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder="Nhập từ cần tra (vd: accommodation)..."
            className="flex-1 border-none bg-transparent py-4 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="m-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-emerald-700"
          >
            Tra từ
          </button>
        </form>

        <div
          className="animate-[fadeUp_.6s_.4s_ease_both] relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs font-medium text-zinc-400">Thử:</span>
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="rounded-full border-[1.5px] border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-all
                         hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div
          className="animate-[fadeUp_.6s_.5s_ease_both] relative z-10 mt-12 flex w-full max-w-xl items-center divide-x divide-zinc-200 border-t border-zinc-200 pt-9"
        >
          {[
            { num: '250K+', label: 'Từ vựng tiếng Anh' },
            { num: '1.2M', label: 'Người dùng' },
            { num: '98%', label: 'Hài lòng' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 px-4 text-center">
              <div className="font-display text-3xl leading-none font-extrabold tracking-tight text-zinc-900">
                {stat.num.split(/(\d[\d.]*)/g).map((part, index) =>
                  /\d/.test(part) ? (
                    <span key={index}>{part}</span>
                  ) : (
                    <span key={index} className="text-emerald-600">
                      {part}
                    </span>
                  ),
                )}
              </div>
              <div className="mt-1 text-xs font-medium text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-900 px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-0 h-full w-1/2 opacity-20
                          bg-radial-[ellipse_50%_60%_at_10%_50%] from-emerald-500 to-transparent"
          />
          <div
            className="absolute top-0 right-0 h-full w-2/5 opacity-10
                          bg-radial-[ellipse_40%_50%_at_90%_30%] from-amber-400 to-transparent"
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <div
              className="mb-5 inline-block rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold tracking-[.08em] text-emerald-400 uppercase"
            >
              ✦ Kết quả tra từ
            </div>
            <h2 className="font-display mb-4 text-4xl leading-tight font-extrabold tracking-tight text-white">
              Định nghĩa chi tiết
              <br />
              &amp; <em className="not-italic text-emerald-400">sinh động</em>
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-zinc-500">
              Mỗi từ đi kèm phiên âm, từ loại, định nghĩa đầy đủ, ví dụ thực tế và từ đồng nghĩa –
              tất cả trong một trang.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Phiên âm IPA chuẩn, nghe phát âm trực tiếp',
                'Ví dụ câu thực tế từ văn phong học thuật & hội thoại',
                'Từ đồng nghĩa, trái nghĩa và cách dùng liên quan',
                'Gợi ý từ phù hợp theo ngữ cảnh IELTS, TOEIC',
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>

            {!isLoggedIn && (
              <Link
                to={ROUTES.LOGIN}
                className="mt-8 inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5
                           text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-emerald-500"
              >
                Đăng nhập để lưu từ →
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-8">
            <div className="mb-1 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold tracking-tight text-white">
                serendipity
              </span>
              <span
                className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1
                               text-xs font-semibold text-emerald-400"
              >
                noun
              </span>
            </div>
            <div className="mb-5 flex items-center gap-2 font-mono text-sm text-zinc-500">
              /ˌser.ənˈdɪp.ɪ.ti/
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10
                                 text-xs text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white"
              >
                ▶
              </button>
            </div>
            <p className="mb-5 border-b border-zinc-700 pb-5 text-sm leading-relaxed text-zinc-300">
              Khả năng tìm thấy những điều tốt đẹp, thú vị một cách tình cờ, không có chủ ý trước.
            </p>
            <p
              className="mb-5 border-l-2 border-emerald-600 pl-4 text-xs leading-relaxed text-zinc-500 italic"
            >
              "The discovery was a happy serendipity — he hadn't planned to be there at all."
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {['IELTS Writing', 'Academic', 'C1 Level'].map(tag => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white
                                 transition-all hover:-translate-y-px hover:bg-emerald-500"
              >
                ♡ Lưu từ
              </button>
              <button
                className="flex-1 rounded-xl border border-zinc-600 bg-zinc-700 py-2.5 text-sm font-semibold text-zinc-400
                                 transition-all hover:border-zinc-500 hover:text-white"
              >
                + Danh sách
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-900 px-6 py-8
                         text-xs text-zinc-600 sm:flex-row"
      >
        <span className="font-display font-extrabold text-zinc-500">
          Dylan <span className="text-emerald-600">Dictionary</span>
        </span>
        <div className="flex gap-6">
          {['Về chúng tôi', 'Hỗ trợ', 'Điều khoản', 'Liên hệ'].map(link => (
            <a key={link} href="#" className="transition-colors hover:text-emerald-400">
              {link}
            </a>
          ))}
        </div>
        <span>© 2026 Dylan Dictionary</span>
      </footer>
    </div>
  )
}
