import React, { useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUpdatePaymentMethodMutation } from "@/redux/features/payment/payment.api";
import type { IPaymentMethod } from "@/types";

const editPaymentMethodSchema = z.object({
  nickname: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof editPaymentMethodSchema>;

interface EditPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: IPaymentMethod;
}

export function EditPaymentMethodModal({ 
  open, 
  onOpenChange, 
  paymentMethod 
}: EditPaymentMethodModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(editPaymentMethodSchema),
  });

  const [updatePaymentMethod, { isLoading }] = useUpdatePaymentMethodMutation();

  // Set initial values when payment method changes
  useEffect(() => {
    if (paymentMethod) {
      setValue("nickname", paymentMethod.cardDetails?.nickname || "");
      setValue("isDefault", paymentMethod.isDefault);
    }
  }, [paymentMethod, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const updateData: any = {};
      
      if (data.nickname !== undefined && data.nickname !== paymentMethod.cardDetails?.nickname) {
        updateData.nickname = data.nickname;
      }
      
      if (data.isDefault !== undefined && data.isDefault !== paymentMethod.isDefault) {
        updateData.isDefault = data.isDefault;
      }

      if (Object.keys(updateData).length > 0) {
        await updatePaymentMethod({
          paymentMethodId: paymentMethod._id,
          update: updateData,
        }).unwrap();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update payment method:", error);
    }
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod.type) {
      case "CARD":
        return `${paymentMethod.cardDetails?.cardType || 'Card'} •••• ${paymentMethod.cardDetails?.lastFourDigits}`;
      case "WALLET":
        return `${paymentMethod.walletDetails?.walletType || 'Wallet'} - ${paymentMethod.walletDetails?.walletId}`;
      case "CASH":
        return "Cash Payment";
      case "BANK_TRANSFER":
        return `${paymentMethod.bankDetails?.bankName || 'Bank'} - •••• ${paymentMethod.bankDetails?.accountNumber?.slice(-4)}`;
      default:
        return "Unknown Payment Method";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payment Method</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">{getPaymentMethodLabel()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {paymentMethod.type.replace('_', ' ')} • Added {new Date(paymentMethod.createdAt).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nickname (only for cards) */}
          {paymentMethod.type === "CARD" && (
            <div>
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                {...register("nickname")}
                id="nickname"
                placeholder="My primary card"
                defaultValue={paymentMethod.cardDetails?.nickname || ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Give this card a memorable name
              </p>
            </div>
          )}

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isDefault" 
              defaultChecked={paymentMethod.isDefault}
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
                  Updating...
                </>
              ) : (
                "Update Payment Method"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
