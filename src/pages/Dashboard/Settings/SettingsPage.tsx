import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, RefreshCcw } from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useResetSettingsMutation,
} from "@/redux/features/settings/settings.api";
import {
  useGetEmergencyContactsQuery,
  useAddEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
} from "@/redux/features/emergency/emergency.api";

export default function SettingsPage() {
  const { data: settingsResponse } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [resetSettings, { isLoading: isResetting }] =
    useResetSettingsMutation();
  const settings = settingsResponse?.data;

  const { data: contactsResponse } = useGetEmergencyContactsQuery();
  const [addContact] = useAddEmergencyContactMutation();
  const [updateContact] = useUpdateEmergencyContactMutation();
  const [deleteContact] = useDeleteEmergencyContactMutation();
  const contacts = contactsResponse?.data || [];

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handleToggle = async (path: string, value: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nested: any = {};
    const [group, key] = path.split(".");
    nested[group] = { [key]: value };
    await updateSettings(nested).unwrap();
  };

  const handleReset = async () => {
    await resetSettings().unwrap();
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship)
      return;
    await addContact(newContact).unwrap();
    setNewContact({ name: "", phone: "", relationship: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button variant="outline" onClick={handleReset} disabled={isResetting}>
          <RefreshCcw className="w-4 h-4 mr-2" /> Reset to Default
        </Button>
      </div>

      <Tabs defaultValue="preferences">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and receipts via email
                  </p>
                </div>
                <Switch
                  checked={!!settings?.notifications?.email}
                  onCheckedChange={(v) =>
                    handleToggle("notifications.email", v)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get ride status updates via SMS
                  </p>
                </div>
                <Switch
                  checked={!!settings?.notifications?.sms}
                  onCheckedChange={(v) => handleToggle("notifications.sms", v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Enable push notifications
                  </p>
                </div>
                <Switch
                  checked={!!settings?.notifications?.push}
                  onCheckedChange={(v) => handleToggle("notifications.push", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show profile to drivers</p>
                  <p className="text-sm text-muted-foreground">
                    Allow drivers to view limited profile info
                  </p>
                </div>
                <Switch
                  checked={!!settings?.privacy?.showProfileToDrivers}
                  onCheckedChange={(v) =>
                    handleToggle("privacy.showProfileToDrivers", v)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share ride stats</p>
                  <p className="text-sm text-muted-foreground">
                    Help improve services by sharing anonymized data
                  </p>
                </div>
                <Switch
                  checked={!!settings?.privacy?.shareRideStats}
                  onCheckedChange={(v) =>
                    handleToggle("privacy.shareRideStats", v)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input
                    value={newContact.relationship}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        relationship: e.target.value,
                      })
                    }
                    placeholder="Spouse"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddContact}>
                  <Plus className="w-4 h-4 mr-2" /> Add Contact
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {contacts.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        defaultValue={c.name}
                        onBlur={(e) =>
                          updateContact({
                            contactId: c._id,
                            update: { name: e.target.value },
                          })
                        }
                      />
                      <Input
                        defaultValue={c.phone}
                        onBlur={(e) =>
                          updateContact({
                            contactId: c._id,
                            update: { phone: e.target.value },
                          })
                        }
                      />
                      <Input
                        defaultValue={c.relationship}
                        onBlur={(e) =>
                          updateContact({
                            contactId: c._id,
                            update: { relationship: e.target.value },
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="ml-3"
                      onClick={() => deleteContact(c._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No emergency contacts yet. Add one above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Safety Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-share location on SOS</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically share live location with contacts when SOS is
                    triggered
                  </p>
                </div>
                <Switch
                  checked={!!settings?.safety?.autoShareLocationOnSOS}
                  onCheckedChange={(v) =>
                    handleToggle("safety.autoShareLocationOnSOS", v)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
