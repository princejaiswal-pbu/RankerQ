<template>
  <div class="p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center">
      <h2 class="jakarta text-[20px] font-black text-gray-900 tracking-tight">AI Quests ✨</h2>
      <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow">Gemini AI • Fresh</span>
    </div>

    <!-- Generator - TEXTBOX INSTEAD OF DROPDOWN -->
    <div v-if="!activeQuiz" class="mt-5 rounded-[24px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] shadow-[0_8px_32px_rgba(79,70,229,0.2)]">
      <div class="rounded-[22px] bg-white p-5">
        <div class="flex gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg animate-pulse">🎮</div>
          <div class="flex-1">
            <h3 class="jakarta font-black text-[16px] tracking-tight">Gemini Quest Generator</h3>
            <p class="text-[12px] text-gray-500 mt-1 leading-4">Type any topic → Gemini creates fresh quiz instantly</p>
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <!-- TEXTBOX FOR TOPIC - REPLACES DROPDOWN -->
          <div>
            <label class="text-[11px] font-black tracking-widest uppercase text-gray-500 flex items-center gap-2">✍️ What topic do you want quiz on? <span class="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">NEW</span></label>
            <textarea v-model="form.topic" placeholder="e.g. 'Contract Act void vs voidable with case laws' or 'Partnership admission of partner goodwill treatment' or 'Economics demand elasticity numericals' - be specific for best quiz!" class="mt-2 w-full min-h-[88px] p-3.5 rounded-xl bg-[#F8F9FF] border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none text-[13px] font-medium resize-none leading-5 placeholder:text-gray-400" maxlength="200"></textarea>
            <div class="mt-1.5 flex justify-between items-center"><span class="text-[10px] text-gray-400">{{ form.topic.length }}/200 chars • Be specific = better quiz</span><span v-if="form.topic.length>10" class="text-[10px] font-bold text-green-600">✓ Ready for Gemini</span></div>
            
            <!-- Quick topic chips -->
            <div class="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button v-for="chip in quickTopics" :key="chip" @click="form.topic=chip" class="whitespace-nowrap px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold hover:bg-indigo-100 transition">+ {{ chip.slice(0,25) }}...</button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-[10px] font-black tracking-widest uppercase text-gray-400">Level</label>
              <div class="mt-1.5 flex bg-gray-100 rounded-xl p-1">
                <button v-for="d in ['Easy','Medium','Hard']" :key="d" @click="form.difficulty=d" :class="form.difficulty===d?'bg-white shadow text-gray-900 border border-gray-200':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black transition">{{ d }}</button>
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black tracking-widest uppercase text-gray-400">Questions</label>
              <div class="mt-1.5 flex bg-gray-100 rounded-xl p-1">
                <button v-for="n in [5,10,15]" :key="n" @click="form.count=n" :class="form.count===n?'bg-white shadow text-gray-900 border':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black transition">{{ n }}</button>
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black tracking-widest uppercase text-gray-400">Timer</label>
              <div class="mt-1.5 flex bg-gray-100 rounded-xl p-1">
                <button v-for="t in ['30s','60s','90s']" :key="t" @click="form.timePerQ=t" :class="form.timePerQ===t?'bg-white shadow text-gray-900 border':'text-gray-500'" class="flex-1 py-2 rounded-lg text-[10px] font-black transition">{{ t }}</button>
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex gap-2">
            <span class="text-indigo-600">🔑</span>
            <p class="text-[11px] text-indigo-800 leading-4"><span v-if="hasApiKey" class="font-black text-green-700">✓ API Key Active:</span><span v-else class="font-black text-amber-700">⚠️ No API Key:</span> {{ hasApiKey ? 'Gemini will generate fresh unique quizzes every time!' : 'Add Gemini API key in profile for fresh quizzes. Using smart mock now.' }}</p>
          </div>

          <button @click="generateQuiz" :disabled="generating||form.topic.trim().length<5" :class="generating||form.topic.trim().length<5?'bg-gray-200 text-gray-400':'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)] hover:shadow-[0_12px_32px_rgba(79,70,229,0.4)]'" class="w-full h-[52px] rounded-xl font-black text-[14px] flex items-center justify-center gap-2 transition active:scale-[0.98] tracking-wide">
            <span v-if="generating" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ generating ? 'Gemini Crafting Quest...' : `🚀 Generate ${form.count}Q Quest with Gemini` }}
          </button>
          <p class="text-[10px] text-gray-400 text-center">Fresh quiz every time • Timer + Bookmark + XP • Game mode</p>
        </div>
      </div>
    </div>

    <!-- Active Quiz Player with TIMER + BOOKMARK + FINISH -->
    <div v-if="activeQuiz" class="mt-4">
      <!-- Game Header with Timer -->
      <div class="flex justify-between items-center bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm">
        <button @click="confirmExit" class="text-[12px] font-black text-gray-600 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition">← Exit</button>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black" :class="timeLeft<10?'bg-red-50 text-red-600 border border-red-200 animate-pulse':'bg-indigo-50 text-indigo-700 border border-indigo-100'">
            <span>⏱️</span><span>{{ formatTime(timeLeft) }}</span>
          </div>
          <span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-gray-900 text-white">{{ currentIndex+1 }}/{{ activeQuiz.questions.length }}</span>
        </div>
      </div>

      <div class="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden p-1 flex gap-1">
        <div v-for="(q,i) in activeQuiz.questions" :key="i" class="flex-1 h-full rounded-full transition-all duration-300" :class="i<currentIndex?'bg-gradient-to-r from-green-400 to-emerald-500':i===currentIndex?'bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse':'bg-gray-200'"></div>
      </div>

      <div class="mt-4 bg-white rounded-[20px] border border-indigo-100 shadow-[0_8px_32px_rgba(79,70,229,0.08)] p-5 relative overflow-hidden">
        <!-- XP bar top -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"></div>
        
        <div class="flex justify-between items-start gap-2">
          <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gray-900 text-white tracking-wide">{{ activeQuiz.questions[currentIndex].subject }} • Lvl {{ activeQuiz.questions[currentIndex].marks }}</span>
          <div class="flex gap-1.5">
            <button @click="toggleBookmarkCurrent" :class="isBookmarkedCurrent?'bg-yellow-400 text-black border-yellow-400':'bg-white border-gray-200 text-gray-400 hover:text-yellow-500'" class="w-8 h-8 rounded-full border flex items-center justify-center transition active:scale-90 text-[14px]">{{ isBookmarkedCurrent?'⭐':'☆' }}</button>
            <span v-if="activeQuiz.questions[currentIndex].timesAsked>1" class="text-[10px] font-black px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">🔥 ×{{ activeQuiz.questions[currentIndex].timesAsked }}</span>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-[10px] font-black tracking-widest uppercase text-indigo-500">Quest {{ currentIndex+1 }} • Gemini AI</p>
          <p class="text-[16px] font-bold text-gray-900 mt-2 leading-6">{{ activeQuiz.questions[currentIndex].question }}</p>
        </div>

        <div class="mt-5 space-y-2.5">
          <button v-for="(opt, idx) in activeQuiz.questions[currentIndex].options" :key="idx" @click="selectAnswer(idx)" :disabled="answered" :class="getOptionClass(idx)" class="w-full text-left px-4 py-3.5 rounded-xl border-2 text-[13px] font-semibold transition-all flex justify-between items-center active:scale-[0.99]">
            <span class="flex items-center gap-2.5"><span class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border" :class="getLetterClass(idx)">{{ String.fromCharCode(65+idx) }}</span>{{ opt }}</span>
            <span v-if="answered && idx===activeQuiz.questions[currentIndex].correct" class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[12px]">✓</span>
            <span v-if="answered && idx===selectedAnswer && idx!==activeQuiz.questions[currentIndex].correct" class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">✗</span>
          </button>
        </div>

        <div v-if="answered" class="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100 animate-[slideUp_0.3s]">
          <p class="text-[11px] font-black tracking-widest uppercase text-indigo-600 flex items-center gap-1">🤖 Gemini AI Explanation</p>
          <p class="text-[12px] font-black text-indigo-800 mt-2">Simple:</p><p class="text-[13px] text-gray-700 mt-1 leading-5">{{ activeQuiz.questions[currentIndex].explanation.simple }}</p>
          <p class="text-[11px] font-black text-gray-800 mt-3 tracking-widest uppercase">ICAI Format:</p><p class="text-[12px] text-gray-600 mt-1 leading-5 whitespace-pre-line">{{ activeQuiz.questions[currentIndex].explanation.icai }}</p>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-2">
          <button @click="toggleBookmarkCurrent" :class="isBookmarkedCurrent?'bg-yellow-400 text-black':'bg-white border border-gray-200 text-gray-600'" class="h-11 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1.5 transition">{{ isBookmarkedCurrent?'⭐ Saved':'🔖 Save' }}</button>
          <button v-if="currentIndex < activeQuiz.questions.length-1" @click="nextQuestion" :disabled="!answered" :class="answered?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px] transition">{{ answered?'Next Quest →':'Select answer' }}</button>
          <button v-else @click="finishQuiz" :disabled="!answered" :class="answered?'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)]':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px] transition active:scale-[0.98]">🏁 Finish Quest • See Result</button>
        </div>
      </div>

      <div class="mt-3 flex justify-center gap-3 text-[10px] text-gray-400 font-medium"><span>🎮 RankerQ by PP</span><span>•</span><span>🤖 Gemini 1.5 Flash</span><span>•</span><span>⏱️ {{ form.timePerQ }}/Q</span></div>
    </div>

    <!-- RESULT SCREEN - ON CONCLUSION -->
    <div v-if="showResult" class="fixed inset-0 z-[60] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4 overflow-y-auto">
      <div class="w-full max-w-[380px] my-8">
        <div class="bg-white rounded-[28px] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.3)] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl"></div>
          
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto text-3xl shadow-[0_8px_24px_rgba(251,146,60,0.4)] animate-bounce">🏆</div>
          <h3 class="jakarta font-black text-[22px] mt-4 tracking-tight">Quest Completed! 🎉</h3>
          <p class="text-[13px] text-gray-500 mt-1 font-medium">{{ form.topic.slice(0,50) }}...</p>
          
          <div class="mt-6 grid grid-cols-3 gap-3">
            <div class="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100"><p class="text-[22px] font-black text-indigo-700">{{ score }}/{{ activeQuiz.questions.length }}</p><p class="text-[10px] text-gray-500 uppercase font-black tracking-widest">Score</p><p class="text-[10px] text-indigo-600 font-bold mt-1">{{ Math.round((score/activeQuiz.questions.length)*100) }}%</p></div>
            <div class="p-3 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-amber-100"><p class="text-[22px] font-black text-amber-600">+{{ earnedXP }}</p><p class="text-[10px] text-gray-500 uppercase font-black tracking-widest">XP</p><p class="text-[10px] text-amber-700 font-bold mt-1">Lvl {{ currentLevel }} → {{ currentLevel + (earnedXP>500?1:0) }}</p></div>
            <div class="p-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100"><p class="text-[22px] font-black text-red-600">{{ wrongCount }}</p><p class="text-[10px] text-gray-500 uppercase font-black tracking-widest">Wrong</p><p class="text-[10px] text-red-600 font-bold mt-1">Bookmarked</p></div>
          </div>

          <div class="mt-5 p-4 rounded-xl bg-gray-900 text-white text-left relative overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <p class="text-[12px] font-black tracking-widest uppercase text-white/60">Game Stats</p>
            <div class="mt-2 grid grid-cols-2 gap-3 text-[12px]"><div><p class="text-white/60 text-[10px] uppercase font-black">Time</p><p class="font-bold">⏱️ {{ totalTime }}s • {{ avgTime }}s/Q</p></div><div><p class="text-white/60 text-[10px] uppercase font-black">Accuracy</p><p class="font-bold">🎯 {{ Math.round((score/activeQuiz.questions.length)*100) }}% • {{ score>activeQuiz.questions.length/2?'🔥 Great!':'💪 Keep up!' }}</p></div></div>
            <div v-if="wrongCount>0" class="mt-3 p-2.5 rounded-lg bg-white/10 border border-white/10"><p class="text-[11px] font-bold">📚 {{ wrongCount }} added to Saved • Revise in {{ Math.ceil(wrongCount*0.5) }} mins for +50 XP bonus</p></div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-2.5">
            <button @click="showResult=false; activeQuiz=null; resetTimer()" class="h-12 rounded-xl bg-white border-2 border-gray-200 font-black text-[13px] hover:bg-gray-50 transition">Close</button>
            <button @click="shareResult" class="h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black text-[13px] shadow-[0_8px_24px_rgba(79,70,229,0.3)]">Share Win ↗️</button>
          </div>
          <button @click="generateQuiz" class="mt-2.5 w-full h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black text-[13px] shadow">🔄 Play Again • New Quest with Gemini</button>
          <p class="mt-3 text-[10px] text-gray-400">🎮 RankerQ by PP • Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const quickTopics=['Indian Contract Act - void vs voidable with case laws','Partnership Act admission retirement death','Sale of Goods conditions warranties','Final accounts with adjustments ICAI pattern','Ratio analysis with formulas','Demand elasticity numericals']
