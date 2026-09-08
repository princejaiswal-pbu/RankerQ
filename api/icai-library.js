const ICAI_SEARCH = 'https://search.icai.org/search?querystring=';
const ALLOWED_HOSTS = new Set(['www.icai.org','icai.org','search.icai.org','resource.cdn.icai.org']);

function clean(s='') { return s.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim(); }
function abs(href, base) { try { const u = new URL(href, base); return ALLOWED_HOSTS.has(u.hostname) ? u.href : null; } catch { return null; } }
function decode(s='') { return s.replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#x2F;/g,'/'); }

function extractAnchors(html, base) {
  const out=[]; const re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))) { const url=abs(decode(m[1]),base); const title=clean(decode(m[2])); if(url && title) out.push({url,title}); }
  return out;
}

async function get(url) {
  const r=await fetch(url,{headers:{'User-Agent':'RankerQ ICAI Resource Indexer/1.0'}});
  if(!r.ok) throw new Error(`ICAI returned ${r.status}`); return await r.text();
}

function classify(text) {
  const t=text.toLowerCase();
  if(t.includes('revision test') || /\brtc\b|\brtp\b/.test(t)) return 'RTP';
  if(t.includes('mock test') || /\bmtp\b/.test(t)) return 'MTP';
  if(t.includes('suggested answer')) return 'Suggested Answer';
  if(t.includes('question paper') || t.includes('question papers')) return 'PYQ';
  if(t.includes('study material')) return 'Study Material';
  return 'Other';
}
function levelOf(text) { const t=text.toLowerCase(); if(t.includes('foundation')) return 'Foundation'; if(t.includes('intermediate')) return 'Intermediate'; if(t.includes('final')) return 'Final'; return 'All'; }
function attemptOf(text) { const m=text.match(/\b(january|may|september|november|december|june)\s*,?\s*(20\d{2})\b/i); return m ? `${m[1][0].toUpperCase()+m[1].slice(1).toLowerCase()} ${m[2]}` : 'All attempts'; }
function subjectOf(text) {
  const names=['Advanced Accounting','Accounting','Corporate and Other Laws','Corporate & Other Laws','Taxation','Cost and Management Accounting','Auditing and Ethics','Financial Management and Strategic Management','Financial Reporting','Advanced Financial Management','Advanced Auditing, Assurance and Professional Ethics','Direct Tax Laws & International Taxation','Indirect Tax Laws','Integrated Business Solutions','Business Laws','Quantitative Aptitude','Business Economics'];
  const low=text.toLowerCase(); return names.find(n=>low.includes(n.toLowerCase())) || 'All subjects';
}

export default async function handler(req,res) {
  if(req.method !== 'GET') return res.status(405).json({error:'GET only'});
  const q=(req.query.q || '').trim(); const level=req.query.level || 'All'; const type=req.query.type || 'All'; const attempt=req.query.attempt || 'All';
  const query = [q, level!=='All'?level:'', type!=='All'?type:'', attempt!=='All'?attempt:'', 'ICAI'].filter(Boolean).join(' ');
  try {
    const searchUrl=ICAI_SEARCH+encodeURIComponent(query || 'CA ICAI question papers RTP MTP suggested answers');
    const searchHtml=await get(searchUrl);
    const anchors=extractAnchors(searchHtml,searchUrl).filter(a=>/icai\.org\/post\//i.test(a.url));
    const unique=[]; const seen=new Set();
    for(const a of anchors){ if(!seen.has(a.url)){seen.add(a.url); unique.push(a);} }
    const results=[];
    for(const page of unique.slice(0,18)) {
      try {
        const html=await get(page.url); const links=extractAnchors(html,page.url);
        const pdfs=links.filter(a=>/\.pdf(?:\?|$)/i.test(a.url) && /resource\.cdn\.icai\.org/i.test(a.url));
        const inferred={level:levelOf(page.title),type:classify(page.title),attempt:attemptOf(page.title),subject:subjectOf(page.title)};
        if(pdfs.length){
          for(const p of pdfs.slice(0,20)) results.push({title:p.title || page.title,url:p.url,sourcePage:page.url, ...inferred});
        } else {
          const c=classify(page.title); if(c!=='Other') results.push({title:page.title,url:page.url,sourcePage:page.url,...inferred,landing:true});
        }
      } catch(e) {}
    }
    const filtered=results.filter(x=>(level==='All'||x.level===level)&&(type==='All'||x.type===type)&&(attempt==='All'||x.attempt===attempt));
    const dedup=[]; const urls=new Set(); for(const x of filtered){ if(!urls.has(x.url)){urls.add(x.url);dedup.push(x);} }
    return res.status(200).json({ok:true,query,updatedAt:new Date().toISOString(),count:dedup.length,items:dedup.slice(0,120)});
  } catch(e) { return res.status(502).json({ok:false,error:'Unable to reach ICAI right now. Try again shortly.',detail:e.message}); }
}
