/**
 * EHB Organize Structure
 * 
 * This is the main script that orchestrates the entire reorganization process
 * by executing all the steps in the EHB organization plan in sequence.
 * 
 * Steps:
 * 1. Prepare and clean existing folders
 * 2. Create main category directories
 * 3. Move folders to categorized structure
 * 4. Save folder mapping
 * 5. Setup internal API connections and linking
 * 6. Home/Dashboard/Marketplace Sync
 * 7. Confirm and activate flow
 */

const fs = require('fs');
const path = require('path');
const { organizeEHBFolders } = require('./ehb-folder-organizer');
const { setupServiceConnections } = require('./ehb-service-connector');
const { synchronizeServices } = require('./ehb-service-sync');

// Root directory
const ROOT_DIR = path.resolve('.');

/**
 * Log messages to console with timestamp
 */
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Final step: Confirm and create a report
 */
function generateReport(results) {
  log('Generating final report');
  
  const reportPath = path.join(ROOT_DIR, 'ehb-reorganization-report.json');
  const report = {
    ...results,
    success: true,
    completedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report generated at: ${reportPath}`);
  
  // Also create a readable summary
  const summaryPath = path.join(ROOT_DIR, 'ehb-reorganization-summary.txt');
  
  const summaryContent = `
====================================================
EHB SYSTEM REORGANIZATION SUMMARY
====================================================
Completed at: ${new Date().toISOString()}

FOLDER ORGANIZATION:
----------------------------------------------------
- Total directories processed: ${results.folderResults.allDirectories.length}
- Categories created: ${Object.keys(results.folderResults.FOLDER_MAPPING).length}
- Folders successfully moved: ${results.folderResults.moveResults.success.length}
- Folders failed to move: ${results.folderResults.moveResults.failure.length}

API CONNECTIONS:
----------------------------------------------------
- Dashboard connections: ${results.connectionResults.dashboardConnections.length}
- SQL connections: ${results.connectionResults.sqlConnections.length}
- AI connections: ${results.connectionResults.aiConnections.length}
- Total connections: ${results.connectionResults.totalConnections}

SERVICE SYNCHRONIZATION:
----------------------------------------------------
- Services synced with EHB-HOME: ${results.syncResults.homeResult.servicesCount}
- Services synced with EHB-DASHBOARD: ${results.syncResults.dashboardResult.servicesCount}
- Services synced with EHB-AI-Marketplace: ${results.syncResults.marketplaceResult.servicesCount}

CONCLUSION:
----------------------------------------------------
The EHB system has been successfully reorganized according
to the standardized structure. All services are now properly
categorized, connected, and synchronized.

For detailed information, please refer to:
- ehb-folder-mapping.json
- ehb-connections-manifest.json
- Services directories in each main UI module
====================================================
`;
  
  fs.writeFileSync(summaryPath, summaryContent);
  log(`Summary generated at: ${summaryPath}`);
  
  return {
    reportPath,
    summaryPath,
    success: true
  };
}

/**
 * Main function to orchestrate the reorganization
 */
async function reorganizeEHBSystem() {
  log('Starting EHB system reorganization');
  
  // Execute each step and save the results
  try {
    // Step 1-4: Organize folders
    log('STEPS 1-4: Organizing folders');
    const folderResults = await organizeEHBFolders();
    log('Folder organization completed');
    
    // Step 5: Setup service connections
    log('STEP 5: Setting up service connections');
    const connectionResults = await setupServiceConnections();
    log('Service connections setup completed');
    
    // Step 6: Synchronize services
    log('STEP 6: Synchronizing services');
    const syncResults = await synchronizeServices();
    log('Service synchronization completed');
    
    // Step 7: Generate report
    log('STEP 7: Finalizing reorganization');
    const finalResults = {
      folderResults,
      connectionResults,
      syncResults
    };
    const reportResults = generateReport(finalResults);
    
    log('EHB system reorganization completed successfully');
    
    return {
      ...finalResults,
      reportResults,
      success: true
    };
  } catch (error) {
    log(`Error during reorganization: ${error.message}`);
    return {
      error: error.message,
      stack: error.stack,
      success: false
    };
  }
}

// Execute if run directly
if (require.main === module) {
  reorganizeEHBSystem()
    .then(results => {
      if (results.success) {
        log('Reorganization completed successfully');
      } else {
        log('Reorganization failed');
      }
    })
    .catch(error => {
      log(`Unhandled error: ${error.message}`);
    });
}

module.exports = {
  reorganizeEHBSystem
};