// src/contracts/WorkTokenProgram/index.js
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

class WorkTokenProgram {
  constructor(connection) {
    this.connection = connection;
  }

  async distributeReward(fromWallet, toWallet, amount) {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(fromWallet),
          toPubkey: new PublicKey(toWallet),
          lamports: amount * 1000000000, // Convert SOL to lamports
        })
      );

      const signature = await this.connection.sendTransaction(transaction, [fromWallet]);
      await this.connection.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error('Error distributing reward:', error);
      throw error;
    }
  }

  async getRewardHistory(wallet) {
    try {
      const history = await this.connection.getSignaturesForAddress(
        new PublicKey(wallet)
      );
      return history;
    } catch (error) {
      console.error('Error getting reward history:', error);
      throw error;
    }
  }
}

export default WorkTokenProgram;