import { ref, computed } from 'vue'

const name = ref('')
const level = ref('')
const screen = ref('splash')
const isLoaded = ref(false)
const streak = ref(0)
const quizzesDone = ref(0)
const xp = ref(0)
const lastLogin = ref('')
const mistakes = ref([])
const bookmarks = ref([])
const geminiApiKey = ref('')
const notifications = ref([
  { id: 1, title: 'New Quest Live! 🎮', desc: 'Law - Contracts quest is live. +150 XP', time: '2h ago', read: false, icon: '🎯' },
  { id: 2, title: 'Streak Shield!', desc: 'Complete a quest today to keep your 7-day streak!', time: '5h ago', read: false, icon: '🔥' },
])

function getCloudStorage() { return window.Telegram?.WebApp?.CloudStorage || null }
function getTodayString() { return new Date().toISOString().split('T')[0] }
function getYesterdayString() { const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0] }
function saveItem(key, value) {
  const str = typeof value==='string'?value:JSON.stringify(value)
  localStorage.setItem(key, str)
  const cloud=getCloudStorage()
  if(cloud) cloud.setItem(key, str, ()=>{})
}
function getItemLocal(key, isJson=false) {
  const v=localStorage.getItem(key)
  if(!v) return null
  if(isJson){ try{ return JSON.parse(v) }catch{ return null } }
  return v
}
function calculateStreak() {
  const today=getTodayString(), yesterday=getYesterdayString()
  const last=lastLogin.value||getItemLocal('rq_last_login')
  if(!last){ streak.value=1; lastLogin.value=today; saveItem('rq_streak','1'); saveItem('rq_last_login',today); return }
  if(last===today) return
  if(last===yesterday){
    streak.value=(parseInt(getItemLocal('rq_streak')||'0')||streak.value)+1
    lastLogin.value=today
    saveItem('rq_streak',String(streak.value)); saveItem('rq_last_login',today)
    notifications.value.unshift({ id:Date.now(), title:`🔥 ${streak.value}-Day Streak!`, desc:`Level Up! You're on a ${streak.value}-day streak`, time:'Just now', read:false, icon:'🔥' })
  } else {
    streak.value=1; lastLogin.value=today; saveItem('rq_streak','1'); saveItem('rq_last_login',today)
  }
}
function addMistake(q) {
  if(mistakes.value.find(m=>m.id===q.id)) return
  mistakes.value.unshift({ ...q, addedAt:Date.now(), revised:false, timesAsked:q.timesAsked||1 })
  saveItem('rq_mistakes', mistakes.value)
}
function removeMistake(id){ mistakes.value=mistakes.value.filter(m=>m.id!==id); saveItem('rq_mistakes',mistakes.value) }
function addBookmark(q){
  if(bookmarks.value.find(b=>b.id===q.id)) return
  bookmarks.value.unshift({ ...q, bookmarkedAt:Date.now() })
  saveItem('rq_bookmarks', bookmarks.value)
  if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
}
function removeBookmark(id){ bookmarks.value=bookmarks.value.filter(b=>b.id!==id); saveItem('rq_bookmarks',bookmarks.value) }
function toggleBookmark(q){
  if(bookmarks.value.find(b=>b.id===q.id)) removeBookmark(q.id)
  else addBookmark(q)
}

