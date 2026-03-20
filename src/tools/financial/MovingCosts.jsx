import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   MOVE.cost — Moving Cost Estimator (Global Edition)
   12 Regions: USA · UK · Canada · Australia · India · UAE · Singapore
              · EU · Germany · Japan · South Korea · China
   Clean Modern · JetBrains Mono + Outfit
═══════════════════════════════════════════════════════════════════ */

/* ─── REGION DATA ─────────────────────────────────────────────────── */
const REGIONS = {
  USA: {
    name: 'United States', flag: '🇺🇸', sym: '$', code: 'USD',
    distanceUnit: 'miles', weightUnit: 'lb',
    rates: {
      localPerHour: 120,     // 2 movers + truck
      ldPerLbPerMile: 0.00015,
      ldBasePerLb: 0.15,
      truckRental: { small: 29, medium: 59, large: 79 },
      fuelPerMile: 0.12,
      laborPerHr: 25,
      storage: { small: 80, medium: 150, large: 250 },
      cleaning: { studio:150, '1br':200, '2br':300, '3br':400, '4br+':550 },
      insurance: 0.03,
      heavyItem: 75, extraStop: 50, flightStairs: 75, longCarry: 100, elevator: 75,
    },
    packingBase: { studio:80, '1br':130, '2br':220, '3br':340, '4br+':500 },
    packingService: { studio:200, '1br':350, '2br':550, '3br':800, '4br+':1200 },
    homeSizes: { studio:'Studio', '1br':'1 Bedroom', '2br':'2 Bedroom', '3br':'3 Bedroom', '4br+':'4+ Bedroom' },
    localThreshold: 50,
    tips: ['Book 6–8 weeks out','Move mid-week to save 20%','Avoid end-of-month surcharges','Check USDOT number at fmcsa.dot.gov','Get binding estimate in writing'],
    avgRanges: { local:'$300–$1,500', longDistance:'$2,500–$8,000' },
  },
  UK: {
    name: 'United Kingdom', flag: '🇬🇧', sym: '£', code: 'GBP',
    distanceUnit: 'miles', weightUnit: 'kg',
    rates: {
      localPerHour: 80,
      ldPerLbPerMile: 0.00012,
      ldBasePerLb: 0.12,
      truckRental: { small: 35, medium: 65, large: 90 },
      fuelPerMile: 0.18,
      laborPerHr: 18,
      storage: { small: 60, medium: 110, large: 200 },
      cleaning: { studio:120, '1br':160, '2br':240, '3br':320, '4br+':450 },
      insurance: 0.025,
      heavyItem: 60, extraStop: 40, flightStairs: 60, longCarry: 80, elevator: 60,
    },
    packingBase: { studio:60, '1br':100, '2br':180, '3br':280, '4br+':420 },
    packingService: { studio:160, '1br':280, '2br':440, '3br':640, '4br+':960 },
    homeSizes: { studio:'Studio', '1br':'1 Bed', '2br':'2 Bed', '3br':'3 Bed', '4br+':'4+ Bed' },
    localThreshold: 40,
    tips: ['Congestion charge applies in London','Book a parking suspension permit','Check council parking rules','Use BAR (British Association of Removers) members','VAT included in most quotes'],
    avgRanges: { local:'£300–£1,200', longDistance:'£1,500–£5,000' },
  },
  Canada: {
    name: 'Canada', flag: '🇨🇦', sym: 'C$', code: 'CAD',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 130,
      ldPerLbPerMile: 0.00014,
      ldBasePerLb: 0.14,
      truckRental: { small: 35, medium: 65, large: 85 },
      fuelPerMile: 0.14,
      laborPerHr: 22,
      storage: { small: 100, medium: 170, large: 280 },
      cleaning: { studio:150, '1br':210, '2br':310, '3br':420, '4br+':580 },
      insurance: 0.03,
      heavyItem: 80, extraStop: 55, flightStairs: 80, longCarry: 100, elevator: 75,
    },
    packingBase: { studio:90, '1br':140, '2br':240, '3br':370, '4br+':540 },
    packingService: { studio:220, '1br':380, '2br':600, '3br':880, '4br+':1300 },
    homeSizes: { studio:'Bachelor/Studio', '1br':'1 Bedroom', '2br':'2 Bedroom', '3br':'3 Bedroom', '4br+':'4+ Bedroom' },
    localThreshold: 80,
    tips: ['GST/HST may apply to moving services','Winter moves need extra planning','Some movers charge fuel surcharges','Inter-provincial moves need a carrier agreement','CBSA declaration required for cross-border'],
    avgRanges: { local:'C$400–C$1,600', longDistance:'C$2,800–C$9,000' },
  },
  Australia: {
    name: 'Australia', flag: '🇦🇺', sym: 'A$', code: 'AUD',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 140,
      ldPerLbPerMile: 0.00013,
      ldBasePerLb: 0.13,
      truckRental: { small: 55, medium: 85, large: 110 },
      fuelPerMile: 0.16,
      laborPerHr: 28,
      storage: { small: 90, medium: 160, large: 280 },
      cleaning: { studio:180, '1br':250, '2br':380, '3br':500, '4br+':700 },
      insurance: 0.03,
      heavyItem: 90, extraStop: 60, flightStairs: 90, longCarry: 110, elevator: 80,
    },
    packingBase: { studio:100, '1br':160, '2br':270, '3br':420, '4br+':620 },
    packingService: { studio:250, '1br':420, '2br':660, '3br':960, '4br+':1400 },
    homeSizes: { studio:'Studio', '1br':'1 Bedroom', '2br':'2 Bedroom', '3br':'3 Bedroom', '4br+':'4+ Bedroom' },
    localThreshold: 50,
    tips: ['GST (10%) included in most quotes','Interstate moves require customs declarations for some items','AFRA member companies are accredited','Quarantine rules apply for interstate produce','Summer (Dec–Feb) is peak season'],
    avgRanges: { local:'A$500–A$2,000', longDistance:'A$3,500–A$12,000' },
  },
  India: {
    name: 'India', flag: '🇮🇳', sym: '₹', code: 'INR',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 800,
      ldPerLbPerMile: 0.0005,
      ldBasePerLb: 0.5,
      truckRental: { small: 1500, medium: 2500, large: 4000 },
      fuelPerMile: 8,
      laborPerHr: 200,
      storage: { small: 3000, medium: 6000, large: 10000 },
      cleaning: { studio:2000, '1br':3000, '2br':5000, '3br':7000, '4br+':10000 },
      insurance: 0.01,
      heavyItem: 1500, extraStop: 500, flightStairs: 1000, longCarry: 800, elevator: 500,
    },
    packingBase: { studio:1500, '1br':2500, '2br':4000, '3br':6000, '4br+':9000 },
    packingService: { studio:4000, '1br':7000, '2br':11000, '3br':16000, '4br+':24000 },
    homeSizes: { studio:'1 RK', '1br':'1 BHK', '2br':'2 BHK', '3br':'3 BHK', '4br+':'4+ BHK' },
    localThreshold: 50,
    tips: ['Compare packers & movers on Agarwal/Gati/DHL','Get GST invoice (18% GST applies)','Verify company on indiafilings.com','Avoid full payment in advance','Transit insurance highly recommended'],
    avgRanges: { local:'₹5,000–₹25,000', longDistance:'₹15,000–₹80,000' },
  },
  UAE: {
    name: 'UAE', flag: '🇦🇪', sym: 'AED', code: 'AED',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 280,
      ldPerLbPerMile: 0.0003,
      ldBasePerLb: 0.3,
      truckRental: { small: 200, medium: 350, large: 500 },
      fuelPerMile: 0.5,
      laborPerHr: 60,
      storage: { small: 300, medium: 600, large: 1000 },
      cleaning: { studio:400, '1br':600, '2br':900, '3br':1200, '4br+':1700 },
      insurance: 0.02,
      heavyItem: 300, extraStop: 150, flightStairs: 200, longCarry: 250, elevator: 150,
    },
    packingBase: { studio:250, '1br':400, '2br':650, '3br':1000, '4br+':1500 },
    packingService: { studio:600, '1br':1000, '2br':1600, '3br':2400, '4br+':3500 },
    homeSizes: { studio:'Studio', '1br':'1 BR', '2br':'2 BR', '3br':'3 BR', '4br+':'4+ BR' },
    localThreshold: 30,
    tips: ['Moving during Ramadan may affect timing','NOC from building may be required','Many buildings have dedicated moving hours (8am–5pm)','Keep passport/Emirates ID accessible','Freight forwarding needed for international moves'],
    avgRanges: { local:'AED 500–AED 3,000', longDistance:'AED 3,000–AED 15,000' },
  },
  Singapore: {
    name: 'Singapore', flag: '🇸🇬', sym: 'S$', code: 'SGD',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 120,
      ldPerLbPerMile: 0.0002,
      ldBasePerLb: 0.2,
      truckRental: { small: 80, medium: 130, large: 180 },
      fuelPerMile: 0.4,
      laborPerHr: 30,
      storage: { small: 120, medium: 220, large: 380 },
      cleaning: { studio:150, '1br':220, '2br':320, '3br':450, '4br+':650 },
      insurance: 0.025,
      heavyItem: 120, extraStop: 60, flightStairs: 100, longCarry: 100, elevator: 60,
    },
    packingBase: { studio:80, '1br':130, '2br':210, '3br':330, '4br+':490 },
    packingService: { studio:200, '1br':340, '2br':540, '3br':790, '4br+':1150 },
    homeSizes: { studio:'Studio/1-room', '1br':'2-room', '2br':'3-room', '3br':'4-room', '4br+':'5-room/EC' },
    localThreshold: 30,
    tips: ['HDB movers must finish by 5pm','Check estate agent for moving slot booking','GST (9%) applies to moving services','Aircon servicing required for rental handover','Within Singapore = all local (it\'s 50km wide!)'],
    avgRanges: { local:'S$300–S$1,500', longDistance:'S$800–S$3,000' },
  },
  EU: {
    name: 'Europe (EU)', flag: '🇪🇺', sym: '€', code: 'EUR',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 90,
      ldPerLbPerMile: 0.00011,
      ldBasePerLb: 0.11,
      truckRental: { small: 40, medium: 70, large: 95 },
      fuelPerMile: 0.20,
      laborPerHr: 20,
      storage: { small: 70, medium: 130, large: 220 },
      cleaning: { studio:130, '1br':180, '2br':270, '3br':360, '4br+':500 },
      insurance: 0.025,
      heavyItem: 70, extraStop: 45, flightStairs: 65, longCarry: 85, elevator: 65,
    },
    packingBase: { studio:70, '1br':110, '2br':190, '3br':300, '4br+':450 },
    packingService: { studio:180, '1br':310, '2br':490, '3br':720, '4br+':1080 },
    homeSizes: { studio:'Studio', '1br':'1 Bedroom', '2br':'2 Bedroom', '3br':'3 Bedroom', '4br+':'4+ Bedroom' },
    localThreshold: 50,
    tips: ['VAT rates vary by country (19–25%)','Cross-border moves need CMR waybill','Residence deregistration required in Germany/Netherlands','French déménageurs regulated by law','Schengen moves simpler than non-EU crossings'],
    avgRanges: { local:'€350–€1,400', longDistance:'€1,800–€6,500' },
  },
  Germany: {
    name: 'Germany', flag: '🇩🇪', sym: '€', code: 'EUR',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 95,
      ldPerLbPerMile: 0.00012,
      ldBasePerLb: 0.13,
      truckRental: { small: 45, medium: 75, large: 100 },
      fuelPerMile: 0.22,
      laborPerHr: 22,
      storage: { small: 80, medium: 140, large: 240 },
      cleaning: { studio:150, '1br':200, '2br':300, '3br':400, '4br+':560 },
      insurance: 0.025,
      heavyItem: 75, extraStop: 50, flightStairs: 70, longCarry: 90, elevator: 70,
    },
    packingBase: { studio:75, '1br':120, '2br':200, '3br':310, '4br+':460 },
    packingService: { studio:190, '1br':330, '2br':520, '3br':760, '4br+':1140 },
    homeSizes: { studio:'Studio/1-Zimmer', '1br':'2-Zimmer', '2br':'3-Zimmer', '3br':'4-Zimmer', '4br+':'5+ Zimmer' },
    localThreshold: 50,
    tips: [
      'Anmeldung (deregistration) required within 2 weeks of leaving',
      'Ummeldung (re-registration) required within 2 weeks of arriving',
      'Many cities require a Halteverbotszone (parking ban zone) permit — book 1 week ahead',
      'Most Umzugsunternehmen charge by the hour + truck size',
      'Check if new landlord requires Übergabeprotokoll (handover protocol)',
      'Sunday moves may be restricted in residential areas due to noise laws',
    ],
    avgRanges: { local:'€400–€1,600', longDistance:'€1,500–€5,500' },
  },
  Japan: {
    name: 'Japan', flag: '🇯🇵', sym: '¥', code: 'JPY',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 12000,
      ldPerLbPerMile: 0.05,
      ldBasePerLb: 50,
      truckRental: { small: 8000, medium: 14000, large: 20000 },
      fuelPerMile: 40,
      laborPerHr: 2500,
      storage: { small: 8000, medium: 15000, large: 28000 },
      cleaning: { studio:20000, '1br':28000, '2br':42000, '3br':58000, '4br+':80000 },
      insurance: 0.005,
      heavyItem: 8000, extraStop: 4000, flightStairs: 6000, longCarry: 7000, elevator: 5000,
    },
    packingBase: { studio:8000, '1br':13000, '2br':22000, '3br':34000, '4br+':50000 },
    packingService: { studio:20000, '1br':35000, '2br':55000, '3br':80000, '4br+':120000 },
    homeSizes: { studio:'ワンルーム (1R)', '1br':'1K/1DK', '2br':'2K/2DK', '3br':'3LDK', '4br+':'4LDK+' },
    localThreshold: 30,
    tips: [
      'Major companies (Yamato, Sakai, Art) offer fixed-price引越し (hikkoshi) packages',
      'Spring (March–April) is peak season — prices 30–50% higher during graduation/school season',
      'Genkan (entrance area) must be fully cleared before movers arrive',
      'Menko-iri system: confirm elevator reservation with building management',
      '原状回復 (genjō kaifuku) — restore rental to original condition before leaving',
      'Appliance disposal requires specific recycling fees (家電リサイクル法)',
    ],
    avgRanges: { local:'¥30,000–¥120,000', longDistance:'¥80,000–¥350,000' },
  },
  Korea: {
    name: 'South Korea', flag: '🇰🇷', sym: '₩', code: 'KRW',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 80000,
      ldPerLbPerMile: 0.3,
      ldBasePerLb: 350,
      truckRental: { small: 50000, medium: 90000, large: 130000 },
      fuelPerMile: 250,
      laborPerHr: 18000,
      storage: { small: 60000, medium: 110000, large: 190000 },
      cleaning: { studio:120000, '1br':180000, '2br':270000, '3br':370000, '4br+':520000 },
      insurance: 0.004,
      heavyItem: 50000, extraStop: 25000, flightStairs: 40000, longCarry: 45000, elevator: 30000,
    },
    packingBase: { studio:50000, '1br':80000, '2br':130000, '3br':200000, '4br+':300000 },
    packingService: { studio:130000, '1br':220000, '2br':350000, '3br':510000, '4br+':760000 },
    homeSizes: { studio:'원룸 (One-room)', '1br':'1.5룸/오피스텔', '2br':'아파트 2베드', '3br':'아파트 3베드', '4br+':'4베드+' },
    localThreshold: 30,
    tips: [
      '포장이사 (pojang-isa) = full packing service — very popular and competitively priced',
      '용달 (yongdal) = small truck + 1 driver for small/studio moves — cheapest option',
      'Book during 비수기 (off-peak): avoid March–April and August–September',
      'Most apartment complexes require advance booking of the 엘리베이터 (elevator)',
      'Hagwon/school calendars drive peak demand in February–March',
      'Check 전입신고 (jeonip-shingo) — address registration within 14 days of move',
    ],
    avgRanges: { local:'₩200,000–₩800,000', longDistance:'₩500,000–₩2,000,000' },
  },
  China: {
    name: 'China', flag: '🇨🇳', sym: '¥', code: 'CNY',
    distanceUnit: 'km', weightUnit: 'kg',
    rates: {
      localPerHour: 280,
      ldPerLbPerMile: 0.0015,
      ldBasePerLb: 1.5,
      truckRental: { small: 200, medium: 380, large: 580 },
      fuelPerMile: 1.2,
      laborPerHr: 60,
      storage: { small: 400, medium: 800, large: 1400 },
      cleaning: { studio:400, '1br':600, '2br':900, '3br':1300, '4br+':1800 },
      insurance: 0.008,
      heavyItem: 300, extraStop: 100, flightStairs: 200, longCarry: 180, elevator: 150,
    },
    packingBase: { studio:200, '1br':320, '2br':520, '3br':800, '4br+':1200 },
    packingService: { studio:500, '1br':850, '2br':1350, '3br':1980, '4br+':2960 },
    homeSizes: { studio:'单间/Studio', '1br':'一居室 (1BR)', '2br':'两居室 (2BR)', '3br':'三居室 (3BR)', '4br+':'四居室+ (4BR+)' },
    localThreshold: 30,
    tips: [
      '比较报价 — always compare at least 3 quotes on 58同城 or 搬家帮',
      'Peak seasons: before/after Spring Festival (Chinese New Year) and September',
      '户口迁移 (hukou transfer) required when moving to a new city — start early',
      'Many compounds require 搬家证 (moving permit) — get approval from property management',
      'Negotiate 打包费 (packing fee) separately — often bundled unnecessarily',
      'Long-distance moves via 物流 (logistics companies) can be cheaper than full-service movers',
    ],
    avgRanges: { local:'¥500–¥3,000', longDistance:'¥2,000–¥12,000' },
  },
};

