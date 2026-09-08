const BOS = 'https://boslive.icai.org/';
const ALLOWED_HOSTS = new Set(['boslive.icai.org','resource.cdn.icai.org','www.icai.org','icai.org']);

function clean(s='') { return s.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&#x2F;/g,'/').replace(/\s+/g,' ').trim(); }
function abs(href, base) { try { const u = new URL(href, base); return ALLOWED_HOSTS.has(u.hostname) ? u.href : null; } catch { return null; } }
function extractAnchors(html, base) {
  const out=[]; const re=/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))) { const url=abs(m[1],base); const title=clean(m[2]); if(url) out.push({url,title}); }
  return out;
}
async function get(url) {
  const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 RankerQ-ICAI-Library','Accept':'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8'}});
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.text();
}
function classify(text) { const t=text.toLowerCase(); if(t.includes('revision test')||/\brtp\b/.test(t)) return 'RTP'; if(t.includes('mock test')||/\bmtp\b/.test(t)) return 'MTP'; if(t.includes('suggested answer')) return 'Suggested Answer'; if(t.includes('question paper')) return 'PYQ'; if(t.includes('study material')) return 'Study Material'; return 'Other'; }
function levelOf(text) { const t=text.toLowerCase(); if(t.includes('foundation')) return 'Foundation'; if(t.includes('intermediate')) return 'Intermediate'; if(t.includes('final')) return 'Final'; return 'All'; }
function attemptOf(text) { const m=text.match(/\b(january|may|september|november|december|june)\s*,?\s*(20\d{2})\b/i); return m ? `${m[1][0].toUpperCase()+m[1].slice(1).toLowerCase()} ${m[2]}` : 'All attempts'; }
function subjectOf(text) {
  const names=['Advanced Accounting','Accounting','Corporate and Other Laws','Corporate & Other Laws','Taxation','Cost and Management Accounting','Auditing and Ethics','Financial Management and Strategic Management','Financial Reporting','Advanced Financial Management','Advanced Auditing, Assurance and Professional Ethics','Direct Tax Laws & International Taxation','Indirect Tax Laws','Integrated Business Solutions','Business Laws','Quantitative Aptitude','Business Economics'];
  const low=text.toLowerCase(); return names.find(n=>low.includes(n.toLowerCase())) || 'All subjects';
}
function infer(title,url){ const text=`${title} ${url}`; return {level:levelOf(text),type:classify(text),attempt:attemptOf(text),subject:subjectOf(text)} }

// BoS exposes the resource families from the homepage. Some child pages occasionally
// return 403 to automated clients; those are skipped rather than inventing links.
const ENTRY_PAGES = [
  `${BOS}education_content.php?p=Question+Papers+New+Scheme`,
  `${BOS}education_content_rtp.php`,
  `${BOS}education_content.php?p=Suggested+Answers`,
  `${BOS}education_content.php?p=Previous+Year+Suggested+Answers`,
  `${BOS}education_content.php?p=Mock+Test+Papers`,
  `${BOS}education_content.php?p=Study+Material(New+Scheme)`
];

export default async function handler(req,res) {
  if(req.method !== 'GET') return res.status(405).json({error:'GET only'});
  const q=(req.query.q||'').trim().toLowerCase(), level=req.query.level||'All', type=req.query.type||'All', attempt=req.query.attempt||'All';
  try {
    const pages=[{url:BOS,title:'ICAI BoS'}];
    for(const url of ENTRY_PAGES){ try{ const html=await get(url); pages.push({url,title:url.includes('rtp')?'Revision Test Papers':url.includes('Suggested')?'Suggested Answers':url.includes('Mock')?'Mock Test Papers':url.includes('Question')?'Previous Year Question Papers':'Study Material',html}); }catch{} }
    const results=[];
    for(const page of pages){
      let html=page.html;
      if(!html){ try{html=await get(page.url)}catch{continue} }
      const anchors=extractAnchors(html,page.url);
      for(const a of anchors){
        if(!/^https?:\/\/(?:resource\.cdn\.icai\.org|boslive\.icai\.org)\//i.test(a.url)) continue;
        const isPdf=/\.pdf(?:[?#]|$)/i.test(a.url);
        const meta=infer(`${page.title} ${a.title}`,a.url);
        const hay=`${a.title} ${page.title} ${a.url}`.toLowerCase();
        if(q && !hay.includes(q)) continue;
        if(level!=='All' && meta.level!==level) continue;
        if(type!=='All' && meta.type!==type) continue;
        if(attempt!=='All' && meta.attempt!==attempt) continue;
        results.push({title:a.title||page.title,url:a.url,sourcePage:page.url,...meta,landing:!isPdf});
      }
    }
    // Keep unique links, prefer actual PDFs.
    const seen=new Set(), dedup=[];
    for(const x of results){ if(!seen.has(x.url)){seen.add(x.url);dedup.push(x)} }
    return res.status(200).json({ok:true,source:BOS,updatedAt:new Date().toISOString(),count:dedup.length,items:dedup.slice(0,200)});
  } catch(e) { return res.status(502).json({ok:false,error:'Unable to read ICAI BoS right now. Try again shortly.',detail:e.message}); }
}
