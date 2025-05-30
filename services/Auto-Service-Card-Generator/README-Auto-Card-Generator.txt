
🔧 AUTO SERVICE CARD GENERATOR
==============================

🎯 Purpose:
Auto-generate dashboard and home page cards for each service.

📁 Expected Input:
- /services/<module>/module.json

📄 module.json Format:
{
  "name": "GoSellr",
  "title": "GoSellr Marketplace",
  "description": "Sell & Buy products globally",
  "sql": "VIP",
  "homepage": true,
  "adminview": true,
  "icon": "🛒"
}

📌 Function:
1. AI reads module.json after ZIP upload
2. Auto-creates card in EHB-HOME (user dashboard)
3. Adds card in EHB-DASHBOARD (admin view)
4. Each card includes: title, icon, SQL tag, live status

📍 Output locations:
- /admin/EHB-HOME/components/cards/
- /admin/EHB-DASHBOARD/components/cards/
