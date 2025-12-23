import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Receipt, Wrench } from "lucide-react";

export default function TenantDashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tenant Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's your rental overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Property</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Apartment 301</div>
            <p className="text-sm text-muted-foreground">
              View your rental property details, lease information, and
              documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rent Payments</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">₹25,000</div>
            <p className="text-sm text-muted-foreground">
              View payment history and manage your rent payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">2 Active</div>
            <p className="text-sm text-muted-foreground">
              Submit and track maintenance requests
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