export async function saveUserToTelegramStorage(userName,userLevel,apiKey=''){
  const data={ name:userName, level:userLevel, apiKey: apiKey||geminiApiKey.value, timestamp:Date.now(), streak:streak.value, quizzes:quizzesDone.value, xp:xp.value, mistakes:mistakes.value, bookmarks:bookmarks.value }
  localStorage.setItem('rq_name',userName); localStorage.setItem('rq_level',userLevel)
  localStorage.setItem('rq_api_key', apiKey||geminiApiKey.value)
  localStorage.setItem('rq_user',JSON.stringify(data)); localStorage.setItem('rq_streak',String(streak.value))
  localStorage.setItem('rq_quizzes',String(quizzesDone.value)); localStorage.setItem('rq_xp',String(xp.value))
  localStorage.setItem('rq_mistakes',JSON.stringify(mistakes.value)); localStorage.setItem('rq_bookmarks',JSON.stringify(bookmarks.value))
  const cloud=getCloudStorage()
  if(!cloud) return true
  return new Promise(res=>{
    cloud.setItem('rq_name',userName,()=>{}); cloud.setItem('rq_level',userLevel,()=>{})
    cloud.setItem('rq_api_key',apiKey||geminiApiKey.value,()=>{})
    cloud.setItem('rq_user',JSON.stringify(data),(err)=>{ res(!err) })
    cloud.setItem('rq_streak',String(streak.value),()=>{}); cloud.setItem('rq_last_login',lastLogin.value||getTodayString(),()=>{})
    cloud.setItem('rq_quizzes',String(quizzesDone.value),()=>{}); cloud.setItem('rq_xp',String(xp.value),()=>{})
    cloud.setItem('rq_mistakes',JSON.stringify(mistakes.value),()=>{}); cloud.setItem('rq_bookmarks',JSON.stringify(bookmarks.value),()=>{})
  })
}

export async function loadUserFromTelegramStorage(){
  const cloud=getCloudStorage()
  const localName=localStorage.getItem('rq_name')||localStorage.getItem('ca_name')
  const localLevel=localStorage.getItem('rq_level')||localStorage.getItem('ca_level')
  const localApiKey=localStorage.getItem('rq_api_key')||''
  const localStreak=parseInt(localStorage.getItem('rq_streak')||localStorage.getItem('ca_streak')||'0')
  const localQuizzes=parseInt(localStorage.getItem('rq_quizzes')||localStorage.getItem('ca_quizzes')||'0')
  const localXp=parseInt(localStorage.getItem('rq_xp')||localStorage.getItem('ca_xp')||'0')
  const localLast=localStorage.getItem('rq_last_login')||localStorage.getItem('ca_last_login')
  const localMistakes=getItemLocal('rq_mistakes',true)||getItemLocal('ca_mistakes',true)||[]
  const localBookmarks=getItemLocal('rq_bookmarks',true)||[]
  if(localStreak) streak.value=localStreak
  if(localQuizzes) quizzesDone.value=localQuizzes
  if(localXp) xp.value=localXp
  if(localLast) lastLogin.value=localLast
  if(localMistakes.length) mistakes.value=localMistakes
  if(localBookmarks.length) bookmarks.value=localBookmarks
  if(localApiKey) geminiApiKey.value=localApiKey
  if(!cloud){
    if(localName&&localLevel){ name.value=localName; level.value=localLevel; screen.value='main'; calculateStreak() } else screen.value='splash'
    isLoaded.value=true; return
  }
  return new Promise(res=>{
    cloud.getItems(['rq_name','rq_level','rq_api_key','rq_user','rq_streak','rq_last_login','rq_quizzes','rq_xp','rq_mistakes','rq_bookmarks'],(err,values)=>{
      if(err||!values.rq_name){
        if(localName){ name.value=localName; level.value=localLevel; screen.value='main'; calculateStreak() } else screen.value='splash'
        isLoaded.value=true; res(); return
      }
      name.value=values.rq_name; level.value=values.rq_level; geminiApiKey.value=values.rq_api_key||localApiKey||''
      streak.value=parseInt(values.rq_streak||localStreak||'1')
      quizzesDone.value=parseInt(values.rq_quizzes||localQuizzes||'0')
      xp.value=parseInt(values.rq_xp||localXp||'0')
      lastLogin.value=values.rq_last_login||''
      try{ mistakes.value=JSON.parse(values.rq_mistakes||'[]') }catch{ mistakes.value=localMistakes }
      try{ bookmarks.value=JSON.parse(values.rq_bookmarks||'[]') }catch{ bookmarks.value=localBookmarks }
      screen.value='main'; calculateStreak(); isLoaded.value=true; res()
    })
  })
}

