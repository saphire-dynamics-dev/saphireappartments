const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export class PaystackService {
  static async initializeTransaction(data) {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to initialize transaction');
      }

      return result;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw error;
    }
  }

  static async verifyTransaction(reference) {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to verify transaction');
      }

      return result;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw error;
    }
  }

  static async getTransaction(transactionId) {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get transaction');
      }

      return result;
    } catch (error) {
      console.error('Paystack get transaction error:', error);
      throw error;
    }
  }

  static async createCustomer(customerData) {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create customer');
      }

      return result;
    } catch (error) {
      console.error('Paystack create customer error:', error);
      throw error;
    }
  }
}

export const getPaystackPublicKey = () => PAYSTACK_PUBLIC_KEY;
