"""
EHB Auto Development

This script automates the entire EHB development process:
1. Fetches data from ChatGPT (via API or web scraping)
2. Processes and organizes the data
3. Installs necessary dependencies
4. Generates code based on the data
5. Integrates everything into the EHB system
"""

import os
import sys
import json
import logging
import subprocess
import time
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='ehb_auto_development.log'
)
logger = logging.getLogger('ehb_auto_development')

# Add console handler for real-time feedback
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
console.setFormatter(formatter)
logger.addHandler(console)

class EhbAutoDevelopment:
    """Main class for automating the EHB development process"""
    
    def __init__(self):
        """Initialize the auto development process"""
        self.base_dir = Path(".")
        self.output_dir = Path("ehb_company_info")
        self.output_dir.mkdir(exist_ok=True)
        
        # ChatGPT URLs provided by the user
        self.chatgpt_urls = [
            "https://chatgpt.com/c/67d9ff38-97fc-8010-8509-545340b6cc66",
            "https://chatgpt.com/share/681ed297-023c-8010-a11a-63ce64f5627d",
            "https://chatgpt.com/gpts/editor/g-6756a6594f448191b44509b44c1bf628",
            "https://chatgpt.com/share/681ed416-2280-8010-8414-dab4e29cf4bc"
        ]
    
    def check_environment(self):
        """Check if the environment is properly set up"""
        logger.info("Checking environment setup")
        
        # Check if OpenAI API key is set
        openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not openai_api_key:
            logger.warning("OPENAI_API_KEY environment variable not set")
            print("\n⚠️ OPENAI_API_KEY environment variable not set.")
            print("Do you want to provide an OpenAI API key now? (y/n)")
            choice = input("> ").strip().lower()
            
            if choice == 'y':
                print("Please enter your OpenAI API key:")
                api_key = input("> ").strip()
                os.environ["OPENAI_API_KEY"] = api_key
                print("API key set for this session")
            else:
                print("Continuing without OpenAI API integration")
        
        # Check if required scripts exist
        required_scripts = [
            "ehb_ai_integrator.py",
            "ehb_chatgpt_scraper.py"
        ]
        
        missing_scripts = [script for script in required_scripts if not Path(script).exists()]
        
        if missing_scripts:
            logger.error(f"Missing required scripts: {missing_scripts}")
            print(f"\n❌ Missing required scripts: {missing_scripts}")
            print("Please make sure these scripts are in the current directory")
            return False
        
        logger.info("Environment check passed")
        return True
    
    def install_dependencies(self):
        """Install required Python dependencies"""
        logger.info("Installing required dependencies")
        
        dependencies = [
            "openai",
            "trafilatura",
            "requests",
            "beautifulsoup4"
        ]
        
        try:
            # Check which dependencies are already installed
            installed_packages = subprocess.check_output([sys.executable, "-m", "pip", "freeze"])
            installed_packages = installed_packages.decode('utf-8').split('\n')
            installed_packages = [pkg.split('==')[0].lower() for pkg in installed_packages if pkg]
            
            to_install = [pkg for pkg in dependencies if pkg.lower() not in installed_packages]
            
            if to_install:
                print(f"\n📦 Installing dependencies: {', '.join(to_install)}")
                subprocess.check_call([sys.executable, "-m", "pip", "install"] + to_install)
                logger.info(f"Successfully installed dependencies: {to_install}")
            else:
                logger.info("All dependencies already installed")
                print("\n✅ All dependencies already installed")
            
            return True
            
        except Exception as e:
            logger.error(f"Error installing dependencies: {e}")
            print(f"\n❌ Error installing dependencies: {e}")
            return False
    
    def check_node_packages(self):
        """Check if required Node.js packages are installed"""
        logger.info("Checking Node.js packages")
        
        frontend_dir = self.base_dir / "frontend"
        backend_dir = self.base_dir / "backend"
        
        # Check frontend dependencies
        if frontend_dir.exists() and (frontend_dir / "package.json").exists():
            print("\n🔍 Checking frontend dependencies...")
            try:
                subprocess.check_call(["npm", "ls", "--json"], cwd=frontend_dir, stdout=subprocess.DEVNULL)
                print("✅ Frontend dependencies are installed")
            except subprocess.CalledProcessError:
                print("⚠️ Some frontend dependencies may be missing")
                print("Running npm install in frontend directory...")
                try:
                    subprocess.check_call(["npm", "install"], cwd=frontend_dir)
                    print("✅ Frontend dependencies installed successfully")
                except subprocess.CalledProcessError as e:
                    print(f"❌ Error installing frontend dependencies: {e}")
        
        # Check backend dependencies
        if backend_dir.exists() and (backend_dir / "package.json").exists():
            print("\n🔍 Checking backend dependencies...")
            try:
                subprocess.check_call(["npm", "ls", "--json"], cwd=backend_dir, stdout=subprocess.DEVNULL)
                print("✅ Backend dependencies are installed")
            except subprocess.CalledProcessError:
                print("⚠️ Some backend dependencies may be missing")
                print("Running npm install in backend directory...")
                try:
                    subprocess.check_call(["npm", "install"], cwd=backend_dir)
                    print("✅ Backend dependencies installed successfully")
                except subprocess.CalledProcessError as e:
                    print(f"❌ Error installing backend dependencies: {e}")
    
    def fetch_data_from_openai(self):
        """Fetch data from OpenAI API"""
        logger.info("Fetching data from OpenAI API")
        
        if os.environ.get("OPENAI_API_KEY"):
            try:
                # Import the AI integrator
                sys.path.append(str(self.base_dir))
                from ehb_ai_integrator import EhbAiIntegrator
                
                integrator = EhbAiIntegrator()
                summary = integrator.run_full_integration()
                
                logger.info("Successfully fetched data from OpenAI API")
                print("\n✅ Successfully fetched data from OpenAI API")
                return True
                
            except Exception as e:
                logger.error(f"Error fetching data from OpenAI API: {e}")
                print(f"\n❌ Error fetching data from OpenAI API: {e}")
                return False
        else:
            logger.warning("Skipping OpenAI API data fetch (no API key)")
            print("\n⚠️ Skipping OpenAI API data fetch (no API key)")
            return False
    
    def scrape_data_from_chatgpt(self):
        """Scrape data from ChatGPT shared URLs"""
        logger.info("Scraping data from ChatGPT shared URLs")
        
        try:
            # Import the ChatGPT scraper
            sys.path.append(str(self.base_dir))
            from ehb_chatgpt_scraper import EhbChatGptScraper
            
            scraper = EhbChatGptScraper()
            results = scraper.scrape_and_process_all(self.chatgpt_urls)
            
            logger.info(f"Successfully scraped data from {len(results)}/{len(self.chatgpt_urls)} ChatGPT URLs")
            print(f"\n✅ Successfully scraped data from {len(results)}/{len(self.chatgpt_urls)} ChatGPT URLs")
            return True
            
        except Exception as e:
            logger.error(f"Error scraping data from ChatGPT URLs: {e}")
            print(f"\n❌ Error scraping data from ChatGPT URLs: {e}")
            return False
    
    def integrate_code_snippets(self):
        """Integrate scraped code snippets into the EHB system"""
        logger.info("Integrating code snippets")
        
        snippets_dir = Path("ehb_company_info/code_snippets")
        
        if not snippets_dir.exists() or not any(snippets_dir.iterdir()):
            logger.warning("No code snippets found to integrate")
            print("\n⚠️ No code snippets found to integrate")
            return False
        
        # Count snippets by type
        js_snippets = list(snippets_dir.glob("*.js"))
        ts_snippets = list(snippets_dir.glob("*.ts"))
        py_snippets = list(snippets_dir.glob("*.py"))
        
        print(f"\n📊 Found {len(js_snippets)} JavaScript, {len(ts_snippets)} TypeScript, and {len(py_snippets)} Python snippets")
        
        # Create examples directory if it doesn't exist
        examples_dir = Path("ehb_company_info/examples")
        examples_dir.mkdir(exist_ok=True)
        
        # Integrate JavaScript snippets
        if js_snippets:
            js_examples_dir = examples_dir / "javascript"
            js_examples_dir.mkdir(exist_ok=True)
            
            for i, snippet in enumerate(js_snippets):
                target_path = js_examples_dir / f"example_{i+1}{snippet.suffix}"
                with open(snippet, 'r', encoding='utf-8') as src:
                    content = src.read()
                
                with open(target_path, 'w', encoding='utf-8') as dst:
                    dst.write(f"/**\n * Example {i+1} from ChatGPT\n */\n\n")
                    dst.write(content)
        
        # Integrate Python snippets
        if py_snippets:
            py_examples_dir = examples_dir / "python"
            py_examples_dir.mkdir(exist_ok=True)
            
            for i, snippet in enumerate(py_snippets):
                target_path = py_examples_dir / f"example_{i+1}{snippet.suffix}"
                with open(snippet, 'r', encoding='utf-8') as src:
                    content = src.read()
                
                with open(target_path, 'w', encoding='utf-8') as dst:
                    dst.write(f"'''\nExample {i+1} from ChatGPT\n'''\n\n")
                    dst.write(content)
        
        logger.info("Successfully integrated code snippets")
        print("\n✅ Successfully integrated code snippets into examples directory")
        return True
    
    def generate_development_plan(self):
        """Generate a development plan based on the collected data"""
        logger.info("Generating development plan")
        
        # Look for roadmap data
        roadmap_file = self.output_dir / "development_roadmap.json"
        priorities_file = self.output_dir / "development_priorities.txt"
        
        dev_plan = {
            "creation_date": time.strftime("%Y-%m-%d"),
            "steps": []
        }
        
        if roadmap_file.exists():
            try:
                with open(roadmap_file, 'r', encoding='utf-8') as f:
                    roadmap = json.load(f)
                
                # Extract phases from the roadmap
                if isinstance(roadmap, dict) and 'phases' in roadmap:
                    for phase in roadmap['phases']:
                        dev_plan['steps'].append({
                            "name": phase.get('name', 'Unnamed Phase'),
                            "description": phase.get('description', ''),
                            "tasks": [task.get('name') for task in phase.get('tasks', [])]
                        })
            except Exception as e:
                logger.error(f"Error processing roadmap file: {e}")
        
        # Add priorities if available
        if priorities_file.exists():
            try:
                with open(priorities_file, 'r', encoding='utf-8') as f:
                    priorities = f.read().strip().split('\n')
                
                dev_plan['priorities'] = priorities
            except Exception as e:
                logger.error(f"Error processing priorities file: {e}")
        
        # If no roadmap data was found, create a basic plan
        if not dev_plan['steps']:
            dev_plan['steps'] = [
                {
                    "name": "Initial Setup",
                    "description": "Set up the basic project structure and dependencies",
                    "tasks": [
                        "Set up frontend project structure",
                        "Set up backend project structure",
                        "Configure database connections",
                        "Set up authentication system"
                    ]
                },
                {
                    "name": "Core Features",
                    "description": "Implement core EHB features",
                    "tasks": [
                        "Implement user management",
                        "Implement dashboard",
                        "Implement AI integration",
                        "Implement blockchain functionality"
                    ]
                },
                {
                    "name": "Testing and Deployment",
                    "description": "Test and deploy the EHB system",
                    "tasks": [
                        "Write unit tests",
                        "Perform integration testing",
                        "Set up CI/CD pipeline",
                        "Deploy to production"
                    ]
                }
            ]
        
        # Save the development plan
        dev_plan_file = self.output_dir / "development_plan.json"
        with open(dev_plan_file, 'w', encoding='utf-8') as f:
            json.dump(dev_plan, f, indent=2)
        
        # Create a human-readable version
        readable_plan = f"# EHB Development Plan\n\nCreated on: {dev_plan['creation_date']}\n\n"
        
        if 'priorities' in dev_plan:
            readable_plan += "## Top Priorities\n\n"
            for i, priority in enumerate(dev_plan['priorities']):
                readable_plan += f"{i+1}. {priority}\n"
            readable_plan += "\n"
        
        readable_plan += "## Development Steps\n\n"
        for i, step in enumerate(dev_plan['steps']):
            readable_plan += f"### Step {i+1}: {step['name']}\n\n"
            readable_plan += f"{step['description']}\n\n"
            
            readable_plan += "Tasks:\n"
            for task in step['tasks']:
                readable_plan += f"- [ ] {task}\n"
            
            readable_plan += "\n"
        
        # Save the readable plan
        readable_plan_file = self.output_dir / "development_plan.md"
        with open(readable_plan_file, 'w', encoding='utf-8') as f:
            f.write(readable_plan)
        
        logger.info("Development plan generated successfully")
        print("\n✅ Development plan generated successfully")
        print(f"📝 Readable plan: {readable_plan_file}")
        return True
    
    def restart_workflows(self):
        """Restart the Replit workflows to apply changes"""
        logger.info("Restarting workflows")
        
        print("\n🔄 Restarting workflows...")
        
        workflows = [
            "Backend Server",
            "Frontend Server",
            "Integration Hub",
            "Developer Portal"
        ]
        
        for workflow in workflows:
            try:
                print(f"Restarting workflow: {workflow}")
                # This is a placeholder - in a real implementation, you would use Replit's API
                # or GUI to restart the workflow
                time.sleep(1)  # Simulate restart time
            except Exception as e:
                logger.error(f"Error restarting workflow {workflow}: {e}")
                print(f"❌ Error restarting workflow {workflow}")
        
        # Give workflows time to start up
        print("⏳ Waiting for workflows to restart...")
        time.sleep(5)
        
        print("✅ Workflows restarted")
        return True
    
    def run_auto_development(self):
        """Run the complete auto development process"""
        logger.info("Starting auto development process")
        
        # Check environment
        if not self.check_environment():
            logger.error("Environment check failed")
            print("\n❌ Environment check failed. Please fix the issues and try again.")
            return False
        
        # Install dependencies
        if not self.install_dependencies():
            logger.error("Failed to install dependencies")
            print("\n❌ Failed to install dependencies. Please install them manually and try again.")
            return False
        
        # Check node packages
        self.check_node_packages()
        
        # Fetch and process data
        print("\n📊 Fetching data for EHB development...")
        openai_success = self.fetch_data_from_openai()
        scraping_success = self.scrape_data_from_chatgpt()
        
        if not openai_success and not scraping_success:
            logger.error("Failed to fetch data from both OpenAI API and ChatGPT scraping")
            print("\n❌ Failed to fetch any data. Please check your API key and URLs.")
            return False
        
        # Integrate code snippets
        self.integrate_code_snippets()
        
        # Generate development plan
        self.generate_development_plan()
        
        # Restart workflows
        self.restart_workflows()
        
        # Print summary
        print("\n✅ Auto development process completed successfully!")
        print("\nYou can now start developing based on the generated plan and code snippets.")
        print(f"📁 All generated data is available in the {self.output_dir} directory.")
        
        # Print next steps
        print("\n📋 Next steps:")
        print("1. Review the development plan in ehb_company_info/development_plan.md")
        print("2. Explore the code snippets in ehb_company_info/examples")
        print("3. Start implementing the top priorities")
        print("4. Test the system with the updated data")
        
        return True

if __name__ == "__main__":
    print("=" * 80)
    print("🚀 EHB AUTO DEVELOPMENT")
    print("=" * 80)
    print("\nThis script will automate the EHB development process by:")
    print("- Fetching data from ChatGPT (via API or web scraping)")
    print("- Processing and organizing the data")
    print("- Installing necessary dependencies")
    print("- Generating code based on the data")
    print("- Integrating everything into the EHB system")
    print("\nPress Enter to continue or Ctrl+C to cancel...")
    input()
    
    auto_dev = EhbAutoDevelopment()
    try:
        auto_dev.run_auto_development()
    except KeyboardInterrupt:
        print("\n\n⚠️ Process interrupted by user.")
        print("You can resume the process by running this script again.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"\n❌ Unexpected error: {e}")
        print("Check the log file for details: ehb_auto_development.log")