export async function clearUserStorage(){
  localStorage.removeItem('rq_name'); localStorage.removeItem('rq_level'); localStorage.removeItem('rq_api_key'); localStorage.removeItem('rq_user')
  localStorage.removeItem('rq_streak'); localStorage.removeItem('rq_last_login'); localStorage.removeItem('rq_quizzes')
  localStorage.removeItem('rq_xp'); localStorage.removeItem('rq_mistakes'); localStorage.removeItem('rq_bookmarks')
  localStorage.removeItem('ca_name'); localStorage.removeItem('ca_level'); localStorage.removeItem('ca_user'); localStorage.removeItem('ca_streak'); localStorage.removeItem('ca_last_login'); localStorage.removeItem('ca_quizzes'); localStorage.removeItem('ca_xp'); localStorage.removeItem('ca_mistakes')
  name.value=''; level.value=''; geminiApiKey.value=''; streak.value=0; quizzesDone.value=0; xp.value=0; lastLogin.value=''; mistakes.value=[]; bookmarks.value=[]; screen.value='form'
  const cloud=getCloudStorage()
  if(cloud) cloud.removeItems(['rq_name','rq_level','rq_api_key','rq_user','rq_streak','rq_last_login','rq_quizzes','rq_xp','rq_mistakes','rq_bookmarks','ca_name','ca_level','ca_user','ca_streak','ca_last_login','ca_quizzes','ca_xp','ca_mistakes'],()=>{})
}

export function useUserStore(){
  const userName=computed(()=>name.value), userLevel=computed(()=>level.value), isOnboarded=computed(()=>!!name.value&&!!level.value)
  const unreadCount=computed(()=>notifications.value.filter(n=>!n.read).length)
  const currentRank=computed(()=>Math.max(1,50-Math.floor(xp.value/250)))
  const mistakeCount=computed(()=>mistakes.value.length), revisionTime=computed(()=>Math.ceil(mistakes.value.length*0.5))
  const bookmarkCount=computed(()=>bookmarks.value.length)
  const levelProgress=computed(()=>{ const xpInLevel=xp.value%1000; return Math.min(100, (xpInLevel/1000)*100) })
  const currentLevel=computed(()=>Math.floor(xp.value/1000)+1)
  async function setUser(n,l,apiKey=''){ name.value=n; level.value=l; if(apiKey) geminiApiKey.value=apiKey; if(streak.value===0){ streak.value=1; lastLogin.value=getTodayString() } await saveUserToTelegramStorage(n,l,apiKey); screen.value='main' }
  async function updateUser(n,l,apiKey=''){ name.value=n; level.value=l; if(apiKey!==undefined) geminiApiKey.value=apiKey; await saveUserToTelegramStorage(n,l,apiKey||geminiApiKey.value) }
  function completeQuiz(xpEarned=150, wrongAnswers=[]){ quizzesDone.value+=1; xp.value+=xpEarned; wrongAnswers.forEach(q=>addMistake(q)); calculateStreak(); saveItem('rq_quizzes',String(quizzesDone.value)); saveItem('rq_xp',String(xp.value)); saveUserToTelegramStorage(name.value,level.value,geminiApiKey.value); if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success') }
  function markAllNotificationsRead(){ notifications.value=notifications.value.map(n=>({...n,read:true})) }
  function markNotificationRead(id){ const f=notifications.value.find(n=>n.id===id); if(f) f.read=true }
  return { name,level,screen,isLoaded,streak,quizzesDone,xp,lastLogin,notifications,unreadCount,currentRank,mistakes,mistakeCount,revisionTime,bookmarks,bookmarkCount,geminiApiKey,levelProgress,currentLevel,userName,userLevel,isOnboarded,setUser,updateUser,completeQuiz,addMistake,removeMistake,addBookmark,removeBookmark,toggleBookmark,loadUserFromTelegramStorage,saveUserToTelegramStorage,clearUserStorage,calculateStreak,markAllNotificationsRead,markNotificationRead }
}
