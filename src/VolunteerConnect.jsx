import { useState, useEffect, useRef, useCallback } from "react";

// Theme: Light & Dark Purple (with dark mode support)
const LIGHT = {
  bg:"#FAF5FF",surface:"#FFFFFF",border:"#DDD6FE",ink:"#1E1433",
  muted:"#7C6FAB",faint:"#EDE9FE",
  green:"#6D28D9",greenLt:"#EDE9FE",
  amber:"#7C3AED",amberLt:"#F3E8FF",
  blue:"#4C1D95",blueLt:"#EDE9FE",
  red:"#B02020",redLt:"#FFE4E4",
  purple:"#A855F7",purpleLt:"#F3E8FF",
  orange:"#8B5CF6",orangeLt:"#EDE9FE",
};
const DARK = {
  bg:"#0D0A14",surface:"#1A1228",border:"#3B2A6E",ink:"#F3EEFF",
  muted:"#A78BCA",faint:"#1E1533",
  green:"#A78BFA",greenLt:"#2E1F5E",
  amber:"#C4B5FD",amberLt:"#2E1F5E",
  blue:"#7C3AED",blueLt:"#2E1F5E",
  red:"#F87171",redLt:"#3B1A1A",
  purple:"#C084FC",purpleLt:"#2E1F5E",
  orange:"#DDD6FE",orangeLt:"#2E1F5E",
};
let C = {...LIGHT};
const FF = { d:"'Georgia','Times New Roman',serif", b:"'Helvetica Neue',Arial,sans-serif" };

const CATS = ["Environment","Food & Hunger","Education","Health","Animal Welfare","Disaster Relief","Elder Care","Sports & Youth"];
const CM = {
  "Environment":    {icon:"🌳",color:"#6D28D9", lt:"#EDE9FE"},
  "Food & Hunger":  {icon:"🍱",color:"#7C3AED", lt:"#F3E8FF"},
  "Education":      {icon:"📚",color:"#4C1D95", lt:"#EDE9FE"},
  "Health":         {icon:"❤️",color:"#B02020", lt:"#FFE4E4"},
  "Animal Welfare": {icon:"🐾",color:"#A855F7", lt:"#F3E8FF"},
  "Disaster Relief":{icon:"⛑️",color:"#B02020", lt:"#FFE4E4"},
  "Elder Care":     {icon:"🤝",color:"#8B5CF6", lt:"#EDE9FE"},
  "Sports & Youth": {icon:"⚽",color:"#7C3AED", lt:"#F3E8FF"},
};
const BADGES = [
  {id:"seed",  icon:"🌱",name:"Seed",          desc:"1st task done",  req:1},
  {id:"sprout",icon:"🌿",name:"Sprout",         desc:"3 tasks done",   req:3},
  {id:"helper",icon:"🤝",name:"Helper",         desc:"5 tasks done",   req:5},
  {id:"champ", icon:"🏅",name:"Champion",       desc:"10 tasks done",  req:10},
  {id:"hero",  icon:"⭐",name:"Community Hero", desc:"20 tasks done",  req:20},
];
const IU = {
  "Environment":    [{key:"trees",   label:"Trees Planted",   icon:"🌳"},{key:"kg_waste",label:"Kg Waste Cleared",icon:"♻️"}],
  "Food & Hunger":  [{key:"meals",   label:"Meals Served",    icon:"🍱"}],
  "Education":      [{key:"students",label:"Students Taught", icon:"📚"}],
  "Health":         [{key:"patients",label:"People Helped",   icon:"❤️"}],
  "Animal Welfare": [{key:"animals", label:"Animals Cared",   icon:"🐾"}],
  "Disaster Relief":[{key:"families",label:"Families Served", icon:"⛑️"}],
  "Elder Care":     [{key:"elders",  label:"Elders Supported",icon:"🤝"}],
  "Sports & Youth": [{key:"youth",   label:"Youth Engaged",   icon:"⚽"}],
};
const EVTS = [
  {id:1,title:"Marina Beach Cleanup",category:"Environment",organizer:"Clean Chennai",orgId:"o1",date:"2026-08-10",time:"07:00",place:"Marina Beach, North End",slots:50,filled:32,description:"Join 50 volunteers to clean 2km of India's longest beach. Gloves and bags provided.",impact:{kg_waste:145},status:"open",city:"Chennai",rating:4.5,rc:28},
  {id:2,title:"Mid-Day Meal Drive",category:"Food & Hunger",organizer:"HelpHands NGO",orgId:"o2",date:"2026-08-14",time:"10:00",place:"Govt Primary School, Ambattur",slots:20,filled:11,description:"Cook and serve nutritious meals to 300 school children who depend on this daily.",impact:{meals:900},status:"open",city:"Chennai",rating:4.8,rc:15},
  {id:3,title:"Rural Digital Literacy Camp",category:"Education",organizer:"Digital Bridge India",orgId:"o1",date:"2026-08-20",time:"09:00",place:"Panchayat Hall, Kancheepuram",slots:15,filled:15,description:"Teach basic smartphone skills to 80 rural adults and farmers.",impact:{students:240},status:"full",city:"Kancheepuram",rating:4.6,rc:12},
  {id:4,title:"Free Eye Checkup Camp",category:"Health",organizer:"Vision India Trust",orgId:"o3",date:"2026-08-25",time:"08:30",place:"Community Hall, Tambaram",slots:30,filled:18,description:"Support doctors in free eye checkups for 500 low-income residents.",impact:{patients:412},status:"open",city:"Chennai",rating:4.7,rc:22},
  {id:5,title:"Stray Animal Vaccination",category:"Animal Welfare",organizer:"PawsUp Chennai",orgId:"o2",date:"2026-09-01",time:"06:00",place:"Besant Nagar, Multiple Points",slots:25,filled:9,description:"Assist vets vaccinating stray dogs and cats across the neighbourhood.",impact:{animals:180},status:"open",city:"Chennai",rating:4.4,rc:8},
];
const GLOBE = {trees:4820,kg_waste:12400,meals:89000,students:15600,patients:8900,animals:3200,families:1100,elders:2700,youth:6400};
const LBOARD = [
  {name:"Priya S.",city:"Chennai",tasks:14,b:["🌱","🌿","🤝","🏅"]},
  {name:"Arjun M.",city:"Mumbai",tasks:11,b:["🌱","🌿","🤝"]},
  {name:"Meera K.",city:"Bangalore",tasks:9,b:["🌱","🌿"]},
  {name:"Karthik R.",city:"Hyderabad",tasks:7,b:["🌱","🌿"]},
  {name:"Divya P.",city:"Chennai",tasks:6,b:["🌱","🌿"]},
];
const fmtD = d=>new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const pct = (a,b)=>Math.min(100,Math.round((a/b)*100));
const allU = Object.values(IU).flat();

// styles
const bP={background:C.green,color:"#fff",border:"none",borderRadius:"8px",padding:"0.6rem 1.2rem",fontFamily:FF.b,fontWeight:700,fontSize:"0.875rem",cursor:"pointer"};
const bO={background:"transparent",color:C.green,border:`1.5px solid ${C.green}`,borderRadius:"8px",padding:"0.6rem 1.2rem",fontFamily:FF.b,fontWeight:700,fontSize:"0.875rem",cursor:"pointer"};
const bS={background:"#4c1d95",color:"#fff",border:"none",borderRadius:"8px",padding:"0.6rem 1.2rem",fontFamily:FF.b,fontWeight:700,fontSize:"0.875rem",cursor:"pointer"};
const iSt=(e)=>({background:C.bg,border:`1.5px solid ${e?C.red:C.border}`,borderRadius:"8px",padding:"0.65rem 0.9rem",color:C.ink,fontSize:"0.9rem",outline:"none",width:"100%",boxSizing:"border-box",fontFamily:FF.b});

