/**
 * Service Flow
 * Manages the flow of data between services
 */

class ServiceFlow {
  constructor() {
    this.flows = new Map();
  }
  
  /**
   * Connect two services with a data flow
   * @param {string} sourceService - Source service name
   * @param {string} targetService - Target service name
   * @param {Object} options - Flow options
   * @returns {string} Flow ID
   */
  connect(sourceService, targetService, options = {}) {
    const flowId = `flow-${Date.now()}-${Math.round(Math.random() * 1000)}`;
    
    this.flows.set(flowId, {
      id: flowId,
      source: sourceService,
      target: targetService,
      options,
      status: 'active',
      createdAt: new Date()
    });
    
    console.log(`Created flow ${flowId} from ${sourceService} to ${targetService}`);
    return flowId;
  }
  
  /**
   * Get all flows
   * @returns {Array} All flows
   */
  getAllFlows() {
    return Array.from(this.flows.values());
  }
  
  /**
   * Get flows for a specific service
   * @param {string} serviceName - Service name
   * @returns {Array} Flows for the service
   */
  getFlowsForService(serviceName) {
    return Array.from(this.flows.values()).filter(
      flow => flow.source === serviceName || flow.target === serviceName
    );
  }
  
  /**
   * Send data through a flow
   * @param {string} flowId - Flow ID
   * @param {any} data - Data to send
   * @returns {boolean} Success status
   */
  sendData(flowId, data) {
    const flow = this.flows.get(flowId);
    
    if (!flow) {
      console.error(`Flow ${flowId} not found`);
      return false;
    }
    
    console.log(`Sending data through flow ${flowId} from ${flow.source} to ${flow.target}`);
    console.log(`Data: ${JSON.stringify(data)}`);
    
    // In a real implementation, this would send the data to the target service
    
    return true;
  }
}

module.exports = { ServiceFlow };
