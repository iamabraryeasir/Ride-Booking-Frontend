import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  CreditCard, 
  Wallet, 
  Banknote, 
  MoreVertical,
  Check,
  Trash2,
  Edit,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  useGetPaymentMethodsQuery,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} from "@/redux/features/payment/payment.api";
import type { IPaymentMethod } from "@/types";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import { EditPaymentMethodModal } from "./EditPaymentMethodModal";

export default function PaymentMethods() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<IPaymentMethod | null>(null);

  const {
    data: paymentMethodsResponse,
    isLoading,
    error,
  } = useGetPaymentMethodsQuery();

  const [setDefault, { isLoading: isSettingDefault }] = useSetDefaultPaymentMethodMutation();
  const [deleteMethod, { isLoading: isDeleting }] = useDeletePaymentMethodMutation();

  const paymentMethods = paymentMethodsResponse?.data || [];

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefault(paymentMethodId).unwrap();
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      try {
        await deleteMethod(paymentMethodId).unwrap();
      } catch (error) {
        console.error("Failed to delete payment method:", error);
      }
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "CARD":
        return <CreditCard className="w-5 h-5" />;
      case "WALLET":
        return <Wallet className="w-5 h-5" />;
      case "CASH":
        return <Banknote className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method: IPaymentMethod) => {
    switch (method.type) {
      case "CARD":
        return `${method.cardDetails?.cardType || 'Card'} •••• ${method.cardDetails?.lastFourDigits}`;
      case "WALLET":
        return `${method.walletDetails?.walletType || 'Wallet'} - ${method.walletDetails?.walletId}`;
      case "CASH":
        return "Cash Payment";
      case "BANK_TRANSFER":
        return `${method.bankDetails?.bankName || 'Bank'} - •••• ${method.bankDetails?.accountNumber?.slice(-4)}`;
      default:
        return "Unknown Payment Method";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading payment methods...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">Failed to load payment methods</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">
            Manage your payment methods for seamless ride payments
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods List */}
      <div className="grid gap-4">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <Card key={method._id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getPaymentMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {getPaymentMethodLabel(method)}
                        {method.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.type === "CARD" && method.cardDetails?.nickname && (
                          <span>{method.cardDetails.nickname}</span>
                        )}
                        {method.type === "CARD" && method.cardDetails?.expiryMonth && method.cardDetails?.expiryYear && (
                          <span className="ml-2">Expires {method.cardDetails.expiryMonth.toString().padStart(2, '0')}/{method.cardDetails.expiryYear}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method._id)}
                        disabled={isSettingDefault}
                      >
                        {isSettingDefault ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Set Default"
                        )}
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingMethod(method)}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(method._id)}
                          className="cursor-pointer text-red-600"
                          disabled={method.isDefault || isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
              <p className="text-muted-foreground mb-4">
                Add a payment method to start booking rides seamlessly
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <AddPaymentMethodModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      {editingMethod && (
        <EditPaymentMethodModal 
          open={!!editingMethod} 
          onOpenChange={(open) => !open && setEditingMethod(null)}
          paymentMethod={editingMethod}
        />
      )}
    </div>
  );
}
