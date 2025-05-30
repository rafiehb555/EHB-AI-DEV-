import requests
import trafilatura
from bs4 import BeautifulSoup
import json
import os
import re

def fetch_website_content(url):
    """Fetch the content of a website using trafilatura."""
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            return trafilatura.extract(downloaded)
        else:
            print(f"Failed to download content from {url}")
            return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def create_folder_if_not_exists(folder_path):
    """Create a folder if it doesn't exist."""
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Created folder: {folder_path}")

def write_to_file(content, file_path):
    """Write content to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote content to {file_path}")

def extract_company_info(text):
    """Extract company information from text."""
    info = {}
    
    # Extract company name
    company_name_match = re.search(r'(EHB[- ]Technologies(?:[ -]Limited)?)', text, re.IGNORECASE)
    if company_name_match:
        info['company_name'] = company_name_match.group(1)
    
    # Extract services
    services = re.findall(r'((?:EHB|JPS|OLS|WMS|HMS|HPS)[- ][A-Za-z]+(?: Service| System)?)', text)
    if services:
        info['services'] = list(set(services))
    
    # Extract descriptions
    descriptions = {}
    service_desc_matches = re.findall(r'((?:EHB|JPS|OLS|WMS|HMS|HPS)[- ][A-Za-z]+(?: Service| System)?)[^\n.]*[^A-Za-z]is[^A-Za-z]([^\n.]+)', text, re.IGNORECASE)
    for service, desc in service_desc_matches:
        descriptions[service] = desc.strip()
    
    if descriptions:
        info['service_descriptions'] = descriptions
    
    return info

def collect_ehb_info():
    """Collect information about EHB from the provided links."""
    urls = [
        "https://replit.com/t/ehb-technologes-limited/repls/SecureVault",
        "https://replit.com/t/ehb-technologes-limited/repls/EHB-TECHNOLOGIES",
        "https://replit.com/t/ehb-technologes-limited/repls/EHB-PROJECT",
        "https://replit.com/t/ehb-technologes-limited/repls/JPS-project"
    ]
    
    all_info = {}
    
    for url in urls:
        print(f"Fetching information from {url}")
        content = fetch_website_content(url)
        if content:
            info = extract_company_info(content)
            project_name = url.split('/')[-1]
            all_info[project_name] = {
                "extracted_info": info,
                "raw_content": content
            }
    
    # Create output directory
    output_dir = "ehb_company_info"
    create_folder_if_not_exists(output_dir)
    
    # Write all information to a JSON file
    write_to_file(json.dumps(all_info, indent=2), f"{output_dir}/all_info.json")
    
    # Create a summary markdown file
    summary = "# EHB Technologies Information\n\n"
    
    for project, data in all_info.items():
        summary += f"## Project: {project}\n\n"
        
        if 'extracted_info' in data:
            info = data['extracted_info']
            
            if 'company_name' in info:
                summary += f"**Company Name:** {info['company_name']}\n\n"
            
            if 'services' in info:
                summary += "**Services:**\n\n"
                for service in info['services']:
                    summary += f"- {service}\n"
                summary += "\n"
            
            if 'service_descriptions' in info:
                summary += "**Service Descriptions:**\n\n"
                for service, desc in info['service_descriptions'].items():
                    summary += f"- **{service}:** {desc}\n"
                summary += "\n"
        
        # Add some raw content as a reference
        summary += "**Content Excerpt:**\n\n"
        content_excerpt = data.get('raw_content', '')[:500] + "..."
        summary += f"```\n{content_excerpt}\n```\n\n"
        summary += "---\n\n"
    
    write_to_file(summary, f"{output_dir}/summary.md")
    
    # Create a Next.js-compatible JSON file for the frontend
    next_js_data = {
        "company": {
            "name": next((info['extracted_info'].get('company_name') for project, info in all_info.items() 
                         if 'extracted_info' in info and 'company_name' in info['extracted_info']), "EHB Technologies"),
            "services": []
        }
    }
    
    # Collect all unique services
    all_services = set()
    all_descriptions = {}
    
    for project, data in all_info.items():
        if 'extracted_info' in data:
            info = data['extracted_info']
            
            if 'services' in info:
                all_services.update(info['services'])
            
            if 'service_descriptions' in info:
                all_descriptions.update(info['service_descriptions'])
    
    # Create structured services data
    for service in all_services:
        service_data = {
            "name": service,
            "description": all_descriptions.get(service, "A service provided by EHB Technologies"),
            "id": service.lower().replace(" ", "-").replace("_", "-")
        }
        next_js_data["company"]["services"].append(service_data)
    
    write_to_file(json.dumps(next_js_data, indent=2), f"{output_dir}/ehb_data.json")
    
    return all_info

if __name__ == "__main__":
    print("Starting EHB information collection process...")
    collect_ehb_info()
    print("EHB information collection complete.")