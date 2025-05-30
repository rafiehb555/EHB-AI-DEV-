"""
EHB AI Integrator

This script automatically fetches data from ChatGPT using the OpenAI API
and integrates it into our EHB system structure.
"""

import os
import json
import requests
import logging
from openai import OpenAI
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='ehb_ai_integration.log'
)
logger = logging.getLogger('ehb_ai_integrator')

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

class EhbAiIntegrator:
    """Main class for integrating AI generated content into EHB system"""
    
    def __init__(self):
        """Initialize paths and settings"""
        self.output_dir = Path("ehb_company_info")
        self.output_dir.mkdir(exist_ok=True)
        
        self.integration_hub_path = Path("EHB-AI-Dev-Fullstack/shared/data")
        self.integration_hub_path.mkdir(exist_ok=True, parents=True)
        
        self.frontend_path = Path("frontend")
        self.backend_path = Path("backend")
        
        # URLs from ChatGPT shared conversations
        self.chatgpt_urls = [
            "https://chatgpt.com/share/681ed297-023c-8010-a11a-63ce64f5627d",
            "https://chatgpt.com/gpts/editor/g-6756a6594f448191b44509b44c1bf628",
            "https://chatgpt.com/share/681ed416-2280-8010-8414-dab4e29cf4bc",
        ]
    
    def fetch_company_data_from_openai(self):
        """Fetch company data using the OpenAI API"""
        logger.info("Fetching company data from OpenAI")
        
        try:
            # Basic company info
            company_info_response = client.chat.completions.create(
                model="gpt-4o", # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides detailed company information in JSON format."},
                    {"role": "user", "content": "Generate detailed EHB Technologies company information including name, slogan, website, CEO, departments, tech stack, and timeline. Format as JSON."}
                ],
                response_format={"type": "json_object"}
            )
            
            company_info = json.loads(company_info_response.choices[0].message.content)
            
            # Save raw response
            with open(self.output_dir / "company_info.json", "w") as f:
                json.dump(company_info, f, indent=2)
            
            # Convert to JS module format for integration hub
            self._convert_to_js_module(company_info, "companyInfo.js")
            
            logger.info("Successfully fetched and saved company data")
            return company_info
            
        except Exception as e:
            logger.error(f"Error fetching company data: {e}")
            raise
    
    def fetch_architecture_from_openai(self):
        """Fetch system architecture using the OpenAI API"""
        logger.info("Fetching system architecture from OpenAI")
        
        try:
            architecture_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a software architect that provides detailed system architecture in JSON format."},
                    {"role": "user", "content": "Generate a detailed architecture for the EHB Technologies system including frontend, backend, database, authentication, and API integration components. Format as JSON."}
                ],
                response_format={"type": "json_object"}
            )
            
            architecture = json.loads(architecture_response.choices[0].message.content)
            
            # Save raw response
            with open(self.output_dir / "system_architecture.json", "w") as f:
                json.dump(architecture, f, indent=2)
            
            # Convert to JS module
            self._convert_to_js_module(architecture, "systemArchitecture.js")
            
            logger.info("Successfully fetched and saved system architecture")
            return architecture
            
        except Exception as e:
            logger.error(f"Error fetching system architecture: {e}")
            raise
    
    def fetch_roadmap_from_openai(self):
        """Fetch development roadmap using the OpenAI API"""
        logger.info("Fetching development roadmap from OpenAI")
        
        try:
            roadmap_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a project manager that provides detailed development roadmaps in JSON format."},
                    {"role": "user", "content": "Generate a detailed development roadmap for the EHB Technologies system including phases, milestones, and priorities. Format as JSON."}
                ],
                response_format={"type": "json_object"}
            )
            
            roadmap = json.loads(roadmap_response.choices[0].message.content)
            
            # Save raw response
            with open(self.output_dir / "development_roadmap.json", "w") as f:
                json.dump(roadmap, f, indent=2)
            
            # Convert to JS module
            self._convert_to_js_module(roadmap, "developmentRoadmap.js")
            
            logger.info("Successfully fetched and saved development roadmap")
            return roadmap
            
        except Exception as e:
            logger.error(f"Error fetching development roadmap: {e}")
            raise
    
    def fetch_code_templates(self):
        """Fetch code templates for important components"""
        logger.info("Fetching code templates from OpenAI")
        
        try:
            # Frontend component templates
            frontend_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a frontend developer that provides React/Next.js component templates."},
                    {"role": "user", "content": "Generate key React components for the EHB Technologies dashboard including a Dashboard component, Analytics component, and User Profile component using Tailwind CSS."}
                ]
            )
            
            frontend_code = frontend_response.choices[0].message.content
            
            # Backend API templates
            backend_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a backend developer that provides Node.js/Express API templates."},
                    {"role": "user", "content": "Generate key Express.js API endpoints for the EHB Technologies system including user authentication, data retrieval, and analytics endpoints."}
                ]
            )
            
            backend_code = backend_response.choices[0].message.content
            
            # Save to files
            with open(self.output_dir / "frontend_templates.js", "w") as f:
                f.write(frontend_code)
            
            with open(self.output_dir / "backend_templates.js", "w") as f:
                f.write(backend_code)
            
            logger.info("Successfully fetched and saved code templates")
            return {
                "frontend": frontend_code,
                "backend": backend_code
            }
            
        except Exception as e:
            logger.error(f"Error fetching code templates: {e}")
            raise
    
    def _convert_to_js_module(self, data, filename):
        """Convert JSON data to a JavaScript module for integration"""
        js_content = f"""/**
 * EHB Technologies - AI Generated Data
 * 
 * This file was automatically generated by the EHB AI Integrator
 * Last updated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 */

module.exports = {json.dumps(data, indent=2)};
"""
        
        # Save to integration hub path
        with open(self.integration_hub_path / filename, "w") as f:
            f.write(js_content)
        
        logger.info(f"Saved JS module: {filename}")
    
    def analyze_development_priorities(self, roadmap):
        """Analyze the roadmap to determine development priorities"""
        logger.info("Analyzing development priorities")
        
        try:
            priorities_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a project manager specializing in development prioritization."},
                    {"role": "user", "content": f"Based on this roadmap, what should be the top 3 development priorities? Roadmap: {json.dumps(roadmap)}"}
                ]
            )
            
            priorities = priorities_response.choices[0].message.content
            
            # Save priorities
            with open(self.output_dir / "development_priorities.txt", "w") as f:
                f.write(priorities)
            
            logger.info("Successfully analyzed and saved development priorities")
            return priorities
            
        except Exception as e:
            logger.error(f"Error analyzing development priorities: {e}")
            raise
    
    def run_full_integration(self):
        """Run the full integration process"""
        logger.info("Starting full AI integration process")
        
        try:
            # Fetch all data
            company_info = self.fetch_company_data_from_openai()
            architecture = self.fetch_architecture_from_openai()
            roadmap = self.fetch_roadmap_from_openai()
            
            # Analyze priorities
            priorities = self.analyze_development_priorities(roadmap)
            
            # Fetch code templates
            code_templates = self.fetch_code_templates()
            
            # Create a summary report
            summary = {
                "integration_time": datetime.datetime.now().isoformat(),
                "company_info_generated": True,
                "architecture_generated": True,
                "roadmap_generated": True,
                "code_templates_generated": True,
                "top_priorities": priorities.split("\n")[:3]
            }
            
            with open(self.output_dir / "integration_summary.json", "w") as f:
                json.dump(summary, f, indent=2)
            
            logger.info("Full AI integration completed successfully")
            return summary
            
        except Exception as e:
            logger.error(f"Error in full integration process: {e}")
            raise

if __name__ == "__main__":
    # If OPENAI_API_KEY is not set, prompt the user
    if not os.environ.get("OPENAI_API_KEY"):
        print("OPENAI_API_KEY environment variable not set.")
        print("Please enter your OpenAI API key:")
        api_key = input("> ")
        os.environ["OPENAI_API_KEY"] = api_key
    
    # Run the integrator
    import datetime  # Import here to avoid issues with the _convert_to_js_module method
    
    integrator = EhbAiIntegrator()
    try:
        summary = integrator.run_full_integration()
        print("\n=== AI Integration Complete ===")
        print(f"Time: {summary['integration_time']}")
        print("\nTop Development Priorities:")
        for i, priority in enumerate(summary['top_priorities']):
            print(f"{i+1}. {priority}")
        print("\nGenerated files saved to:", integrator.output_dir)
        print("Data integrated into:", integrator.integration_hub_path)
        print("\nNext steps: Review the generated data and start development based on the priorities")
    except Exception as e:
        print(f"Integration process failed: {e}")
        print("Check the log file for details: ehb_ai_integration.log")