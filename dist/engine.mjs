export const example={price:360,cost:120,vat:20,costVat:20,shipping:60,shippingVat:20,shippingIncome:30,other:12,otherVat:20,rate:10,commissionVat:20,discount:10,bundleDiscount:5,bundleShipping:72,included:true,commissionIncluded:false,baseGross:true,commissionShipping:false};
export function compare(x){
 for(const k of Object.keys(example).filter(k=>typeof example[k]==='number'))if(!Number.isFinite(x[k])||x[k]<0)throw Error('invalid');
 if(x.price<=0||['vat','costVat','shippingVat','otherVat','commissionVat','rate','discount','bundleDiscount'].some(k=>x[k]>100))throw Error('invalid');
 const net=(n,v)=>x.included?n/(1+v/100):n;
 const c=x.rate/100/(x.commissionIncluded?1+x.commissionVat/100:1);
 return [{id:'normal',q:1,d:0,ship:x.shipping,delivery:x.shippingIncome},{id:'discount',q:1,d:x.discount,ship:x.shipping,delivery:x.shippingIncome},{id:'bundle',q:2,d:x.bundleDiscount,ship:x.bundleShipping,delivery:x.shippingIncome},{id:'free',q:1,d:0,ship:x.shipping,delivery:0}].map(s=>{
 const sales=x.price*s.q*(1-s.d/100),revenue=(sales+s.delivery)/(1+x.vat/100),goods=net(x.cost,x.costVat)*s.q,shipping=net(s.ship,x.shippingVat),other=net(x.other,x.otherVat);
 const base=(sales+(x.commissionShipping?s.delivery:0))/(x.baseGross?1:1+x.vat/100),commission=base*c,profit=revenue-goods-shipping-other-commission;
 const coefficient=1/(1+x.vat/100)-c/(x.baseGross?1:1+x.vat/100);
 const shippingContribution=s.delivery/(1+x.vat/100)-(x.commissionShipping?s.delivery*c/(x.baseGross?1:1+x.vat/100):0);
 return {...s,sales,revenue,goods,shipping,other,commission,profit,unit:profit/s.q,margin:revenue?profit/revenue*100:0,breakEven:coefficient>0?Math.max(0,(goods+shipping+other-shippingContribution)/coefficient):null};
 });
}
