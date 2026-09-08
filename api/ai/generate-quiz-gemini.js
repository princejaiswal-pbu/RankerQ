// /api/ai/generate-quiz-gemini.js - Vercel Serverless - Fresh Gemini Quizzes for RankerQ by PP
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { topic, difficulty, count, timePerQ, apiKey: clientApiKey } = req.body
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(400).json({ error: 'No Gemini API key. Add in profile or set GEMINI_API_KEY env. Get free at aistudio.google.com' })

  const safeCount = Math.min(15, Math.max(5, Number(count) || 10))
  const prompt = `You are an expert CA exam question writer for RankerQ.
Create exactly ${safeCount} original multiple-choice questions about: "${String(topic).slice(0,200)}".
Level/difficulty: ${difficulty}. Time per question: ${timePerQ}.

QUALITY RULES:
- Questions must be academically meaningful and specific to CA/ICAI preparation.
- Do NOT write placeholder questions, generic questions, fake case laws, or questions unrelated to the requested topic.
- Each question must have exactly 4 plausible options. Only one option is correct.
- Do not make the correct answer obvious because it is longer or more detailed.
- Do not put "Correct as per ICAI", "Incorrect interpretation", "Partially correct" or similar meta-options.
- Where a section, standard, formula, case law, threshold, rate, date or rule is used, state it accurately. If you are not confident, avoid inventing it.
- Give a short, student-friendly explanation that teaches why the correct option is right and why the key idea matters.
- Give an ICAI-style explanation that names the relevant provision/standard/concept when appropriate and explains the application.
- Return ONLY JSON. No markdown and no commentary.

Schema:
[
  {
    "question":"...",
    "options":["...","...","...","..."],
    "correct":0,
    "marks":2,
    "timesAsked":1,
    "subject":"...",
    "chapter":"...",
    "explanation":{
      "simple":"2-4 sentence student-friendly explanation.",
      "icai":"Concise ICAI-style reasoning with relevant provision/standard/concept where applicable."
    }
  }
]
`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.9, maxOutputTokens:4000, responseMimeType:'application/json' } })
    })
    const data = await response.json()
    if (data.error) return res.status(500).json({ error:'Gemini API error', details:data.error })
    let content=data.candidates?.[0]?.content?.parts?.[0]?.text||'[]'
    const m=content.match(/\[.*\]/s); if(m) content=m[0]
    const parsed=JSON.parse(content)
    if(!Array.isArray(parsed) || parsed.length<1) throw new Error('Gemini returned no questions')
    const questions=parsed.slice(0,safeCount).map((q,i)=>{
      const options=Array.isArray(q.options) ? q.options.map(v=>String(v).trim()).filter(Boolean).slice(0,4) : []
      if(!q.question || options.length!==4) throw new Error(`Invalid question ${i+1} returned by Gemini`)
      const correct=Number(q.correct)
      if(!Number.isInteger(correct) || correct<0 || correct>3) throw new Error(`Invalid answer key for question ${i+1}`)
      const explanation=typeof q.explanation==='object' && q.explanation ? q.explanation : {}
      return {
        id:`gemini-${Date.now()}-${i}`,
        question:String(q.question).trim(),
        options,
        correct,
        marks:Number(q.marks)||2,
        timesAsked:Number(q.timesAsked)||1,
        subject:String(q.subject||'CA'),
        chapter:String(q.chapter||topic).slice(0,100),
        explanation:{
          simple:String(explanation.simple||'Review the correct option and the relevant ICAI concept.'),
          icai:String(explanation.icai||'Refer to the relevant ICAI study material for the applicable provision or concept.')
        }
      }
    })
    res.status(200).json({ questions, meta:{ topic, difficulty, fresh:true, generatedBy:'Gemini' } })
  } catch(e){ res.status(500).json({ error:'Failed to generate fresh quest with Gemini', details:e.message }) }
}