const HOME_HOURS  = { studio:3, '1br':4, '2br':6, '3br':8, '4br+':12 };
const HOME_WEIGHT = { studio:700, '1br':1200, '2br':2200, '3br':3500, '4br+':5000 }; // kg

/* ─── CALC ENGINE ─────────────────────────────────────────────────── */
const calcCost = (region, inputs) => {
  const R = REGIONS[region].rates;
  const { homeSize, distance, moveType, movers, truckSize,
    packingSupplies, professionalPacking, storage, storageMonths,
    tipsPercent, insurance, cleaningService, utilityDeposits,
    extraStops, heavyItems, flights, longCarry, elevatorFee } = inputs;

  const isLocal = distance <= REGIONS[region].localThreshold;
  const items = [];
  const weightKg = HOME_WEIGHT[homeSize];

  if (moveType === 'professional') {
    if (isLocal) {
      const hrs  = HOME_HOURS[homeSize];
      const cost = hrs * R.localPerHour * (movers / 2);
      items.push({ label:`Professional Movers (${movers} movers × ${hrs}h)`, cost, color:'var(--acc)' });
    } else {
      const cost = weightKg * R.ldBasePerLb + distance * R.ldPerLbPerMile * weightKg;
      items.push({ label:`Long-Distance Moving (~${weightKg}kg, ${distance} ${REGIONS[region].distanceUnit})`, cost, color:'var(--acc)' });
    }
  } else if (moveType === 'diy') {
    const days   = Math.ceil(distance / 400 + 1);
    const rental = R.truckRental[truckSize] * days;
    const fuel   = distance * 2 * R.fuelPerMile * (truckSize==='large'?2:truckSize==='medium'?1.5:1);
    items.push({ label:`Truck Rental (${truckSize}, ${days}d)`, cost:rental, color:'var(--acc)' });
    items.push({ label:'Fuel', cost:fuel, color:'var(--warn)' });
  } else {
    const rental = R.truckRental[truckSize];
    const labor  = movers * HOME_HOURS[homeSize] * 0.6 * R.laborPerHr;
    const fuel   = distance * 2 * R.fuelPerMile;
    items.push({ label:`Truck Rental (${truckSize})`, cost:rental, color:'var(--acc)' });
    items.push({ label:`Day Laborers (${movers} × ${(HOME_HOURS[homeSize]*0.6).toFixed(0)}h)`, cost:labor, color:'var(--warn)' });
    items.push({ label:'Fuel', cost:fuel, color:'var(--warn)' });
  }

  if (packingSupplies)     items.push({ label:'Packing Supplies', cost:REGIONS[region].packingBase[homeSize], color:'var(--pur)' });
  if (professionalPacking) items.push({ label:'Professional Packing', cost:REGIONS[region].packingService[homeSize], color:'var(--pur)' });
  if (storage && storageMonths>0) items.push({ label:`Storage (${storageMonths}mo)`, cost:R.storage[truckSize]*storageMonths, color:'var(--gold)' });
  if (insurance)           items.push({ label:'Moving Insurance', cost:Math.max(R.heavyItem, weightKg*R.insurance*10), color:'var(--lo)' });
  if (cleaningService)     items.push({ label:'Cleaning Service', cost:R.cleaning[homeSize], color:'var(--lo)' });
  if (heavyItems>0)        items.push({ label:`Heavy Items (${heavyItems})`, cost:heavyItems*R.heavyItem, color:'var(--warn)' });
  if (extraStops>0)        items.push({ label:`Extra Stops (${extraStops})`, cost:extraStops*R.extraStop, color:'var(--warn)' });
  if (flights>0)           items.push({ label:`Stair Flights (${flights})`, cost:flights*R.flightStairs, color:'var(--warn)' });
  if (longCarry)           items.push({ label:'Long Carry Fee', cost:R.longCarry, color:'var(--warn)' });
  if (elevatorFee)         items.push({ label:'Elevator Fee', cost:R.elevator, color:'var(--warn)' });
  if (utilityDeposits>0)   items.push({ label:'Utility Deposits', cost:utilityDeposits, color:'var(--tx2)' });

  const subtotal = items.reduce((s,i)=>s+i.cost, 0);
  if (moveType!=='diy' && tipsPercent>0) {
    items.push({ label:`Tip (${tipsPercent}%)`, cost:subtotal*(tipsPercent/100), color:'var(--lo)' });
  }

  const total = items.reduce((s,i)=>s+i.cost, 0);
  return { items, total, low:total*0.82, high:total*1.28 };
};

