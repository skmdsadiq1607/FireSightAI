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
• Target: Jamnagar Mega Refinery & Petrochem Complex (RIL)
• Location: Jamnagar, Gujarat (22.360°N, 69.865°E)
• Severity: CRITICAL [88/100 Risk Score]
• Thermal Radiance: 58.4 MW FRP | VIIRS Satellite Sensor
• Containment: DIRECT HIT (0m Inside Polygon)

🚒 TACTICAL RESPONSE DIRECTIVE
• Threat: Rapid Hydrocarbon / Chemical Excursion
• Suppression Protocol: Alcohol-Resistant AFFF Foam (AR-AFFF) monitors. STRICTLY FORBID plain water on crude oil pools.
• Cooling Action: Activate automated water cooling sprays on adjacent LPG spheres & storage tanks.
• Inter-Agency Dispatch: SDMA Emergency Desk & NDRF Battalion mobilized on Priority 1.

🛡️ MANDATORY CIVILIAN PRECAUTIONS & HEALTH ADVISORY
1. EVACUATION CORDON: Mandatory 1,500m evacuation zone downwind. Move perpendicular to prevailing wind, never directly downwind.
2. RESPIRATORY PROTECTION: Wear N95/FFP2 respirator or multi-layer damp cloth over nose/mouth. Plume contains Toxic Hydrocarbon / VOCs, Benzene & Heavy Chemical Smoke.
3. INDOOR SHELTER-IN-PLACE: If within 1.5km–3.5km buffer, seal doors & windows with damp towels. TURN OFF air conditioners & exhaust fans immediately.
4. WATER & FOOD SAFETY: Do NOT consume open well water or rooftop tank water due to toxic fallout. Drink sealed bottled/boiled water only.
5. VULNERABLE CITIZENS: Urgent priority indoor shelter for infants, elderly, pregnant women, and asthma/respiratory patients.
6. EMERGENCY HELPLINES: Dial 112 (Disaster/Police) | 108 (Ambulance) | 1077 (District Disaster DEOC).

🔗 LIVE SATELLITE DOSSIER:
https://firesightai-puce.vercel.app/events/FIRMS-20260921-22.360-69.865-IND
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dispatched by FireSight AI & National Disaster Management Authority`;

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