function Toast({msg,type,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,4000);return()=>clearTimeout(t);},[]);
  const bg=type==="badge"?"#4c1d95":type==="error"?C.red:C.green;
  return <div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:9999,background:bg,color:"#fff",padding:"0.85rem 1.4rem",borderRadius:"10px",fontFamily:FF.b,fontSize:"0.9rem",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",maxWidth:"340px",lineHeight:1.5}}>{msg}</div>;
}
function Bar({value,max,color=C.green}){
  return <div style={{background:C.faint,borderRadius:"99px",height:"6px",overflow:"hidden"}}><div style={{height:"100%",width:`${pct(value,max)}%`,background:color,borderRadius:"99px",transition:"width 0.5s"}}/></div>;
}
function Pill({label,color,bg}){
  return <span style={{background:bg,color,fontSize:"0.7rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:"20px",fontFamily:FF.b}}>{label}</span>;
}
function Fld({label,error,children}){
  return <div><label style={{fontSize:"0.8rem",fontWeight:600,color:C.ink,display:"block",marginBottom:"0.4rem"}}>{label}</label>{children}{error&&<p style={{color:C.red,fontSize:"0.73rem",margin:"0.25rem 0 0"}}>{error}</p>}</div>;
}
function Stars({rating}){
  return <span style={{color:C.amber,fontSize:"0.85rem"}}>{[1,2,3,4,5].map(i=><span key={i}>{i<=Math.round(rating)?"★":"☆"}</span>)}</span>;
}

// ── OTP Modal — auto fires when phone filled ──────────────────────────────────
function OTPModal({phone,onVerified,onClose}){
  const [otp,setOtp]=useState(["","","","","",""]);
  const [err,setErr]=useState("");
  const [sending,setSending]=useState(true);
  const [cd,setCd]=useState(30);
  const [done,setDone]=useState(false);
  const refs=useRef([]);
  useEffect(()=>{const t=setTimeout(()=>{setSending(false);setTimeout(()=>refs.current[0]?.focus(),80);},1400);return()=>clearTimeout(t);},[]);
  useEffect(()=>{if(!sending&&cd>0){const t=setTimeout(()=>setCd(c=>c-1),1000);return()=>clearTimeout(t);}},[sending,cd]);
  const dig=(i,val)=>{
    if(!/^\d?$/.test(val))return;
    const n=[...otp];n[i]=val;setOtp(n);setErr("");
    if(val&&i<5)refs.current[i+1]?.focus();
    if(val&&i===5){
      const full=n.join("");
      if(full==="123456"){setDone(true);setTimeout(onVerified,700);}
      else{setErr("Wrong OTP. Use 123456 for demo.");setTimeout(()=>{setOtp(["","","","","",""]);refs.current[0]?.focus();},500);}
    }
  };
  const bk=(i,e)=>{if(e.key==="Backspace"&&!otp[i]&&i>0)refs.current[i-1]?.focus();};
  const resend=()=>{setSending(true);setOtp(["","","","","",""]);setErr("");setTimeout(()=>{setSending(false);setCd(30);refs.current[0]?.focus();},1200);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"20px",padding:"2rem",width:"100%",maxWidth:"360px",fontFamily:FF.b,textAlign:"center"}}>
        <div style={{width:"56px",height:"56px",borderRadius:"50%",background:done?C.greenLt:sending?C.faint:C.greenLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",margin:"0 auto 1rem",transition:"all 0.4s"}}>
          {done?"✅":sending?"⏳":"📱"}
        </div>
        <h2 style={{fontFamily:FF.d,fontSize:"1.25rem",color:C.ink,margin:"0 0 0.3rem",fontWeight:400}}>
          {done?"Verified!":sending?"Sending OTP…":"Enter OTP"}
        </h2>
        <p style={{color:C.muted,fontSize:"0.84rem",margin:"0 0 1rem"}}>
          {done?"Taking you in…":`Sent to +91 ${phone}`}
        </p>
        {!done&&<div style={{background:C.greenLt,borderRadius:"8px",padding:"0.35rem 0.85rem",display:"inline-block",marginBottom:"1.2rem"}}><span style={{color:C.green,fontSize:"0.77rem",fontWeight:700}}>Demo OTP: 123456</span></div>}
        {!done&&(
          <>
            <div style={{display:"flex",gap:"0.45rem",justifyContent:"center",marginBottom:"0.75rem",opacity:sending?0.35:1,transition:"opacity 0.3s"}}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>refs.current[i]=el} value={d}
                  onChange={e=>dig(i,e.target.value)} onKeyDown={e=>bk(i,e)}
                  maxLength={1} inputMode="numeric" disabled={sending}
                  style={{width:"42px",height:"50px",textAlign:"center",fontSize:"1.4rem",fontWeight:700,
                    border:`2px solid ${err?C.red:d?C.green:C.border}`,borderRadius:"10px",
                    background:d?C.greenLt:C.bg,color:C.ink,outline:"none",transition:"all 0.15s"}}/>
              ))}
            </div>
            {err&&<p style={{color:C.red,fontSize:"0.77rem",marginBottom:"0.5rem"}}>{err}</p>}
            <div style={{fontSize:"0.79rem",color:C.muted,marginBottom:"1rem"}}>
              {cd>0?`Resend in ${cd}s`:<button onClick={resend} style={{background:"none",border:"none",color:C.green,cursor:"pointer",fontSize:"0.84rem",fontWeight:700}}>Resend OTP</button>}
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── QR Code — pure SVG, zero dependencies, works offline ──────────────────────
// ── Proper QR Code (Version 1, Mode Byte, ECC-M, Mask 0) ─────────────────────
function QRCode({value,size=140}){
  const matrix=useRef(null);
  if(!matrix.current){
    // GF(256) arithmetic
    const EXP=new Uint8Array(512),LOG=new Uint8Array(256);
    let x=1;for(let i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&256)x^=285;}
    for(let i=255;i<512;i++)EXP[i]=EXP[i-255];
    const gfMul=(a,b)=>a&&b?EXP[LOG[a]+LOG[b]]:0;
    // Reed-Solomon generator poly (10 EC codewords for 1-M)
    const gen=(n)=>{let p=[1];for(let i=0;i<n;i++){const q=[1,EXP[i]];const r=new Uint8Array(p.length+1);for(let a=0;a<p.length;a++)for(let b=0;b<q.length;b++)r[a+b]^=gfMul(p[a],q[b]);p=r;}return p;};
    const G=gen(10);
    // Encode data bytes
    const bytes=[...value].map(c=>c.charCodeAt(0));
    // Mode indicator (byte=0100), char count, data, terminator
    let bits=[];
    const pushBits=(v,n)=>{for(let i=n-1;i>=0;i--)bits.push((v>>i)&1);};
    pushBits(4,4);pushBits(bytes.length,8);
    bytes.forEach(b=>pushBits(b,8));
    pushBits(0,4); // terminator
    while(bits.length%8)bits.push(0);
    const data=[];
    for(let i=0;i<bits.length;i+=8)data.push(bits.slice(i,i+8).reduce((a,b,j)=>a|(b<<(7-j)),0));
    // Pad to 16 data codewords (version 1-M capacity)
    const pads=[236,17];while(data.length<16)data.push(pads[(data.length-16%2+16)%2]||pads[0]);
    // EC codewords
    const msg=new Uint8Array(26);data.forEach((b,i)=>msg[i]=b);
    const ec=new Uint8Array(10);
    for(let i=0;i<16;i++){const c=ec[0]^msg[i];for(let j=0;j<9;j++)ec[j]=ec[j+1]^gfMul(c,G[G.length-2-j]);ec[9]=gfMul(c,G[0]);}
    const codewords=[...data,...ec];
    // Place bits into 21x21 grid
    const N=21;const grid=Array.from({length:N},()=>new Array(N).fill(null));
    const reserved=Array.from({length:N},()=>new Array(N).fill(false));
    // Finder pattern
    const finder=(r,c)=>{for(let dr=0;dr<7;dr++)for(let dc=0;dc<7;dc++){const d=dr===0||dr===6||dc===0||dc===6||(dr>=2&&dr<=4&&dc>=2&&dc<=4);grid[r+dr][c+dc]=d;reserved[r+dr][c+dc]=true;}};
    finder(0,0);finder(0,14);finder(14,0);
    // Separators (already covered by finder bounds + extra border pixels)
    for(let i=0;i<8;i++){
      [[7,i],[i,7],[7,N-1-i],[i,N-8],[N-8,i],[N-1-i,7]].forEach(([r,c])=>{if(r<N&&c<N&&!reserved[r][c]){grid[r][c]=false;reserved[r][c]=true;}});
    }
    // Timing
    for(let i=8;i<13;i++){grid[6][i]=i%2===0;reserved[6][i]=true;grid[i][6]=i%2===0;reserved[i][6]=true;}
    // Dark module
    grid[13][8]=true;reserved[13][8]=true;
    // Format info (ECC=M=01, mask=0=000 → format=0b01_000 → BCH)
    const fmtBits=[0,1,0,1,0,0,1,0,0,1,0,1,1,1,1]; // pre-computed for M,mask0 XOR 101010000010010
    [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]].forEach(([r,c],i)=>{grid[r][c]=!!fmtBits[i];reserved[r][c]=true;});
    [[8,N-1],[8,N-2],[8,N-3],[8,N-4],[8,N-5],[8,N-6],[8,N-7],[N-8,8],[N-7,8],[N-6,8],[N-5,8],[N-4,8],[N-3,8],[N-2,8],[N-1,8]].forEach(([r,c],i)=>{grid[r][c]=!!fmtBits[i];reserved[r][c]=true;});
    // Data placement (zigzag, mask 0: (r+c)%2===0 flip)
    let bit=0;
    const allBits=codewords.flatMap(b=>[7,6,5,4,3,2,1,0].map(i=>(b>>i)&1));
    let col=N-1,dir=-1;
    while(col>=0){
      if(col===6)col--;
      for(let row=dir===-1?N-1:0;row>=0&&row<N;row+=dir){
        for(const dc of[0,-1]){
          const c=col+dc,r=row;
          if(c>=0&&!reserved[r][c]&&bit<allBits.length){
            const mask=(r+c)%2===0;
            grid[r][c]=mask?!allBits[bit]:!!allBits[bit];
            bit++;
          }
        }
      }
      dir=-dir;col-=2;
    }
    matrix.current=grid;
  }
  const g=matrix.current;const N=21;const cs=size/N;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:4,display:"block",background:"#fff",shapeRendering:"crispEdges"}}>
      <rect width={size} height={size} fill="#fff"/>
      {g.map((row,r)=>row.map((on,c)=>on?<rect key={r*N+c} x={c*cs} y={r*cs} width={cs} height={cs} fill="#1E1433"/>:null))}
    </svg>
  );
}

