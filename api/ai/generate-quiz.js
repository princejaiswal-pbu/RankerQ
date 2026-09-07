export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { subject, topic, difficulty, count, level, mistakes = [], apiKey } = req.body || {}
  const safeCount = Math.max(1, Math.min(15, Number.parseInt(count, 10) || 5))
  if (!subject || !topic || !difficulty) return res.status(400).json({ error: 'Subject, topic, and difficulty are required.' })
  const key = apiKey || process.env.GEMINI_API_KEY
  if (!key) return res.status(503).json({ error: 'Add a Gemini API key in your profile to generate fresh quizzes.' })
  const weakAreas = mistakes.slice(0, 5).map(m => `${m.subject}: ${m.question}`).join('\n') || 'None'
  const prompt = `Create ${safeCount} fresh CA ${level || 'Foundation'} MCQs on ${subject}: ${topic}. Difficulty: ${difficulty}. Weak areas: ${weakAreas}. Return ONLY a JSON array. Each object must have question, options (exactly 4 strings), correct (0-3), marks (2-5), timesAsked (1-5), and explanation with simple and icai strings. Do not repeat questions.`
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9, responseMimeType: 'application/json' } }) })
    const data = await response.json()
    if (!response.ok) throw new Error(data?.error?.message || `Gemini request failed (${response.status})`)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    const questions = JSON.parse(text)
    if (!Array.isArray(questions) || !questions.length) throw new Error('Gemini returned no questions.')
    res.status(200).json({ questions: questions.filter(q => Array.isArray(q.options) && q.options.length >= 4).slice(0, safeCount).map((q, index) => ({ id: `gemini-${Date.now()}-${index}`, subject, chapter: topic, ...q, options: q.options.slice(0, 4), correct: Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4 ? q.correct : 0, explanation: q.explanation || { simple: 'Review this concept.', icai: 'Refer to the ICAI module.' } })), meta: { subject, topic, difficulty, generatedBy: 'Gemini' } })
  } catch (error) { res.status(500).json({ error: 'Could not generate a Gemini quiz.', details: error.message }) }
}
