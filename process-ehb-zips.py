#!/usr/bin/env python3
import os
import shutil
import zipfile
import json
import glob
import time
from datetime import datetime

# Define the input directory where zip files will be placed
# Use absolute path to ensure correct directory is used
import os.path
INPUT_ZIP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'attached_assets'))
PROCESSED_DIR = os.path.join(INPUT_ZIP_DIR, 'processed')

if not os.path.exists(INPUT_ZIP_DIR):
    os.makedirs(INPUT_ZIP_DIR)
if not os.path.exists(PROCESSED_DIR):
    os.makedirs(PROCESSED_DIR)

# Define the log file for tracking operations
LOG_FILE = 'ehb_zip_processing.log'

def log_message(message):
    """Write a message to the log file with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, 'a') as log:
        log.write(f"[{timestamp}] {message}\n")
    print(message)

def process_config_file(config_data, extract_dir):
    """Process the config.json file if it exists in the extracted directory"""
    try:
        if os.path.exists(os.path.join(extract_dir, 'config.json')):
            with open(os.path.join(extract_dir, 'config.json'), 'r') as config_file:
                config = json.load(config_file)
                log_message(f"Found configuration file: {config}")
                return config
        else:
            log_message("No config.json file found in the zip archive")
            return config_data
    except Exception as e:
        log_message(f"Error processing configuration file: {str(e)}")
        return config_data

def identify_module_type(folder_name, files_list):
    """Identify what type of EHB module this zip contains"""
    # Simple heuristics to identify module type
    if any('package.json' in f for f in files_list):
        if any('next.config' in f for f in files_list):
            return "frontend"
        else:
            return "backend"
    elif any('.py' in f for f in files_list):
        return "python-service"
    elif any('Dockerfile' in f for f in files_list):
        return "container-service"
    else:
        # Default to module name pattern matching
        folder_lower = folder_name.lower()
        if 'frontend' in folder_lower or 'ui' in folder_lower:
            return "frontend"
        elif 'backend' in folder_lower or 'api' in folder_lower:
            return "backend"
        elif 'service' in folder_lower:
            return "service"
        else:
            return "unknown"

def determine_target_directory(module_name, module_type):
    """Determine the target directory based on module name and type"""
    # Handle special cases first
    if module_name.startswith("EHB-") or module_name.startswith("ehb-"):
        return module_name
    
    # Map the module type to a directory
    if module_type == "frontend":
        return "frontend"
    elif module_type == "backend":
        return "backend"
    elif module_type == "service" or module_type == "python-service":
        if not os.path.exists(module_name):
            return module_name
        else:
            return f"{module_name}-Service"
    else:
        # For unknown types, use the module name
        return module_name

def copy_files_to_target(extract_dir, target_dir, config_data):
    """Copy files from extract directory to target directory based on config"""
    try:
        # Make sure target directory exists
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            log_message(f"Created target directory: {target_dir}")
        
        # Get list of files/directories to copy
        items_to_copy = os.listdir(extract_dir)
        
        # Handle specific mapping if provided in config
        file_mapping = config_data.get('file_mapping', {})
        
        # If file mapping exists, use it
        if file_mapping:
            for source, dest in file_mapping.items():
                source_path = os.path.join(extract_dir, source)
                if os.path.exists(source_path):
                    dest_path = os.path.join(target_dir, dest)
                    # Create parent directories if needed
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    
                    if os.path.isdir(source_path):
                        if os.path.exists(dest_path):
                            shutil.rmtree(dest_path)
                        shutil.copytree(source_path, dest_path)
                    else:
                        shutil.copy2(source_path, dest_path)
                    log_message(f"Mapped {source} -> {dest}")
        else:
            # Copy all files except config.json, README, etc.
            for item in items_to_copy:
                if item.lower() not in ['config.json', 'readme.md', 'readme.txt']:
                    source_path = os.path.join(extract_dir, item)
                    dest_path = os.path.join(target_dir, item)
                    
                    if os.path.isdir(source_path):
                        if os.path.exists(dest_path):
                            shutil.rmtree(dest_path)
                        shutil.copytree(source_path, dest_path)
                    else:
                        shutil.copy2(source_path, dest_path)
                    log_message(f"Copied {item} to {target_dir}")
        
        return True
    except Exception as e:
        log_message(f"Error copying files: {str(e)}")
        return False

def run_post_integration_scripts(config_data, target_dir):
    """Run any post-integration scripts specified in the config"""
    try:
        post_scripts = config_data.get('post_integration_scripts', [])
        
        for script in post_scripts:
            script_path = os.path.join(target_dir, script)
            if os.path.exists(script_path):
                log_message(f"Running post-integration script: {script}")
                extension = os.path.splitext(script_path)[1].lower()
                
                if extension == '.py':
                    os.system(f"python {script_path}")
                elif extension == '.js':
                    os.system(f"node {script_path}")
                elif extension == '.sh':
                    os.system(f"bash {script_path}")
                else:
                    log_message(f"Unknown script type: {extension}")
                    
    except Exception as e:
        log_message(f"Error running post-integration scripts: {str(e)}")

def process_zip_file(zip_file_path):
    """Process a single zip file and integrate it into the EHB system"""
    try:
        # Extract the zip file name without extension
        zip_file_name = os.path.basename(zip_file_path)
        module_name = os.path.splitext(zip_file_name)[0]
        log_message(f"Processing zip file: {zip_file_path}")
        
        # Create a temporary extraction directory
        temp_extract_dir = f"temp/extract_{int(time.time())}"
        if not os.path.exists(temp_extract_dir):
            os.makedirs(temp_extract_dir)
        
        # Extract the zip file
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(temp_extract_dir)
            file_list = zip_ref.namelist()
            log_message(f"Extracted {len(file_list)} files to {temp_extract_dir}")
        
        # Start with empty config data
        config_data = {}
        
        # Check for config.json and process it
        config_data = process_config_file(config_data, temp_extract_dir)
        
        # If config specifies the module name, use it
        if 'module_name' in config_data:
            module_name = config_data['module_name']
        
        # Identify the module type
        module_type = identify_module_type(module_name, file_list)
        log_message(f"Identified module type: {module_type}")
        
        # If config specifies the module type, override the detected one
        if 'module_type' in config_data:
            module_type = config_data['module_type']
            log_message(f"Using config-specified module type: {module_type}")
        
        # Determine the target directory
        target_dir = determine_target_directory(module_name, module_type)
        if 'target_directory' in config_data:
            target_dir = config_data['target_directory']
            log_message(f"Using config-specified target directory: {target_dir}")
        
        log_message(f"Target directory: {target_dir}")
        
        # Copy files to the target directory
        success = copy_files_to_target(temp_extract_dir, target_dir, config_data)
        
        if success:
            # Run any post-integration scripts
            run_post_integration_scripts(config_data, target_dir)
            
            # Update EHB integration registry if specified
            if config_data.get('register_with_integration_hub', False):
                register_success = register_with_integration_hub(module_name, module_type, target_dir)
                if register_success:
                    log_message(f"Successfully registered {module_name} with Integration Hub")
                else:
                    log_message(f"Failed to register {module_name} with Integration Hub")
            
            log_message(f"Successfully integrated {module_name} into the EHB system")
            
            # Move the processed zip file to a 'processed' directory
            processed_dir = os.path.join(os.path.dirname(INPUT_ZIP_DIR), "attached_assets", "processed")
            if not os.path.exists(processed_dir):
                os.makedirs(processed_dir)
            
            shutil.move(zip_file_path, os.path.join(processed_dir, zip_file_name))
            log_message(f"Moved {zip_file_name} to {processed_dir}")
        else:
            log_message(f"Failed to integrate {module_name}")
        
        # Clean up extraction directory
        shutil.rmtree(temp_extract_dir)
        log_message(f"Cleaned up temporary extraction directory")
        
        return success
    except Exception as e:
        log_message(f"Error processing zip file {zip_file_path}: {str(e)}")
        return False

def find_zip_files():
    """Find all zip files in the input directory"""
    if not os.path.exists(INPUT_ZIP_DIR):
        log_message(f"Warning: Input directory {INPUT_ZIP_DIR} does not exist")
        return []
        
    zip_pattern = os.path.join(INPUT_ZIP_DIR, "*.zip")
    log_message(f"Looking for zip files in: {os.path.abspath(zip_pattern)}")
    
    # Use absolute path to help with debugging
    abs_pattern = os.path.abspath(zip_pattern)
    zip_files = glob.glob(abs_pattern)
    
    # Log each found zip file
    for zip_file in zip_files:
        log_message(f"Found zip file: {zip_file}")
        
    if not zip_files:
        log_message("No zip files found in the specified directory")
        
    return zip_files

def process_all_zip_files():
    """Find and process all zip files in the input directory"""
    log_message("Starting EHB zip file processing")
    
    # Make sure temp directory exists
    if not os.path.exists("temp"):
        os.makedirs("temp")
    
    # Find all zip files
    zip_files = find_zip_files()
    log_message(f"Found {len(zip_files)} zip files to process")
    
    # Process each zip file
    processed_count = 0
    for zip_file in zip_files:
        if process_zip_file(zip_file):
            processed_count += 1
    
    log_message(f"Processed {processed_count} out of {len(zip_files)} zip files")
    
    # Clean up any empty directories
    clean_empty_directories()
    
    return processed_count

def register_with_integration_hub(module_name, module_type, module_path):
    """Register a module with the Integration Hub via API call"""
    try:
        import requests
        import json
        
        # Define the integration hub API endpoint
        integration_hub_url = "http://localhost:5003/api/integration/register-module"
        
        # Prepare module data for registration
        module_data = {
            "moduleId": module_name.replace('-', ''),  # Remove hyphens for ID
            "name": module_name,
            "type": module_type,
            "path": os.path.abspath(module_path),
            "discoveredByZipProcessor": True,
            "registrationDate": datetime.now().isoformat(),
            "capabilities": detect_module_capabilities(module_path)
        }
        
        log_message(f"Attempting to register module with Integration Hub: {json.dumps(module_data)}")
        
        # Make API request to register the module
        response = requests.post(
            integration_hub_url,
            json=module_data,
            headers={"Content-Type": "application/json"},
            timeout=5  # 5 second timeout
        )
        
        if response.status_code == 200 or response.status_code == 201:
            log_message(f"Module registration successful: {response.json()}")
            return True
        else:
            log_message(f"Module registration failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_message(f"Error registering module with Integration Hub: {str(e)}")
        
        # Fallback to file-based registration if API call fails
        try:
            manifest_path = os.path.join(module_path, "module-manifest.json")
            with open(manifest_path, 'w') as manifest_file:
                manifest_data = {
                    "moduleId": module_name.replace('-', ''),
                    "name": module_name,
                    "type": module_type,
                    "registeredByZipProcessor": True,
                    "registrationDate": datetime.now().isoformat()
                }
                json.dump(manifest_data, manifest_file, indent=2)
            
            log_message(f"Created module manifest file as API registration failed: {manifest_path}")
            return True
            
        except Exception as fallback_error:
            log_message(f"Failed to create module manifest as fallback: {str(fallback_error)}")
            return False

def detect_module_capabilities(module_path):
    """Detect module capabilities based on its structure"""
    capabilities = []
    
    # Check for frontend capabilities
    frontend_path = os.path.join(module_path, 'frontend')
    if os.path.exists(frontend_path):
        capabilities.append("ui")
        
        # Check for React components
        components_path = os.path.join(frontend_path, 'components')
        if os.path.exists(components_path):
            capabilities.append("components")
        
        # Check for pages
        pages_path = os.path.join(frontend_path, 'pages')
        if os.path.exists(pages_path):
            capabilities.append("pages")
    
    # Check for backend capabilities
    backend_path = os.path.join(module_path, 'backend')
    if os.path.exists(backend_path):
        capabilities.append("api")
        
        # Check for routes
        routes_path = os.path.join(backend_path, 'routes')
        if os.path.exists(routes_path):
            capabilities.append("rest-api")
        
        # Check for controllers
        controllers_path = os.path.join(backend_path, 'controllers')
        if os.path.exists(controllers_path):
            capabilities.append("controllers")
    
    return capabilities

def clean_empty_directories():
    """Remove any empty directories in the project"""
    log_message("Cleaning up empty directories")
    
    # Walk through all directories
    for root, dirs, files in os.walk(".", topdown=False):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            try:
                # Skip certain directories
                if 'node_modules' in dir_path or '.git' in dir_path:
                    continue
                
                # Check if directory is empty
                if not os.listdir(dir_path):
                    os.rmdir(dir_path)
                    log_message(f"Removed empty directory: {dir_path}")
            except Exception as e:
                log_message(f"Error removing directory {dir_path}: {str(e)}")

def main():
    """Main function"""
    process_all_zip_files()

if __name__ == "__main__":
    main()