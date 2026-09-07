export default function handler(req,res){
  const data=[
    { id:1, type:'RTP', level:'Foundation', subject:'Business Laws', title:'RTP May 2025 - Business Laws', attempt:'May 2025', year:2025, pages:42, isLatest:true, isOfficial:true, pdfUrl:'https://www.icai.org/post/rtp-may-2025-foundation-law' },
    { id:2, type:'MTP', level:'Foundation', subject:'Business Laws', title:'MTP Series II May 2025 - With Answers', attempt:'May 2025', year:2025, pages:38, isLatest:true, isOfficial:true, pdfUrl:'https://boslive.icai.org/' },
    { id:3, type:'PYQ', level:'Foundation', subject:'Business Laws', title:'PYQ Nov 2024 - Contracts (4 Marks)', attempt:'Nov 2024', year:2024, marks:4, isOfficial:true, pdfUrl:'https://www.icai.org/post/pyq-nov-2024', timesAsked:3 }
  ]
  res.status(200).json({ resources:data, meta:{ total:data.length, lastUpdated:new Date().toISOString(), autoUpdate:'Daily 6 AM IST' } })
}
