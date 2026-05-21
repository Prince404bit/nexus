import Link from "next/link"

async function getQuestions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/questions`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.questions ?? []
  } catch {
    return []
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions()

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Q&A</h1>
            <p className="text-gray-400 mt-2">Ask anything. Get real answers.</p>
          </div>
          <Link href="/questions/ask" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-5 py-2.5 rounded-full font-bold text-sm transition">
            + Ask Question
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No questions yet.</p>
            <Link href="/questions/ask" className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm">
              Ask the First Question
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q: any) => (
              <div key={q.id} className="border border-white/10 rounded-2xl p-5 bg-white/5 hover:border-white/20 transition">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <span className="text-sm font-bold">0</span>
                    <span className="text-xs text-gray-500">Votes</span>
                    <span className={`text-sm font-bold mt-1 ${q.acceptedAnswerId ? "text-green-400" : "text-gray-500"}`}>
                      {q._count?.answers ?? 0}
                    </span>
                    <span className="text-xs text-gray-500">Answers</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white hover:text-violet-400 cursor-pointer transition mb-2">{q.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">#{tag}</span>
                      ))}
                      {q.acceptedAnswerId && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">Solved</span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        by {q.author?.username ?? "unknown"} · {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}