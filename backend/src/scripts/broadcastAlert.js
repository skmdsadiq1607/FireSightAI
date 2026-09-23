const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// List of verified participants who sent 'join soft-peace' to Twilio sandbox
const REGISTERED_SUBSCRIBERS = [
  '+919441921812',
  '+918187057917',
  '+919949344786',
  '+918688125767',
  '+916305161612',
  '+919390083934',
  '+919392562340',
  '+919642424311',
  '+919390602742',
  '+916301561276'
];

async function broadcastAlert() {
  console.log(`[FireSight AI] Initiating Live Mass WhatsApp Broadcast to ${REGISTERED_SUBSCRIBERS.length} registered sandbox members...`);
  
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';
  
  const alertText = 
`🚨 CRITICAL NDMA DISASTER ALERT [FIRESIGHT-AI] 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 INCIDENT TELEMETRY
• Asset: Jamnagar Mega Refinery & Petrochem Complex (RIL)
• Location: Jamnagar, Gujarat (22.360°N, 69.865°E)
• Risk: CRITICAL [88/100] | Thermal: 58.4 MW FRP
• Status: DIRECT HIT (0m Inside Industrial Polygon)

🚒 TACTICAL RESPONSE DIRECTIVE
• Protocol: AR-AFFF Foam monitors. FORBID water on crude oil.
• Cooling: Automated deluge spray on adjacent LPG spheres & tanks.
• Dispatch: SDMA Emergency Desk & NDRF Battalion on Priority 1.

🛡️ MANDATORY CIVILIAN PRECAUTIONS & HEALTH ADVISORY
1. EVACUATION: 1,500m cordon downwind. Move perpendicular to wind.
2. RESPIRATORY: Wear N95/FFP2 mask or damp cloth. Plume contains toxic VOCs & benzene smoke.
3. SHELTER-IN-PLACE: If within 1.5–3.5km, seal doors/windows with wet towels. Turn OFF AC & fans.
4. WATER & FOOD: Do NOT drink open well/tank water. Use sealed bottled/boiled water only.
5. VULNERABLE CITIZENS: Move infants, elderly, pregnant women & asthma patients indoors immediately.
6. HELPLINES: Dial 112 (Police/Disaster) | 108 (Ambulance) | 1077 (District DEOC).

🔗 LIVE DOSSIER:
https://firesightai-puce.vercel.app/events/FIRMS-20260921-22.360-69.865-IND
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dispatched by FireSight AI & NDMA Emergency Network`;

  const results = [];

  for (const phone of REGISTERED_SUBSCRIBERS) {
    try {
      console.log(`-> Transmitting alert to whatsapp:${phone}...`);
      const msg = await twilio.messages.create({
        body: alertText,
        from: `whatsapp:${fromWhatsApp}`,
        to: `whatsapp:${phone}`
      });
      console.log(`   ✓ Delivered! SID: ${msg.sid}`);
      results.push({ phone, success: true, sid: msg.sid });
    } catch (err) {
      console.warn(`   ✗ Failed for ${phone}: ${err.message}`);
      results.push({ phone, success: false, error: err.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n========================================`);
  console.log(`BROADCAST COMPLETE: ${successCount} / ${REGISTERED_SUBSCRIBERS.length} Delivered`);
  console.log(`========================================`);
  return results;
}

broadcastAlert().catch(console.error);
