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
const notifications = ref([
  { id: 1, title: 'New Quiz Live!', desc: 'Business Law - Contracts is now live. +150 XP', time: '2h ago', read: false, icon: '📝' },
  { id: 2, title: 'Streak Reminder', desc: 'Complete a quiz today to keep your 7-day streak!', time: '5h ago', read: false, icon: '🔥' },
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
  const last=lastLogin.value||getItemLocal('ca_last_login')
  if(!last){ streak.value=1; lastLogin.value=today; saveItem('ca_streak','1'); saveItem('ca_last_login',today); return }
  if(last===today) return
  if(last===yesterday){
    streak.value=(parseInt(getItemLocal('ca_streak')||'0')||streak.value)+1
    lastLogin.value=today
    saveItem('ca_streak',String(streak.value)); saveItem('ca_last_login',today)
    notifications.value.unshift({ id:Date.now(), title:`🔥 ${streak.value}-Day Streak!`, desc:`You're on a ${streak.value}-day streak`, time:'Just now', read:false, icon:'🔥' })
  } else {
    streak.value=1; lastLogin.value=today; saveItem('ca_streak','1'); saveItem('ca_last_login',today)
  }
}
function addMistake(q) {
  if(mistakes.value.find(m=>m.id===q.id)) return
  mistakes.value.unshift({ ...q, addedAt:Date.now(), revised:false, timesAsked:q.timesAsked||Math.floor(Math.random()*4)+1 })
  saveItem('ca_mistakes', mistakes.value)
}
function removeMistake(id){ mistakes.value=mistakes.value.filter(m=>m.id!==id); saveItem('ca_mistakes',mistakes.value) }
function markMistakeRevised(id){ const m=mistakes.value.find(m=>m.id===id); if(m){ m.revised=true; saveItem('ca_mistakes',mistakes.value) } }
function clearMistakes(){ mistakes.value=[]; saveItem('ca_mistakes',[]) }

export async function saveUserToTelegramStorage(userName,userLevel){
  const data={ name:userName, level:userLevel, timestamp:Date.now(), streak:streak.value, quizzes:quizzesDone.value, xp:xp.value, mistakes:mistakes.value }
  localStorage.setItem('ca_name',userName); localStorage.setItem('ca_level',userLevel)
  localStorage.setItem('ca_user',JSON.stringify(data)); localStorage.setItem('ca_streak',String(streak.value))
  localStorage.setItem('ca_quizzes',String(quizzesDone.value)); localStorage.setItem('ca_xp',String(xp.value))
  localStorage.setItem('ca_mistakes',JSON.stringify(mistakes.value))
  const cloud=getCloudStorage()
  if(!cloud) return true
  return new Promise(res=>{
    cloud.setItem('ca_name',userName,()=>{}); cloud.setItem('ca_level',userLevel,()=>{})
    cloud.setItem('ca_user',JSON.stringify(data),(err)=>{ res(!err) })
    cloud.setItem('ca_streak',String(streak.value),()=>{}); cloud.setItem('ca_last_login',lastLogin.value||getTodayString(),()=>{})
    cloud.setItem('ca_quizzes',String(quizzesDone.value),()=>{}); cloud.setItem('ca_xp',String(xp.value),()=>{})
    cloud.setItem('ca_mistakes',JSON.stringify(mistakes.value),()=>{})
  })
}

export async function loadUserFromTelegramStorage(){
  const cloud=getCloudStorage()
  const localName=localStorage.getItem('ca_name'), localLevel=localStorage.getItem('ca_level')
  const localStreak=parseInt(localStorage.getItem('ca_streak')||'0'), localQuizzes=parseInt(localStorage.getItem('ca_quizzes')||'0')
  const localXp=parseInt(localStorage.getItem('ca_xp')||'0'), localLast=localStorage.getItem('ca_last_login')
  const localMistakes=getItemLocal('ca_mistakes',true)||[]
  if(localStreak) streak.value=localStreak
  if(localQuizzes) quizzesDone.value=localQuizzes
  if(localXp) xp.value=localXp
  if(localLast) lastLogin.value=localLast
  if(localMistakes.length) mistakes.value=localMistakes
  if(!cloud){
    if(localName&&localLevel){ name.value=localName; level.value=localLevel; screen.value='main'; calculateStreak() } else screen.value='splash'
    isLoaded.value=true; return
  }
  return new Promise(res=>{
    cloud.getItems(['ca_name','ca_level','ca_user','ca_streak','ca_last_login','ca_quizzes','ca_xp','ca_mistakes'],(err,values)=>{
      if(err||!values.ca_name){
        if(localName){ name.value=localName; level.value=localLevel; screen.value='main'; calculateStreak() } else screen.value='splash'
        isLoaded.value=true; res(); return
      }
      name.value=values.ca_name; level.value=values.ca_level
      streak.value=parseInt(values.ca_streak||localStreak||'1')
      quizzesDone.value=parseInt(values.ca_quizzes||localQuizzes||'0')
      xp.value=parseInt(values.ca_xp||localXp||'0')
      lastLogin.value=values.ca_last_login||''
      try{ mistakes.value=JSON.parse(values.ca_mistakes||'[]') }catch{ mistakes.value=localMistakes }
      screen.value='main'; calculateStreak(); isLoaded.value=true; res()
    })
  })
}

export async function clearUserStorage(){
  localStorage.removeItem('ca_name'); localStorage.removeItem('ca_level'); localStorage.removeItem('ca_user')
  localStorage.removeItem('ca_streak'); localStorage.removeItem('ca_last_login'); localStorage.removeItem('ca_quizzes')
  localStorage.removeItem('ca_xp'); localStorage.removeItem('ca_mistakes')
  name.value=''; level.value=''; streak.value=0; quizzesDone.value=0; xp.value=0; lastLogin.value=''; mistakes.value=[]; screen.value='form'
  const cloud=getCloudStorage()
  if(cloud) cloud.removeItems(['ca_name','ca_level','ca_user','ca_streak','ca_last_login','ca_quizzes','ca_xp','ca_mistakes'],()=>{})
}

export function useUserStore(){
  const userName=computed(()=>name.value), userLevel=computed(()=>level.value), isOnboarded=computed(()=>!!name.value&&!!level.value)
  const unreadCount=computed(()=>notifications.value.filter(n=>!n.read).length)
  const currentRank=computed(()=>Math.max(1,50-Math.floor(xp.value/300)))
  const mistakeCount=computed(()=>mistakes.value.length), revisionTime=computed(()=>Math.ceil(mistakes.value.length*0.5))
  async function setUser(n,l){ name.value=n; level.value=l; if(streak.value===0){ streak.value=1; lastLogin.value=getTodayString() } await saveUserToTelegramStorage(n,l); screen.value='main' }
  async function updateUser(n,l){ name.value=n; level.value=l; await saveUserToTelegramStorage(n,l) }
  function completeQuiz(xpEarned=150, wrongAnswers=[]){ quizzesDone.value+=1; xp.value+=xpEarned; wrongAnswers.forEach(q=>addMistake(q)); calculateStreak(); saveItem('ca_quizzes',String(quizzesDone.value)); saveItem('ca_xp',String(xp.value)); saveUserToTelegramStorage(name.value,level.value); if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success') }
  function markAllNotificationsRead(){ notifications.value=notifications.value.map(n=>({...n,read:true})) }
  function markNotificationRead(id){ const f=notifications.value.find(n=>n.id===id); if(f) f.read=true }
  return { name,level,screen,isLoaded,streak,quizzesDone,xp,lastLogin,notifications,unreadCount,currentRank,mistakes,mistakeCount,revisionTime,userName,userLevel,isOnboarded,setUser,updateUser,completeQuiz,addMistake,removeMistake,markMistakeRevised,clearMistakes,loadUserFromTelegramStorage,saveUserToTelegramStorage,clearUserStorage,calculateStreak,markAllNotificationsRead,markNotificationRead }
}
