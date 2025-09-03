/**
 * Node Modules
 */
import React, { useState } from "react";

/**
 * UI Components
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Icons
 */
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  Camera,
  Plus,
  Edit,
  Trash2,
  Shield,
  Bell,
  Settings,
  Star,
} from "lucide-react";

/**
 * Types
 */
interface PaymentMethod {
  id: string;
  type: "card" | "digital_wallet";
  brand?: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface RiderProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    profilePhoto?: string;
  };
  homeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  workAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethods: PaymentMethod[];
  emergencyContacts: EmergencyContact[];
  preferences: {
    notifications: {
      push: boolean;
      sms: boolean;
      email: boolean;
    };
    privacy: {
      shareLocation: boolean;
      shareRideHistory: boolean;
    };
    accessibility: {
      requireAccessibleVehicle: boolean;
      requireChildSeat: boolean;
    };
  };
  stats: {
    totalRides: number;
    rating: number;
    memberSince: string;
  };
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<RiderProfile>({
    id: "rider-123",
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      dateOfBirth: "1990-05-15",
      profilePhoto: "/api/placeholder/120/120",
    },
    homeAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    workAddress: {
      street: "456 Corporate Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "USA",
    },
    paymentMethods: [
      {
        id: "pm1",
        type: "card",
        brand: "Visa",
        last4: "1234",
        expiryDate: "12/26",
        isDefault: true,
      },
      {
        id: "pm2",
        type: "card",
        brand: "Mastercard",
        last4: "5678",
        expiryDate: "08/25",
        isDefault: false,
      },
    ],
    emergencyContacts: [
      {
        id: "ec1",
        name: "Jane Doe",
        phone: "+1-555-0456",
        relationship: "Spouse",
      },
      {
        id: "ec2",
        name: "Robert Doe",
        phone: "+1-555-0789",
        relationship: "Brother",
      },
    ],
    preferences: {
      notifications: {
        push: true,
        sms: true,
        email: false,
      },
      privacy: {
        shareLocation: true,
        shareRideHistory: false,
      },
      accessibility: {
        requireAccessibleVehicle: false,
        requireChildSeat: false,
      },
    },
    stats: {
      totalRides: 247,
      rating: 4.9,
      memberSince: "2022-03-15",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: "card" as const,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handlePersonalInfoSave = () => {
    // In real app, this would save to backend
    setIsEditing(false);
    console.log("Profile updated");
  };

  const handlePreferenceChange = (
    category: keyof typeof profile.preferences,
    key: string,
    value: boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [key]: value,
        },
      },
    }));
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: newPayment.type,
      brand: "Visa", // Would be detected from card number
      last4: newPayment.cardNumber.slice(-4),
      expiryDate: newPayment.expiryDate,
      isDefault: profile.paymentMethods.length === 0,
    };

    setProfile((prev) => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newMethod],
    }));

    setNewPayment({
      type: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      name: "",
    });
    setShowAddPayment(false);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((pm) => pm.id !== id),
    }));
  };

  const handleSetDefaultPayment = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    }));
  };

  const handleAddEmergencyContact = () => {
    const contact: EmergencyContact = {
      id: `ec${Date.now()}`,
      ...newContact,
    };

    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact],
    }));

    setNewContact({
      name: "",
      phone: "",
      relationship: "",
    });
    setShowAddContact(false);
  };

  const handleDeleteEmergencyContact = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((ec) => ec.id !== id),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.personalInfo.profilePhoto} />
                  <AvatarFallback className="text-lg">
                    {profile.personalInfo.firstName[0]}
                    {profile.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {profile.personalInfo.firstName}{" "}
                  {profile.personalInfo.lastName}
                </h2>
                <p className="text-gray-600">{profile.personalInfo.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {profile.stats.rating}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {profile.stats.totalRides} rides
                  </span>
                  <span className="text-gray-500 text-sm">
                    Member since{" "}
                    {new Date(profile.stats.memberSince).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          firstName: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          lastName: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.personalInfo.email}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.personalInfo.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        dateOfBirth: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handlePersonalInfoSave} size="sm">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Home Address */}
              <div>
                <Label className="text-sm font-medium">Home</Label>
                <p className="text-sm text-gray-600">
                  {profile.homeAddress.street}, {profile.homeAddress.city},{" "}
                  {profile.homeAddress.state} {profile.homeAddress.zipCode}
                </p>
              </div>

              {profile.workAddress && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Work</Label>
                    <p className="text-sm text-gray-600">
                      {profile.workAddress.street}, {profile.workAddress.city},{" "}
                      {profile.workAddress.state} {profile.workAddress.zipCode}
                    </p>
                  </div>
                </>
              )}

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Add a new credit/debit card to your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={newPayment.cardNumber}
                        onChange={(e) =>
                          setNewPayment((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={newPayment.expiryDate}
                          onChange={(e) =>
                            setNewPayment((prev) => ({
                              ...prev,
                              expiryDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={newPayment.cvv}
                          onChange={(e) =>
                            setNewPayment((prev) => ({
                              ...prev,
                              cvv: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={newPayment.name}
                        onChange={(e) =>
                          setNewPayment((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddPaymentMethod}
                        className="flex-1"
                      >
                        Add Card
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddPayment(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
              <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                    <DialogDescription>
                      Add someone we can contact in case of emergency
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Name</Label>
                      <Input
                        id="contactName"
                        placeholder="Jane Doe"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="+1-555-0456"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewContact((prev) => ({
                            ...prev,
                            relationship: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddEmergencyContact}
                        className="flex-1"
                      >
                        Add Contact
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddContact(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">
                        {contact.phone} • {contact.relationship}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmergencyContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-gray-600">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.push}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("notifications", "push", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS Notifications</p>
                    <p className="text-xs text-gray-600">
                      Receive text messages for important updates
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.sms}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("notifications", "sms", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-gray-600">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("notifications", "email", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy */}
            <div>
              <h4 className="font-medium mb-3">Privacy & Security</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Share Location</p>
                    <p className="text-xs text-gray-600">
                      Allow emergency contacts to see your location during rides
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.shareLocation}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "privacy",
                        "shareLocation",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Share Ride History</p>
                    <p className="text-xs text-gray-600">
                      Allow emergency contacts to see your recent rides
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.shareRideHistory}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "privacy",
                        "shareRideHistory",
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Accessibility */}
            <div>
              <h4 className="font-medium mb-3">
                Accessibility & Special Needs
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Wheelchair Accessible Vehicle
                    </p>
                    <p className="text-xs text-gray-600">
                      Always request wheelchair accessible vehicles
                    </p>
                  </div>
                  <Switch
                    checked={
                      profile.preferences.accessibility.requireAccessibleVehicle
                    }
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "accessibility",
                        "requireAccessibleVehicle",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Child Car Seat</p>
                    <p className="text-xs text-gray-600">
                      Always request vehicles with child car seats
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.accessibility.requireChildSeat}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "accessibility",
                        "requireChildSeat",
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
