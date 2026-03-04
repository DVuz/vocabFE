import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, Search, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface Meaning {
  id: number;
  partOfSpeech: string;
  cefrLevel: string | null;
  definition: string;
  vnDefinition: string;
  examples: string[];
  ipa: { uk: string | null; us: string | null };
  audio: { uk: string | null; us: string | null };
}

interface WordData {
  id: number;
  word: string;
  meanings: Meaning[];
}

const CEFR_COLOR: Record<string, string> = {
  A1: 'bg-green-100 text-green-700 border-green-200',
  A2: 'bg-lime-100 text-lime-700 border-lime-200',
  B1: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  B2: 'bg-orange-100 text-orange-700 border-orange-200',
  C1: 'bg-red-100 text-red-700 border-red-200',
  C2: 'bg-purple-100 text-purple-700 border-purple-200',
};

const POS_COLOR: Record<string, string> = {
  noun: 'bg-blue-50 text-blue-600 border-blue-200',
  verb: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  adjective: 'bg-violet-50 text-violet-600 border-violet-200',
  adverb: 'bg-amber-50 text-amber-600 border-amber-200',
  preposition: 'bg-pink-50 text-pink-600 border-pink-200',
  conjunction: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  pronoun: 'bg-teal-50 text-teal-600 border-teal-200',
};

const POS_DOT: Record<string, string> = {
  noun: 'bg-blue-400',
  verb: 'bg-emerald-400',
  adjective: 'bg-violet-400',
  adverb: 'bg-amber-400',
  preposition: 'bg-pink-400',
  conjunction: 'bg-cyan-400',
  pronoun: 'bg-teal-400',
};

