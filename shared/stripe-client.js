/**
 * EHB Shared Stripe Client
 * 
 * This module provides a centralized Stripe client that can be used
 * across different services in the EHB ecosystem. It handles initialization,
 * payment processing, subscription management, and basic operations.
 * 
 * @version 1.0.0
 * @date 2025-05-13
 */

const Stripe = require('stripe');

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLIC_KEY;
const DEBUG = process.env.NODE_ENV !== 'production';

// Singleton instance
let stripeInstance = null;

/**
 * Get or initialize the Stripe client
 * @returns {Object} The Stripe client instance
 */
function getClient() {
  if (!stripeInstance) {
    if (!STRIPE_SECRET_KEY) {
      console.warn('Missing Stripe credentials. Create client with dummy values to prevent crashes.');
      // Create a non-functional client to prevent crashes
      stripeInstance = {
        paymentIntents: {
          create: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          retrieve: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          update: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          cancel: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        },
        customers: {
          create: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          retrieve: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          update: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          delete: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        },
        subscriptions: {
          create: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          retrieve: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          update: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          cancel: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        },
        _isConnected: false,
      };
      return stripeInstance;
    }

    try {
      stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16', // Use the latest stable API version
        appInfo: {
          name: 'EHB System',
          version: '1.0.0',
        },
      });
      console.log('Stripe client initialized successfully');
    } catch (error) {
      console.error('Error initializing Stripe client:', error);
      throw error;
    }
  }
  
  return stripeInstance;
}

/**
 * Test the Stripe connection
 * @returns {Promise<Object>} Connection test results
 */
async function testConnection() {
  try {
    if (!STRIPE_SECRET_KEY) {
      return {
        connected: false,
        error: 'Missing Stripe credentials',
        details: 'Please configure STRIPE_SECRET_KEY environment variable'
      };
    }

    const stripe = getClient();
    
    // Try to retrieve account information (lightweight test)
    const account = await stripe.accounts.retrieve();
    
    return {
      connected: true,
      accountType: account.type,
      accountId: account.id,
      country: account.country,
      details: account.details_submitted ? 'Complete' : 'Incomplete'
    };
  } catch (error) {
    console.error('Error testing Stripe connection:', error);
    return {
      connected: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Connection error'
    };
  }
}

/**
 * Create a payment intent for a one-time payment
 * @param {Object} options Payment options
 * @param {number} options.amount Amount in cents
 * @param {string} options.currency Currency code (default: 'usd')
 * @param {string} options.description Description of the payment
 * @param {string} options.customerId Stripe customer ID (optional)
 * @returns {Promise<Object>} Created payment intent
 */
async function createPaymentIntent(options) {
  try {
    const { amount, currency = 'usd', description, customerId, metadata = {} } = options;
    
    if (!amount) {
      throw new Error('Amount is required');
    }
    
    const stripe = getClient();
    
    const paymentIntentOptions = {
      amount,
      currency,
      description,
      metadata,
    };
    
    if (customerId) {
      paymentIntentOptions.customer = customerId;
    }
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    
    return {
      success: true,
      paymentIntent,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error creating payment'
    };
  }
}

/**
 * Create a subscription
 * @param {Object} options Subscription options
 * @param {string} options.customerId Stripe customer ID
 * @param {string} options.priceId Stripe price ID
 * @param {string} options.paymentMethod Payment method ID (optional)
 * @returns {Promise<Object>} Created subscription
 */
async function createSubscription(options) {
  try {
    const { customerId, priceId, paymentMethod, metadata = {} } = options;
    
    if (!customerId || !priceId) {
      throw new Error('Customer ID and price ID are required');
    }
    
    const stripe = getClient();
    
    const subscriptionOptions = {
      customer: customerId,
      items: [{
        price: priceId,
      }],
      metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    };
    
    if (paymentMethod) {
      subscriptionOptions.default_payment_method = paymentMethod;
    }
    
    const subscription = await stripe.subscriptions.create(subscriptionOptions);
    
    return {
      success: true,
      subscription,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error creating subscription'
    };
  }
}

/**
 * Create a customer in Stripe
 * @param {Object} options Customer options
 * @param {string} options.email Customer email
 * @param {string} options.name Customer name
 * @param {Object} options.metadata Additional metadata
 * @returns {Promise<Object>} Created customer
 */
async function createCustomer(options) {
  try {
    const { email, name, metadata = {} } = options;
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    const stripe = getClient();
    
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    
    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error creating customer'
    };
  }
}

/**
 * Get public configuration for client-side use
 * @returns {Object} Public configuration
 */
function getPublicConfig() {
  return {
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  };
}

// Export the Stripe interface
module.exports = {
  stripe: getClient(),
  getClient,
  testConnection,
  createPaymentIntent,
  createSubscription,
  createCustomer,
  getPublicConfig,
};