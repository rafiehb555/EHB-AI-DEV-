# EHB سسٹم سروس URLs

آپ نیچے دیے گئے URLs کو استعمال کر کے ہر سروس کو براؤزر میں کھول سکتے ہیں:

## ڈیٹابیس انٹیگریشن

EHB سسٹم میں اب Supabase ڈیٹابیس انٹیگریشن شامل کی گئی ہے۔ یہ مختلف سروسز کو ایک ہی ڈیٹابیس تک رسائی فراہم کرتا ہے:

- مرکزی شیئرڈ ڈیٹابیس کلائنٹ فائل: `shared/supabase.js`
- ڈیٹابیس کنکشن سٹیٹس چیک: `https://{{REPL_SLUG}}-5020.{{REPL_OWNER}}.repl.co/settings`
- بیک اینڈ API انڈپوائنٹس: `https://{{REPL_SLUG}}-5001.{{REPL_OWNER}}.repl.co/api/supabase/status`

ڈیٹابیس رسائی کے لیے درج ذیل API انڈپوائنٹس دستیاب ہیں:

| API انڈپوائنٹ | ڈسکرپشن |
| --- | --- |
| GET /api/supabase/status | ڈیٹابیس کنکشن سٹیٹس چیک کرتا ہے |
| GET /api/supabase/data/:table | ڈیٹابیس ٹیبل سے ڈیٹا حاصل کرتا ہے |
| POST /api/supabase/data/:table | ڈیٹابیس ٹیبل میں ڈیٹا داخل کرتا ہے |
| PUT /api/supabase/data/:table | ڈیٹابیس ٹیبل میں ڈیٹا اپڈیٹ کرتا ہے |
| DELETE /api/supabase/data/:table | ڈیٹابیس ٹیبل سے ڈیٹا ڈیلیٹ کرتا ہے |
| POST /api/supabase/storage/:bucket/:filename | اسٹوریج میں فائل اپلوڈ کرتا ہے |
| GET /api/supabase/storage/:bucket/:filename | اسٹوریج سے فائل کا پبلک URL حاصل کرتا ہے |
| DELETE /api/supabase/storage/:bucket/:filename | اسٹوریج سے فائل ڈیلیٹ کرتا ہے |
| GET /api/supabase/storage/:bucket/list | اسٹوریج بکٹ میں فائلز کی لسٹ حاصل کرتا ہے |

## مرکزی سروسز

| سروس | پورٹ | URL |
| --- | --- | --- |
| فرنٹ اینڈ سرور (ایڈمن پینل) | 5000 | https://{{REPL_SLUG}}.{{REPL_OWNER}}.repl.co |
| بیک اینڈ سرور | 5001 | https://{{REPL_SLUG}}-5001.{{REPL_OWNER}}.repl.co |
| EHB ہوم | 5005 | https://{{REPL_SLUG}}-5005.{{REPL_OWNER}}.repl.co |
| ڈیولپر پورٹل | 5010 | https://{{REPL_SLUG}}-5010.{{REPL_OWNER}}.repl.co |

## AI سروسز

| سروس | پورٹ | URL |
| --- | --- | --- |
| AI انٹیگریشن ہب | 5150 | https://{{REPL_SLUG}}-5150.{{REPL_OWNER}}.repl.co |
| LangChain AI سروس | 5100 | https://{{REPL_SLUG}}-5100.{{REPL_OWNER}}.repl.co |
| EHB پلے گراؤنڈ | 5050 | https://{{REPL_SLUG}}-5050.{{REPL_OWNER}}.repl.co |
| EHB ایڈمن ڈیش بورڈ | 5020 | https://{{REPL_SLUG}}-5020.{{REPL_OWNER}}.repl.co |

## آٹونومس ایجنٹ سسٹم

| سروس | پورٹ | URL |
| --- | --- | --- |
| ایجنٹ ڈیش بورڈ | 5200 | https://{{REPL_SLUG}}-5200.{{REPL_OWNER}}.repl.co |

## بزنس سروسز

| سروس | پورٹ | URL |
| --- | --- | --- |
| GoSellr سروس | 5002 | https://{{REPL_SLUG}}-5002.{{REPL_OWNER}}.repl.co |

## ریڈائریکٹرز

یہ سروسز URL ریڈائریکٹ کرتی ہیں مرکزی سروسز تک۔ آپ انہیں براہ راست استعمال نہ کریں:

| سروس | پورٹ |
| --- | --- |
| AI-Integration-Hub-Redirector | 4200 |
| Developer-Portal-Redirector | 4010 |
| EHB-Central-Redirector | 3000 |
| GoSellr-Redirector | 4000 |

## استعمال کا طریقہ

کسی بھی سروس تک پہنچنے کے لیے، اپنے Replit پروجیکٹ کا URL اور پورٹ استعمال کریں، مثال کے طور پر:

اگر آپ کا Replit پروجیکٹ URL `https://my-project.username.repl.co` ہے تو، بیک اینڈ سرور تک پہنچنے کے لیے استعمال کریں:
`https://my-project-5001.username.repl.co`

## نوٹ:

- سروسز اپنے مقررہ پورٹس پر چل رہی ہیں
- ہمیشہ فرنٹ اینڈ سرور پورٹ 5000 پر چلتا ہے، جو کہ بنیادی Replit URL ہے
- باقی سروسز متعلقہ پورٹ نمبرز کے ساتھ URL کے ذریعے قابل رسائی ہیں