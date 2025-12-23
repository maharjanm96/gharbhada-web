import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties, tenants, payments..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's your property overview.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Property
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Building2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-600" />
                <span className="text-green-600">12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tenants
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-600" />
                <span className="text-green-600">8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹4,85,000</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-600" />
                <span className="text-green-600">12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
              </CardTitle>
              <AlertCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="size-3 text-red-600" />
                <span className="text-red-600">2</span> require immediate
                attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>
                    Latest rent payments received
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Rajesh Kumar</TableCell>
                    <TableCell>Apartment 301</TableCell>
                    <TableCell>₹25,000</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Priya Sharma</TableCell>
                    <TableCell>Villa B-12</TableCell>
                    <TableCell>₹45,000</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Amit Patel</TableCell>
                    <TableCell>Flat 204</TableCell>
                    <TableCell>₹18,000</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-yellow-600">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sneha Reddy</TableCell>
                    <TableCell>House C-5</TableCell>
                    <TableCell>₹32,000</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Requests</CardTitle>
                  <CardDescription>Recent maintenance tickets</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                      <Wrench className="size-5 text-red-600 dark:text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Water Leakage</p>
                      <p className="text-xs text-muted-foreground">
                        Apartment 301 - Reported 2h ago
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                      <Wrench className="size-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AC Repair</p>
                      <p className="text-xs text-muted-foreground">
                        Villa B-12 - Reported 5h ago
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-yellow-600">
                    In Progress
                  </Badge>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Wrench className="size-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Door Lock Issue</p>
                      <p className="text-xs text-muted-foreground">
                        Flat 204 - Reported 1d ago
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Wrench className="size-5 text-green-600 dark:text-green-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Painting Work</p>
                      <p className="text-xs text-muted-foreground">
                        House C-5 - Reported 2d ago
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Completed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Overview */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Properties Overview</CardTitle>
                <CardDescription>
                  Manage your property portfolio
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 size-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Properties</TabsTrigger>
                <TabsTrigger value="occupied">Occupied</TabsTrigger>
                <TabsTrigger value="vacant">Vacant</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Apartment 301
                      </TableCell>
                      <TableCell>MG Road, Bangalore</TableCell>
                      <TableCell>Rajesh Kumar</TableCell>
                      <TableCell>₹25,000/mo</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          Occupied
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Villa B-12</TableCell>
                      <TableCell>Indiranagar, Bangalore</TableCell>
                      <TableCell>Priya Sharma</TableCell>
                      <TableCell>₹45,000/mo</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          Occupied
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Flat 204</TableCell>
                      <TableCell>Koramangala, Bangalore</TableCell>
                      <TableCell>Amit Patel</TableCell>
                      <TableCell>₹18,000/mo</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          Occupied
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">House C-5</TableCell>
                      <TableCell>HSR Layout, Bangalore</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>₹32,000/mo</TableCell>
                      <TableCell>
                        <Badge variant="outline">Vacant</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="occupied">
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Occupied properties will be shown here
                </div>
              </TabsContent>
              <TabsContent value="vacant">
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Vacant properties will be shown here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