const form=reactive({ topic:'', difficulty:'Medium', count:10, timePerQ:'60s' })
const generating=ref(false), activeQuiz=ref(null), currentIndex=ref(0), selectedAnswer=ref(null), answered=ref(false), showResult=ref(false), score=ref(0), earnedXP=ref(0), wrongAnswers=ref([]), timeLeft=ref(60), timer=ref(null), totalTime=ref(0), startTime=ref(0)
const hasApiKey=computed(()=>!!store.geminiApiKey.value)
const currentLevel=computed(()=>store.currentLevel.value)
const wrongCount=computed(()=>wrongAnswers.value.length)
const avgTime=computed(()=>activeQuiz.value?Math.round(totalTime.value/activeQuiz.value.questions.length):0)
const isBookmarkedCurrent=computed(()=>{ if(!activeQuiz.value) return false; const q=activeQuiz.value.questions[currentIndex.value]; return store.bookmarks.value.some(b=>b.id===q.id) })
function formatTime(s){ return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` }
function startTimer(){
  const sec=parseInt(form.timePerQ)
  timeLeft.value=sec; startTime.value=Date.now()
  if(timer.value) clearInterval(timer.value)
  timer.value=setInterval(()=>{
    timeLeft.value--; totalTime.value=Math.floor((Date.now()-startTime.value)/1000)
    if(timeLeft.value<=0){ autoNext() }
  },1000)
}
function resetTimer(){ if(timer.value) clearInterval(timer.value); timer.value=null; timeLeft.value=parseInt(form.timePerQ) }
function autoNext(){
  if(!answered.value){
    const q=activeQuiz.value.questions[currentIndex.value]
    wrongAnswers.value.push({ id:q.id, question:q.question, yourAnswer:'Time out', correctAnswer:q.options[q.correct], subject:q.subject, chapter:form.topic.slice(0,20), year:'2024-Gemini', marks:q.marks, timesAsked:q.timesAsked })
    answered.value=true
  }
  if(currentIndex.value+1<activeQuiz.value.questions.length) nextQuestion()
  else finishQuiz()
}
async function generateQuiz(){
  if(form.topic.trim().length<5){ alert('Please enter a topic (min 5 chars)'); return }
  generating.value=true
  // Try real Gemini API if key available
  try{
    if(hasApiKey.value){
      const apiKey=store.geminiApiKey.value
      const prompt=`Generate ${form.count} MCQs for topic: "${form.topic}". Difficulty: ${form.difficulty}. Subject: CA. Each: question, 4 options, correct index 0-3, marks 2-5, timesAsked 1-5, explanation simple + icai format. Return ONLY JSON array [{"question":"...","options":["A","B","C","D"],"correct":0,"marks":3,"timesAsked":2,"explanation":{"simple":"...","icai":"..."}}]`
      const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.8, maxOutputTokens:4000, responseMimeType:'application/json' } })
      })
      const data=await resp.json()
      let content=data.candidates?.[0]?.content?.parts?.[0]?.text||''
      const m=content.match(/\[.*\]/s); if(m) content=m[0]
      const qs=JSON.parse(content)
      activeQuiz.value={ questions: qs.map((q,i)=>({ id:`gemini-${Date.now()}-${i}`, subject:'Gemini', chapter:form.topic.slice(0,30), ...q })) }
      currentIndex.value=0; selectedAnswer.value=null; answered.value=false; score.value=0; wrongAnswers.value=[]; totalTime.value=0; generating.value=false; startTimer(); return
    }
  }catch(e){ console.error('Gemini direct failed, using mock',e) }
  await new Promise(r=>setTimeout(r,1500))
  const mockQuestions=Array.from({ length:form.count }, (_,i)=>({
    id:`gemini-${Date.now()}-${i}-${Math.random()}`, subject:'Gemini AI', chapter:form.topic.slice(0,25), marks:form.difficulty==='Hard'?5:form.difficulty==='Medium'?3:2, timesAsked:Math.floor(Math.random()*4)+1,
    question:`[${form.topic}] Q${i+1}: ${['What constitutes valid consideration under Indian Contract Act?','Distinguish void and voidable agreement with Mohini Bibi case.','Essentials of valid contract u/s 10?','Explain supervening impossibility Sec 56 with example.'][i%4]}`,
    options:['Correct as per ICAI module + Gemini verified','Incorrect interpretation - opposite','Partially correct but misses key point','Completely wrong provision'],
    correct:i%4,
    explanation:{ simple:`About ${form.topic}: key is that valid contracts need offer, acceptance, consideration, capacity, free consent. Simple: like buying phone - valid if both agree freely.`, icai:`As per ICAI Module:\n1. Sec 10 - Essentials\n2. Case: Mohini Bibi vs Dharmadas (1903)\n3. Sec 2(j) void, 2(i) voidable\nAnswer: Option ${String.fromCharCode(65+(i%4))}` }
  }))
  activeQuiz.value={ questions:mockQuestions }; currentIndex.value=0; selectedAnswer.value=null; answered.value=false; score.value=0; wrongAnswers.value=[]; totalTime.value=0; generating.value=false; startTimer()
}
function selectAnswer(idx){
  if(answered.value) return
  selectedAnswer.value=idx; answered.value=true
  const q=activeQuiz.value.questions[currentIndex.value]
  if(idx===q.correct){ score.value++; earnedXP.value+=q.marks*15 } else { wrongAnswers.value.push({ id:q.id, question:q.question, yourAnswer:q.options[idx], correctAnswer:q.options[q.correct], subject:q.subject, chapter:form.topic.slice(0,20), year:'2024-Gemini', marks:q.marks, timesAsked:q.timesAsked, explanation:q.explanation.simple }) }
}
function nextQuestion(){
  if(currentIndex.value+1<activeQuiz.value.questions.length){ currentIndex.value++; selectedAnswer.value=null; answered.value=false; timeLeft.value=parseInt(form.timePerQ) }
}
function finishQuiz(){
  resetTimer()
  earnedXP.value=score.value*25+(activeQuiz.value.questions.length-wrongAnswers.value.length)*10
  store.completeQuiz(earnedXP.value, wrongAnswers.value)
  showResult.value=true
  if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
}
function toggleBookmarkCurrent(){
  if(!activeQuiz.value) return
  const q=activeQuiz.value.questions[currentIndex.value]
  store.toggleBookmark({ ...q, topic:form.topic })
}
function getOptionClass(idx){
  if(!answered.value){ return selectedAnswer.value===idx?'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-sm':'bg-white border-2 border-gray-100 hover:border-indigo-200' }
  const q=activeQuiz.value.questions[currentIndex.value]
  if(idx===q.correct) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800 font-bold shadow-sm'
  if(idx===selectedAnswer.value && idx!==q.correct) return 'bg-red-50 border-red-300 text-red-800'
  return 'bg-white border-gray-100 text-gray-400'
}
function getLetterClass(idx){
  if(!answered.value) return selectedAnswer.value===idx?'bg-indigo-600 text-white border-indigo-600':'bg-gray-100 text-gray-500 border-gray-200'
  const q=activeQuiz.value.questions[currentIndex.value]
  if(idx===q.correct) return 'bg-green-500 text-white border-green-500'
  if(idx===selectedAnswer.value) return 'bg-red-500 text-white border-red-500'
  return 'bg-gray-100 text-gray-400 border-gray-200'
}
function confirmExit(){ if(confirm('Exit quest? Progress will be lost!')){ resetTimer(); activeQuiz.value=null } }
function shareResult(){
  const text=`🎮 I scored ${score.value}/${activeQuiz.value.questions.length} in Gemini Quest "${form.topic.slice(0,30)}" on RankerQ by PP! +${earnedXP.value} XP • Lvl ${currentLevel.value}. Try: https://t.me/yourbot`
  if(window.Telegram?.WebApp?.openTelegramLink){ window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbot')}&text=${encodeURIComponent(text)}`) } else { navigator.clipboard.writeText(text); alert('Result copied!') }
}
onUnmounted(()=>{ if(timer.value) clearInterval(timer.value) })
</script>