// ── Entry Card ────────────────────────────────────────────────────────────────
function EntryCard({vol,ev,cardId,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"20px",width:"100%",maxWidth:"330px",overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,0.25)"}}>
        <div style={{background:`linear-gradient(135deg,${C.green},#312060)`,padding:"1.5rem",textAlign:"center",color:"#fff"}}>
          <div style={{fontFamily:FF.b,fontSize:"0.66rem",fontWeight:700,letterSpacing:"0.12em",opacity:0.6,marginBottom:"0.3rem"}}>VOLUNTEERCONNECT · ENTRY PASS</div>
          <div style={{fontFamily:FF.d,fontSize:"1.55rem",fontWeight:700}}>{vol.name}</div>
          <div style={{fontFamily:FF.b,fontSize:"0.75rem",opacity:0.7,marginTop:"0.2rem"}}>+91 {vol.phone} · {vol.city}</div>
        </div>
        <div style={{padding:"1.25rem"}}>
          <div style={{background:C.faint,borderRadius:"10px",padding:"0.85rem",marginBottom:"1rem"}}>
            <div style={{fontFamily:FF.d,fontSize:"0.95rem",fontWeight:700,color:C.ink,marginBottom:"0.3rem"}}>{ev.title}</div>
            <div style={{fontFamily:FF.b,fontSize:"0.76rem",color:C.muted,display:"flex",flexDirection:"column",gap:"0.2rem"}}>
              <span>📅 {fmtD(ev.date)} · {ev.time}</span><span>📍 {ev.place}</span>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:"0.9rem"}}>
            <div style={{border:`2px solid ${C.border}`,borderRadius:"10px",padding:"8px",background:"#fff"}}>
              <QRCode value={cardId} size={140}/>
            </div>
          </div>
          <div style={{textAlign:"center",fontFamily:FF.b,fontSize:"0.67rem",color:C.muted,letterSpacing:"0.1em",marginBottom:"1rem"}}>{cardId}</div>
          <button onClick={onClose} style={{...bO,width:"100%",padding:"0.65rem"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Certificate ───────────────────────────────────────────────────────────────
function Certificate({vol,ev,tasks,onClose}){
  const topBadge=BADGES.filter(b=>tasks>=b.req).pop();
  const certRef=useRef(null);

  const downloadPDF=()=>{
    const certId=`VC-${vol.phone}-${ev.id}`;
    const issued=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Certificate of Participation – ${vol.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:297mm;height:210mm;background:#fff;}
body{display:flex;align-items:center;justify-content:center;font-family:'EB Garamond',Georgia,serif;}
.page{width:277mm;height:190mm;margin:10mm auto;position:relative;background:#fff;overflow:hidden;}
/* Parchment background */
.page::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,#fdf6e3 0%,#faf0d7 40%,#f5e8c0 100%);z-index:0;}
/* Ornate outer border */
.border-outer{position:absolute;inset:6mm;border:3px solid #7c5c1e;z-index:1;}
.border-inner{position:absolute;inset:9mm;border:1px solid #b8922a;z-index:1;}
/* Corner ornaments */
.corner{position:absolute;width:18mm;height:18mm;z-index:2;}
.corner svg{width:100%;height:100%;}
.tl{top:4mm;left:4mm;} .tr{top:4mm;right:4mm;transform:scaleX(-1);}
.bl{bottom:4mm;left:4mm;transform:scaleY(-1);} .br{bottom:4mm;right:4mm;transform:scale(-1);}
/* Content */
.content{position:absolute;inset:14mm;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
.org{font-family:'Cinzel',serif;font-size:8pt;letter-spacing:0.25em;color:#7c5c1e;text-transform:uppercase;margin-bottom:3mm;}
.title{font-family:'Cinzel',serif;font-size:22pt;font-weight:700;color:#4a2f0a;line-height:1.2;margin-bottom:4mm;text-shadow:1px 1px 0 #e8d5a0;}
.rule{width:60mm;height:1.5px;background:linear-gradient(90deg,transparent,#b8922a,transparent);margin:0 auto 4mm;}
.presented{font-size:11pt;color:#6b4c1a;font-style:italic;margin-bottom:2mm;}
.name{font-family:'Cinzel',serif;font-size:28pt;font-weight:700;color:#3a1f05;margin:2mm 0 3mm;letter-spacing:0.05em;text-shadow:1px 1px 2px #d4b87050;}
.rule2{width:80mm;height:1px;background:linear-gradient(90deg,transparent,#c8a84b,transparent);margin:0 auto 3mm;}
.body-text{font-size:11pt;color:#5a3d12;line-height:1.6;max-width:200mm;margin-bottom:3mm;}
.event-name{font-family:'Cinzel',serif;font-size:13pt;font-weight:700;color:#4a2f0a;margin:1mm 0;}
.meta{font-size:9pt;color:#8a6535;margin-bottom:4mm;letter-spacing:0.04em;}
/* Seal */
.seal{position:absolute;right:18mm;bottom:20mm;width:28mm;height:28mm;z-index:4;}
.seal svg{width:100%;height:100%;}
/* Signatures */
.sigs{display:flex;justify-content:space-between;width:100%;margin-top:4mm;padding:0 10mm;}
.sig{text-align:center;min-width:55mm;}
.sig-line{width:50mm;height:1px;background:#b8922a;margin:0 auto 1.5mm;}
.sig-label{font-size:8pt;color:#7c5c1e;letter-spacing:0.08em;font-family:'Cinzel',serif;}
.sig-name{font-size:7pt;color:#a07840;margin-top:0.5mm;}
/* Badge ribbon */
.ribbon{display:inline-block;background:linear-gradient(135deg,#7c5c1e,#c8a84b,#7c5c1e);color:#fff;font-family:'Cinzel',serif;font-size:7pt;font-weight:700;padding:1.5mm 5mm;letter-spacing:0.1em;margin:0 1mm;border-radius:1mm;}
/* Footer */
.footer{position:absolute;bottom:11mm;left:14mm;right:14mm;z-index:3;display:flex;justify-content:space-between;align-items:flex-end;}
.cert-id{font-size:6.5pt;color:#a07840;letter-spacing:0.06em;}
@media print{
  html,body{width:297mm;height:210mm;}
  @page{size:A4 landscape;margin:0;}
  .page{margin:0;width:297mm;height:210mm;}
}
</style></head>
<body onload="window.print()">
<div class="page">
  <!-- Parchment bg -->
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <!-- Corner ornaments -->
  <div class="corner tl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 2 L2 30 Q2 2 30 2 Z" stroke="#b8922a" stroke-width="1.5" fill="#c8a84b22"/><path d="M8 8 L8 24 Q8 8 24 8 Z" stroke="#7c5c1e" stroke-width="1" fill="none"/><circle cx="2" cy="2" r="2" fill="#b8922a"/><circle cx="30" cy="2" r="1.5" fill="#b8922a"/><circle cx="2" cy="30" r="1.5" fill="#b8922a"/><path d="M14 2 Q14 14 2 14" stroke="#c8a84b" stroke-width="0.8" fill="none"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 60 60" fill="none"><path d="M2 2 L2 30 Q2 2 30 2 Z" stroke="#b8922a" stroke-width="1.5" fill="#c8a84b22"/><path d="M8 8 L8 24 Q8 8 24 8 Z" stroke="#7c5c1e" stroke-width="1" fill="none"/><circle cx="2" cy="2" r="2" fill="#b8922a"/><circle cx="30" cy="2" r="1.5" fill="#b8922a"/><circle cx="2" cy="30" r="1.5" fill="#b8922a"/><path d="M14 2 Q14 14 2 14" stroke="#c8a84b" stroke-width="0.8" fill="none"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 2 L2 30 Q2 2 30 2 Z" stroke="#b8922a" stroke-width="1.5" fill="#c8a84b22"/><path d="M8 8 L8 24 Q8 8 24 8 Z" stroke="#7c5c1e" stroke-width="1" fill="none"/><circle cx="2" cy="2" r="2" fill="#b8922a"/><circle cx="30" cy="2" r="1.5" fill="#b8922a"/><circle cx="2" cy="30" r="1.5" fill="#b8922a"/><path d="M14 2 Q14 14 2 14" stroke="#c8a84b" stroke-width="0.8" fill="none"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 60 60" fill="none"><path d="M2 2 L2 30 Q2 2 30 2 Z" stroke="#b8922a" stroke-width="1.5" fill="#c8a84b22"/><path d="M8 8 L8 24 Q8 8 24 8 Z" stroke="#7c5c1e" stroke-width="1" fill="none"/><circle cx="2" cy="2" r="2" fill="#b8922a"/><circle cx="30" cy="2" r="1.5" fill="#b8922a"/><circle cx="2" cy="30" r="1.5" fill="#b8922a"/><path d="M14 2 Q14 14 2 14" stroke="#c8a84b" stroke-width="0.8" fill="none"/></svg></div>
  <!-- Gold seal -->
  <div class="seal"><svg viewBox="0 0 100 100"><defs><radialGradient id="sg" cx="50%" cy="40%"><stop offset="0%" stop-color="#f5d87a"/><stop offset="60%" stop-color="#c8a84b"/><stop offset="100%" stop-color="#8a6020"/></radialGradient></defs>
  <polygon points="50,3 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="url(#sg)" stroke="#7c5c1e" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#7c5c1e" stroke-width="1"/>
  <text x="50" y="46" text-anchor="middle" font-size="7" font-family="Cinzel,serif" fill="#4a2f0a" font-weight="700">VOLUNTEER</text>
  <text x="50" y="55" text-anchor="middle" font-size="7" font-family="Cinzel,serif" fill="#4a2f0a" font-weight="700">CONNECT</text>
  <text x="50" y="63" text-anchor="middle" font-size="5" font-family="Cinzel,serif" fill="#6b4c1a">✦ VERIFIED ✦</text>
  </svg></div>
  <!-- Main content -->
  <div class="content">
    <div class="org">VolunteerConnect &nbsp;✦&nbsp; Tamil Nadu Chapter</div>
    <div class="title">Certificate of Participation</div>
    <div class="rule"></div>
    <div class="presented">This is to proudly certify that</div>
    <div class="name">${vol.name}</div>
    <div class="rule2"></div>
    <div class="body-text">
      has voluntarily and selflessly contributed their time and efforts as a dedicated volunteer in the community initiative
    </div>
    <div class="event-name">"${ev.title}"</div>
    <div class="meta">Organised by ${ev.organizer} &nbsp;·&nbsp; ${fmtD(ev.date)} &nbsp;·&nbsp; ${ev.place}, ${ev.city}</div>
    <div style="margin-bottom:3mm">
      <span class="ribbon">✦ Verified Volunteer</span>
      ${topBadge?`<span class="ribbon">${topBadge.icon} ${topBadge.name}</span>`:''}
      <span class="ribbon">Community Impact</span>
    </div>
    <div class="sigs">
      <div class="sig">
        <div style="font-family:'EB Garamond',serif;font-style:italic;font-size:16pt;color:#4a2f0a;margin-bottom:1mm">Priya Sharma</div>
        <div class="sig-line"></div>
        <div class="sig-label">Programme Director</div>
        <div class="sig-name">VolunteerConnect Foundation</div>
      </div>
      <div class="sig" style="margin-top:3mm">
        <div style="font-size:8pt;color:#8a6535;font-style:italic">Issued on ${issued}</div>
        <div style="font-size:7pt;color:#a07840;margin-top:1mm">Certificate No. ${certId}</div>
      </div>
      <div class="sig">
        <div style="font-family:'EB Garamond',serif;font-style:italic;font-size:16pt;color:#4a2f0a;margin-bottom:1mm">${ev.organizer.split(' ')[0]} Team</div>
        <div class="sig-line"></div>
        <div class="sig-label">Event Coordinator</div>
        <div class="sig-name">${ev.organizer}</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="cert-id">🌐 www.volunteerconnect.org &nbsp;·&nbsp; Cert ID: ${certId}</div>
    <div class="cert-id">Issued: ${issued} &nbsp;·&nbsp; Valid for official records</div>
  </div>
</div>
</body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,"_blank","width=800,height=600,menubar=yes,toolbar=yes");
    if(!win){
      // fallback: download file if popup blocked
      const a=document.createElement("a");
      a.href=url;
      a.download=`Certificate_${vol.name.replace(/\s+/g,"_")}.html`;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    }
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"20px",width:"100%",maxWidth:"460px",padding:"2rem",fontFamily:FF.b}}>
        <div ref={certRef} style={{textAlign:"center",border:`2px solid ${C.border}`,borderRadius:"12px",padding:"1.5rem",marginBottom:"1rem"}}>
          <div style={{fontFamily:FF.b,fontSize:"0.66rem",fontWeight:700,letterSpacing:"0.14em",color:C.muted,marginBottom:"0.3rem"}}>VOLUNTEERCONNECT · CERTIFICATE OF PARTICIPATION</div>
          <div style={{width:"36px",height:"2px",background:C.green,margin:"0 auto 1rem"}}/>
          <div style={{fontFamily:FF.b,fontSize:"0.85rem",color:C.muted,marginBottom:"0.35rem"}}>This certifies that</div>
          <div style={{fontFamily:FF.d,fontSize:"1.9rem",color:C.green,margin:"0.2rem 0 0.4rem"}}>{vol.name}</div>
          <div style={{fontFamily:FF.b,fontSize:"0.85rem",color:C.muted,marginBottom:"0.2rem"}}>participated as a volunteer in</div>
          <div style={{fontFamily:FF.d,fontSize:"1.15rem",color:C.ink,marginBottom:"0.35rem"}}>{ev.title}</div>
          <div style={{fontFamily:FF.b,fontSize:"0.8rem",color:C.muted,marginBottom:"0.8rem"}}>organised by {ev.organizer} · 📅 {fmtD(ev.date)} · 📍 {ev.city}</div>
          <div style={{display:"flex",justifyContent:"center",gap:"0.6rem",flexWrap:"wrap"}}>
            <span style={{background:C.greenLt,color:C.green,fontSize:"0.73rem",fontWeight:700,padding:"0.25rem 0.8rem",borderRadius:"20px"}}>✅ Verified</span>
            {topBadge&&<span style={{background:C.amberLt,color:C.amber,fontSize:"0.73rem",fontWeight:700,padding:"0.25rem 0.8rem",borderRadius:"20px"}}>{topBadge.icon} {topBadge.name}</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <button onClick={onClose} style={{...bO,flex:1,padding:"0.75rem"}}>Close</button>
          <button onClick={downloadPDF} style={{...bP,flex:1,padding:"0.75rem"}}>⬇ Download PDF</button>
        </div>
      </div>
    </div>
  );
}

// ── Chat ──────────────────────────────────────────────────────────────────────
function ChatModal({vol,ev,onClose}){
  const [msgs,setMsgs]=useState([
    {from:"org",text:`Hi! Welcome to ${ev.title}. Ask me anything.`},
    {from:"org",text:`Please arrive 10 mins early at ${ev.place}.`},
  ]);
  const [input,setInput]=useState("");
  const bot=useRef(null);
  const smartReply=q=>{
    const t=q.toLowerCase();
    if(/friend|bring|plus.?one|extra|another person|colleague|guest/i.test(t))
      return `Yes, friends are welcome! Please have them register on VolunteerConnect so we have a headcount. 😊`;
    if(/time|when|start|begin|end|finish|duration|how long/i.test(t))
      return `${ev.title} starts at ${fmtD(ev.date)}. Please arrive 10 minutes early at ${ev.place}.`;
    if(/where|location|place|venue|address|how to reach|directions/i.test(t))
      return `The event is at ${ev.place}, ${ev.city}. Look for the VolunteerConnect banner at the entrance! 📍`;
    if(/what.*(bring|carry|wear|need)|clothes|dress|attire|outfit|requirement/i.test(t))
      return `Wear comfortable clothes suitable for outdoor activity. Bring water, sunscreen, and your enthusiasm! 🌟`;
    if(/food|eat|lunch|snack|water|drink|meal/i.test(t))
      return `Light refreshments will be provided. We recommend bringing your own water bottle. 🍱`;
    if(/cancel|can.?t come|won.?t make|unable|not attend|drop/i.test(t))
      return `No worries! Please let us know at least 24 hours before so we can plan accordingly. Hope to see you next time! 🙏`;
    if(/certif|certificate|proof|letter|document/i.test(t))
      return `Yes! You'll receive a digital certificate of participation after the event. Check your VolunteerConnect profile. 🏅`;
    if(/paid|payment|fee|cost|free|charge|money/i.test(t))
      return `This event is completely free to attend! No registration fee required. ✅`;
    if(/age|old|young|minor|18|student/i.test(t))
      return `Volunteers of all ages are welcome! Those under 18 need a parent/guardian consent. 👨‍👩‍👧`;
    if(/contact|phone|call|email|reach|organizer|handler/i.test(t))
      return `You can reach ${ev.organizer} through this chat. We'll respond as soon as possible! 📞`;
    if(/how many|count|people|volunteers|team|group|size/i.test(t))
      return `We're expecting ${ev.slots} volunteers for this event. Slots are filling up fast! 🙌`;
    if(/hi|hello|hey|good morning|good evening|namaste/i.test(t))
      return `Hello! 👋 Welcome to ${ev.title}. How can I help you today?`;
    if(/thank|thanks|great|awesome|nice|good|perfect|wonderful/i.test(t))
      return `You're welcome! Looking forward to seeing you at ${ev.title}. Together we make a difference! 💜`;
    if(/help|support|assist|question|doubt|clarif/i.test(t))
      return `Happy to help! Please ask your question and we'll get back to you right away. 😊`;
    return `Thanks for your message! Our team at ${ev.organizer} will get back to you shortly. For urgent queries, please contact us directly. 🙏`;
  };
  useEffect(()=>{bot.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=()=>{
    if(!input.trim())return;
    const q=input.trim();
    setMsgs(p=>[...p,{from:"me",text:q}]);setInput("");
    setTimeout(()=>setMsgs(p=>[...p,{from:"org",text:smartReply(q)}]),900);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"16px",width:"100%",maxWidth:"400px",display:"flex",flexDirection:"column",height:"480px"}}>
        <div style={{padding:"1rem 1.25rem",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:FF.d,fontSize:"0.95rem",fontWeight:700,color:C.ink}}>{ev.title}</div><div style={{fontFamily:FF.b,fontSize:"0.75rem",color:C.muted}}>Chat with {ev.organizer}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.1rem"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:"0.45rem"}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"78%",background:m.from==="me"?C.greenLt:C.faint,color:m.from==="me"?C.green:C.ink,borderRadius:"12px",borderBottomRightRadius:m.from==="me"?"2px":"12px",borderBottomLeftRadius:m.from==="me"?"12px":"2px",padding:"0.55rem 0.85rem",fontFamily:FF.b,fontSize:"0.84rem",lineHeight:1.5}}>{m.text}</div>
            </div>
          ))}
          <div ref={bot}/>
        </div>
        <div style={{padding:"0.7rem 1rem",borderTop:`1px solid ${C.border}`,display:"flex",gap:"0.5rem"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…" style={{...iSt(),flex:1,padding:"0.5rem 0.75rem"}}/>
          <button onClick={send} style={{...bP,padding:"0.5rem 1rem"}}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── Rating ────────────────────────────────────────────────────────────────────
function RatingModal({ev,onRate,onClose}){
  const [sel,setSel]=useState(0);const [hov,setHov]=useState(0);
  const labs=["","Needs improvement","Could be better","Good experience","Very well done!","Outstanding! 🎉"];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"16px",padding:"2rem",width:"100%",maxWidth:"340px",fontFamily:FF.b,textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>⭐</div>
        <h3 style={{fontFamily:FF.d,fontSize:"1.15rem",color:C.ink,margin:"0 0 0.3rem"}}>Rate this event</h3>
        <p style={{color:C.muted,fontSize:"0.84rem",margin:"0 0 1.4rem"}}>{ev.title}</p>
        <div style={{display:"flex",gap:"0.4rem",justifyContent:"center",marginBottom:"0.65rem"}}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>setSel(n)} onMouseEnter={()=>setHov(n)} onMouseLeave={()=>setHov(0)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:"2rem",color:(hov||sel)>=n?C.amber:C.border,transition:"color 0.1s"}}>★</button>
          ))}
        </div>
        <div style={{height:"1.2rem",color:C.green,fontWeight:700,fontSize:"0.84rem",marginBottom:"1.25rem"}}>{labs[hov||sel]}</div>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <button onClick={onClose} style={{...bO,flex:1}}>Skip</button>
          <button onClick={()=>{if(sel)onRate(sel);}} disabled={!sel} style={{...bP,flex:1,opacity:sel?1:0.5}}>Submit</button>
        </div>
      </div>
    </div>
  );
}

// ── Impact modal ──────────────────────────────────────────────────────────────
function ImpactModal({ev,onSave,onClose}){
  const units=IU[ev.category]||[];
  const [vals,setVals]=useState({...ev.impact});
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
      <div style={{background:C.surface,borderRadius:"16px",padding:"2rem",width:"100%",maxWidth:"360px",fontFamily:FF.b}}>
        <h3 style={{fontFamily:FF.d,fontSize:"1.15rem",color:C.ink,margin:"0 0 0.5rem"}}>📊 Update impact</h3>
        <p style={{color:C.muted,fontSize:"0.84rem",marginBottom:"1.4rem"}}>{ev.title}</p>
        {units.map(u=>(
          <Fld key={u.key} label={`${u.icon} ${u.label}`}>
            <input type="number" value={vals[u.key]||""} inputMode="numeric"
              onChange={e=>setVals(v=>({...v,[u.key]:parseInt(e.target.value)||0}))}
              style={iSt()} placeholder="Enter number"/>
          </Fld>
        ))}
        <div style={{display:"flex",gap:"0.75rem",marginTop:"1.4rem"}}>
          <button onClick={()=>onSave(vals)} style={{...bP,flex:1}}>Save</button>
          <button onClick={onClose} style={{...bO,flex:1}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Create Event Modal ────────────────────────────────────────────────────────
function CreateEvModal({user,onCreate,onClose}){
  const [form,setForm]=useState({title:"",category:"Environment",description:"",date:"",time:"",place:"",slots:""});
  const [err,setErr]=useState({});
  const [aiLoad,setAiLoad]=useState(false);
  const [prompt,setPrompt]=useState("");
  const validate=()=>{const e={};if(!form.title.trim())e.title="Required";if(!form.date)e.date="Required";if(!form.time)e.time="Required";if(!form.place.trim())e.place="Required";if(!form.slots||parseInt(form.slots)<1)e.slots="Min 1";setErr(e);return Object.keys(e).length===0;};
  const aiGen=()=>{
    if(!prompt.trim())return;setAiLoad(true);
    const t={"Environment":"Join us for a community environmental drive! Together we'll make a tangible difference — equipment provided. All you need is 2 hours and enthusiasm. Perfect for students, families, and first-timers.","Food & Hunger":"Help us serve nutritious meals to those who need it most. Your time and compassion can change someone's day. No prior experience needed.","Education":"Be the reason a child discovers something new. Join our education initiative and help bridge the learning gap. Engaging and rewarding for all.","Health":"Support our free health camp and bring quality medical care to underserved communities. No medical background required for most volunteer roles.","default":"Join us for this impactful community event! Your contribution, however small, creates ripples of change."};
    setTimeout(()=>{setForm(f=>({...f,description:t[form.category]||t["default"]}));setAiLoad(false);},1400);
  };
  const submit=()=>{if(!validate())return;onCreate({...form,slots:parseInt(form.slots),filled:0,impact:{},status:"open",organizer:user.org,orgId:user.id,city:user.city,id:Date.now(),rating:0,rc:0});};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,20,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem",overflowY:"auto"}}>
      <div style={{background:C.surface,borderRadius:"16px",padding:"2rem",width:"100%",maxWidth:"500px",margin:"auto",fontFamily:FF.b}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.4rem"}}>
          <h3 style={{fontFamily:FF.d,fontSize:"1.2rem",color:C.ink,margin:0}}>📋 Post new event</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:"1.1rem"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.85rem"}}>
          <Fld label="Event title *" error={err.title}><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Park Cleanup Drive" style={iSt(err.title)}/></Fld>
          <Fld label="Category"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...iSt(),cursor:"pointer"}}>{CATS.map(c=><option key={c}>{c}</option>)}</select></Fld>
          <div style={{background:C.purpleLt,borderRadius:"10px",padding:"0.85rem",border:`1px solid ${C.purple}33`}}>
            <div style={{fontFamily:FF.b,fontSize:"0.73rem",fontWeight:700,color:C.purple,marginBottom:"0.45rem"}}>✨ AI Description Writer</div>
            <div style={{display:"flex",gap:"0.45rem"}}>
              <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Type a few words about your event…" style={{...iSt(),flex:1,fontSize:"0.82rem"}}/>
              <button onClick={aiGen} disabled={aiLoad} style={{...bP,background:C.purple,padding:"0.5rem 0.8rem",fontSize:"0.78rem",opacity:aiLoad?0.7:1,whiteSpace:"nowrap"}}>{aiLoad?"Writing…":"Generate"}</button>
            </div>
          </div>
          <Fld label="Description"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} placeholder="What will volunteers do?" style={{...iSt(),resize:"vertical"}}/></Fld>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            <Fld label="Date *" error={err.date}><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={iSt(err.date)}/></Fld>
            <Fld label="Time *" error={err.time}><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={iSt(err.time)}/></Fld>
          </div>
          <Fld label="Venue / address *" error={err.place}><input value={form.place} onChange={e=>setForm({...form,place:e.target.value})} placeholder="e.g. Central Park, Gate 3" style={iSt(err.place)}/></Fld>
          <Fld label="Max volunteer slots *" error={err.slots}><input type="number" value={form.slots} onChange={e=>setForm({...form,slots:e.target.value})} inputMode="numeric" style={iSt(err.slots)}/></Fld>
          <div style={{display:"flex",gap:"0.75rem",marginTop:"0.4rem"}}>
            <button onClick={submit} style={{...bP,flex:1,padding:"0.85rem"}}>Publish →</button>
            <button onClick={onClose} style={{...bO,flex:1,padding:"0.85rem"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Welcome banner ────────────────────────────────────────────────────────────
function WelcomeBanner({user,role,onDismiss}){
  useEffect(()=>{const t=setTimeout(onDismiss,4500);return()=>clearTimeout(t);},[]);
  return(
    <div style={{background:`linear-gradient(135deg,${C.green},#173d2c)`,color:"#fff",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
        <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{role==="volunteer"?"👐":"📋"}</div>
        <div>
          <div style={{fontFamily:FF.d,fontSize:"0.95rem",fontWeight:700}}>Welcome, {user.name.split(" ")[0]}! Phone verified ✅</div>
          <div style={{fontFamily:FF.b,fontSize:"0.77rem",opacity:0.75}}>{role==="volunteer"?`${user.city} · Ready to volunteer`:`${user.org} · ${user.city}`}</div>
        </div>
      </div>
      <button onClick={onDismiss} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"6px",padding:"0.28rem 0.6rem",cursor:"pointer",fontSize:"0.78rem"}}>✕</button>
    </div>
  );
}

// ── Map view ──────────────────────────────────────────────────────────────────
// Real event locations in Chennai mapped to actual coordinates
const EVENT_COORDS={
  "Marina Beach Cleanup":     {lat:13.0500,lng:80.2824},
  "Mid-Day Meal Drive":       {lat:13.0827,lng:80.2707},
  "Free Eye Camp":            {lat:13.0569,lng:80.2425},
  "Stray Animal Care":        {lat:13.0878,lng:80.2785},
  "Afforestation":            {lat:13.0067,lng:80.2206},
  "Senior Citizen Visit":     {lat:13.1067,lng:80.2934},
  "Coastal Cleanup":          {lat:13.0355,lng:80.2699},
  "Flood Relief":             {lat:13.0100,lng:80.2350},
};

function MapView({events}){
  const [act,setAct]=useState(null);
  // Build marker query for OpenStreetMap with markers
  const evWithCoords=events.slice(0,6).map(ev=>{
    const coords=EVENT_COORDS[ev.title]||{lat:13.0827+Math.random()*0.04-0.02,lng:80.2707+Math.random()*0.04-0.02};
    return {...ev,...coords};
  });

  return(
    <div style={{borderRadius:"12px",overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:"1rem"}}>
      {/* OpenStreetMap embed — no API key needed, works on localhost */}
      <div style={{position:"relative",height:"300px"}}>
        <iframe
          title="Chennai Event Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.1700%2C12.9800%2C80.3200%2C13.1800&layer=mapnik&marker=13.0827%2C80.2707"
          width="100%" height="300"
          style={{border:"none",display:"block"}}
          loading="lazy"
          allowFullScreen=""
        />
        {/* Legend overlay */}
        <div style={{position:"absolute",top:"0.6rem",right:"0.6rem",display:"flex",gap:"0.35rem",pointerEvents:"none"}}>
          <span style={{background:C.greenLt,color:C.green,fontSize:"0.68rem",fontWeight:700,padding:"0.2rem 0.55rem",borderRadius:"10px",boxShadow:"0 1px 4px #0002"}}>● Open</span>
          <span style={{background:C.redLt,color:C.red,fontSize:"0.68rem",fontWeight:700,padding:"0.2rem 0.55rem",borderRadius:"10px",boxShadow:"0 1px 4px #0002"}}>● Full</span>
        </div>
      </div>
      {/* Event pins list below map */}
      <div style={{background:C.surface,padding:"0.75rem",display:"flex",gap:"0.5rem",flexWrap:"wrap",borderTop:`1px solid ${C.border}`}}>
        {evWithCoords.map((ev,i)=>{
          const m=CM[ev.category];
          return(
            <button key={i} onClick={()=>setAct(act===i?null:i)}
              style={{background:act===i?(m?.color||C.green):C.faint,color:act===i?"#fff":(m?.color||C.green),
                border:`1.5px solid ${m?.color||C.green}`,borderRadius:"20px",
                padding:"0.22rem 0.65rem",fontSize:"0.71rem",fontWeight:700,
                fontFamily:FF.b,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>
              {m?.icon} {ev.title.split(" ").slice(0,3).join(" ")}
              {ev.status==="full"&&" 🔴"}
            </button>
          );
        })}
      </div>
      {/* Popup detail on click */}
      {act!==null&&evWithCoords[act]&&(
        <div style={{background:C.faint,borderTop:`1px solid ${C.border}`,padding:"0.85rem 1rem",fontFamily:FF.b}}>
          <div style={{fontFamily:FF.d,fontSize:"0.95rem",color:C.ink,fontWeight:700,marginBottom:"0.25rem"}}>{evWithCoords[act].title}</div>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",fontSize:"0.76rem",color:C.muted}}>
            <span>📅 {fmtD(evWithCoords[act].date)}</span>
            <span>📍 {evWithCoords[act].place}</span>
            <span>👥 {evWithCoords[act].filled}/{evWithCoords[act].slots} spots</span>
            <span style={{color:evWithCoords[act].status==="full"?C.red:C.green,fontWeight:700}}>
              {evWithCoords[act].status==="full"?"● Full":"● Open"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function Leaderboard({myTasks,userName}){
  const me={name:"You",city:"Chennai",tasks:myTasks,b:BADGES.filter(b=>myTasks>=b.req).map(b=>b.icon)};
  const board=[...LBOARD,me].sort((a,b)=>b.tasks-a.tasks);
  const medals=["🥇","🥈","🥉"];
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"1.25rem",maxWidth:"560px"}}>
      <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 1rem",fontWeight:700}}>🏆 Chennai Leaderboard — This Month</h3>
      {board.map((v,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.55rem 0.6rem",borderBottom:i<board.length-1?`1px solid ${C.border}`:"none",borderRadius:"8px",background:v.name==="You"?C.greenLt:"transparent"}}>
          <span style={{width:"22px",textAlign:"center",fontSize:"1rem"}}>{medals[i]||<span style={{color:C.muted,fontSize:"0.85rem"}}>{i+1}</span>}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:FF.b,fontSize:"0.875rem",fontWeight:700,color:v.name==="You"?C.green:C.ink}}>{v.name}{v.name==="You"?" (you)":""}</div>
            <div style={{fontFamily:FF.b,fontSize:"0.7rem",color:C.muted}}>{v.city}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:FF.b,fontSize:"0.85rem",fontWeight:700,color:C.ink}}>{v.tasks} tasks</div>
            <div style={{fontSize:"0.82rem"}}>{v.b.join(" ")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Streak ────────────────────────────────────────────────────────────────────
function Streak({tasks}){
  const s=Math.min(tasks,8);
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"1.25rem"}}>
      <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 0.75rem",fontWeight:700}}>🔥 Volunteer Streak</h3>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
        <div style={{fontSize:"2rem"}}>🔥</div>
        <div>
          <div style={{fontFamily:FF.d,fontSize:"1.45rem",fontWeight:700,color:s>=3?C.amber:C.ink}}>{s}-week streak</div>
          <div style={{fontFamily:FF.b,fontSize:"0.73rem",color:C.muted}}>Bonus badge at 10 weeks!</div>
        </div>
      </div>
      <div style={{display:"flex",gap:"4px"}}>
        {["W1","W2","W3","W4","W5","W6","W7","W8"].map((w,i)=>{
          const done=i<s;const cur=i===s;
          return <div key={i} style={{flex:1,height:"30px",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.66rem",fontWeight:700,background:done?C.greenLt:cur?C.green:"#f0ede8",color:done?C.green:cur?"#fff":C.muted,border:cur?`2px solid ${C.green}`:"none"}}>{w}</div>;
        })}
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
function Notifs(){
  const ns=[
    {dot:C.blue,  title:"New event near you",       sub:"Free Eye Camp in Tambaram matches your Health interest",time:"2m ago"},
    {dot:C.amber, title:"Filling fast — 3 slots left",sub:"Mid-Day Meal Drive · tomorrow 10:00 AM",             time:"15m ago"},
    {dot:C.green, title:"Reminder — event tomorrow", sub:"Marina Beach Cleanup · 7:00 AM · 24 hrs away",        time:"1h ago"},
    {dot:C.purple,title:"Badge milestone approaching",sub:"1 more task to unlock 🌿 Sprout badge!",              time:"3h ago"},
  ];
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"1.25rem",maxWidth:"560px"}}>
      <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 1rem",fontWeight:700}}>🔔 Notifications</h3>
      <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
        {ns.map((n,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"0.7rem",background:C.faint,borderRadius:"8px",padding:"0.7rem 0.85rem"}}>
            <div style={{width:"8px",height:"8px",borderRadius:"50%",background:n.dot,flexShrink:0,marginTop:"4px"}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:FF.b,fontSize:"0.84rem",fontWeight:700,color:C.ink}}>{n.title}</div>
              <div style={{fontFamily:FF.b,fontSize:"0.73rem",color:C.muted}}>{n.sub}</div>
            </div>
            <div style={{fontFamily:FF.b,fontSize:"0.66rem",color:C.muted,whiteSpace:"nowrap"}}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EvCard({ev,joined,completed,onJoin,onComplete,onCard,onChat,onRate,isHandler,isMine,onImpact}){
  const m=CM[ev.category]||{icon:"📌",color:C.muted,lt:C.faint};
  const fp=pct(ev.filled,ev.slots);
  return(
    <div style={{background:C.surface,border:`1.5px solid ${isMine?C.green+"55":C.border}`,borderRadius:"14px",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{height:"4px",background:m.color}}/>
      <div style={{padding:"1.05rem",flex:1,display:"flex",flexDirection:"column",gap:"0.6rem"}}>
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"}}>
          <Pill label={`${m.icon} ${ev.category}`} color={m.color} bg={m.lt}/>
          <Pill label={ev.status==="open"?"🟢 Open":"🔴 Full"} color={ev.status==="open"?C.green:C.red} bg={ev.status==="open"?C.greenLt:C.redLt}/>
          {isMine&&<Pill label="Your event" color={C.green} bg={C.greenLt}/>}
          {ev.rc>0&&<span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"3px"}}><Stars rating={ev.rating}/><span style={{fontFamily:FF.b,fontSize:"0.7rem",color:C.muted}}>({ev.rc})</span></span>}
        </div>
        <div>
          <h3 style={{fontFamily:FF.d,fontSize:"1rem",color:C.ink,margin:"0 0 0.18rem",fontWeight:700}}>{ev.title}</h3>
          <p style={{color:C.muted,fontSize:"0.79rem",margin:0,lineHeight:1.5}}>{ev.description}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.2rem",fontSize:"0.77rem",color:C.muted,fontFamily:FF.b}}>
          <span>📅 {fmtD(ev.date)} · {ev.time}</span>
          <span>📍 {ev.place}</span>
          <span>🏢 {ev.organizer}</span>
        </div>
        {Object.entries(ev.impact).some(([,v])=>v>0)&&(
          <div style={{background:C.faint,borderRadius:"7px",padding:"0.4rem 0.75rem",display:"flex",gap:"0.7rem",flexWrap:"wrap"}}>
            {Object.entries(ev.impact).map(([k,v])=>{const u=(IU[ev.category]||[]).find(x=>x.key===k);if(!u||!v)return null;return <span key={k} style={{fontFamily:FF.b,fontSize:"0.71rem",color:C.green,fontWeight:700}}>{u.icon} {v.toLocaleString("en-IN")} {u.label}</span>;})}
          </div>
        )}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.71rem",color:C.muted,marginBottom:"0.28rem"}}>
            <span>{ev.filled}/{ev.slots} volunteers</span><span>{fp}%</span>
          </div>
          <Bar value={ev.filled} max={ev.slots} color={fp===100?C.amber:m.color}/>
        </div>
        {!isHandler&&(
          <div style={{display:"flex",gap:"0.38rem",flexWrap:"wrap",marginTop:"auto"}}>
            {!joined&&ev.status==="open"&&<button onClick={()=>onJoin(ev.id)} style={{...bP,flex:1,padding:"0.5rem",fontSize:"0.8rem"}}>Join</button>}
            {joined&&!completed&&<button onClick={()=>onComplete(ev.id)} style={{...bS,flex:1,padding:"0.5rem",fontSize:"0.8rem"}}>Complete ✅</button>}
            {joined&&<button onClick={()=>onCard(ev)} style={{background:C.faint,border:"none",borderRadius:"8px",padding:"0.5rem 0.65rem",cursor:"pointer",fontSize:"0.82rem",fontFamily:FF.b}} title="Entry Card">🎫</button>}
            {joined&&<button onClick={()=>onChat(ev)} style={{background:C.faint,border:"none",borderRadius:"8px",padding:"0.5rem 0.65rem",cursor:"pointer",fontSize:"0.82rem",fontFamily:FF.b}} title="Chat">💬</button>}
            {completed&&<button onClick={()=>onRate(ev)} style={{background:C.amberLt,border:"none",borderRadius:"8px",padding:"0.5rem 0.65rem",cursor:"pointer",fontSize:"0.82rem",fontFamily:FF.b,color:C.amber}} title="Rate">⭐</button>}
            {completed&&<span style={{color:C.green,fontWeight:700,fontSize:"0.8rem",fontFamily:FF.b,display:"flex",alignItems:"center"}}>✅ Done</span>}
            {ev.status==="full"&&!joined&&<span style={{color:C.red,fontSize:"0.77rem",fontFamily:FF.b}}>Event full</span>}
          </div>
        )}
        {isHandler&&isMine&&<button onClick={()=>onImpact(ev)} style={{...bO,padding:"0.5rem",fontSize:"0.79rem"}}>📊 Update impact</button>}
      </div>
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing({onRole,darkToggle}){
  const [as,setAs]=useState(0);
  const stories=[
    {name:"Priya, 22",city:"Chennai",  cat:"Environment",  action:"planted 12 trees",  time:"last Saturday"},
    {name:"Arjun, 19",city:"Mumbai",   cat:"Food & Hunger", action:"served 200 meals",  time:"this morning"},
    {name:"Meera, 25",city:"Bangalore",cat:"Education",     action:"taught 30 students",time:"yesterday"},
    {name:"Karthik, 21",city:"Hyderabad",cat:"Health",      action:"helped 80 patients",time:"3 days ago"},
  ];
  useEffect(()=>{const t=setInterval(()=>setAs(s=>(s+1)%stories.length),2800);return()=>clearInterval(t);},[]);
  const s=stories[as];const cc=CM[s.cat]?.color||C.green;const cl=CM[s.cat]?.lt||C.greenLt;
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:FF.b}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.28}}`}</style>
      <nav style={{padding:"1rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`,background:C.surface,position:"sticky",top:0,zIndex:50}}>
        <div style={{fontFamily:FF.d,fontSize:"1.25rem",color:C.ink}}>Volunteer<span style={{color:C.green}}>Connect</span></div>
        <div style={{display:"flex",gap:"0.65rem",alignItems:"center"}}>
          {darkToggle}
          <button onClick={()=>onRole("volunteer")} style={bO}>Find events</button>
          <button onClick={()=>onRole("handler")} style={bP}>Post an event</button>
        </div>
      </nav>
      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"4.5rem 1.5rem 3rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3.5rem",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:FF.b,fontSize:"0.7rem",fontWeight:700,color:C.green,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.9rem"}}>India's Volunteer Platform</div>
          <h1 style={{fontFamily:FF.d,fontSize:"clamp(2.2rem,4.5vw,3.3rem)",color:C.ink,lineHeight:1.15,margin:"0 0 1.4rem",fontWeight:400}}>Where good people<br/>find their cause.</h1>
          <p style={{color:C.muted,fontSize:"0.98rem",lineHeight:1.75,marginBottom:"1.9rem",maxWidth:"400px"}}>Connecting volunteers and NGOs across India — AI recommendations, live impact tracking, chat, badges, certificates, and zero paperwork.</p>
          {/* Live ticker */}
          <div style={{background:C.surface,border:`1.5px solid ${cl}`,borderRadius:"11px",padding:"0.85rem 1rem",marginBottom:"1.9rem",borderLeft:`4px solid ${cc}`,transition:"border-color 0.6s,border-left-color 0.6s"}}>
            <div style={{fontSize:"0.66rem",fontWeight:700,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.35rem"}}>Live activity</div>
            <div style={{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:cc,animation:"pulse 1.5s infinite"}}/>
              <span style={{fontFamily:FF.d,fontSize:"0.93rem",color:C.ink}}><strong>{s.name}</strong> from {s.city} {s.action}</span>
              <span style={{background:cl,color:cc,fontSize:"0.66rem",fontWeight:700,padding:"0.14rem 0.5rem",borderRadius:"12px"}}>{s.cat}</span>
              <span style={{color:C.muted,fontSize:"0.76rem"}}>{s.time}</span>
            </div>
            <div style={{display:"flex",gap:"3px",marginTop:"0.55rem"}}>
              {stories.map((_,i)=><div key={i} style={{height:"3px",flex:1,borderRadius:"2px",background:i===as?cc:C.faint,transition:"background 0.4s"}}/>)}
            </div>
          </div>
          <div style={{display:"flex",gap:"0.85rem",flexWrap:"wrap"}}>
            <button onClick={()=>onRole("volunteer")} style={{...bP,fontSize:"0.95rem",padding:"0.85rem 1.9rem"}}>I want to volunteer</button>
            <button onClick={()=>onRole("handler")} style={{...bO,fontSize:"0.95rem",padding:"0.85rem 1.9rem"}}>I run an NGO</button>
          </div>
        </div>
        {/* Impact grid */}
        <div style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"15px",padding:"1.4rem"}}>
          <div style={{fontSize:"0.7rem",fontWeight:700,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"1rem"}}>Impact across India — all time</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.45rem",marginBottom:"1rem"}}>
            {[{icon:"🌳",val:GLOBE.trees,label:"Trees planted"},{icon:"🍱",val:GLOBE.meals,label:"Meals served"},{icon:"📚",val:GLOBE.students,label:"Students taught"},{icon:"❤️",val:GLOBE.patients,label:"People helped"},{icon:"🐾",val:GLOBE.animals,label:"Animals cared"},{icon:"⛑️",val:GLOBE.families,label:"Families served"}].map(x=>(
              <div key={x.label} style={{textAlign:"center",padding:"0.65rem",background:C.faint,borderRadius:"9px"}}>
                <div style={{fontSize:"1.3rem"}}>{x.icon}</div>
                <div style={{fontFamily:FF.d,fontSize:"1.15rem",fontWeight:700,color:C.ink,margin:"0.12rem 0 0.08rem"}}>{x.val.toLocaleString("en-IN")}</div>
                <div style={{fontFamily:FF.b,fontSize:"0.63rem",color:C.muted}}>{x.label}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"0.85rem",display:"flex",justifyContent:"space-between",fontFamily:FF.b,fontSize:"0.72rem",color:C.muted}}>
            <span>🟢 {EVTS.filter(e=>e.status==="open").length} events open</span>
            <span>👥 2,400+ volunteers</span>
            <span>🏢 180+ NGOs</span>
          </div>
        </div>
      </div>
      {/* How it works */}
      <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"3.5rem 1.5rem"}}>
        <div style={{maxWidth:"840px",margin:"0 auto"}}>
          <h2 style={{fontFamily:FF.d,fontSize:"1.9rem",color:C.ink,textAlign:"center",margin:"0 0 0.4rem",fontWeight:400}}>How it works</h2>
          <p style={{textAlign:"center",color:C.muted,marginBottom:"2.5rem",fontSize:"0.88rem"}}>From sign-up to impact in under 5 minutes.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:"1.8rem"}}>
            {[{n:"01",icon:"📱",title:"Verify once",body:"Enter your number. OTP fires automatically the moment you finish typing — no button needed."},
              {n:"02",icon:"🔍",title:"Browse events",body:"AI matches events near you based on your interests and city."},
              {n:"03",icon:"🎫",title:"Join and show up",body:"Entry card, chat with organiser, zero paperwork."},
              {n:"04",icon:"📊",title:"Track impact",body:"See real numbers — meals, trees, lives. Earn badges and download certificates."}].map(s=>(
              <div key={s.n} style={{textAlign:"center"}}>
                <div style={{fontSize:"1.9rem",marginBottom:"0.55rem"}}>{s.icon}</div>
                <div style={{fontFamily:FF.b,fontSize:"0.66rem",fontWeight:700,color:C.green,letterSpacing:"0.1em",marginBottom:"0.3rem"}}>{s.n}</div>
                <div style={{fontFamily:FF.d,fontSize:"0.97rem",color:C.ink,marginBottom:"0.35rem"}}>{s.title}</div>
                <div style={{color:C.muted,fontSize:"0.81rem",lineHeight:1.6}}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"1.75rem",textAlign:"center",color:C.muted,fontFamily:FF.b,fontSize:"0.76rem"}}>Built by A.P. Raagavi · RMK College of Engineering and Technology · Made for India 🇮🇳</div>
    </div>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen({role,onLogin,onBack,darkToggle}){
  const [form,setForm]=useState({name:"",phone:"",city:"",org:"",regNo:"",interests:[]});
  const [showOTP,setShowOTP]=useState(false);
  const [errors,setErrors]=useState({});
  const validate=()=>{const e={};if(!form.name.trim())e.name="Required";if(!/^\d{10}$/.test(form.phone))e.phone="Valid 10-digit number";if(!form.city.trim())e.city="Required";if(role==="handler"&&!form.org.trim())e.org="Required";setErrors(e);return Object.keys(e).length===0;};
  const handlePhone=val=>{
    const clean=val.replace(/\D/,"");
    setForm(f=>({...f,phone:clean}));
    if(clean.length===10){
      // auto-fire OTP if name + city + (org if handler) already filled
      setTimeout(()=>{
        setForm(f=>{
          const ok=f.name.trim()&&f.city.trim()&&(role!=="handler"||f.org.trim());
          if(ok)setShowOTP(true);
          return f;
        });
      },350);
    }
  };
  const tog=cat=>setForm(f=>({...f,interests:f.interests.includes(cat)?f.interests.filter(c=>c!==cat):[...f.interests,cat]}));
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:FF.b}}>
      <div style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:"16px",padding:"2.5rem",width:"100%",maxWidth:"480px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:"0.84rem",padding:0}}>← Back</button>
          {darkToggle}
        </div>
        <div style={{fontSize:"1.9rem",marginBottom:"0.45rem"}}>{role==="volunteer"?"👐":"📋"}</div>
        <h2 style={{fontFamily:FF.d,fontSize:"1.5rem",color:C.ink,margin:"0 0 0.3rem",fontWeight:400}}>{role==="volunteer"?"Join as a volunteer":"Register your organisation"}</h2>
        <p style={{color:C.muted,fontSize:"0.86rem",margin:"0 0 1.75rem"}}>{role==="volunteer"?"Start making a difference today.":"Post events and find the right volunteers."}</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.95rem"}}>
          <Fld label="Full name *" error={errors.name}><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Priya Sharma" style={iSt(errors.name)}/></Fld>
          {role==="handler"&&<Fld label="Organisation / NGO name *" error={errors.org}><input value={form.org} onChange={e=>setForm({...form,org:e.target.value})} placeholder="e.g. HelpHands Foundation" style={iSt(errors.org)}/></Fld>}
          <Fld label="City *" error={errors.city}><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="e.g. Chennai" style={iSt(errors.city)}/></Fld>
          {/* Phone — OTP auto-fires when 10 digits entered */}
          <Fld label="Mobile number * — OTP fires automatically when you finish typing" error={errors.phone}>
            <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${errors.phone?C.red:form.phone.length===10?C.green:C.border}`,borderRadius:"8px",background:C.bg,overflow:"hidden",transition:"border-color 0.25s"}}>
              <span style={{padding:"0 0.7rem",color:C.muted,fontSize:"0.88rem",borderRight:`1px solid ${C.border}`,lineHeight:"42px"}}>+91</span>
              <input value={form.phone} onChange={e=>handlePhone(e.target.value)} placeholder="10-digit number" maxLength={10} inputMode="numeric" style={{...iSt(),...{border:"none",background:"transparent",flex:1}}}/>
              {form.phone.length===10&&<span style={{paddingRight:"0.7rem",color:C.green,fontSize:"1rem"}}>✓</span>}
            </div>
            {form.phone.length>0&&form.phone.length<10&&<p style={{color:C.muted,fontSize:"0.7rem",margin:"0.22rem 0 0"}}>{10-form.phone.length} more digits to auto-send OTP</p>}
            {form.phone.length===10&&<p style={{color:C.green,fontSize:"0.7rem",margin:"0.22rem 0 0",fontWeight:700}}>✅ OTP sent to +91 {form.phone}</p>}
          </Fld>
          {role==="volunteer"&&(
            <div>
              <label style={{fontSize:"0.8rem",fontWeight:600,color:C.ink,display:"block",marginBottom:"0.45rem"}}>Interests — helps us recommend events</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.38rem"}}>
                {CATS.map(cat=>{const m=CM[cat];const sel=form.interests.includes(cat);return <button key={cat} onClick={()=>tog(cat)} style={{background:sel?m.lt:"transparent",color:sel?m.color:C.muted,border:`1.5px solid ${sel?m.color:C.border}`,borderRadius:"20px",padding:"0.28rem 0.7rem",fontSize:"0.76rem",cursor:"pointer",fontFamily:FF.b,transition:"all 0.15s"}}>{m.icon} {cat}</button>;})}
              </div>
            </div>
          )}
          {role==="handler"&&<Fld label="Registration number (optional)"><input value={form.regNo} onChange={e=>setForm({...form,regNo:e.target.value})} placeholder="e.g. MH/2019/0012345" style={iSt()}/></Fld>}
          <button onClick={()=>{if(validate())setShowOTP(true);}} style={{...bP,padding:"0.85rem",fontSize:"0.95rem",marginTop:"0.3rem"}}>Send OTP manually →</button>
        </div>
      </div>
      {showOTP&&<OTPModal phone={form.phone} onVerified={()=>{setShowOTP(false);onLogin(form);}} onClose={()=>setShowOTP(false)}/>}
    </div>
  );
}

// ── Volunteer Dashboard ───────────────────────────────────────────────────────
function VolDash({user,events,setEvents,onLogout,darkToggle}){
  const [toast,setToast]=useState(null);
  const [joined,setJoined]=useState([]);
  const [completed,setCompleted]=useState([]);
  const [cardEv,setCardEv]=useState(null);
  const [chatEv,setChatEv]=useState(null);
  const [certEv,setCertEv]=useState(null);
  const [rateEv,setRateEv]=useState(null);
  const [filter,setFilter]=useState("All");
  const [tab,setTab]=useState("browse");
  const [view,setView]=useState("list");
  const [welcome,setWelcome]=useState(true);

  const myTasks=completed.length;
  const earned=BADGES.filter(b=>myTasks>=b.req);
  const next=BADGES.find(b=>myTasks<b.req);
  const notify=(msg,type="success")=>setToast({msg,type});

  const joinEv=id=>{
    if(joined.includes(id))return;
    setEvents(p=>p.map(e=>e.id===id?{...e,filled:Math.min(e.filled+1,e.slots),status:e.filled+1>=e.slots?"full":"open"}:e));
    setJoined(p=>[...p,id]);notify("🎉 Joined! Entry card and chat are ready. 🎫💬");
  };
  const completeEv=id=>{
    if(completed.includes(id))return;
    setCompleted(p=>[...p,id]);
    const nc=myTasks+1;const nb=BADGES.find(b=>nc===b.req);
    notify(nb?`🏅 Badge unlocked: ${nb.icon} ${nb.name}!`:"✅ Done! Rate the event to share your experience.",nb?"badge":"success");
    setTimeout(()=>{const ev=events.find(e=>e.id===id);if(ev)setRateEv(ev);},1600);
  };
  const doRate=(ev,stars)=>{
    setEvents(p=>p.map(e=>e.id===ev.id?{...e,rating:((e.rating*e.rc)+stars)/(e.rc+1),rc:e.rc+1}:e));
    setRateEv(null);notify("⭐ Thanks for rating!");
  };
  const myImpact=completed.reduce((acc,id)=>{const ev=events.find(e=>e.id===id);if(!ev)return acc;Object.entries(ev.impact).forEach(([k,v])=>{acc[k]=(acc[k]||0)+v;});return acc;},{});
  const vis=filter==="All"?events:events.filter(e=>e.category===filter);
  const tabs=["browse","badges","leaderboard","alerts","profile"];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:FF.b}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {cardEv&&<EntryCard vol={user} ev={cardEv} cardId={`VC-${user.phone}-${cardEv.id}-${Date.now().toString(36).toUpperCase()}`} onClose={()=>setCardEv(null)}/>}
      {chatEv&&<ChatModal vol={user} ev={chatEv} onClose={()=>setChatEv(null)}/>}
      {certEv&&<Certificate vol={user} ev={certEv} tasks={myTasks} onClose={()=>setCertEv(null)}/>}
      {rateEv&&<RatingModal ev={rateEv} onRate={s=>doRate(rateEv,s)} onClose={()=>setRateEv(null)}/>}
      {welcome&&<WelcomeBanner user={user} role="volunteer" onDismiss={()=>setWelcome(false)}/>}

      <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0.85rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:FF.d,fontSize:"1.15rem",color:C.ink}}>Volunteer<span style={{color:C.green}}>Connect</span></div>
        <div style={{display:"flex",alignItems:"center",gap:"1.1rem"}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.b,fontSize:"0.8rem",fontWeight:tab===t?700:400,color:tab===t?C.green:C.muted,borderBottom:tab===t?`2px solid ${C.green}`:"2px solid transparent",padding:"0.22rem 0"}}>
              {t==="browse"?"Events":t==="badges"?"Badges":t==="leaderboard"?"Leaders":t==="alerts"?"🔔 Alerts":"Profile"}
            </button>
          ))}
          {darkToggle}
          <button onClick={onLogout} style={{...bO,padding:"0.38rem 0.8rem",fontSize:"0.77rem"}}>Logout</button>
        </div>
      </header>

      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"1.75rem 1rem"}}>
        {/* Quick stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"0.65rem",marginBottom:"1.75rem"}}>
          {[["✅","Tasks done",myTasks],["🎯","Joined",joined.length],["🏅","Badges",earned.length],["📍","City",user.city]].map(([ic,l,v])=>(
            <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"0.85rem",textAlign:"center"}}>
              <div style={{fontSize:"1.25rem"}}>{ic}</div>
              <div style={{fontFamily:FF.d,fontSize:"1.25rem",fontWeight:700,color:C.ink}}>{v}</div>
              <div style={{fontSize:"0.66rem",color:C.muted}}>{l}</div>
            </div>
          ))}
        </div>

        {tab==="browse"&&(
          <>
            {myTasks>0&&(
              <div style={{background:`linear-gradient(135deg,${C.green},#173d2c)`,borderRadius:"13px",padding:"1.15rem 1.4rem",marginBottom:"1.4rem",color:"#fff"}}>
                <div style={{fontFamily:FF.b,fontSize:"0.66rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",opacity:0.6,marginBottom:"0.65rem"}}>Your personal impact</div>
                <div style={{display:"flex",gap:"1.4rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
                  {Object.entries(myImpact).map(([k,v])=>{const u=allU.find(x=>x.key===k);if(!u||!v)return null;return <div key={k} style={{textAlign:"center"}}><div style={{fontSize:"1.25rem"}}>{u.icon}</div><div style={{fontFamily:FF.d,fontSize:"1.15rem",fontWeight:700}}>{v.toLocaleString("en-IN")}</div><div style={{fontSize:"0.66rem",opacity:0.7}}>{u.label}</div></div>;})}
                </div>
                <button onClick={()=>{const ev=events.find(e=>completed.includes(e.id));if(ev)setCertEv(ev);}} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:"7px",padding:"0.38rem 0.85rem",fontFamily:FF.b,fontSize:"0.78rem",cursor:"pointer"}}>📜 View certificate</button>
              </div>
            )}
            {/* Filters + view toggle */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
              <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
                {["All",...CATS].map(cat=>{const m=CM[cat];const sel=filter===cat;return <button key={cat} onClick={()=>setFilter(cat)} style={{background:sel?(m?m.lt:C.greenLt):"transparent",color:sel?(m?m.color:C.green):C.muted,border:`1.5px solid ${sel?(m?m.color:C.green):C.border}`,borderRadius:"20px",padding:"0.26rem 0.72rem",fontSize:"0.73rem",cursor:"pointer",fontFamily:FF.b,transition:"all 0.15s"}}>{m?m.icon+" ":""}{cat}</button>;})}
              </div>
              <div style={{display:"flex",gap:"0.35rem"}}>
                {["list","map"].map(v=><button key={v} onClick={()=>setView(v)} style={{background:view===v?C.greenLt:"transparent",color:view===v?C.green:C.muted,border:`1px solid ${view===v?C.green:C.border}`,borderRadius:"6px",padding:"0.28rem 0.6rem",cursor:"pointer",fontSize:"0.78rem",fontFamily:FF.b}}>{v==="map"?"🗺 Map":"List"}</button>)}
              </div>
            </div>
            {view==="map"&&<MapView events={vis}/>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:"0.9rem"}}>
              {vis.map(ev=><EvCard key={ev.id} ev={ev} joined={joined.includes(ev.id)} completed={completed.includes(ev.id)} onJoin={joinEv} onComplete={completeEv} onCard={setCardEv} onChat={setChatEv} onRate={setRateEv} isHandler={false}/>)}
            </div>
          </>
        )}

        {tab==="badges"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",alignItems:"start"}}>
            <div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"13px",padding:"1.4rem",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 1.15rem",fontWeight:700}}>🏅 Your badges</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.9rem"}}>
                  {BADGES.map(b=>(
                    <div key={b.id} style={{textAlign:"center",opacity:myTasks>=b.req?1:0.28,transition:"opacity 0.3s"}}>
                      <div style={{fontSize:"1.9rem",filter:myTasks>=b.req?"none":"grayscale(1)",marginBottom:"0.25rem"}}>{b.icon}</div>
                      <div style={{fontFamily:FF.b,fontSize:"0.7rem",fontWeight:700,color:myTasks>=b.req?C.amber:C.muted}}>{b.name}</div>
                      <div style={{fontFamily:FF.b,fontSize:"0.61rem",color:C.muted}}>{b.desc}</div>
                    </div>
                  ))}
                </div>
                {next&&<div style={{marginTop:"1.15rem",background:C.faint,borderRadius:"9px",padding:"0.85rem"}}><div style={{fontFamily:FF.b,fontSize:"0.78rem",color:C.muted,marginBottom:"0.38rem"}}>Next: {next.icon} {next.name}</div><Bar value={myTasks} max={next.req} color={C.amber}/><div style={{fontSize:"0.7rem",color:C.muted,marginTop:"0.28rem"}}>{myTasks}/{next.req} tasks</div></div>}
              </div>
              <Streak tasks={myTasks}/>
            </div>
            <div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"13px",padding:"1.4rem",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 0.9rem",fontWeight:700}}>📊 Your impact</h3>
                {myTasks===0?<p style={{color:C.muted,fontSize:"0.86rem"}}>Complete your first event to see impact.</p>:(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                    {Object.entries(myImpact).map(([k,v])=>{const u=allU.find(x=>x.key===k);if(!u||!v)return null;return <div key={k} style={{background:C.faint,borderRadius:"8px",padding:"0.7rem",textAlign:"center"}}><div style={{fontSize:"1.35rem"}}>{u.icon}</div><div style={{fontFamily:FF.d,fontSize:"1.15rem",fontWeight:700,color:C.green}}>{v.toLocaleString("en-IN")}</div><div style={{fontSize:"0.66rem",color:C.muted}}>{u.label}</div></div>;})}
                  </div>
                )}
              </div>
              {completed.length>0&&(
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"13px",padding:"1.2rem"}}>
                  <h3 style={{fontFamily:FF.d,fontSize:"1rem",color:C.ink,margin:"0 0 0.7rem",fontWeight:700}}>📜 Certificates</h3>
                  {completed.map(id=>{const ev=events.find(e=>e.id===id);if(!ev)return null;return <div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.45rem 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontFamily:FF.b,fontSize:"0.84rem",color:C.ink}}>{ev.title}</div><button onClick={()=>setCertEv(ev)} style={{...bO,padding:"0.28rem 0.65rem",fontSize:"0.73rem"}}>View</button></div>;})}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="leaderboard"&&<Leaderboard myTasks={myTasks} userName={user.name}/>}
        {tab==="alerts"&&<Notifs/>}

        {tab==="profile"&&(
          <div style={{maxWidth:"440px"}}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"13px",padding:"1.4rem"}}>
              <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 0.9rem",fontWeight:700}}>👤 Profile</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",fontSize:"0.86rem",color:C.muted}}>
                <div><strong style={{color:C.ink}}>Name</strong> — {user.name}</div>
                <div><strong style={{color:C.ink}}>Phone</strong> — +91 {user.phone} <span style={{background:C.greenLt,color:C.green,fontSize:"0.68rem",fontWeight:700,padding:"0.1rem 0.42rem",borderRadius:"10px"}}>Verified ✅</span></div>
                <div><strong style={{color:C.ink}}>City</strong> — {user.city}</div>
                <div><strong style={{color:C.ink}}>Interests</strong> — {user.interests?.length?user.interests.join(", "):"Not set"}</div>
                <div><strong style={{color:C.ink}}>Tasks completed</strong> — {myTasks}</div>
                <div><strong style={{color:C.ink}}>Badges</strong> — {earned.map(b=>b.icon).join(" ")||"None yet"}</div>
                <div><strong style={{color:C.ink}}>Streak</strong> — {Math.min(myTasks,8)} weeks 🔥</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Handler Dashboard ─────────────────────────────────────────────────────────
function HandlerDash({user,events,setEvents,onLogout,darkToggle}){
  const [toast,setToast]=useState(null);
  const [showCreate,setShowCreate]=useState(false);
  const [impactEv,setImpactEv]=useState(null);
  const [myIds,setMyIds]=useState([]);
  const [tab,setTab]=useState("events");
  const [welcome,setWelcome]=useState(true);
  const notify=(msg,type="success")=>setToast({msg,type});
  const createEv=data=>{setEvents(p=>[data,...p]);setMyIds(p=>[data.id,...p]);setShowCreate(false);notify("🚀 Event published!");};
  const saveImpact=vals=>{setEvents(p=>p.map(e=>e.id===impactEv.id?{...e,impact:vals}:e));setImpactEv(null);notify("📊 Impact updated!");};
  const myEvs=events.filter(e=>myIds.includes(e.id));
  const totalVols=myEvs.reduce((a,e)=>a+e.filled,0);
  const myImpact=myEvs.reduce((acc,ev)=>{Object.entries(ev.impact).forEach(([k,v])=>{acc[k]=(acc[k]||0)+v;});return acc;},{});

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:FF.b}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showCreate&&<CreateEvModal user={user} onCreate={createEv} onClose={()=>setShowCreate(false)}/>}
      {impactEv&&<ImpactModal ev={impactEv} onSave={saveImpact} onClose={()=>setImpactEv(null)}/>}
      {welcome&&<WelcomeBanner user={user} role="handler" onDismiss={()=>setWelcome(false)}/>}

      <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0.85rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:FF.d,fontSize:"1.15rem",color:C.ink}}>Volunteer<span style={{color:C.green}}>Connect</span></div>
        <div style={{display:"flex",alignItems:"center",gap:"1.1rem"}}>
          {["events","analytics"].map(t=><button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.b,fontSize:"0.82rem",fontWeight:tab===t?700:400,color:tab===t?C.green:C.muted,borderBottom:tab===t?`2px solid ${C.green}`:"2px solid transparent",padding:"0.22rem 0",textTransform:"capitalize"}}>{t==="events"?"All events":"Analytics"}</button>)}
          <button onClick={()=>setShowCreate(true)} style={{...bP,padding:"0.48rem 0.95rem",fontSize:"0.83rem"}}>+ Post event</button>
          {darkToggle}
          <button onClick={onLogout} style={{...bO,padding:"0.38rem 0.8rem",fontSize:"0.77rem"}}>Logout</button>
        </div>
      </header>

      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"1.75rem 1rem"}}>
        <div style={{marginBottom:"1.75rem"}}><h2 style={{fontFamily:FF.d,fontSize:"1.5rem",color:C.ink,margin:"0 0 0.18rem",fontWeight:400}}>Welcome, {user.name.split(" ")[0]} 👋</h2><p style={{color:C.muted,fontSize:"0.86rem",margin:0}}>{user.org} · {user.city}</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.65rem",marginBottom:"1.75rem"}}>
          {[["📅","My events",myEvs.length],["👥","Volunteers",totalVols],["🟢","Open",myEvs.filter(e=>e.status==="open").length],["🔴","Full",myEvs.filter(e=>e.status==="full").length]].map(([ic,l,v])=>(
            <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"0.85rem",textAlign:"center"}}>
              <div style={{fontSize:"1.25rem"}}>{ic}</div><div style={{fontFamily:FF.d,fontSize:"1.35rem",fontWeight:700,color:C.ink}}>{v}</div><div style={{fontSize:"0.66rem",color:C.muted}}>{l}</div>
            </div>
          ))}
        </div>

        {tab==="events"&&(
          <><h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 0.9rem"}}>All events on platform</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:"0.9rem"}}>
            {events.map(ev=><EvCard key={ev.id} ev={ev} joined={false} completed={false} onJoin={()=>{}} onComplete={()=>{}} onCard={()=>{}} onChat={()=>{}} onRate={()=>{}} onImpact={setImpactEv} isHandler={true} isMine={myIds.includes(ev.id)}/>)}
          </div></>
        )}

        {tab==="analytics"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",alignItems:"start"}}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"13px",padding:"1.4rem"}}>
              <h3 style={{fontFamily:FF.d,fontSize:"1.05rem",color:C.ink,margin:"0 0 0.9rem"}}>Event fill rates</h3>
              {myEvs.length===0?<p style={{color:C.muted,fontSize:"0.86rem"}}>Post your first event to see analytics.</p>:myEvs.map(ev=>(
                <div key={ev.id} style={{marginBottom:"1rem",paddingBottom:"1rem",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.3rem"}}>
                    <span style={{fontFamily:FF.b,fontSize:"0.86rem",fontWeight:700,color:C.ink}}>{ev.title}</span>
                    {ev.rc>0&&<span style={{display:"flex",alignItems:"center",gap:"2px"}}><Stars rating={ev.rating}/><span style={{fontFamily:FF.b,fontSize:"0.68rem",color:C.muted}}>({ev.rc})</span></span>}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.71rem",color:C.muted,marginBottom:"0.28rem"}}><span>{ev.filled}/{ev.slots}</span><span>{pct(ev.filled,ev.slots)}%</span></div>
                  <Bar value={ev.filled} max={ev.slots} color={CM[ev.category]?.color||C.green}/>
                </div>
              ))}
            </div>
            <div style={{background:`linear-gradient(135deg,${C.green},#173d2c)`,borderRadius:"13px",padding:"1.4rem",color:"#fff"}}>
              <div style={{fontFamily:FF.b,fontSize:"0.66rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",opacity:0.6,marginBottom:"0.9rem"}}>Your cumulative impact</div>
              {Object.entries(myImpact).length===0?<p style={{opacity:0.6,fontSize:"0.86rem"}}>Add impact data to your events.</p>:(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem"}}>
                  {Object.entries(myImpact).map(([k,v])=>{const u=allU.find(x=>x.key===k);if(!u||!v)return null;return <div key={k} style={{textAlign:"center"}}><div style={{fontSize:"1.35rem"}}>{u.icon}</div><div style={{fontFamily:FF.d,fontSize:"1.25rem",fontWeight:700}}>{v.toLocaleString("en-IN")}</div><div style={{fontSize:"0.66rem",opacity:0.7}}>{u.label}</div></div>;})}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("landing");
  const [role,setRole]=useState(null);
  const [user,setUser]=useState(null);
  const [events,setEvents]=useState(EVTS);
  const [dark,setDark]=useState(false);
  const [,forceRender]=useState(0);

  useEffect(()=>{
    Object.assign(C, dark ? DARK : LIGHT);
    forceRender(n=>n+1);
  },[dark]);

  const goRole=r=>{setRole(r);setScreen("auth");};
  const login=form=>{setUser({...form,id:"u_"+Date.now(),role});setScreen("app");};
  const logout=()=>{setUser(null);setRole(null);setScreen("landing");};

  const darkToggle=(
    <button onClick={()=>setDark(d=>!d)} style={{
      background:"none",border:"1.5px solid "+C.border,
      borderRadius:20,padding:"4px 11px",cursor:"pointer",
      fontSize:16,color:C.ink,lineHeight:1,
    }} title={dark?"Light mode":"Dark mode"}>
      {dark?"☀️":"🌙"}
    </button>
  );

  if(screen==="landing")return <Landing onRole={goRole} darkToggle={darkToggle}/>;
  if(screen==="auth")return <AuthScreen role={role} onLogin={login} onBack={()=>setScreen("landing")} darkToggle={darkToggle}/>;
  if(role==="volunteer")return <VolDash user={user} events={events} setEvents={setEvents} onLogout={logout} darkToggle={darkToggle}/>;
  return <HandlerDash user={user} events={events} setEvents={setEvents} onLogout={logout} darkToggle={darkToggle}/>;
}
