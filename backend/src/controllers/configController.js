const SystemConfig = require('../models/SystemConfig');

exports.getConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ key: 'global_config' });
    if (!config) {
      config = await SystemConfig.create({
        key: 'global_config',
        dataMode: process.env.DATA_MODE || 'demo'
      });
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { dataMode, riskWeights, firmsSettings } = req.body;
    let config = await SystemConfig.findOne({ key: 'global_config' });

    if (!config) {
      config = new SystemConfig({ key: 'global_config' });
    }

    if (dataMode) {
      config.dataMode = dataMode;
      process.env.DATA_MODE = dataMode;
    }
    if (riskWeights) config.riskWeights = { ...config.riskWeights.toObject(), ...riskWeights };
    if (firmsSettings) config.firmsSettings = { ...config.firmsSettings.toObject(), ...firmsSettings };

    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
