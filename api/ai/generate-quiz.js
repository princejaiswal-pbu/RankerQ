// /api/ai/generate-quiz.js - Vercel Serverless Function
// Generates personalized CA quiz using Meta AI (Llama 3)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { subject, chapter, difficulty, count, level, mistakes } = req.body

  // Build prompt for Llama
  const weakAreas = mistakes?.slice(0, 5).map(m => `${m.subject} - ${m.chapter}: ${m.question}`).join('\n') || 'None'
  
  const prompt = `
You are a CA Foundation/Intermediate expert. Generate ${count} MCQs for:
- Subject: ${subject}
- Chapter: ${chapter}
- Level: ${level}
- Difficulty: ${difficulty}
- Student weak areas: ${weakAreas}

Requirements:
- Each question: ICAI pattern, ${difficulty} difficulty
- 4 options, 1 correct
- Include marks (2-5), times ICAI asked (1-5), year
- Provide simple explanation + ICAI format explanation
- Format as JSON array:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "marks": 3,
    "timesAsked": 2,
    "explanation": { "simple": "...", "icai": "..." }
  }
]

Return ONLY JSON, no extra text.
`

  try {
    // Option 1: Meta AI API (if you have access)
    // const response = await fetch('https://api.llama.meta.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.META_AI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     model: 'llama3-70b',
    //     messages: [{ role: 'user', content: prompt }],
    //     temperature: 0.7
    //   })
    // })

    // Option 2: OpenAI compatible (for demo, using Groq/OpenAI)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    const data = await response.json()
    let content = data.choices[0].message.content
    
    // Extract JSON
    const jsonMatch = content.match(/\[.*\]/s)
    if (jsonMatch) content = jsonMatch[0]
    
    const questions = JSON.parse(content)

    res.status(200).json({ 
      questions: questions.map((q, i) => ({
        id: `ai-${Date.now()}-${i}`,
        subject,
        chapter,
        ...q
      })),
      meta: { subject, chapter, difficulty, generatedBy: 'Meta AI Llama 3' }
    })

  } catch (error) {
    console.error('AI Quiz generation error:', error)
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message })
  }
}
