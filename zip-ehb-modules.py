from zipfile import ZipFile
import os

# Define folder paths for the modules to be zipped
base_paths = [
    # Core Modules
    "EHB-AI-Marketplace",
    "EHB-Blockchain",
    "EHB-DASHBOARD",
    "EHB-HOME-PAGE",
    "EHB-SQL",
    "EHB-AM-AFFILIATE-SYSTEM",
    
    # Business Modules
    "GoSellr-Ecommerce",
    "EHB-Franchise",
    "JPS-Job-Providing-Service",
    
    # Service Modules
    "HPS-Education-Service",
    "WMS-World-Medical-Service",
    "OLS-Online-Law-Service",
    "EHB-Tube",
    "AG-Travelling",
    "SOT-Technologies",
    "HMS-Machinery",
    "Delivery-Service",
    
    # Legacy Modules (if they still exist)
    "EHB-AI-Dev-Fullstack",
    "EHB-Affiliate-System",
    "EHB-Blockchain-Base",
    "EHB-GoSellr-Franchise-JPS",
    "EHB-Homepage-Dashboard-UI",
    "EHB-PSS-EMO-EDR-Dashboard",
    "EHB-Services-Departments-Flow",
    "EHB-TrustyWallet-System"
]

# Create output directory if it doesn't exist
if not os.path.exists('ehb_zips'):
    os.makedirs('ehb_zips')

def zip_module(module_path):
    """
    Create a ZIP file for the given module path.
    """
    if not os.path.exists(module_path):
        print(f"Warning: Module path '{module_path}' does not exist, skipping.")
        return

    module_name = os.path.basename(module_path)
    zip_filename = f"ehb_zips/{module_name}.zip"
    
    print(f"Creating ZIP file for {module_name}...")
    
    # Directories to exclude
    exclude_dirs = ['node_modules', '.next', '.git', '__pycache__', 'dist', 'build']
    
    with ZipFile(zip_filename, 'w') as zipf:
        for root, dirs, files in os.walk(module_path):
            # Remove excluded directories from dirs to prevent os.walk from traversing them
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, os.path.dirname(module_path))
                print(f"  Adding: {arc_name}")
                zipf.write(file_path, arc_name)
    
    print(f"✅ ZIP file created: {zip_filename}")

def zip_all_modules():
    """
    Create ZIP files for all modules in base_paths.
    """
    for module_path in base_paths:
        zip_module(module_path)
    
    # Create a complete system ZIP
    create_complete_system_zip()
    
    print("\nAll modules zipped successfully!")

def create_complete_system_zip():
    """
    Create a comprehensive ZIP file of the entire EHB system.
    """
    print("\nCreating comprehensive EHB system ZIP...")
    
    # Include core documentation files
    docs_files = [
        "EHB-README.md",
        "EHB-INTEGRATION-GUIDE.md",
        "EHB-STRUCTURE-OVERVIEW.md",
        "EHB-SYSTEM-ARCHITECTURE.md"
    ]
    
    # Core system files
    system_files = [
        "package.json",
        "package-lock.json",
        "start-servers.js",
        "backend",
        "frontend"
    ]
    
    zip_filename = "ehb_zips/EHB-Complete-System.zip"
    
    # Directories to exclude
    exclude_dirs = ['node_modules', '.next', '.git', '__pycache__', 'dist', 'build']
    
    with ZipFile(zip_filename, 'w') as zipf:
        # Add documentation files
        for doc_file in docs_files:
            if os.path.exists(doc_file):
                print(f"  Adding: {doc_file}")
                zipf.write(doc_file)
        
        # Add system files
        for sys_file in system_files:
            if os.path.exists(sys_file):
                if os.path.isdir(sys_file):
                    for root, dirs, files in os.walk(sys_file):
                        # Remove excluded directories from dirs
                        dirs[:] = [d for d in dirs if d not in exclude_dirs]
                        
                        for file in files:
                            file_path = os.path.join(root, file)
                            print(f"  Adding: {file_path}")
                            zipf.write(file_path)
                else:
                    print(f"  Adding: {sys_file}")
                    zipf.write(sys_file)
        
        # Add all modules
        for module_path in base_paths:
            if os.path.exists(module_path):
                for root, dirs, files in os.walk(module_path):
                    # Remove excluded directories from dirs
                    dirs[:] = [d for d in dirs if d not in exclude_dirs]
                    
                    for file in files:
                        file_path = os.path.join(root, file)
                        print(f"  Adding: {file_path}")
                        zipf.write(file_path)
    
    print(f"✅ Complete system ZIP created: {zip_filename}")

if __name__ == "__main__":
    print("EHB Module Zipper")
    print("=================")
    zip_all_modules()