function AudioButton({ url, label }: { url: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function play(e: React.MouseEvent) {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setPlaying(false);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlaying(true);
  }

  return (
    <button
      onClick={play}
      title={`Nghe phát âm ${label}`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all
        ${
          playing
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
        }`}
    >
      <Volume2 size={11} />
      {label}
    </button>
  );
}

function MeaningCard({
  meaning,
  index,
  showVN,
}: {
  meaning: Meaning;
  index: number;
  showVN: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const posClass = POS_COLOR[meaning.partOfSpeech] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200';

  async function handleSave() {
    if (saved || saving) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      setSaveError('Bạn cần đăng nhập để lưu từ');
      setTimeout(() => setSaveError(null), 3000);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/user-words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meaningId: meaning.id }),
      });
      const json = await res.json();
      if (res.status === 201 || json.success) {
        setSaved(true);
      } else if (res.status === 409) {
        setSaved(true); // đã lưu rồi
      } else {
        setSaveError(json.message ?? 'Lưu thất bại');
        setTimeout(() => setSaveError(null), 3000);
      }
    } catch {
      setSaveError('Lỗi kết nối');
      setTimeout(() => setSaveError(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-sm hover:border-zinc-300 transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className="text-xs font-bold text-zinc-300 shrink-0">{index}</span>

          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${posClass}`}
          >
            {meaning.partOfSpeech}
          </span>

          {meaning.cefrLevel && (
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded border shrink-0 ${CEFR_COLOR[meaning.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
            >
              {meaning.cefrLevel}
            </span>
          )}

          {(meaning.ipa.uk || meaning.ipa.us) && (
            <div className="flex items-center gap-2 flex-wrap">
              {meaning.ipa.uk && (
                <span className="flex items-center gap-1.5 text-[12px] text-blue-700 font-mono border-2 border-blue-300 rounded-md px-3 py-1 bg-blue-50 font-semibold">
                  <span className="text-blue-600">UK</span>
                  <span>/{meaning.ipa.uk}/</span>
                  {meaning.audio.uk && <AudioButton url={meaning.audio.uk} label="UK" />}
                </span>
              )}
              {meaning.ipa.us && (
                <span className="flex items-center gap-1.5 text-[12px] text-amber-700 font-mono border-2 border-amber-300 rounded-md px-3 py-1 bg-amber-50 font-semibold">
                  <span className="text-amber-600">US</span>
                  <span>/{meaning.ipa.us}/</span>
                  {meaning.audio.us && <AudioButton url={meaning.audio.us} label="US" />}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saved || saving}
          title={saved ? 'Đã lưu' : 'Thêm vào danh sách từ'}
          className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
            ${
              saved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600 cursor-default'
                : saving
                  ? 'border-zinc-200 text-zinc-300 cursor-wait'
                  : 'border-zinc-200 text-zinc-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
        >
          <BookOpen size={11} />
          {saving ? 'Đang lưu…' : saved ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>

      {saveError && <p className="text-xs text-red-500 mb-2">{saveError}</p>}

      <p className="text-zinc-900 text-sm leading-relaxed font-medium">{meaning.definition}</p>
      {showVN && (
        <p className="text-zinc-500 text-sm leading-relaxed mt-0.5 italic">
          {meaning.vnDefinition}
        </p>
      )}

      {meaning.examples.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {meaning.examples.map((ex, i) => (
            <li
              key={i}
              className="text-xs text-zinc-600 italic leading-relaxed pl-3 border-l-2 border-emerald-300"
            >
              "{ex}"
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const Route = createFileRoute('/search/$word')({
  component: SearchPage,
});

function SearchPage() {
  const { word } = Route.useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(word);
  const [data, setData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVN, setShowVN] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    setQuery(word);

    fetch(`${API_BASE}/dict/${encodeURIComponent(word)}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data as WordData);
        else setError(json.message ?? 'Không tìm thấy từ này');
      })
      .catch(() => setError('Lỗi kết nối, vui lòng thử lại'))
      .finally(() => setLoading(false));
  }, [word]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate({ to: '/search/$word', params: { word: trimmed } });
  }

  const grouped: Record<string, Meaning[]> = {};
  if (data) {
    for (const m of data.meanings) {
      if (!grouped[m.partOfSpeech]) grouped[m.partOfSpeech] = [];
      grouped[m.partOfSpeech].push(m);
    }
  }
  const posList = Object.keys(grouped);
  let meaningIndex = 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex gap-8 items-start">
          {/* ══ LEFT SIDEBAR ══ */}
          <aside className="w-72 shrink-0 sticky top-24 flex flex-col gap-4">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div
                className="flex items-center bg-white border-2 border-zinc-200 rounded-xl overflow-hidden
                              focus-within:border-emerald-500 transition-all shadow-sm"
              >
                <span className="pl-3 text-zinc-400 shrink-0">
                  <Search size={15} />
                </span>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm từ khác..."
                  className="flex-1 px-2 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent border-none outline-none"
                />
                <button
                  type="submit"
                  className="m-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-all"
                >
                  Tra
                </button>
              </div>
            </form>

            {/* Word info card */}
            {!loading && data && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                <h1 className="font-display text-3xl font-extrabold text-zinc-900 tracking-tight mb-1 break-all">
                  {data.word}
                </h1>
                <p className="text-xs text-zinc-400 mb-3">{data.meanings.length} lớp nghĩa</p>

                <button
                  onClick={() => setShowVN(v => !v)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all mb-2
                    ${
                      showVN
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                >
                  <span>Dịch nghĩa (VI)</span>
                  <span
                    className={`w-8 h-4 rounded-full transition-colors relative ${showVN ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${showVN ? 'left-4' : 'left-0.5'}`}
                    />
                  </span>
                </button>

                <div className="flex flex-col gap-1">
                  {posList.map(pos => (
                    <button
                      key={pos}
                      onClick={() =>
                        document
                          .getElementById(`pos-${pos}`)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                      className="flex items-center justify-between px-3 py-2 rounded-lg
                                 hover:bg-zinc-50 transition-all group text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${POS_DOT[pos] ?? 'bg-zinc-400'}`}
                        />
                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">
                          {pos}
                        </span>
                      </span>
                      <span className="text-xs text-zinc-400 tabular-nums">
                        {grouped[pos].length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm animate-pulse">
                <div className="h-8 bg-zinc-100 rounded-lg w-3/4 mb-2" />
                <div className="h-3 bg-zinc-100 rounded w-1/3 mb-5" />
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-zinc-100 rounded-lg mb-1.5" />
                ))}
              </div>
            )}

            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-600 transition-colors px-1"
            >
              <ArrowLeft size={14} />
              Về trang chủ
            </Link>
          </aside>

          {/* ══ RIGHT CONTENT ══ */}
          <main className="flex-1 min-w-0">
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-9 h-9 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                <p className="text-sm text-zinc-400">Đang tìm "{word}"…</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                <Search size={40} className="text-zinc-300" />
                <h2 className="text-xl font-bold text-zinc-800">Không tìm thấy "{word}"</h2>
                <p className="text-sm text-zinc-400">{error}</p>
              </div>
            )}

            {!loading && data && (
              <div className="flex flex-col gap-10">
                {posList.map(pos => (
                  <section key={pos} id={`pos-${pos}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full border ${POS_COLOR[pos] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
                      >
                        {pos}
                      </span>
                      <div className="flex-1 h-px bg-zinc-200" />
                      <span className="text-xs text-zinc-400 tabular-nums shrink-0">
                        {grouped[pos].length} nghĩa
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {grouped[pos].map(m => {
                        meaningIndex++;
                        return (
                          <MeaningCard
                            key={m.id}
                            meaning={m}
                            index={meaningIndex}
                            showVN={showVN}
                          />
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
