export const example={price:360,cost:120,vat:20,costVat:20,shipping:60,shippingVat:20,shippingIncome:30,other:12,otherVat:20,rate:10,commissionVat:20,discount:10,bundleDiscount:5,bundleShipping:72,included:true,commissionIncluded:false,baseGross:true,commissionShipping:false,platform:0,platformVat:20,packaging:0,packagingVat:20,currency:'TRY',shippingMode:'fixed',bundleOverride:true,tiers:[{min:0,cost:60},{min:300,cost:72},{min:600,cost:90}]};
export function compare(input){
 const x={...example,...input};
 const percentages=['vat','costVat','shippingVat','otherVat','platformVat','packagingVat','commissionVat','rate','discount','bundleDiscount'];
 for(const k of Object.keys(example).filter(k=>typeof example[k]==='number'))if(!Number.isFinite(x[k])||x[k]<0)throw Error('invalid');
 if(x.price<=0||percentages.some(k=>x[k]>100)||!['fixed','tiers'].includes(x.shippingMode)||!['TRY','EUR','USD'].includes(x.currency))throw Error('invalid');
 if(x.shippingMode==='tiers'&&(!Array.isArray(x.tiers)||!x.tiers.length||x.tiers[0].min!==0||x.tiers.some((b,i)=>!Number.isFinite(b.min)||!Number.isFinite(b.cost)||b.min<0||b.cost<0||(i>0&&b.min<=x.tiers[i-1].min))))throw Error('tiers');
 const net=(n,v,k)=>(x[k+'Included']??x.included)?n/(1+v/100):n;
 const c=x.rate/100/(x.commissionIncluded?1+x.commissionVat/100:1);
 return [{id:'normal',q:1,d:0,ship:x.shipping,delivery:x.shippingIncome},{id:'discount',q:1,d:x.discount,ship:x.shipping,delivery:x.shippingIncome},{id:'bundle',q:2,d:x.bundleDiscount,ship:x.bundleShipping,delivery:x.shippingIncome},{id:'free',q:1,d:0,ship:x.shipping,delivery:0}].map(s=>{
 const tiered=x.shippingMode==='tiers'&&!(s.id==='bundle'&&x.bundleOverride);
 const bands=tiered?x.tiers:[{min:0,cost:s.ship}];
 const sales=x.price*s.q*(1-s.d/100),bandIndex=bands.findLastIndex(b=>sales>=b.min),band=bands[bandIndex];
 const shippingKey=s.id==='bundle'&&!tiered?'bundleShipping':'shipping';
 const shippingVat=shippingKey==='bundleShipping'?(x.bundleShippingVat??x.shippingVat):x.shippingVat;
 if(!Number.isFinite(shippingVat)||shippingVat<0||shippingVat>100)throw Error('invalid');
 const shippingNet=n=>net(n,shippingVat,shippingKey);
 const revenue=(sales+s.delivery)/(1+x.vat/100),goods=net(x.cost,x.costVat,'cost')*s.q,shipping=shippingNet(band.cost),other=net(x.other,x.otherVat,'other'),platform=net(x.platform,x.platformVat,'platform'),packaging=net(x.packaging,x.packagingVat,'packaging');
 const base=(sales+(x.commissionShipping?s.delivery:0))/(x.baseGross?1:1+x.vat/100),commission=base*c,profit=revenue-goods-shipping-other-platform-packaging-commission;
 const coefficient=1/(1+x.vat/100)-c/(x.baseGross?1:1+x.vat/100);
 const shippingContribution=s.delivery/(1+x.vat/100)-(x.commissionShipping?s.delivery*c/(x.baseGross?1:1+x.vat/100):0);
 const fixed=goods+other+platform+packaging;
 const profitableRanges=[];
 for(let i=0;i<bands.length;i++){
  const lo=bands[i].min,hi=bands[i+1]?.min??Infinity,constant=shippingContribution-fixed-shippingNet(bands[i].cost);
  if(coefficient>0){const start=Math.max(lo,-constant/coefficient,0);if(start<hi)profitableRanges.push({min:start,max:hi});}
  else if(coefficient===0&&constant>=0)profitableRanges.push({min:lo,max:hi});
  else if(coefficient<0&&coefficient*lo+constant>=0){profitableRanges.push({min:lo,max:Math.min(hi,-constant/coefficient)});}
 }
 const breakEven=profitableRanges.length?profitableRanges[0].min:null;
 const laterLoss=breakEven!==null&&bands.some(b=>b.min>breakEven&&coefficient*b.min+shippingContribution-fixed-shippingNet(b.cost)<-1e-9);
 return {...s,sales,revenue,goods,shipping,other,platform,packaging,commission,profit,unit:profit/s.q,margin:revenue?profit/revenue*100:0,breakEven,tiered,bandMin:band.min,bandMax:bands[bandIndex+1]?.min??null,shippingInput:band.cost,laterLoss,profitableRanges};
 });
}