/* ─── CHECKLIST ───────────────────────────────────────────────────── */
const CHECKLIST = {
  '8 Weeks Before': ['Research and book moving company / reserve truck','Start decluttering — sell, donate, discard','Get at least 3 quotes','Notify employer of address change','Create a moving folder for all documents'],
  '6 Weeks Before': ['Buy/collect packing supplies','Start packing non-essentials','Notify bank, utilities, subscriptions','Transfer medical, dental, school records','Arrange childcare/pet care for moving day'],
  '4 Weeks Before': ['Confirm booking with movers','Pack room by room — label every box','Photograph electronics before disconnecting','Schedule utility disconnection & connection','Measure new home doorways and furniture'],
  '2 Weeks Before': ['Pack almost everything (leave essentials)','Confirm move-day logistics','Forward mail / update postal address','Prepare tip/payment envelopes','Return borrowed items, collect lent items'],
  'Moving Day': ['Final walkthrough of every room','Take meter readings at old home','Protect floors and doorways','Keep valuables and documents with you','Check inventory as items are loaded'],
  'First Week': ['Unpack essentials box first','Check for damage and document photos','File damage claims if needed','Update ID/driving licence address','Find nearest hospital, pharmacy, shops'],
};

/* ─── STYLES ──────────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 60% 40% at 20% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 40% 30% at 85% 95%,rgba(251,146,60,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#fff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;
  --tx:#0c1f2e;--tx2:#2d5070;--tx3:#6b90aa;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:52px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:8px;backdrop-filter:blur(24px);}
.dk .topbar{background:rgba(8,11,15,.96);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,248,.96);border-bottom:1.5px solid var(--bdr);}

/* region bar */
.rbar{display:flex;overflow-x:auto;scrollbar-width:none;gap:2px;padding:6px 16px;}
.rbar::-webkit-scrollbar{display:none;}
.dk .rbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .rbar{background:var(--s2);border-bottom:1.5px solid var(--bdr);}
.rbtn{padding:5px 13px;border:none;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9.5px;
  letter-spacing:.06em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .13s;border-radius:20px;}
