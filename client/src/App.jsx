
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [syllabus, setSyllabus] = useState(null)
  const [result, setResult] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyzeSyllabus = async () => {
    if (!syllabus) return

    setLoading(true)
    setError('')
    setResult('')
    setAnalysis('')

    const formData = new FormData()
    formData.append('syllabus', syllabus)

    try {
      const response = await axios.post(
        'http://localhost:5000/api/analyze-syllabus',
        formData,
      )

      setResult(response.data.text)
      setAnalysis(response.data.analysis)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not analyze the PDF. Please check that the backend is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 md:px-12">
        <h1 className="text-2xl font-bold text-indigo-600">
          Learnova<span className="text-slate-800">.</span>
        </h1>
        <a
          href="#upload"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium !text-white hover:bg-indigo-700"
        >
          Get Started
        </a>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            Your Personal Learning Companion
          </p>
          <h2 className="text-4xl font-extrabold md:text-6xl">
            Study smarter,
            <span className="block text-indigo-600">not harder.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload your syllabus and let Learnova extract its text for analysis.
          </p>
        </div>

        <section
          id="upload"
          className="mx-auto mt-12 max-w-2xl rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-100/50 md:p-10"
        >
          <div className="text-center">
            <div className="text-5xl">📚</div>
            <h3 className="mt-4 text-2xl font-bold">Upload Your Syllabus</h3>
            <p className="mt-2 text-slate-500">
              Select a text-based PDF file (maximum 10 MB).
            </p>
          </div>

          <label
            htmlFor="syllabus-file"
            className="mt-8 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 p-8 text-center hover:bg-indigo-100"
          >
            <span className="text-3xl">📄</span>
            <span className="mt-3 font-semibold text-indigo-700">
              Click to choose a PDF
            </span>
            <span className="mt-2 text-sm text-slate-500">
              PDF files only
            </span>
            <input
              id="syllabus-file"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => {
                setSyllabus(event.target.files?.[0] ?? null)
                setResult('')
                setError('')
              }}
            />
          </label>

          {syllabus && (
            <p className="mt-4 break-all text-center text-sm text-green-700">
              Selected file: {syllabus.name}
            </p>
          )}

          <button
            type="button"
            disabled={!syllabus || loading}
            onClick={analyzeSyllabus}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold !text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Extracting Text...' : 'Analyze Syllabus'}
          </button>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-6">
              <h4 className="mb-3 text-lg font-bold">Extracted Syllabus Text</h4>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6">
                {result}
              </pre>
            </div>
          )}

          
          {analysis && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <h4 className="mb-3 text-xl font-bold text-indigo-700">
                Learnova AI Analysis
              </h4>
              <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {analysis}
              </div>
            </div>
          )}

        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-500">
        © 2026 Learnova. Learn with purpose.
      </footer>
    </div>
  )
}

export default App
