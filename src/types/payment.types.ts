export type TPaymentMethodType = "CASH" | "CARD" | "WALLET" | "BANK_TRANSFER";
export type TCardType = "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER";

export interface IPaymentMethod {
  _id: string;
  userId: string;
  type: TPaymentMethodType;
  isDefault: boolean;
  isActive: boolean;
  
  // Card-specific details
  cardDetails?: {
    cardType: TCardType;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    cardHolderName: string;
    nickname?: string;
  };
  
  // Wallet-specific details
  walletDetails?: {
    walletType: string;
    walletId: string;
    balance?: number;
  };
  
  // Bank transfer details
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface IAddPaymentMethodRequest {
  type: TPaymentMethodType;
  isDefault?: boolean;
  
  // Card details
  cardDetails?: {
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    cardHolderName: string;
    nickname?: string;
  };
  
  // Wallet details
  walletDetails?: {
    walletType: string;
    walletId: string;
  };
  
  // Bank details
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
  };
}

export interface IUpdatePaymentMethodRequest {
  isDefault?: boolean;
  nickname?: string;
  isActive?: boolean;
}

export interface IPaymentMethodFilters {
  type?: TPaymentMethodType;
  isDefault?: boolean;
  isActive?: boolean;
}