.dk .rbtn{background:transparent;color:var(--tx3);}
.dk .rbtn.on{background:rgba(56,189,248,.12);color:var(--acc);border:1px solid rgba(56,189,248,.25);}
.dk .rbtn:not(.on):hover{color:var(--tx2);background:rgba(56,189,248,.04);}
.lt .rbtn{background:transparent;color:var(--tx3);}
.lt .rbtn.on{background:rgba(3,105,161,.1);color:var(--acc);border:1px solid rgba(3,105,161,.2);font-weight:600;}
.lt .rbtn:not(.on):hover{color:var(--tx2);}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'JetBrains Mono',monospace;font-size:9.5px;
  letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600;}
.lt .tab{color:var(--tx3);}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 120px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:16px 18px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 2px 18px rgba(3,105,161,.06);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(56,189,248,.28);border-radius:8px;box-shadow:0 0 28px rgba(56,189,248,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(3,105,161,.22);border-radius:14px;box-shadow:0 4px 24px rgba(3,105,161,.1);}

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:500;border:none;transition:all .13s;}
.dk .btn-pri{background:var(--acc);color:#080b0f;border-radius:6px;}
.dk .btn-pri:hover{background:#7dd3fc;}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:10px;}
.lt .btn-pri:hover{background:#0284c7;}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 11px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}

.inp{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.12);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);}
.sel{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;cursor:pointer;appearance:none;transition:all .13s;}
.dk .sel{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.lt .sel{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}

.lbl{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(56,189,248,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:8px;}
.dk .sec-lbl{color:rgba(56,189,248,.3);}
.lt .sec-lbl{color:var(--acc);}

.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.7;}
.dk .hint{border:1px solid rgba(56,189,248,.14);border-radius:7px;background:rgba(56,189,248,.04);border-left:3px solid rgba(56,189,248,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(3,105,161,.14);border-radius:11px;background:rgba(3,105,161,.04);border-left:3px solid rgba(3,105,161,.3);color:var(--tx2);}

.scard{padding:10px 12px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;margin-top:6px;}
.dk .rng{background:rgba(56,189,248,.15);accent-color:var(--acc);}
.lt .rng{background:rgba(3,105,161,.15);accent-color:var(--acc);}

.chk{display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 0;}
.chk input{width:14px;height:14px;cursor:pointer;accent-color:var(--acc);}
.chk span{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);}

.cost-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;}
.dk .cost-row{border-bottom:1px solid rgba(56,189,248,.05);}
.lt .cost-row{border-bottom:1px solid rgba(3,105,161,.05);}

.task-row{display:flex;align-items:flex-start;gap:10px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:all .12s;}
.dk .task-row:hover{background:rgba(56,189,248,.04);}
.lt .task-row:hover{background:rgba(3,105,161,.04);}
.task-row.done .task-text{text-decoration:line-through;opacity:.4;}

.hist-row{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:8px;background:var(--s2);}
.dk .hist-row:hover{border-color:rgba(56,189,248,.3);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

.prose p{font-size:13px;line-height:1.85;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;margin:18px 0 7px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 14px;margin-bottom:8px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:120px;bottom:0;width:220px;z-index:300;box-shadow:4px 0 28px rgba(0,0,0,.5);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);}
  .mob-overlay.show{display:block;}
  .main{padding:10px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:560px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

const TABS = [
  { id:'estimate',  icon:'◈',  label:'Estimate' },
  { id:'compare',   icon:'⇄',  label:'DIY vs Pro' },
  { id:'checklist', icon:'⊞',  label:'Checklist' },
  { id:'regional',  icon:'🌍', label:'All Regions' },
  { id:'history',   icon:'⌛', label:'History' },
  { id:'tips',      icon:'∑',  label:'Tips' },
];

const fmtCost = (n, sym) => {
  if (!isFinite(n) || isNaN(n)) return '—';
  const r = Math.round(n);
  if (sym === '₹') {
    if (r >= 100000) return `₹${(r/100000).toFixed(1)}L`;
    if (r >= 1000)   return `₹${(r/1000).toFixed(1)}K`;
    return `₹${r.toLocaleString('en-IN')}`;
  }
  // Korean Won — no decimals, use 만(10K) / 억(100M)
  if (sym === '₩') {
    if (r >= 100000000) return `₩${(r/100000000).toFixed(1)}억`;
    if (r >= 10000)     return `₩${(r/10000).toFixed(0)}만`;
    return `₩${r.toLocaleString()}`;
  }
  // Japanese Yen / Chinese Yuan large numbers
  if (sym === '¥') {
    if (r >= 10000000) return `¥${(r/10000000).toFixed(1)}千万`;
    if (r >= 10000)    return `¥${(r/10000).toFixed(1)}万`;
    if (r >= 1000)     return `¥${(r/1000).toFixed(1)}K`;
    return `¥${r.toLocaleString()}`;
  }
  if (r >= 1000000) return `${sym}${(r/1000000).toFixed(1)}M`;
  if (r >= 1000)    return `${sym}${(r/1000).toFixed(1)}K`;
  return `${sym}${r.toLocaleString()}`;
};

export default function MovingCostEstimatorGlobal() {
  const [dark, setDark]     = useState(true);
  const [tab,  setTab]      = useState('estimate');
  const [mob,  setMob]      = useState(false);
  const [region, setRegion] = useState('USA');
  const dk = dark;

  const RG = REGIONS[region];
  const sym = RG.sym;
  const fmt = n => fmtCost(n, sym);

  /* ── Inputs ── */
  const [homeSize,            setHomeSize]            = useState('2br');
  const [distance,            setDistance]            = useState(20);
  const [moveType,            setMoveType]            = useState('professional');
  const [movers,              setMovers]              = useState(2);
  const [truckSize,           setTruckSize]           = useState('medium');
  const [packingSupplies,     setPackingSupplies]     = useState(true);
  const [professionalPacking, setProfessionalPacking] = useState(false);
  const [storage,             setStorage]             = useState(false);
  const [storageMonths,       setStorageMonths]       = useState(1);
  const [tipsPercent,         setTipsPercent]         = useState(15);
  const [insurance,           setInsurance]           = useState(true);
  const [cleaningService,     setCleaningService]     = useState(false);
  const [utilityDeposits,     setUtilityDeposits]     = useState(0);
  const [extraStops,          setExtraStops]          = useState(0);
  const [heavyItems,          setHeavyItems]          = useState(0);
  const [flights,             setFlights]             = useState(0);
  const [longCarry,           setLongCarry]           = useState(false);
  const [elevatorFee,         setElevatorFee]         = useState(false);

  const inputs = { homeSize, distance, moveType, movers, truckSize,
    packingSupplies, professionalPacking, storage, storageMonths,
    tipsPercent, insurance, cleaningService, utilityDeposits,
    extraStops, heavyItems, flights, longCarry, elevatorFee };

  const result  = useMemo(() => calcCost(region, inputs), [region, ...Object.values(inputs)]);
  const diyRes  = useMemo(() => calcCost(region, { ...inputs, moveType:'diy',  tipsPercent:0, insurance:false }), [region, homeSize, distance, truckSize]);
  const proRes  = useMemo(() => calcCost(region, { ...inputs, moveType:'professional', tipsPercent:15, insurance:true }), [region, homeSize, distance, movers]);
  const hybRes  = useMemo(() => calcCost(region, { ...inputs, moveType:'hybrid', tipsPercent:10 }), [region, homeSize, distance, truckSize, movers]);

  /* ── Checklist ── */
  const [checked, setChecked] = useState({});
  const totalTasks = Object.values(CHECKLIST).flat().length;
  const doneTasks  = Object.values(checked).filter(Boolean).length;

  /* ── History ── */
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(false);

  const saveHist = () => setHist(h => [{
    id:Date.now(), region, flag:RG.flag, sym, homeSize, distance, moveType,
    total:result.total, low:result.low, high:result.high,
    time:new Date().toLocaleTimeString()
  }, ...h].slice(0,20));

  const copyResult = () => {
    navigator.clipboard.writeText(`${RG.flag} ${RG.name} Moving Estimate\n${homeSize} · ${distance}${RG.distanceUnit} · ${moveType}\n${fmt(result.low)} – ${fmt(result.high)}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const kmRegions = ['India','Canada','Australia','EU','Germany','Japan','Korea','China','Singapore','UAE'];
  const distancePresets = region==='Singapore' ? [5,10,15,20,30,50] : kmRegions.includes(region) ? [10,25,50,100,300,500] : [5,15,30,50,200,500];

  const sideStats = [
    { label:'Mid Estimate',  val:fmt(result.total),  color:'var(--lo)' },
    { label:'Low Estimate',  val:fmt(result.low),    color:'var(--acc)' },
    { label:'High Estimate', val:fmt(result.high),   color:'var(--warn)' },
    { label:'Region',        val:`${RG.flag} ${region}`, color:'var(--pur)' },
    { label:'Currency',      val:`${sym} ${RG.code}`,color:'var(--gold)' },
    { label:'Checklist',     val:`${doneTasks}/${totalTasks}`, color:'var(--tx2)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk ? 'dk' : 'lt'}>
        <div className={`mob-overlay ${mob?'show':''}`} onClick={() => setMob(false)}/>

        {/* TOPBAR */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={() => setMob(s=>!s)} style={{ padding:'5px 9px',fontSize:14 }}>☰</button>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?6:9,background:dk?'rgba(56,189,248,.1)':'linear-gradient(135deg,#0369a1,#0ea5e9)',
              border:dk?'1px solid rgba(56,189,248,.3)':'none' }}>
              <span style={{ fontSize:14 }}>🚚</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:'var(--tx)' }}>
              MOVE<span style={{ color:'var(--acc)' }}>.cost</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginLeft:7 }}>GLOBAL</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ padding:'3px 11px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',background:'rgba(74,222,128,.07)',
            fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--lo)',fontWeight:600 }}>
            {fmt(result.low)} – {fmt(result.high)}
          </div>
          <button className="btn-ghost" onClick={copyResult} style={{ padding:'5px 9px',fontSize:10 }}>{copied?'✓':'⎘'}</button>
          <button className="btn-ghost" onClick={() => setDark(d=>!d)} style={{ padding:'5px 9px',fontSize:13 }}>{dk?'☀':'◑'}</button>
        </div>

        {/* REGION BAR */}
        <div className="rbar">
          {Object.entries(REGIONS).map(([key, r]) => (
            <button key={key} className={`rbtn ${region===key?'on':''}`} onClick={() => setRegion(key)}>
              <span>{r.flag}</span>
              <span>{key}</span>
            </button>
          ))}
        </div>

        {/* TABBAR */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className={`sidebar ${mob?'mob':''}`}>
            <div className="sec-lbl">Summary — {RG.flag} {RG.name}</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Avg Ranges ({RG.flag})</div>
            <div className="scard">
              <div className="lbl" style={{ margin:0 }}>Local Move</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--acc)' }}>{RG.avgRanges.local}</div>
            </div>
            <div className="scard">
              <div className="lbl" style={{ margin:0 }}>Long Distance</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--warn)' }}>{RG.avgRanges.longDistance}</div>
            </div>
            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ ESTIMATE ══ */}
              {tab==='estimate' && (
                <motion.div key={`est-${region}`} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:13 }}>

                  

                  {/* Region banner */}
                  <div style={{ padding:'10px 16px',borderRadius:8,display:'flex',alignItems:'center',gap:12,
                    background:dk?'rgba(56,189,248,.04)':'rgba(3,105,161,.04)',
                    border:dk?'1px solid rgba(56,189,248,.15)':'1.5px solid rgba(3,105,161,.15)' }}>
                    <span style={{ fontSize:22 }}>{RG.flag}</span>
                    <div>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)' }}>{RG.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                        {sym} {RG.code} · Distance in {RG.distanceUnit} · Weight in {RG.weightUnit}
                      </div>
                    </div>
                    <div style={{ flex:1 }}/>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>Market Range</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--acc)' }}>{RG.avgRanges.local}</div>
                    </div>
                  </div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:13 }} className="g2">
                    {/* Inputs */}
                    <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                      <div className="panel" style={{ padding:'17px 19px',display:'flex',flexDirection:'column',gap:11 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,letterSpacing:'.06em',color:'var(--tx)' }}>MOVE DETAILS</div>

                        <div>
                          <div className="lbl">Home Size</div>
                          <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
                            {Object.entries(RG.homeSizes).map(([k,l]) => (
                              <button key={k} className={`btn-ghost ${homeSize===k?'on':''}`} onClick={() => setHomeSize(k)} style={{ fontSize:8.5 }}>{l}</button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="lbl">Distance — {distance} {RG.distanceUnit}</div>
                          <input className="inp" type="number" value={distance} onChange={e => setDistance(+e.target.value)} min={1} style={{ marginBottom:0 }}/>
                          <input className="rng" type="range" min={1} max={region==='Singapore'?50:1500} step={region==='Singapore'?1:5} value={distance} onChange={e => setDistance(+e.target.value)}/>
                          <div style={{ display:'flex',gap:4,marginTop:6,flexWrap:'wrap' }}>
                            {distancePresets.map(v => (
                              <button key={v} className={`btn-ghost ${distance===v?'on':''}`} onClick={() => setDistance(v)} style={{ fontSize:8 }}>{v}</button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="lbl">Move Type</div>
                          <div style={{ display:'flex',gap:6 }}>
                            {[['professional','Professional'],['hybrid','Hybrid'],['diy','DIY']].map(([v,l]) => (
                              <button key={v} className={`btn-ghost ${moveType===v?'on':''}`} onClick={() => setMoveType(v)} style={{ fontSize:8.5 }}>{l}</button>
                            ))}
                          </div>
                        </div>

                        {moveType !== 'professional' && (
                          <div>
                            <div className="lbl">Truck Size</div>
                            <div style={{ display:'flex',gap:5 }}>
                              {[['small','Small'],['medium','Medium'],['large','Large']].map(([v,l]) => (
                                <button key={v} className={`btn-ghost ${truckSize===v?'on':''}`} onClick={() => setTruckSize(v)} style={{ fontSize:8.5 }}>{l}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {moveType !== 'diy' && (
                          <div>
                            <div className="lbl">Movers — {movers}</div>
                            <input className="rng" type="range" min={2} max={6} step={1} value={movers} onChange={e => setMovers(+e.target.value)} style={{ marginTop:0 }}/>
                            <div style={{ display:'flex',gap:4,marginTop:5 }}>
                              {[2,3,4,5,6].map(v => (
                                <button key={v} className={`btn-ghost ${movers===v?'on':''}`} onClick={() => setMovers(v)} style={{ fontSize:8 }}>{v}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add-ons */}
                      <div className="panel" style={{ padding:'17px 19px',display:'flex',flexDirection:'column',gap:7 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,letterSpacing:'.06em',color:'var(--tx)' }}>ADD-ONS</div>
                        {[
                          [packingSupplies,setPackingSupplies,'Packing Supplies'],
                          [professionalPacking,setProfessionalPacking,'Professional Packing'],
                          [insurance,setInsurance,'Moving Insurance'],
                          [cleaningService,setCleaningService,'Cleaning Service'],
                          [longCarry,setLongCarry,'Long Carry Fee'],
                          [elevatorFee,setElevatorFee,'Elevator Fee'],
                        ].map(([val,setter,label],i) => (
                          <label key={i} className="chk">
                            <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)}/>
                            <span>{label}</span>
                          </label>
                        ))}
                        <label className="chk" style={{ marginTop:3 }}>
                          <input type="checkbox" checked={storage} onChange={e => setStorage(e.target.checked)}/>
                          <span>Storage Unit</span>
                        </label>
                        {storage && (
                          <div style={{ marginLeft:22 }}>
                            <div className="lbl" style={{ fontSize:7.5 }}>Months — {storageMonths}</div>
                            <input className="rng" type="range" min={1} max={12} value={storageMonths} onChange={e => setStorageMonths(+e.target.value)} style={{ marginTop:0 }}/>
                          </div>
                        )}
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:4 }}>
                          {[
                            { label:'Heavy Items', val:heavyItems, setter:setHeavyItems },
                            { label:'Extra Stops', val:extraStops, setter:setExtraStops },
                            { label:'Stair Flights',val:flights,   setter:setFlights },
                            { label:`Utility Dep (${sym})`,val:utilityDeposits,setter:setUtilityDeposits },
                          ].map((s,i) => (
                            <div key={i}>
                              <div className="lbl" style={{ fontSize:7.5 }}>{s.label}</div>
                              <input className="inp" type="number" value={s.val} onChange={e => s.setter(+e.target.value)} min={0} style={{ padding:'5px 9px',fontSize:11 }}/>
                            </div>
                          ))}
                        </div>
                        {moveType !== 'diy' && (
                          <div style={{ marginTop:4 }}>
                            <div className="lbl">Tip — {tipsPercent}%</div>
                            <div style={{ display:'flex',gap:4 }}>
                              {[0,10,15,20,25].map(v => (
                                <button key={v} className={`btn-ghost ${tipsPercent===v?'on':''}`} onClick={() => setTipsPercent(v)} style={{ fontSize:8 }}>{v}%</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Results */}
                    <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                      <div className="panel-hi" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:12 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:11,letterSpacing:'.08em',color:'var(--tx3)',textTransform:'uppercase' }}>
                          {RG.flag} Estimated Cost
                        </div>
                        <div style={{ display:'flex',alignItems:'baseline',gap:10 }}>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:34,color:'var(--lo)' }}>{fmt(result.total)}</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>mid-range</div>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)' }}>
                          Range: <span style={{ color:'var(--acc)' }}>{fmt(result.low)}</span> — <span style={{ color:'var(--warn)' }}>{fmt(result.high)}</span>
                        </div>
                        <div style={{ height:6,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                          <motion.div style={{ height:'100%',background:'linear-gradient(90deg,var(--acc),var(--lo),var(--warn))',borderRadius:3 }}
                            initial={{ opacity:0 }} animate={{ opacity:1 }} key={region}/>
                        </div>
                        <button className="btn-ghost" onClick={saveHist} style={{ alignSelf:'flex-start',fontSize:8 }}>⊕ Save Estimate</button>
                      </div>

                      {/* Breakdown */}
                      <div className="panel" style={{ padding:'16px 18px',maxHeight:340,overflowY:'auto' }}>
                        <div className="lbl" style={{ marginBottom:9 }}>Cost Breakdown</div>
                        {result.items.map((item,i) => (
                          <motion.div key={i} className="cost-row"
                            initial={{ opacity:0,x:6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx2)',flex:1,paddingRight:8 }}>{item.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:item.color,flexShrink:0 }}>{fmt(item.cost)}</span>
                          </motion.div>
                        ))}
                        <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10,marginTop:4,borderTop:'1px solid var(--bdr)' }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',letterSpacing:'.1em' }}>TOTAL</span>
                          <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:'var(--lo)' }}>{fmt(result.total)}</span>
                        </div>
                      </div>

                      {/* Region tips */}
                      <div className="panel" style={{ padding:'14px 16px' }}>
                        <div className="lbl" style={{ marginBottom:8 }}>{RG.flag} Local Tips</div>
                        {RG.tips.map((t,i) => (
                          <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx2)',padding:'3px 0',
                            borderBottom:i<RG.tips.length-1?'1px solid var(--bdr)':'none',display:'flex',gap:7,alignItems:'flex-start' }}>
                            <span style={{ color:'var(--lo)',flexShrink:0 }}>→</span>{t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══ DIY VS PRO ══ */}
              {tab==='compare' && (
                <motion.div key={`cmp-${region}`} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:13 }}>
                  <div className="hint"><span>⇄</span><span>{RG.flag} Comparing move types for {RG.homeSizes[homeSize]} · {distance} {RG.distanceUnit}</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:11 }} className="g3">
                    {[
                      { label:'DIY', res:diyRes, color:'var(--lo)', pros:['Lowest cost','Full control','Flexible timing'], cons:['Physical effort','Damage risk','No insurance'] },
                      { label:'Hybrid', res:hybRes, color:'var(--warn)', pros:['Mid-range cost','Less physical work','Flexible'], cons:['Coordination needed','Still rent truck'] },
                      { label:'Professional', res:proRes, color:'var(--acc)', pros:['Least stress','Insured','Efficient'], cons:['Most expensive','Less flexible'] },
                    ].map((s,i) => (
                      <motion.div key={i} className={`panel ${moveType===s.label.toLowerCase()?'panel-hi':''}`}
                        style={{ padding:'16px 18px',borderTop:`3px solid ${s.color}` }}
                        initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.08 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,color:s.color,marginBottom:2 }}>{s.label}</div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:24,color:s.color,margin:'8px 0 2px' }}>{fmt(s.res.total)}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',marginBottom:10 }}>
                          {fmt(s.res.low)} – {fmt(s.res.high)}
                        </div>
                        <div style={{ height:4,background:'var(--bdr)',borderRadius:2,overflow:'hidden',marginBottom:12 }}>
                          <motion.div style={{ height:'100%',borderRadius:2,background:s.color }}
                            initial={{ width:0 }}
                            animate={{ width:`${(s.res.total/Math.max(diyRes.total,proRes.total,hybRes.total))*100}%` }}
                            transition={{ duration:0.7,delay:i*.1 }}/>
                        </div>
                        {s.pros.map((p,j) => <div key={j} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--lo)',padding:'2px 0' }}>✓ {p}</div>)}
                        <div style={{ marginTop:4 }}>
                          {s.cons.map((c,j) => <div key={j} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--er)',padding:'2px 0' }}>✗ {c}</div>)}
                        </div>
                        <button className="btn-ghost" style={{ width:'100%',marginTop:10,fontSize:8.5 }}
                          onClick={() => { setMoveType(s.label.toLowerCase()); setTab('estimate'); }}>
                          Use This →
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ CHECKLIST ══ */}
              {tab==='checklist' && (
                <motion.div key="chk" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:13 }}>
                  <div className="panel-hi" style={{ padding:'14px 18px',display:'flex',alignItems:'center',gap:14 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                        <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)' }}>Moving Checklist</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--acc)' }}>{doneTasks}/{totalTasks}</span>
                      </div>
                      <div style={{ height:7,background:'var(--bdr)',borderRadius:4,overflow:'hidden' }}>
                        <motion.div style={{ height:'100%',borderRadius:4,background:'var(--lo)' }}
                          animate={{ width:`${(doneTasks/totalTasks)*100}%` }} transition={{ duration:0.4 }}/>
                      </div>
                    </div>
                    <button className="btn-ghost" onClick={() => setChecked({})} style={{ fontSize:8 }}>✕ Reset</button>
                  </div>
                  {Object.entries(CHECKLIST).map(([phase, tasks]) => (
                    <div key={phase} className="panel" style={{ padding:'14px 18px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:'var(--tx)' }}>{phase}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                          {tasks.filter(t => checked[`${phase}::${t}`]).length}/{tasks.length}
                        </div>
                      </div>
                      {tasks.map((task,i) => {
                        const key = `${phase}::${task}`;
                        const done = checked[key];
                        return (
                          <div key={i} className={`task-row ${done?'done':''}`} onClick={() => setChecked(c => ({ ...c, [key]:!c[key] }))}>
                            <div style={{ width:15,height:15,borderRadius:3,flexShrink:0,marginTop:1,display:'flex',alignItems:'center',justifyContent:'center',
                              background:done?'var(--lo)':'transparent',
                              border:done?'none':dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)' }}>
                              {done && <span style={{ fontSize:9,color:dk?'#080b0f':'#fff',fontWeight:700 }}>✓</span>}
                            </div>
                            <span className="task-text" style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'var(--tx2)',lineHeight:1.5 }}>{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══ ALL REGIONS ══ */}
              {tab==='regional' && (
                <motion.div key="reg" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:13 }}>
                  <div className="hint"><span>🌍</span><span>Same {RG.homeSizes[homeSize]} home, {distance} {RG.distanceUnit} move — estimated cost across all 8 regions. Adjust home size and distance in the Estimate tab.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:11 }} className="g2">
                    {Object.entries(REGIONS).map(([key, r]) => {
                      const res = calcCost(key, inputs);
                      const isActive = key === region;
                      return (
                        <motion.div key={key} className={isActive ? 'panel-hi' : 'panel'}
                          style={{ padding:'16px 18px',cursor:'pointer',transition:'all .15s',borderLeft:isActive?`3px solid var(--acc)`:undefined }}
                          onClick={() => setRegion(key)}
                          whileHover={{ scale:1.01 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                            <span style={{ fontSize:20 }}>{r.flag}</span>
                            <div>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:isActive?'var(--acc)':'var(--tx)' }}>{r.name}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>{r.sym} {r.code}</div>
                            </div>
                            <div style={{ flex:1 }}/>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:'var(--lo)' }}>{fmtCost(res.total, r.sym)}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>
                                {fmtCost(res.low,r.sym)} – {fmtCost(res.high,r.sym)}
                              </div>
                            </div>
                          </div>
                          {/* Bar relative to max */}
                          <div style={{ height:4,background:'var(--bdr)',borderRadius:2,overflow:'hidden' }}>
                            <motion.div style={{ height:'100%',borderRadius:2,background:isActive?'var(--acc)':'var(--tx3)',opacity:isActive?1:0.4 }}
                              initial={{ width:0 }}
                              animate={{ width:`${Math.min(100,(res.total/15000)*100)}%` }}
                              transition={{ duration:0.7 }}/>
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:5 }}>
                            Local avg: {r.avgRanges.local}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab==='history' && (
                <motion.div key="hst" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:9 }}>
                  <div className="hint"><span>⌛</span><span>Session-only history. Click any row to restore those settings.</span></div>
                  {hist.length===0
                    ? <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>No saved estimates yet.</div>
                    : hist.map((h,i) => (
                        <motion.div key={h.id} className="hist-row"
                          initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}
                          onClick={() => { setRegion(h.region); setHomeSize(h.homeSize); setDistance(h.distance); setMoveType(h.moveType); setTab('estimate'); }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:2 }}>
                              {h.flag} {h.region} · {h.homeSize.toUpperCase()} · {h.distance} · {h.moveType}
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{h.time}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:17,color:'var(--lo)' }}>{fmtCost(h.total,h.sym)}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>{fmtCost(h.low,h.sym)}–{fmtCost(h.high,h.sym)}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length>0 && <button className="btn-ghost" onClick={() => setHist([])} style={{ alignSelf:'flex-start',marginTop:4 }}>✕ Clear</button>}
                  
                </motion.div>
              )}

              {/* ══ TIPS ══ */}
              {tab==='tips' && (
                <motion.div key={`tips-${region}`} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'24px 28px',marginBottom:13 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:24,color:'var(--tx)',marginBottom:3 }}>
                      {RG.flag} Moving Guide — {RG.name}
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:20,letterSpacing:'.12em' }}>
                      LOCAL TIPS · PRICING · BEST PRACTICES
                    </div>

                    {/* Region-specific tips */}
                    <div style={{ marginBottom:20 }}>
                      <div className="lbl" style={{ marginBottom:10 }}>Region-Specific Tips</div>
                      {RG.tips.map((t,i) => (
                        <div key={i} style={{ display:'flex',gap:9,padding:'8px 0',borderBottom:i<RG.tips.length-1?'1px solid var(--bdr)':'none' }}>
                          <span style={{ color:'var(--lo)',fontFamily:"'JetBrains Mono',monospace",fontSize:11,flexShrink:0 }}>→</span>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)',lineHeight:1.6 }}>{t}</span>
                        </div>
                      ))}
                    </div>

                    <div className="prose">
                      <h3>Universal Moving Tips</h3>
                      <p><strong>Book early:</strong> 6–8 weeks for local, 8–12 weeks for long-distance moves. Peak season (summer, end of month) means higher prices and limited availability. Moving mid-week is typically cheaper than weekends.</p>
                      <p><strong>Declutter first:</strong> Every item you don't move saves time and money. Sell on local marketplaces, donate to charities, or arrange a collection. Weight-based long-distance quotes become significantly cheaper with less stuff.</p>
                      <p><strong>Get multiple quotes:</strong> Always compare at least 3 movers. Ask for in-home surveys rather than phone estimates — accuracy matters. Check for hidden fees: fuel surcharges, stair fees, long carry fees, and insurance.</p>
                      <h3>Packing Smart</h3>
                      <p>Pack room by room and label every box on its sides, not the top (you'll stack them). Use wardrobe boxes for hanging clothes. Pack books in small boxes only — they're heavy. Use towels and bedding to wrap fragile items.</p>
                      {[
                        { q:'What is a typical tip for movers?', a:`In ${RG.name}: Generally 10–20% of the total cost for good service, paid in cash directly to the crew at the end of the move. For long-distance moves or exceptionally large jobs, tipping per person (${sym}20–${sym}50 per mover) is common.` },
                        { q:'Should I buy moving insurance?', a:'Basic carrier liability is included but covers very little (often per-kilogram, not replacement value). For electronics, antiques, or high-value items, full-value protection or third-party insurance is worth the cost. Document everything with photos before packing.' },
                        { q:'How do I avoid moving scams?', a:'Red flags: unusually low quotes, large upfront cash deposits, no physical address, unmarked trucks, refusal to provide written contracts. Always check for accreditation, read reviews on multiple platforms, and get everything in writing before handing over any payment.' },
                      ].map(({ q, a },i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--tx)',marginBottom:4 }}>{q}</div>
                          <div style={{ fontSize:12.5,color:'var(--tx2)',lineHeight:1.8 }}>{a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}