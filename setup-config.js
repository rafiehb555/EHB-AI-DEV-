require('dotenv').config(); const fs = require('fs'); const config = JSON.parse(fs.readFileSync('./config.json', 'utf8')); global.ehb_config = config;
