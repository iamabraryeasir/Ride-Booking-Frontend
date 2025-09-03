import { useSelector } from "react-redux";
import { AlertTriangle, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { USER_STATUS } from "@/constants/role";
import toast from "react-hot-toast";

export default function AccountStatusPage() {
  const user = useSelector(selectCurrentUser);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const getStatusInfo = () => {
    if (!user) return null;

    switch (user.status) {
      case USER_STATUS.BLOCKED:
        return {
          title: "Account Blocked",
          description:
            "Your account has been temporarily blocked due to policy violations.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case USER_STATUS.SUSPENDED:
        return {
          title: "Account Suspended",
          description:
            "Your account has been suspended. Please contact support for assistance.",
          icon: <Clock className="h-12 w-12 text-orange-500" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case USER_STATUS.PENDING:
        return {
          title: "Account Pending",
          description:
            "Your account is under review. We will notify you once the review is complete.",
          icon: <Clock className="h-12 w-12 text-blue-500" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              Account Status Unknown
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Unable to determine account status. Please try logging in again.
            </p>
            <Button onClick={handleLogout} disabled={isLoading}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className={`w-full max-w-lg ${statusInfo.borderColor} border-2`}>
        <CardHeader className={`${statusInfo.bgColor} rounded-t-lg`}>
          <div className="flex flex-col items-center space-y-4">
            {statusInfo.icon}
            <div className="text-center">
              <CardTitle className={`text-xl font-bold ${statusInfo.color}`}>
                {statusInfo.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {statusInfo.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Account holder: <span className="font-medium">{user.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Role:{" "}
                <span className="font-medium capitalize">
                  {user.role.toLowerCase()}
                </span>
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Need Help?
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-gray-600">
                      support@rideshare.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-xs text-gray-600">+1-800-RIDESHARE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                What to do next:
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Contact our support team using the information above</li>
                <li>• Provide your account email for faster assistance</li>
                <li>• Wait for our team to review your account status</li>
                {user.status === USER_STATUS.BLOCKED && (
                  <li>
                    • Review our community guidelines to prevent future issues
                  </li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3 pt-4">
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Logging out..." : "Return to Login"}
              </Button>

              <Button variant="outline" asChild className="w-full">
                <a href="mailto:support@rideshare.com?subject=Account Status Inquiry">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
