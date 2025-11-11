
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, Shield, User, Settings, FileText, AlertTriangle, Check } from "lucide-react";
import Navigation from "@/components/Navigation";

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const auditEntries = [
    {
      id: 1,
      action: "Results Import",
      target: "AQA Mathematics Results",
      user: "admin@school.edu",
      ipAddress: "192.168.1.100",
      timestamp: "2024-06-25 15:30:22",
      status: "Success",
      details: "Successfully imported 124 student results from AQA API",
      icon: FileText,
      color: "text-green-600"
    },
    {
      id: 2,
      action: "User Access",
      target: "Student Results (ID: 12345)",
      user: "emma.williams@school.edu",
      ipAddress: "192.168.1.105",
      timestamp: "2024-06-25 15:15:08",
      status: "Success",
      details: "Accessed embargoed results for validation review",
      icon: User,
      color: "text-blue-600"
    },
    {
      id: 3,
      action: "Embargo Update",
      target: "System Embargo Settings",
      user: "headteacher@school.edu",
      ipAddress: "192.168.1.102",
      timestamp: "2024-06-25 14:45:31",
      status: "Success",
      details: "Updated embargo end date to 2024-08-15 09:00",
      icon: Shield,
      color: "text-orange-600"
    },
    {
      id: 4,
      action: "API Sync",
      target: "Edexcel Results API",
      user: "system",
      ipAddress: "system",
      timestamp: "2024-06-25 13:30:15",
      status: "Success",
      details: "Automated sync completed - 89 records processed",
      icon: Settings,
      color: "text-purple-600"
    },
    {
      id: 5,
      action: "User Login",
      target: "Admin Dashboard",
      user: "mark.thompson@school.edu",
      ipAddress: "192.168.1.108",
      timestamp: "2024-06-25 12:22:44",
      status: "Success",
      details: "Successful login with 2FA verification",
      icon: User,
      color: "text-green-600"
    },
    {
      id: 6,
      action: "Failed Login",
      target: "Student Portal",
      user: "unknown@external.com",
      ipAddress: "203.45.67.89",
      timestamp: "2024-06-25 12:15:12",
      status: "Failed",
      details: "Multiple failed login attempts detected",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      id: 7,
      action: "Security Incident",
      target: "",
      user: "system",
      ipAddress: "203.45.67.89",
      timestamp: "2024-06-25 12:14:30",
      status: "Alert",
      details: "Security incident detected - requires attention",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || entry.action.toLowerCase().replace(" ", "") === actionFilter;
    const matchesStatus = statusFilter === "all" || entry.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Alert":
        return "bg-red-100 text-red-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportLogs = () => {
    // Simulate export functionality
    console.log("Exporting audit logs...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
          <p className="text-gray-600">Complete log of system activities and user actions</p>
        </div>

        {/* Security Alert */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Security Incident detected - requires attention</span>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user, action, or target..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="resultsimport">Results Import</SelectItem>
                  <SelectItem value="useraccess">User Access</SelectItem>
                  <SelectItem value="embargoupdate">Embargo Update</SelectItem>
                  <SelectItem value="apisync">API Sync</SelectItem>
                  <SelectItem value="userlogin">User Login</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportLogs} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Entries */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
            <CardDescription>{filteredEntries.length} entries found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-gray-50 ${entry.color}`}>
                      <entry.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{entry.action}</h3>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                      
                      {entry.target && (
                        <p className="text-sm text-gray-600 mb-1">{entry.target}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">User:</span> {entry.user}
                        </div>
                        <div>
                          <span className="font-medium">IP Address:</span> {entry.ipAddress}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-700">{entry.details}</p>
                        <span className="text-xs text-gray-500">{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
