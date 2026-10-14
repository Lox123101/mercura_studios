// Vercel serverless function: receives a request from the site form and forwards it to your Telegram.
// Set two environment variables in Vercel → Project → Settings → Environment Variables:
//   TELEGRAM_BOT_TOKEN  — token from @BotFather
//   TELEGRAM_CHAT_ID    — your chat id (see ИНСТРУКЦИЯ.md)
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }

  // only accept requests coming from this site
  const origin = req.headers.origin || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (origin && host && !origin.endsWith('//' + host)) return res.status(403).json({ ok: false });

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return res.status(500).json({ ok: false, error: 'not_configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true }); // bot trap field

  const name = clean(b.name, 80), phone = clean(b.phone, 40), tg = clean(b.telegram, 40);
  const type = clean(b.type, 60), about = String(b.about ?? '').trim().slice(0, 2000);
  if (b.consent !== true) return res.status(400).json({ ok: false, error: 'no_consent' });
  if (!name || (!phone && !tg) || about.length < 10) return res.status(400).json({ ok: false, error: 'invalid' });

  const text = [
    '🔥 Новая заявка с сайта Mercura',
    '',
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone || '—'}`,
    `✈️ Telegram: ${tg || '—'}`,
    `🧩 Нужно: ${type || '—'}`,
    '✅ Согласие на обработку данных: получено',
    '',
    `📝 О проекте:\n${about}`,
  ].join('\n');

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
    const j = await r.json();
    if (!j.ok) return res.status(502).json({ ok: false, error: 'telegram' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'network' });
  }
};
