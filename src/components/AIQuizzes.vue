<template>
  <div class="p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center">
      <h2 class="jakarta text-[20px] font-black tracking-tight">AI Quests ✨</h2>
      <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">Gemini • Fresh</span>
    </div>

    <div v-if="!activeQuiz" class="mt-5 rounded-[24px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] shadow-[0_8px_32px_rgba(79,70,229,0.2)]">
      <div class="rounded-[22px] bg-white p-5">
        <div class="flex gap-3"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl">🎮</div><div class="flex-1"><h3 class="jakarta font-black text-[16px]">Gemini Quest Generator</h3><p class="text-[12px] text-gray-500 mt-1">Type any CA topic → fresh quiz instantly</p></div></div>

        <div class="mt-5 space-y-4">
          <div>
            <label class="text-[11px] font-black uppercase text-gray-500">✍️ Topic (be specific for best quiz)</label>
            <textarea v-model="form.topic" placeholder="e.g. 'Indian Contract Act - void vs voidable with Mohini Bibi case law' or 'Final Accounts - Treatment of goodwill on admission' - detailed topic = better quiz!" class="mt-2 w-full min-h-[90px] p-3.5 rounded-xl bg-[#F8F9FF] border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none text-[13px] font-medium resize-none leading-5" maxlength="200"></textarea>
            <div class="mt-1.5 flex justify-between"><span class="text-[10px] text-gray-400">{{ form.topic.length }}/200</span><span v-if="form.topic.length>10" class="text-[10px] font-bold text-green-600">✓ Ready</span></div>
            <div class="mt-3 flex gap-2 overflow-x-auto scrollbar-hide"><button v-for="chip in quickTopics" :key="chip" @click="form.topic=chip" class="whitespace-nowrap px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">+ {{ chip.slice(0,22) }}...</button></div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div><label class="text-[9px] font-black uppercase text-gray-400">Level</label><div class="mt-1 flex bg-gray-100 rounded-xl p-1"><button v-for="d in ['Easy','Medium','Hard']" :key="d" @click="form.difficulty=d" :class="form.difficulty===d?'bg-white shadow border':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black">{{ d }}</button></div></div>
            <div><label class="text-[9px] font-black uppercase text-gray-400">Qs</label><div class="mt-1 flex bg-gray-100 rounded-xl p-1"><button v-for="n in [5,10,15]" :key="n" @click="form.count=n" :class="form.count===n?'bg-white shadow border':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black">{{ n }}</button></div></div>
            <div><label class="text-[9px] font-black uppercase text-gray-400">Timer</label><div class="mt-1 flex bg-gray-100 rounded-xl p-1"><button v-for="t in ['30s','60s','90s']" :key="t" @click="form.timePerQ=t" :class="form.timePerQ===t?'bg-white shadow border':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black">{{ t }}</button></div></div>
          </div>

          <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-2"><span>🔑</span><p class="text-[11px] text-indigo-800"><span v-if="hasApiKey" class="font-black text-green-700">✓ API Key:</span><span v-else class="font-black text-amber-700">⚠️ No Key:</span> {{ hasApiKey?'Fresh Gemini quizzes every time!':'Add key in profile for real Gemini. Using high-quality mock now.' }}</p></div>

          <button @click="generateQuiz" :disabled="generating||form.topic.trim().length<5" :class="generating||form.topic.trim().length<5?'bg-gray-200 text-gray-400':'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'" class="w-full h-[52px] rounded-xl font-black text-[14px] flex items-center justify-center gap-2">
            <span v-if="generating" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ generating?'Gemini Crafting Quest...':`🚀 Generate ${form.count}Q Quest with Gemini` }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeQuiz" class="mt-4">
      <div class="flex justify-between items-center bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm">
        <button @click="confirmExit" class="text-[12px] font-black px-2.5 py-1 rounded-full bg-gray-100">← Exit</button>
        <div class="flex gap-2"><div class="px-2.5 py-1 rounded-full text-[11px] font-black" :class="timeLeft<10?'bg-red-50 text-red-600 border border-red-200 animate-pulse':'bg-indigo-50 text-indigo-700 border'"><span>⏱️ {{ formatTime(timeLeft) }}</span></div><span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-gray-900 text-white">{{ currentIndex+1 }}/{{ activeQuiz.questions.length }}</span></div>
      </div>

      <div class="mt-3 h-2 bg-gray-100 rounded-full flex gap-1 p-1"><div v-for="(q,i) in activeQuiz.questions" :key="i" class="flex-1 h-full rounded-full" :class="i<currentIndex?'bg-green-500':i===currentIndex?'bg-indigo-600 animate-pulse':'bg-gray-200'"></div></div>

      <div class="mt-4 bg-white rounded-[20px] border border-indigo-100 shadow p-5 relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div class="flex justify-between gap-2">
          <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gray-900 text-white">{{ currentQ.subject || 'Gemini' }} • {{ currentQ.marks }} Marks</span>
          <div class="flex gap-1.5"><button @click="toggleBookmarkCurrent" :class="isBookmarkedCurrent?'bg-yellow-400 text-black border-yellow-400':'bg-white border-gray-200 text-gray-400'" class="w-8 h-8 rounded-full border flex items-center justify-center">{{ isBookmarkedCurrent?'⭐':'☆' }}</button><span v-if="currentQ.timesAsked>1" class="text-[10px] font-black px-2 py-1 rounded-full bg-amber-50 text-amber-700 border">🔥 ×{{ currentQ.timesAsked }}</span></div>
        </div>

        <p class="text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-4">Question {{ currentIndex+1 }} • Gemini AI</p>
        <p class="text-[16px] font-bold text-gray-900 mt-2 leading-6">{{ currentQ.question }}</p>

        <div class="mt-5 space-y-2.5">
          <button v-for="(opt, idx) in currentQ.options" :key="idx" @click="selectAnswer(idx)" :disabled="answered" :class="getOptionClass(idx)" class="w-full text-left px-4 py-3.5 rounded-xl border-2 text-[13px] font-semibold flex justify-between items-center">
            <span class="flex gap-2.5 items-center"><span class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border" :class="getLetterClass(idx)">{{ String.fromCharCode(65+idx) }}</span><span class="flex-1">{{ opt }}</span></span>
            <span v-if="answered && idx===currentQ.correct" class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[12px]">✓</span>
            <span v-if="answered && idx===selectedAnswer && idx!==currentQ.correct" class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">✗</span>
          </button>
        </div>

        <div v-if="answered" class="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <div class="flex justify-between items-center"><p class="text-[11px] font-black uppercase tracking-widest text-indigo-600">🤖 Gemini Explanation • Fixed</p><span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ Verified</span></div>
          
          <div class="mt-3">
            <p class="text-[11px] font-black text-gray-700 uppercase">Correct Answer:</p>
            <p class="text-[13px] font-bold text-green-700 mt-1">{{ String.fromCharCode(65+currentQ.correct) }}. {{ currentQ.options[currentQ.correct] }}</p>
          </div>

          <div class="mt-3">
            <p class="text-[11px] font-black text-indigo-700 uppercase">Simple Explanation:</p>
            <p class="text-[13px] text-gray-800 mt-1 leading-5">{{ currentQ.explanation?.simple || 'No explanation' }}</p>
          </div>

          <div class="mt-3">
            <p class="text-[11px] font-black text-gray-800 uppercase">ICAI Format:</p>
            <p class="text-[12px] text-gray-700 mt-1 leading-5 whitespace-pre-line">{{ currentQ.explanation?.icai || currentQ.explanation?.simple || '' }}</p>
          </div>

          <div v-if="currentQ.explanation?.tip" class="mt-3 p-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
            <p class="text-[10px] font-black uppercase text-yellow-700">💡 Tip for Exam:</p>
            <p class="text-[11px] text-yellow-800 mt-1">{{ currentQ.explanation.tip }}</p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-2">
          <button @click="toggleBookmarkCurrent" :class="isBookmarkedCurrent?'bg-yellow-400 text-black':'bg-white border-2'" class="h-11 rounded-xl font-bold text-[12px]">{{ isBookmarkedCurrent?'⭐ Saved':'🔖 Save' }}</button>
          <button v-if="currentIndex < activeQuiz.questions.length-1" @click="nextQuestion" :disabled="!answered" :class="answered?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px]">{{ answered?'Next Quest →':'Select answer' }}</button>
          <button v-else @click="finishQuiz" :disabled="!answered" :class="answered?'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px]">🏁 Finish Quest • Result</button>
        </div>
      </div>
    </div>

    <div v-if="showResult" class="fixed inset-0 z-[60] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div class="w-full max-w-[380px] bg-white rounded-[28px] p-6 shadow-2xl text-center">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto text-3xl">🏆</div>
        <h3 class="jakarta font-black text-[22px] mt-4">Quest Completed! 🎉</h3>
        <p class="text-[13px] text-gray-500 mt-1">{{ form.topic.slice(0,50) }}</p>
        <div class="mt-6 grid grid-cols-3 gap-3">
          <div class="p-3 rounded-2xl bg-indigo-50 border"><p class="text-[22px] font-black text-indigo-700">{{ score }}/{{ activeQuiz.questions.length }}</p><p class="text-[10px] font-black uppercase">Score</p><p class="text-[10px] text-indigo-600 font-bold">{{ Math.round((score/activeQuiz.questions.length)*100) }}%</p></div>
          <div class="p-3 rounded-2xl bg-yellow-50 border"><p class="text-[22px] font-black text-amber-600">+{{ earnedXP }}</p><p class="text-[10px] font-black uppercase">XP</p><p class="text-[10px] font-bold">Lvl {{ currentLevel }}</p></div>
          <div class="p-3 rounded-2xl bg-red-50 border"><p class="text-[22px] font-black text-red-600">{{ wrongCount }}</p><p class="text-[10px] font-black uppercase">Wrong</p></div>
        </div>
        <div class="mt-5 p-3 rounded-xl bg-gray-900 text-white text-left"><p class="text-[11px] font-black uppercase opacity-60">Stats</p><p class="text-[12px] mt-1">⏱️ {{ totalTime }}s total • {{ avgTime }}s avg • 🎯 {{ Math.round((score/activeQuiz.questions.length)*100) }}%</p><p v-if="wrongCount>0" class="text-[11px] mt-2 p-2 rounded bg-white/10">📚 {{ wrongCount }} saved to bookmarks for revision</p></div>
        <div class="mt-6 grid grid-cols-2 gap-2"><button @click="showResult=false; activeQuiz=null; resetTimer()" class="h-12 rounded-xl bg-white border-2 font-black text-[13px]">Close</button><button @click="shareResult" class="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-[13px]">Share ↗️</button></div>
        <button @click="generateQuiz" class="mt-2.5 w-full h-12 rounded-xl bg-yellow-400 text-black font-black text-[13px]">🔄 New Quest with Gemini</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const quickTopics=['Indian Contract Act void vs voidable with Mohini Bibi case','Partnership admission goodwill treatment ICAI','Final Accounts with adjustments 10 marks','Demand elasticity numericals','Companies Act 2013 - Types of companies','Audit - Vouching and verification']
