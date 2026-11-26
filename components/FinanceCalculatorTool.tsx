"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import { useCountrySettings } from "@/components/CountrySelector";
import { calculateSIP, calculateFixedDeposit, calculateRecurringDeposit, calculateProfit, calculateHourlyRate, calculateInterest } from "@/lib/finance-calculators.mjs";

type Kind = "sip" | "fd-rd" | "profit" | "freelance" | "interest";
const inputStyle: React.CSSProperties = { width: "100%", padding: 13, border: "1px solid #d7e3dc", borderRadius: 10, color: "#17251e", background: "#fff", fontSize: 15 };
const buttonStyle: React.CSSProperties = { border: 0, borderRadius: 10, background: "#14634b", color: "#fff", padding: "13px 18px", fontWeight: 800, cursor: "pointer" };
const secondaryStyle: React.CSSProperties = { border: "1px solid #d5e4da", borderRadius: 10, background: "#f2f8f3", color: "#14634b", padding: "11px 15px", fontWeight: 700, cursor: "pointer" };
const descriptions: Record<Kind,string> = {
  sip: "Estimate the future value of monthly mutual fund investments using an assumed annual return rate.",
  "fd-rd": "Estimate fixed deposit maturity or recurring deposit value with clear compounding assumptions.",
  profit: "Calculate business profit, profit margin and markup from cost and selling price.",
  freelance: "Estimate a freelance hourly rate from your income goal, business expenses, billable hours and tax estimate.",
  interest: "Compare simple interest with compound interest using your principal, annual rate and investment period."
};
const titles: Record<Kind,string> = { sip:"SIP Calculator", "fd-rd":"FD & RD Calculator", profit:"Profit Margin & Markup Calculator", freelance:"Freelance Hourly Rate Calculator", interest:"Simple & Compound Interest Calculator" };
export default function FinanceCalculatorTool({kind}:{kind:Kind}) {
  const [values,setValues] = useState<Record<string,string>>({amount:"5000",rate:"12",years:"10",cost:"80",selling:"100",monthlyIncome:"3000",expenses:"500",hours:"20",tax:"20",frequency:"4"});
  const [mode,setMode] = useState<"fd"|"rd">("fd");
  const { country } = useCountrySettings();
  const currency = country.currency;
  const [result,setResult] = useState<Record<string,number|null>|null>(null);
  const [error,setError] = useState("");
  const set=(key:string,value:string)=>{setValues(old=>({...old,[key]:value}));setResult(null);setError("");};
  const number=(key:string)=>Number(values[key]);
  const money=(n:number|null|undefined)=>n===null||n===undefined?"—":new Intl.NumberFormat(country.locale,{style:"currency",currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
  function calculate(){
    setError("");setResult(null);
    try {
      let data: Record<string,number|null>;
      if(kind==="sip") { const r=calculateSIP(number("amount"),number("rate"),number("years")); data={invested:r.invested,estimatedValue:r.estimatedValue,estimatedReturns:r.estimatedReturns,months:r.months}; }
      else if(kind==="fd-rd"&&mode==="fd") { const r=calculateFixedDeposit(number("amount"),number("rate"),number("years"),number("frequency")); data={principal:r.principal,maturityValue:r.maturityValue,interestEarned:r.interestEarned}; }
      else if(kind==="fd-rd") { const r=calculateRecurringDeposit(number("amount"),number("rate"),number("years")); data={invested:r.invested,maturityValue:r.maturityValue,interestEarned:r.interestEarned,months:r.months}; }
      else if(kind==="profit") { const r=calculateProfit(number("cost"),number("selling")); data={cost:r.cost,sellingPrice:r.sellingPrice,profit:r.profit,marginPercent:r.marginPercent,markupPercent:r.markupPercent}; }
      else if(kind==="freelance") { const r=calculateHourlyRate(number("monthlyIncome"),number("expenses"),number("hours"),number("tax")); data={annualBillableHours:r.annualBillableHours,requiredAnnualRevenue:r.requiredAnnualRevenue,hourlyRate:r.hourlyRate}; }
      else { const r=calculateInterest(number("amount"),number("rate"),number("years"),number("frequency")); data={simpleInterest:r.simpleInterest,simpleTotal:r.simpleTotal,compoundInterest:r.compoundInterest,compoundTotal:r.compoundTotal}; }
      setResult(data);
    } catch(e) { setError(e instanceof Error?e.message:"Please check the values and try again."); }
  }
  const field=(label:string,key:string,placeholder?:string)=><label style={{display:"grid",gap:7,fontWeight:700,color:kind==="profit"?"#fff":"#24372e"}}>{label}<input type="number" min="0" step="any" value={values[key]||""} onChange={e=>set(key,e.target.value)} placeholder={placeholder||"Enter value"} style={inputStyle}/></label>;
  const outputLabels: Record<string,string> = {invested:"Total amount invested",estimatedValue:"Estimated future value",estimatedReturns:"Estimated returns",months:"Number of monthly deposits",principal:"Principal amount",maturityValue:"Estimated maturity value",interestEarned:"Estimated interest earned",cost:"Cost price",sellingPrice:"Selling price",profit:"Profit / loss",marginPercent:"Profit margin",markupPercent:"Markup",annualBillableHours:"Billable hours per year",requiredAnnualRevenue:"Required annual revenue",hourlyRate:"Suggested hourly rate",simpleInterest:"Simple interest",simpleTotal:"Total with simple interest",compoundInterest:"Compound interest",compoundTotal:"Total with compound interest"};
  const percentKeys=["marginPercent","markupPercent"];
  return <main style={{maxWidth:980,margin:"32px auto",padding:20,color:"#17251e"}}>
    <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
    <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:32}}>FREE ONLINE CALCULATOR</p>
    <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.2,margin:"10px 0"}}>{titles[kind]}</h1>
    <p style={{color:"#46556b",lineHeight:1.7,maxWidth:760}}>{descriptions[kind]}</p>
    <section style={{marginTop:22,padding:20,border:"1px solid #e0e9e3",borderRadius:16,background:kind==="profit"?"#17372b":"#fff",boxShadow:"0 8px 28px rgba(20,60,40,.05)"}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"end",marginBottom:18}}>
        <div style={{display:"grid",gap:4,fontWeight:700,color:kind==="profit"?"#fff":"#24372e"}}><span>Selected currency</span><strong>{country.currency}</strong><small style={{fontWeight:500,opacity:.75}}>Based on the country setting above. No exchange-rate conversion is applied.</small></div>
        {kind==="fd-rd"&&<label style={{display:"grid",gap:7,fontWeight:700,color:"#24372e"}}>Deposit type<select value={mode} onChange={e=>{setMode(e.target.value as "fd"|"rd");setResult(null);}} style={inputStyle}><option value="fd">Fixed Deposit (FD)</option><option value="rd">Recurring Deposit (RD)</option></select></label>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:14}}>
        {kind==="profit"?<>{field("Cost price", "cost")}{field("Selling price", "selling")}</>:kind==="freelance"?<>{field("Target monthly take-home income","monthlyIncome")}{field("Monthly business expenses","expenses")}{field("Billable hours per week","hours")}{field("Estimated tax rate (%)","tax")}</>:<>{field(kind==="fd-rd"&&mode==="rd"?"Monthly deposit amount":"Investment / deposit amount","amount")}{field("Expected annual rate (%)","rate")}{field("Duration (years)","years")}</>}
        {(kind==="interest"||(kind==="fd-rd"&&mode==="fd"))&&<label style={{display:"grid",gap:7,fontWeight:700,color:"#24372e"}}>Compounding frequency<select value={values.frequency} onChange={e=>set("frequency",e.target.value)} style={inputStyle}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></label>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:18}}><button type="button" onClick={calculate} style={buttonStyle}>Calculate now →</button><button type="button" onClick={()=>{setValues({amount:"5000",rate:"12",years:"10",cost:"80",selling:"100",monthlyIncome:"3000",expenses:"500",hours:"20",tax:"20",frequency:"4"});setMode("fd");setResult(null);setError("");}} style={secondaryStyle}>Reset</button></div>
      {error&&<p role="alert" style={{color:"#b42318",marginTop:14}}>{error}</p>}
      {result&&<section aria-live="polite" style={{marginTop:22,padding:18,borderRadius:12,background:"#eef8f1",border:"1px solid #cce8d5"}}><h2 style={{fontSize:20,margin:"0 0 12px"}}>Your estimate</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,190px),1fr))",gap:12}}>{Object.entries(result).map(([key,value])=><div key={key} style={{background:"#fff",padding:13,borderRadius:9}}><small style={{display:"block",color:"#52665b",marginBottom:6}}>{outputLabels[key]||key}</small><strong style={{fontSize:19,color:"#145b42"}}>{percentKeys.includes(key)?(value===null?"—":Number(value).toFixed(2)+"%"):key==="months"||key==="annualBillableHours"?String(value):money(value)}</strong></div>)}</div></section>}
    </section>
    <p style={{fontSize:12,color:"#68786f",lineHeight:1.7,marginTop:16}}>Estimates only. Actual returns, rates, fees, taxes and compounding rules depend on the financial institution, product and applicable laws. This calculator does not provide investment, tax or financial advice.</p>
    <section className="tool-content"><h2>How to use the {titles[kind]}</h2><ol><li>Enter the amount, rate and duration or the business figures requested above.</li><li>Choose the available options and select Calculate now.</li><li>Review the estimate and compare it with the terms from your bank, provider or accountant.</li></ol><h3>Calculation assumptions</h3>
      {kind==="sip"?<p>The SIP estimate assumes equal contributions at the end of each month and a constant nominal annual return divided into monthly periods. Actual mutual fund returns are market-linked, variable and not guaranteed. Taxes and fund expenses are not included.</p>:kind==="fd-rd"?<p>FD uses the selected compounding frequency. RD is an approximate estimate using monthly compounding and month-end deposits; actual bank RD maturity values can differ because institutions may apply quarterly compounding, rounding and product-specific rules. Check the bank's official maturity quote before investing.</p>:kind==="profit"?<p>Profit or loss is selling price minus cost price. Profit margin divides profit by selling price; markup divides profit by cost price. These percentages are different and do not include overheads, tax, shipping or other business costs unless you include them in cost.</p>:kind==="freelance"?<p>The suggested hourly rate annualizes your monthly income goal and expenses, adjusts for the estimated tax percentage, then divides by annual billable hours (52 weeks). It does not automatically account for unpaid leave, non-billable admin time, insurance, platform fees or currency conversion.</p>:<p>Simple interest is calculated on the original principal. Compound interest applies the selected compounding frequency. The calculator assumes the stated annual rate stays constant for the full period and excludes fees and taxes.</p>}
      <h3>Frequently asked questions</h3><details><summary>Are these results guaranteed?</summary><p>No. They are mathematical estimates based on the values and assumptions you enter. Verify actual product terms with the provider.</p></details><details><summary>Are my figures uploaded?</summary><p>No. The calculations run in your browser; the values are not sent to a PicToSpec calculation server.</p></details><details><summary>How is the currency chosen?</summary><p>Currency follows the country selected in the Country & format setting. This changes formatting only; it does not convert exchange rates.</p></details>
    </section>
  </main>;
}
