# EHB AI Automation System

## Overview

This is a comprehensive automation system for the EHB (Enterprise Hybrid Blockchain) platform that allows you to:

1. Automatically fetch data from ChatGPT conversations
2. Generate code and development plans
3. Optimize system performance
4. Integrate AI-generated content into your EHB system

## Files and Tools

### Main Tools

- **`ehb_auto_development.py`**: Complete automation system that orchestrates the entire development process
- **`ehb_ai_integrator.py`**: Fetches data from OpenAI API and integrates it into EHB
- **`ehb_chatgpt_scraper.py`**: Scrapes content from ChatGPT shared URLs
- **`optimize-ehb-performance.js`**: Optimizes the EHB system for better performance
- **`run-ehb-auto-development.sh`**: Shell script to run the entire auto development process

## Setup Instructions

1. Make sure you have Python 3.x installed
2. Install the required Python packages:
   ```bash
   pip install openai trafilatura requests beautifulsoup4
   ```
3. Make the shell script executable:
   ```bash
   chmod +x run-ehb-auto-development.sh
   ```
4. Prepare your ChatGPT conversation URLs (if using the scraper)
5. Get an OpenAI API key (if using the AI integrator)

## How to Use

### Option 1: Run the Complete Automation

The easiest way to run the complete automation process is to use the shell script:

```bash
./run-ehb-auto-development.sh
```

This will:
- Check your environment and install dependencies
- Fetch data from OpenAI API (if API key is provided)
- Scrape data from ChatGPT shared URLs
- Process and organize the data
- Generate a development plan
- Integrate everything into the EHB system

### Option 2: Run Individual Components

If you prefer to run individual components:

1. **Fetch Data from OpenAI API**:
   ```bash
   python ehb_ai_integrator.py
   ```

2. **Scrape Data from ChatGPT**:
   ```bash
   python ehb_chatgpt_scraper.py
   ```

3. **Optimize System Performance**:
   ```bash
   node optimize-ehb-performance.js
   ```

## Customization

### ChatGPT URLs

To change the ChatGPT URLs being scraped, edit the `chatgpt_urls` list in:
- `ehb_chatgpt_scraper.py`
- `ehb_auto_development.py`

### OpenAI Prompts

To modify the prompts sent to OpenAI API, edit `ehb_ai_integrator.py` and look for the `messages` parameters in API calls.

### Performance Optimization

To customize performance optimizations, edit `optimize-ehb-performance.js` and modify the optimization functions.

## Output Files

All generated files will be stored in the `ehb_company_info` directory:

- `company_info.json`: Company information from OpenAI
- `system_architecture.json`: System architecture
- `development_roadmap.json`: Development roadmap
- `development_plan.md`: Human-readable development plan
- `code_snippets/`: Directory containing extracted code snippets
- `chatgpt_content/`: Directory containing raw content from ChatGPT
- `processed/`: Directory containing processed content

## Integration with EHB System

The automation system integrates the generated content into your EHB system:

- Company info is added to `EHB-AI-Dev-Fullstack/shared/data/companyInfo.js`
- System architecture is added to `EHB-AI-Dev-Fullstack/shared/data/systemArchitecture.js`
- Code snippets are organized into example files

## Troubleshooting

### API Key Issues

If you see errors related to the OpenAI API key:
- Make sure you have set the `OPENAI_API_KEY` environment variable
- Verify that the API key is correct and has sufficient permissions

### Scraping Issues

If you see errors related to scraping ChatGPT URLs:
- Make sure the URLs are accessible
- Check if the format of the URLs is correct (should start with `https://chatgpt.com/share/` or `https://chatgpt.com/gpts/editor/`)

### Performance Optimization Issues

If you see errors related to performance optimization:
- Make sure the file paths in `optimize-ehb-performance.js` match your project structure
- Check if the file content patterns match your codebase

## Further Development

This automation system can be extended in several ways:

1. Add more AI models (e.g., Claude, Gemini)
2. Add automated testing
3. Implement CI/CD integration
4. Add more performance optimizations

## License

This software is property of EHB Technologies.

## Contact

For any questions or issues, please contact support@ehbtechnologies.com.