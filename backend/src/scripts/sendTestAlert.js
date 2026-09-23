const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const AlertService = require('../services/AlertService');

const targetNumber = process.argv[2] || '+917923259283';
const channel = process.argv[3] || 'WHATSAPP'; // 'WHATSAPP' or 'SMS'

console.log(`[FireSight AI] Testing Live Alert Dispatch to ${targetNumber} via ${channel}...`);

AlertService.sendEmergencyAlert({
  eventId: 'FIRMS-20260921-22.360-69.865-IND',
  facilityName: 'Jamnagar Mega Refinery & Petrochemical Complex (RIL)',
  riskScore: 88,
  riskLevel: 'CRITICAL',
  locationName: 'Jamnagar, Gujarat',
  coordinates: [69.865, 22.360],
  frp: 58.4,
  recommendation: 'Deploy AR-AFFF foam immediately. Enforce 1,500m safety cordon.',
  recipientName: 'Disaster Management Response Desk',
  phoneNumber: targetNumber,
  channel: channel
}).then(result => {
  console.log('Dispatch Result:');
  console.log(JSON.stringify(result, null, 2));
}).catch(err => {
  console.error('Dispatch Failed:', err);
});
