"""
EHB ChatGPT Scraper

This script scrapes content from ChatGPT shared URLs and processes it 
for use in EHB system development.
"""

import os
import re
import json
import logging
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('EhbChatGptScraper')

class EhbChatGptScraper:
    """Scrapes and processes content from ChatGPT shared URLs"""
    
    def __init__(self):
        """Initialize the scraper with output directories"""
        self.output_dir = Path("ehb_company_info")
        self.raw_dir = self.output_dir / "chatgpt_content"
        self.code_dir = self.output_dir / "code_snippets"
        self.processed_dir = self.output_dir / "processed"
        
        # Create directories if they don't exist
        self.output_dir.mkdir(exist_ok=True)
        self.raw_dir.mkdir(exist_ok=True)
        self.code_dir.mkdir(exist_ok=True)
        self.processed_dir.mkdir(exist_ok=True)
    
    def scrape_url(self, url):
        """Scrape content from a ChatGPT shared URL"""
        logger.info(f"Scraping URL: {url}")
        
        try:
            # Use requests to get the page content
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code != 200:
                logger.error(f"Failed to retrieve content from {url}. Status code: {response.status_code}")
                return None
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract conversation content
            content_divs = soup.find_all("div", class_="markdown")
            
            if not content_divs:
                logger.warning(f"No conversation content found at {url}")
                
                # Try to extract content from a potential JSON structure
                scripts = soup.find_all("script")
                for script in scripts:
                    if script.string and "__NEXT_DATA__" in script.string:
                        try:
                            data = json.loads(script.string)
                            # Extract content from the Next.js data structure (this varies depending on the page structure)
                            # This is a simplified approach and might need adjustment
                            return json.dumps(data, indent=2)
                        except:
                            pass
                
                # If we still can't find content, save the entire HTML for manual inspection
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                html_path = self.raw_dir / f"raw_html_{timestamp}.html"
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(response.text)
                logger.info(f"Saved raw HTML to {html_path} for inspection")
                
                return None
            
            # Combine all markdown content
            content = "\n\n".join([div.get_text() for div in content_divs])
            
            # Save raw content
            url_id = url.split('/')[-1]
            filename = f"chatgpt_{url_id}.txt"
            filepath = self.raw_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            logger.info(f"Saved raw content to {filepath}")
            return content
            
        except Exception as e:
            logger.error(f"Error scraping URL {url}: {str(e)}")
            return None
    
    def extract_code_snippets(self, content):
        """Extract code snippets from the content"""
        logger.info("Extracting code snippets")
        
        if not content:
            return []
        
        # Match code blocks with language specifier ```language ... ```
        pattern = r"```([a-zA-Z0-9_+\-#]+)\n([\s\S]*?)```"
        matches = re.findall(pattern, content)
        
        # Also match code blocks without language specifier
        unlabeled_pattern = r"```\n([\s\S]*?)```"
        unlabeled_matches = re.findall(unlabeled_pattern, content)
        
        # Process matches with language specifier
        snippets = []
        for i, (language, code) in enumerate(matches):
            language = language.strip().lower()
            code = code.strip()
            
            ext = self._get_extension_for_language(language)
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"snippet_{timestamp}_{i}{ext}"
            filepath = self.code_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(code)
            
            snippets.append({
                'language': language,
                'content': code,
                'file': str(filepath)
            })
            
            logger.info(f"Saved {language} code snippet to {filepath}")
        
        # Process unlabeled matches (assume it's JavaScript if we can't tell)
        for i, code in enumerate(unlabeled_matches):
            code = code.strip()
            
            # Skip if this code is already captured in the labeled snippets
            if any(s['content'] == code for s in snippets):
                continue
            
            # Guess language based on content
            language = 'javascript'  # Default
            if 'function' in code and 'def ' not in code:
                language = 'javascript'
            elif 'def ' in code or 'import ' in code and '#' in code:
                language = 'python'
            elif '<html>' in code.lower() or '</div>' in code:
                language = 'html'
            
            ext = self._get_extension_for_language(language)
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"snippet_{timestamp}_unlabeled_{i}{ext}"
            filepath = self.code_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(code)
            
            snippets.append({
                'language': language,
                'content': code,
                'file': str(filepath)
            })
            
            logger.info(f"Saved unlabeled (guessed as {language}) code snippet to {filepath}")
        
        logger.info(f"Extracted {len(snippets)} code snippets")
        return snippets
    
    def _get_extension_for_language(self, language):
        """Get the appropriate file extension for a language"""
        language_map = {
            'javascript': '.js',
            'js': '.js',
            'typescript': '.ts',
            'ts': '.ts',
            'jsx': '.jsx',
            'tsx': '.tsx',
            'python': '.py',
            'py': '.py',
            'html': '.html',
            'css': '.css',
            'json': '.json',
            'markdown': '.md',
            'md': '.md',
            'bash': '.sh',
            'shell': '.sh',
            'sh': '.sh',
            'sql': '.sql',
            'java': '.java',
            'c': '.c',
            'cpp': '.cpp',
            'c++': '.cpp',
            'csharp': '.cs',
            'cs': '.cs',
            'go': '.go',
            'ruby': '.rb',
            'rb': '.rb',
            'php': '.php',
            'rust': '.rs',
            'swift': '.swift',
            'kotlin': '.kt',
            'scala': '.scala',
            'xml': '.xml',
            'yaml': '.yaml',
            'yml': '.yml',
            'ini': '.ini',
            'toml': '.toml',
            'dockerfile': '.Dockerfile',
        }
        
        return language_map.get(language.lower(), '.txt')
    
    def extract_company_info(self, content):
        """Extract company information from the content"""
        logger.info("Extracting company information")
        
        if not content:
            return None
        
        # Look for company information sections
        company_info = {}
        
        # Common patterns to look for
        patterns = {
            'name': r"(?:Company|Business) Name:?\s*([^\n]+)",
            'description': r"(?:Company|Business) Description:?\s*([^\n]+(?:\n\s*[^\n]+)*)",
            'mission': r"Mission(?: Statement)?:?\s*([^\n]+(?:\n\s*[^\n]+)*)",
            'vision': r"Vision(?: Statement)?:?\s*([^\n]+(?:\n\s*[^\n]+)*)",
            'values': r"(?:Core )?Values:?\s*([^\n]+(?:\n\s*[^\n]+)*)",
            'founded': r"Founded(?: Year| Date)?:?\s*([^\n]+)",
            'headquarters': r"(?:Headquarters|HQ|Location):?\s*([^\n]+)",
            'industry': r"Industry:?\s*([^\n]+)",
            'employees': r"(?:Employees|Team Size):?\s*([^\n]+)",
            'website': r"Website:?\s*([^\n]+)",
            'contact': r"Contact:?\s*([^\n]+(?:\n\s*[^\n]+)*)"
        }
        
        # Extract information using patterns
        for key, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                company_info[key] = match.group(1).strip()
        
        # Save company info as JSON
        if company_info:
            filepath = self.processed_dir / "company_info.json"
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(company_info, f, indent=2)
            
            logger.info(f"Saved company information to {filepath}")
        
        return company_info
    
    def extract_development_roadmap(self, content):
        """Extract development roadmap from the content"""
        logger.info("Extracting development roadmap")
        
        if not content:
            return None
        
        roadmap = {
            'phases': []
        }
        
        # Look for roadmap section
        roadmap_pattern = r"(?:Development|Product) Roadmap:?\s*([^\n]+(?:\n\s*[^\n]+)*)"
        roadmap_match = re.search(roadmap_pattern, content, re.IGNORECASE)
        
        if roadmap_match:
            roadmap_text = roadmap_match.group(1)
            
            # Look for phases or stages
            phase_pattern = r"(?:Phase|Stage) (\d+):?\s*([^:]+)(?::|\n)"
            phase_matches = re.findall(phase_pattern, content, re.IGNORECASE)
            
            for phase_num, phase_name in phase_matches:
                phase = {
                    'name': f"Phase {phase_num}: {phase_name.strip()}",
                    'tasks': []
                }
                
                # Find the end of the current phase
                phase_start = content.find(f"Phase {phase_num}")
                next_phase = f"Phase {int(phase_num) + 1}"
                phase_end = content.find(next_phase, phase_start)
                if phase_end == -1:
                    phase_end = len(content)
                
                # Extract the phase content
                phase_content = content[phase_start:phase_end]
                
                # Extract tasks for this phase
                task_pattern = r"[-•*]\s*([^\n]+)"
                task_matches = re.findall(task_pattern, phase_content)
                
                for task in task_matches:
                    phase['tasks'].append({
                        'name': task.strip(),
                        'status': 'pending'
                    })
                
                roadmap['phases'].append(phase)
        
        # If no structured phases were found, try to extract a list
        if not roadmap['phases']:
            # Look for bullet points that might indicate roadmap items
            roadmap_items = re.findall(r"[-•*]\s*([^\n]+)", content)
            
            if roadmap_items:
                roadmap['phases'].append({
                    'name': 'Development Roadmap',
                    'tasks': [{'name': item.strip(), 'status': 'pending'} for item in roadmap_items]
                })
        
        # Save roadmap as JSON
        if roadmap['phases']:
            filepath = self.processed_dir / "development_roadmap.json"
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(roadmap, f, indent=2)
            
            logger.info(f"Saved development roadmap to {filepath}")
        
        return roadmap
    
    def extract_system_architecture(self, content):
        """Extract system architecture from the content"""
        logger.info("Extracting system architecture")
        
        if not content:
            return None
        
        architecture = {
            'components': [],
            'integrations': [],
            'databases': []
        }
        
        # Look for system architecture section
        arch_pattern = r"(?:System|Software) Architecture:?\s*([^\n]+(?:\n\s*[^\n]+)*)"
        arch_match = re.search(arch_pattern, content, re.IGNORECASE)
        
        # Extract components/services
        component_pattern = r"[-•*]\s*([A-Za-z0-9_\- ]+)(?:\s*-\s*|\s*:\s*)([^\n]+)"
        component_matches = re.findall(component_pattern, content)
        
        for comp_name, comp_desc in component_matches:
            architecture['components'].append({
                'name': comp_name.strip(),
                'description': comp_desc.strip()
            })
        
        # Extract database information
        if "Database" in content or "MongoDB" in content or "PostgreSQL" in content:
            db_pattern = r"(?:Database|Data Storage):?\s*([^\n]+)"
            db_match = re.search(db_pattern, content, re.IGNORECASE)
            
            if db_match:
                db_text = db_match.group(1).strip()
                architecture['databases'].append({
                    'name': db_text,
                    'type': 'SQL' if any(db in db_text for db in ['SQL', 'PostgreSQL', 'MySQL']) else 'NoSQL'
                })
            
            # Look for specific database mentions
            for db in ['MongoDB', 'PostgreSQL', 'MySQL', 'Supabase', 'Firebase']:
                if db in content:
                    if not any(d['name'] == db for d in architecture['databases']):
                        architecture['databases'].append({
                            'name': db,
                            'type': 'NoSQL' if db in ['MongoDB', 'Firebase'] else 'SQL'
                        })
        
        # Extract integrations
        integration_keywords = [
            'API Integration', 'Third-party', 'Integration', 
            'OAuth', 'Payment Gateway', 'Authentication Provider'
        ]
        
        for keyword in integration_keywords:
            if keyword in content:
                integration_pattern = f"{keyword}:?\s*([^\n]+)"
                integration_match = re.search(integration_pattern, content, re.IGNORECASE)
                
                if integration_match:
                    architecture['integrations'].append({
                        'name': integration_match.group(1).strip(),
                        'type': keyword
                    })
        
        # Look for specific integrations
        for integration in ['Stripe', 'OpenAI', 'Anthropic', 'AWS', 'Google Cloud', 'Twilio']:
            if integration in content and not any(i['name'] == integration for i in architecture['integrations']):
                architecture['integrations'].append({
                    'name': integration,
                    'type': 'Third-party Service'
                })
        
        # Save architecture as JSON
        if architecture['components'] or architecture['integrations'] or architecture['databases']:
            filepath = self.processed_dir / "system_architecture.json"
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(architecture, f, indent=2)
            
            logger.info(f"Saved system architecture to {filepath}")
        
        return architecture
    
    def process_content(self, content, url):
        """Process the scraped content to extract meaningful information"""
        logger.info(f"Processing content from {url}")
        
        if not content:
            logger.warning(f"No content to process from {url}")
            return None
        
        results = {
            'url': url,
            'code_snippets': self.extract_code_snippets(content),
            'company_info': self.extract_company_info(content),
            'development_roadmap': self.extract_development_roadmap(content),
            'system_architecture': self.extract_system_architecture(content)
        }
        
        # Generate summary
        found_items = []
        if results['code_snippets']:
            found_items.append(f"{len(results['code_snippets'])} code snippets")
        if results['company_info']:
            found_items.append("company information")
        if results['development_roadmap'] and results['development_roadmap']['phases']:
            found_items.append(f"development roadmap with {len(results['development_roadmap']['phases'])} phases")
        if results['system_architecture'] and results['system_architecture']['components']:
            found_items.append(f"system architecture with {len(results['system_architecture']['components'])} components")
        
        summary = f"Extracted {', '.join(found_items)}" if found_items else "No meaningful content extracted"
        logger.info(summary)
        
        return results
    
    def scrape_and_process_all(self, urls):
        """Scrape and process all provided URLs"""
        logger.info(f"Starting to scrape and process {len(urls)} URLs")
        
        all_results = []
        for i, url in enumerate(urls, 1):
            logger.info(f"Processing URL {i}/{len(urls)}: {url}")
            
            # Scrape content
            content = self.scrape_url(url)
            
            # Process content
            if content:
                results = self.process_content(content, url)
                if results:
                    all_results.append(results)
        
        logger.info(f"Scraping complete. Processed {len(all_results)}/{len(urls)} URLs successfully")
        return all_results

if __name__ == "__main__":
    # URLs to scrape (user provided)
    urls_to_scrape = [
        "https://chatgpt.com/c/67d9ff38-97fc-8010-8509-545340b6cc66",
        "https://chatgpt.com/share/681ed297-023c-8010-a11a-63ce64f5627d",
        "https://chatgpt.com/gpts/editor/g-6756a6594f448191b44509b44c1bf628",
        "https://chatgpt.com/share/681ed416-2280-8010-8414-dab4e29cf4bc"
    ]
    
    # Run the scraper
    scraper = EhbChatGptScraper()
    results = scraper.scrape_and_process_all(urls_to_scrape)
    
    # Create a combined company info file if multiple sources were found
    company_info_sources = [r['company_info'] for r in results if r.get('company_info')]
    if len(company_info_sources) > 1:
        combined_info = {}
        for info in company_info_sources:
            combined_info.update(info)
        
        if combined_info:
            filepath = Path("ehb_company_info") / "processed" / "combined_company_info.json"
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(combined_info, f, indent=2)
            
            logger.info(f"Saved combined company information to {filepath}")