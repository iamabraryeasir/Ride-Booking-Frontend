import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Wallet, Banknote, Building, Loader2 } from "lucide-react";
import { useAddPaymentMethodMutation } from "@/redux/features/payment/payment.api";
import type { TPaymentMethodType } from "@/types";

const addPaymentMethodSchema = z.object({
  type: z.enum(["CARD", "WALLET", "BANK_TRANSFER"]),
  isDefault: z.boolean().optional(),
  
  // Card details
  cardNumber: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  cvv: z.string().optional(),
  cardHolderName: z.string().optional(),
  nickname: z.string().optional(),
  
  // Wallet details
  walletType: z.string().optional(),
  walletId: z.string().optional(),
  
  // Bank details
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "CARD") {
    if (!data.cardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card number is required",
        path: ["cardNumber"],
      });
    }
    if (!data.expiryMonth || data.expiryMonth < 1 || data.expiryMonth > 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid expiry month is required",
        path: ["expiryMonth"],
      });
    }
    if (!data.expiryYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiry year is required",
        path: ["expiryYear"],
      });
    }
    if (!data.cvv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVV is required",
        path: ["cvv"],
      });
    }
    if (!data.cardHolderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card holder name is required",
        path: ["cardHolderName"],
      });
    }
  } else if (data.type === "WALLET") {
    if (!data.walletType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wallet type is required",
        path: ["walletType"],
      });
    }
    if (!data.walletId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wallet ID is required", 
        path: ["walletId"],
      });
    }
  } else if (data.type === "BANK_TRANSFER") {
    if (!data.accountNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account number is required",
        path: ["accountNumber"],
      });
    }
    if (!data.routingNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Routing number is required",
        path: ["routingNumber"],
      });
    }
    if (!data.bankName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank name is required",
        path: ["bankName"],
      });
    }
    if (!data.accountHolderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account holder name is required",
        path: ["accountHolderName"],
      });
    }
  }
});

type FormData = z.infer<typeof addPaymentMethodSchema>;

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodModal({ open, onOpenChange }: AddPaymentMethodModalProps) {
  const [selectedType, setSelectedType] = useState<TPaymentMethodType>("CARD");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: {
      type: "CARD",
      isDefault: false,
    },
  });

  const [addPaymentMethod, { isLoading }] = useAddPaymentMethodMutation();

  const handleTypeChange = (type: TPaymentMethodType) => {
    setSelectedType(type);
    setValue("type", type);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        type: data.type,
        isDefault: data.isDefault,
      };

      if (data.type === "CARD") {
        payload.cardDetails = {
          cardNumber: data.cardNumber,
          expiryMonth: Number(data.expiryMonth),
          expiryYear: Number(data.expiryYear),
          cvv: data.cvv,
          cardHolderName: data.cardHolderName,
          nickname: data.nickname,
        };
      } else if (data.type === "WALLET") {
        payload.walletDetails = {
          walletType: data.walletType,
          walletId: data.walletId,
        };
      } else if (data.type === "BANK_TRANSFER") {
        payload.bankDetails = {
          accountNumber: data.accountNumber,
          routingNumber: data.routingNumber,
          bankName: data.bankName,
          accountHolderName: data.accountHolderName,
        };
      }

      await addPaymentMethod(payload).unwrap();
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment Type Selection */}
          <div>
            <Label className="text-base font-medium">Payment Type</Label>
            <RadioGroup
              value={selectedType}
              onValueChange={handleTypeChange}
              className="grid grid-cols-3 gap-4 mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CARD" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WALLET" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                  <Wallet className="w-4 h-4" />
                  Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BANK_TRANSFER" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                  <Building className="w-4 h-4" />
                  Bank
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details */}
          {selectedType === "CARD" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    {...register("cardNumber")}
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cardHolderName">Card Holder Name</Label>
                  <Input
                    {...register("cardHolderName")}
                    id="cardHolderName"
                    placeholder="John Doe"
                    className={errors.cardHolderName ? "border-red-500" : ""}
                  />
                  {errors.cardHolderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardHolderName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select onValueChange={(value) => setValue("expiryMonth", Number(value))}>
                    <SelectTrigger className={errors.expiryMonth ? "border-red-500" : ""}>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select onValueChange={(value) => setValue("expiryYear", Number(value))}>
                    <SelectTrigger className={errors.expiryYear ? "border-red-500" : ""}>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    {...register("cvv")}
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  {...register("nickname")}
                  id="nickname"
                  placeholder="My primary card"
                />
              </div>
            </div>
          )}

          {/* Wallet Details */}
          {selectedType === "WALLET" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="walletType">Wallet Type</Label>
                <Select onValueChange={(value) => setValue("walletType", value)}>
                  <SelectTrigger className={errors.walletType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select wallet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                    <SelectItem value="GOOGLE_PAY">Google Pay</SelectItem>
                    <SelectItem value="APPLE_PAY">Apple Pay</SelectItem>
                    <SelectItem value="VENMO">Venmo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.walletType && (
                  <p className="text-red-500 text-xs mt-1">{errors.walletType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="walletId">Wallet ID/Email</Label>
                <Input
                  {...register("walletId")}
                  id="walletId"
                  placeholder="wallet@example.com"
                  className={errors.walletId ? "border-red-500" : ""}
                />
                {errors.walletId && (
                  <p className="text-red-500 text-xs mt-1">{errors.walletId.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {selectedType === "BANK_TRANSFER" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    {...register("bankName")}
                    id="bankName"
                    placeholder="Chase Bank"
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="accountHolderName">Account Holder</Label>
                  <Input
                    {...register("accountHolderName")}
                    id="accountHolderName"
                    placeholder="John Doe"
                    className={errors.accountHolderName ? "border-red-500" : ""}
                  />
                  {errors.accountHolderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.accountHolderName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    {...register("accountNumber")}
                    id="accountNumber"
                    placeholder="123456789"
                    className={errors.accountNumber ? "border-red-500" : ""}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    {...register("routingNumber")}
                    id="routingNumber"
                    placeholder="021000021"
                    className={errors.routingNumber ? "border-red-500" : ""}
                  />
                  {errors.routingNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.routingNumber.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isDefault" 
              onCheckedChange={(checked) => setValue("isDefault", !!checked)}
            />
            <Label 
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default payment method
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Payment Method"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
