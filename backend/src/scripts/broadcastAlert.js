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
`🚨 CRITICAL NDMA INCIDENT ALERT [FIRESIGHT-AI] 🚨
SEVERITY: CRITICAL (88/100)
FACILITY: Jamnagar Mega Refinery & Petrochem Complex (RIL)
LOCATION: Jamnagar, Gujarat (22.360°N, 69.865°E)
THERMAL: 58.4 MW FRP | VIIRS Satellite Sensor
STATUS: INSIDE Critical Industrial Polygon (0m)
PROTOCOL: Evacuate 1,500m radius downwind. Deploy AR-AFFF foam monitors immediately.
DOSSIER: https://firesightai-puce.vercel.app/events/FIRMS-20260921-22.360-69.865-IND`;

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
