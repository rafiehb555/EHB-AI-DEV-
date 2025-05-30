const axios = require('axios');

exports.detectAndTranslate = async (req, res) => {
  const { text } = req.body;
  try {
    const detectRes = await axios.post('https://libretranslate.com/detect', { q: text });
    const lang = detectRes.data[0]?.language || 'en';

    const translateRes = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: lang,
      target: 'en',
      format: 'text'
    });

    res.json({
      language: lang,
      translation: translateRes.data.translatedText
    });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
};
