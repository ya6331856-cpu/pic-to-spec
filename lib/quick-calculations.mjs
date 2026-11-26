function money(value, settings = {}) {
  const locale = settings.locale || "en-IN";
  const currency = settings.currency || "INR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateQuickTool(kind, a, b, c, dob, gstMode, nowOrSettings = new Date(), extraDisplaySettings = {}) {
  const now = nowOrSettings instanceof Date ? nowOrSettings : new Date();
  const displaySettings = nowOrSettings instanceof Date
    ? extraDisplaySettings
    : nowOrSettings && typeof nowOrSettings === "object"
      ? nowOrSettings
      : {};
  const x=Number(a), y=Number(b), z=Number(c);
  if(kind!=="age"&&(!a.trim()||!b.trim()||!Number.isFinite(x)||x<0||!Number.isFinite(y)||y<0||x>1e15||y>1e15)) return "Enter valid non-negative numbers up to 1 quadrillion in both fields.";
  if(kind==="gst"&&y>100) return "GST rate must be between 0% and 100%.";
  if(kind==="emi"&&(!c.trim()||!Number.isFinite(z)||z<=0||z>100||!Number.isInteger(z*12)||x<=0||y>100)) return "Enter a loan amount above zero, an annual rate from 0% to 100%, and a tenure up to 100 years in whole-month increments.";
  if(kind==="discount"&&y>100) return "Discount must be between 0% and 100%.";
  if(kind==="percentage"&&y===0) return "The second value cannot be zero.";
  if(kind==="gst") {
    const tax=x*y/100;
    const split=gstMode==="intra"?"CGST: "+money(tax/2)+" · SGST: "+money(tax/2):"IGST: "+money(tax);
    return {main:money(tax),label:"GST amount",extra:split+" · Total including GST: "+money(x+tax)+" · Base: "+money(x)};
  }
  if(kind==="emi") {
    const n=z*12,r=y/1200,emi=r===0?x/n:x*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
    if(!Number.isFinite(emi)) return "These values are too large to calculate. Reduce the loan amount or tenure.";
    return {main:money(emi,displaySettings),label:"Estimated monthly payment",extra:"Total payment: "+money(emi*n,displaySettings)+" · Interest: "+money(emi*n-x,displaySettings)};
  }
  if(kind==="percentage") {
    const pct=x/y*100;
    if(!Number.isFinite(pct)) return "These values are too large to calculate.";
    return {main:pct.toFixed(2)+"%",label:"Percentage",extra:x+" is "+pct.toFixed(2)+"% of "+y};
  }
  if(kind==="discount") {
    const saved=x*y/100;
    return {main:money(x-saved,displaySettings),label:"Price after discount",extra:"You save "+money(saved,displaySettings)};
  }
  if(!dob) return "Select your date of birth.";
  const d=new Date(dob+"T00:00:00"),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(Number.isNaN(d.getTime())||d.getFullYear()!==Number(dob.slice(0,4))||d.getMonth()+1!==Number(dob.slice(5,7))||d.getDate()!==Number(dob.slice(8,10))||d>today) return "Choose a valid date in the past.";
  let years=today.getFullYear()-d.getFullYear(),months=today.getMonth()-d.getMonth(),days=today.getDate()-d.getDate();
  if(days<0){months--;days+=new Date(today.getFullYear(),today.getMonth(),0).getDate();}
  if(months<0){years--;months+=12;}
  return {main:years+" years",label:"Your age",extra:months+" months and "+days+" days"};
}
