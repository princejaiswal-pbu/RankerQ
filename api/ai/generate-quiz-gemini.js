// /api/ai/generate-quiz-gemini.js - Vercel Serverless - Fresh Gemini Quizzes for RankerQ by PP
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { topic, difficulty, count, timePerQ, apiKey: clientApiKey } = req.body
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(400).json({ error: 'No Gemini API key. Add in profile or set GEMINI_API_KEY env. Get free at aistudio.google.com' })

  const prompt = `You are RankerQ by PP - CA exam game quest generator. Generate ${count} FRESH, UNIQUE, HIGH-QUALITY MCQs for topic: "${topic}". Difficulty: ${difficulty}. Time per Q: ${timePerQ}. 
Requirements:
- Each question must be UNIQUE, not repeated, fresh
- CA Foundation/Intermediate level, ICAI pattern
- 4 options, 1 correct index 0-3
- marks 2-5, timesAsked 1-5
- explanation simple (easy language) + icai (ICAI module format)
- Game style: make it engaging
- Return ONLY valid JSON array: [{"question":"...","options":["A","B","C","D"],"correct":0,"marks":3,"timesAsked":2,"explanation":{"simple":"...","icai":"..."}}]
No extra text.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.9, maxOutputTokens:4000, responseMimeType:'application/json' } })
    })
    const data = await response.json()
    if (data.error) return res.status(500).json({ error:'Gemini API error', details:data.error })
    let content=data.candidates?.[0]?.content?.parts?.[0]?.text||'[]'
    const m=content.match(/\[.*\]/s); if(m) content=m[0]
    const questions=JSON.parse(content)
    res.status(200).json({ questions: questions.map((q,i)=>({ id:`gemini-${Date.now()}-${i}`, subject:'Gemini', topic, ...q })), meta:{ topic, difficulty, fresh:true, generatedBy:'Gemini 1.5 Flash - RankerQ by PP' } })
  } catch(e){ res.status(500).json({ error:'Failed to generate fresh quest with Gemini', details:e.message }) }
}