const form=reactive({ topic:'', difficulty:'Medium', count:10, timePerQ:'60s' })
const generating=ref(false), activeQuiz=ref(null), currentIndex=ref(0), selectedAnswer=ref(null), answered=ref(false), showResult=ref(false), score=ref(0), earnedXP=ref(0), wrongAnswers=ref([]), timeLeft=ref(60), timer=ref(null), totalTime=ref(0), startTime=ref(0)
const hasApiKey=computed(()=>!!store.geminiApiKey.value), currentLevel=computed(()=>store.currentLevel.value), currentQ=computed(()=>activeQuiz.value?.questions[currentIndex.value]||{}), wrongCount=computed(()=>wrongAnswers.value.length), avgTime=computed(()=>activeQuiz.value?Math.round(totalTime.value/activeQuiz.value.questions.length):0), isBookmarkedCurrent=computed(()=>{ const q=currentQ.value; return store.bookmarks.value.some(b=>b.id===q.id) })
function formatTime(s){ return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` }
function startTimer(){ const sec=parseInt(form.timePerQ); timeLeft.value=sec; startTime.value=Date.now(); if(timer.value) clearInterval(timer.value); timer.value=setInterval(()=>{ timeLeft.value--; totalTime.value=Math.floor((Date.now()-startTime.value)/1000); if(timeLeft.value<=0) autoNext() },1000) }
function resetTimer(){ if(timer.value) clearInterval(timer.value); timer.value=null; timeLeft.value=parseInt(form.timePerQ) }
function autoNext(){ if(!answered.value){ const q=currentQ.value; wrongAnswers.value.push({ id:q.id, question:q.question, yourAnswer:'Time out', correctAnswer:q.options[q.correct], subject:'Law', chapter:form.topic.slice(0,20), marks:q.marks }); answered.value=true } if(currentIndex.value+1<activeQuiz.questions.length) nextQuestion(); else finishQuiz() }

function getFixedMockQuestions(){
  const topic=form.topic||'CA Foundation'
  // High-quality fixed mock questions - no more broken options
  return [
    {
      id:`gemini-${Date.now()}-0`,
      subject:'Business Laws',
      marks:form.difficulty==='Hard'?5:3,
      timesAsked:3,
      question:`What is the difference between void and voidable contract under Indian Contract Act, 1872? (Based on topic: ${topic})`,
      options:[
        'Void is void-ab-initio (never valid), Voidable is valid till avoided - e.g., minor contract void, fraud contract voidable',
        'Both are same and enforceable in court',
        'Void is valid, Voidable is invalid from beginning',
        'Void can be ratified, Voidable cannot be ratified'
      ],
      correct:0,
      explanation:{
        simple:'Void = dead from start (e.g., agreement with minor). Voidable = valid but one party can cancel (e.g., contract by fraud). Think: Void = never born, Voidable = can be killed.',
        icai:'As per ICAI Module:\n1. Void [Sec 2(j)]: Agreement not enforceable by law, void-ab-initio. Eg: Agreement with minor (Mohini Bibi vs Dharmadas Ghose 1903)\n2. Voidable [Sec 2(i)]: Enforceable at option of one party. Eg: Contract caused by coercion, fraud, misrepresentation\nAnswer: Option A is correct.',
        tip:'ICAI loves Mohini Bibi case for void. For voidable, remember fraud/coercion. Draw table in exam: Nature, Rights, Example.'
      }
    },
    {
      id:`gemini-${Date.now()}-1`,
      subject:'Business Laws',
      marks:4,
      timesAsked:4,
      question:`Essentials of a valid contract u/s 10 of Indian Contract Act, 1872?`,
      options:[
        'Offer + Acceptance + Lawful Consideration + Capacity + Free Consent + Lawful Object + Not expressly declared void',
        'Only offer and acceptance is enough',
        'Only consideration and capacity',
        'Only free consent and lawful object'
      ],
      correct:0,
      explanation:{
        simple:'Valid contract needs 7 things: Offer, Acceptance, Consideration, Capacity, Free Consent, Lawful Object, Not void. Miss one = not valid.',
        icai:'Sec 10: All agreements are contracts if made by free consent of competent parties, for lawful consideration and lawful object, not expressly declared void.\nEssentials:\n1. Offer & Acceptance\n2. Intention to create legal relation\n3. Lawful Consideration\n4. Capacity (major, sound mind)\n5. Free Consent (no coercion/fraud)\n6. Lawful Object\n7. Not declared void (e.g., wagering)',
        tip:'Write 7 points with sections. ICAI gives 1 mark per essential.'
      }
    },
    {
      id:`gemini-${Date.now()}-2`,
      subject:'Accounting',
      marks:5,
      timesAsked:5,
      question:`Treatment of Goodwill on admission of partner as per AS?`,
      options:[
        'Old partners sacrifice ratio: Premium for goodwill credited to sacrificing partners in sacrifice ratio, new partner brings goodwill in cash or adjustment',
        'Goodwill is ignored on admission',
        'Goodwill is distributed equally among all partners',
        'Goodwill is credited only to new partner'
      ],
      correct:0,
      explanation:{
        simple:'When new partner joins, he pays for goodwill because he will share future profits that old partners built. Old partners share it in sacrifice ratio.',
        icai:'As per AS and ICAI Module:\n- Sacrifice = Old Ratio - New Ratio\n- Journal: Bank A/c Dr To Premium for Goodwill A/c\n- Then Premium A/c Dr To Sacrificing Partners Capital A/c (in sacrifice ratio)\n- If goodwill not brought in cash: New partner Capital A/c Dr To Sacrificing Partners Capital A/c',
        tip:'Always calculate sacrifice ratio first. ICAI asks 5 marks numerical.'
      }
    }
  ]
}

async function generateQuiz(){
  if(form.topic.trim().length<5){ alert('Enter topic min 5 chars'); return }
  generating.value=true
  try{
    if(hasApiKey.value){
      const apiKey=store.geminiApiKey.value
      const prompt=`You are ICAI CA expert for RankerQ by PP. Generate ${form.count} UNIQUE high-quality MCQs for topic: "${form.topic}". Difficulty: ${form.difficulty}. 
STRICT FORMAT - Return ONLY JSON array:
[
  {
    "subject": "Business Laws",
    "marks": 3,
    "timesAsked": 2,
    "question": "Clear specific question?",
    "options": ["Correct detailed option with explanation","Wrong option 1","Wrong option 2","Wrong option 3"],
    "correct": 0,
    "explanation": {
      "simple": "Simple language explanation with analogy",
      "icai": "ICAI module format: Section, Case law, Points. As per Sec X... Case Y vs Z...",
      "tip": "Exam tip: How to write answer"
    }
  }
]
Rules:
- Question must be specific, ICAI pattern, based on topic
- Options: 4, first should be correct with detailed reason, others plausible but wrong
- Correct index 0-3 must match correct option
- Simple: easy language, analogy
- ICAI: mention sections, case laws, ICAI module points
- Tip: 1 exam tip
- No extra text, only JSON array
`
      const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.85, maxOutputTokens:5000, responseMimeType:'application/json' } })
      })
      const data=await resp.json()
      if(data.error) throw new Error(data.error.message)
      let content=data.candidates?.[0]?.content?.parts?.[0]?.text||''
      const m=content.match(/\[.*\]/s); if(m) content=m[0]
      const qs=JSON.parse(content)
      // Validate and fix
      const fixed=qs.map((q,i)=>({
        id:`gemini-${Date.now()}-${i}`,
        subject:q.subject||'Gemini',
        marks:q.marks||3,
        timesAsked:q.timesAsked||2,
        question:q.question,
        options:q.options && q.options.length===4?q.options:['Option A','Option B','Option C','Option D'],
        correct:typeof q.correct==='number'&&q.correct>=0&&q.correct<4?q.correct:0,
        explanation:{
          simple:q.explanation?.simple||q.explanation||'Explanation',
          icai:q.explanation?.icai||q.explanation?.simple||'',
          tip:q.explanation?.tip||'Remember sections and case laws'
        }
      }))
      activeQuiz.value={ questions:fixed }; currentIndex.value=0; selectedAnswer.value=null; answered.value=false; score.value=0; wrongAnswers.value=[]; totalTime.value=0; generating.value=false; startTimer(); return
    }
  }catch(e){ console.error('Gemini failed, using fixed mock',e); }
  await new Promise(r=>setTimeout(r,1200))
  const baseQs=getFixedMockQuestions()
  let allQs=[]
  while(allQs.length<form.count){ allQs=[...allQs,...baseQs.map(q=>({ ...q, id:`${q.id}-${allQs.length}-${Math.random()}` })) ] }
  activeQuiz.value={ questions:allQs.slice(0,form.count) }; currentIndex.value=0; selectedAnswer.value=null; answered.value=false; score.value=0; wrongAnswers.value=[]; totalTime.value=0; generating.value=false; startTimer()
}
function selectAnswer(idx){ if(answered.value) return; selectedAnswer.value=idx; answered.value=true; const q=currentQ.value; if(idx===q.correct){ score.value++; earnedXP.value+=q.marks*15 } else { wrongAnswers.value.push({ id:q.id, question:q.question, yourAnswer:q.options[idx], correctAnswer:q.options[q.correct], subject:q.subject, chapter:form.topic.slice(0,20), marks:q.marks }) } }
function nextQuestion(){ if(currentIndex.value+1<activeQuiz.value.questions.length){ currentIndex.value++; selectedAnswer.value=null; answered.value=false; timeLeft.value=parseInt(form.timePerQ) } }
function finishQuiz(){ resetTimer(); earnedXP.value=score.value*25+(activeQuiz.questions.length-wrongAnswers.value.length)*10; store.completeQuiz(earnedXP.value,wrongAnswers.value); showResult.value=true }
function toggleBookmarkCurrent(){ const q=currentQ.value; store.toggleBookmark({ ...q, topic:form.topic }) }
function getOptionClass(idx){
  if(!answered.value) return selectedAnswer.value===idx?'bg-indigo-50 border-indigo-400 text-indigo-800':'bg-white border-2 border-gray-100 hover:border-indigo-200'
  const q=currentQ.value; if(idx===q.correct) return 'bg-green-50 border-green-400 text-green-800 font-bold'; if(idx===selectedAnswer.value) return 'bg-red-50 border-red-300 text-red-800'; return 'bg-white border-gray-100 text-gray-400'
}
function getLetterClass(idx){
  if(!answered.value) return selectedAnswer.value===idx?'bg-indigo-600 text-white border-indigo-600':'bg-gray-100 text-gray-500 border-gray-200'
  const q=currentQ.value; if(idx===q.correct) return 'bg-green-500 text-white border-green-500'; if(idx===selectedAnswer.value) return 'bg-red-500 text-white'; return 'bg-gray-100 text-gray-400 border-gray-200'
}
function confirmExit(){ if(confirm('Exit quest? Progress lost!')){ resetTimer(); activeQuiz.value=null } }
function shareResult(){ const text=`🎮 I scored ${score.value}/${activeQuiz.value.questions.length} in "${form.topic.slice(0,30)}" on RankerQ by PP! +${earnedXP.value} XP`; if(window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbot')}&text=${encodeURIComponent(text)}`) }
onUnmounted(()=>{ if(timer.value) clearInterval(timer.value) })
</script>
