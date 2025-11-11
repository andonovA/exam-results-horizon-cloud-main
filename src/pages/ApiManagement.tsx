
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus, Wifi, WifiOff, RefreshCw, Shield, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const ApiManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: "",
    organization: "",
    apiUrl: "",
    authMethod: "",
    credentials: "",
    description: ""
  });

  const apiConnections = [
    {
      id: 1,
      name: "AQA Results API",
      organization: "AQA",
      status: "Connected",
      lastSync: "2024-08-15T09:30:00",
      endpoint: "https://api.aqa.org.uk/results/v2",
      authMethod: "OAuth2",
      syncFrequency: "Daily at 09:00"
    },
    {
      id: 2,
      name: "OCR Results Feed",
      organization: "OCR",
      status: "Error",
      lastSync: "2024-08-14T15:45:00",
      endpoint: "https://results.ocr.org.uk/api/v1",
      authMethod: "API Key",
      syncFrequency: "Every 6 hours"
    },
    {
      id: 3,
      name: "Edexcel Data Portal",
      organization: "Edexcel",
      status: "Disconnected",
      lastSync: "2024-08-10T12:00:00",
      endpoint: "https://portal.edexcel.com/api/results",
      authMethod: "JWT Token",
      syncFrequency: "Manual"
    }
  ];

  const syncLogs = [
    {
      id: 1,
      timestamp: "2024-08-15T09:30:15",
      organization: "AQA",
      status: "Success",
      recordsProcessed: 1247,
      message: "Successfully synced all available results"
    },
    {
      id: 2,
      timestamp: "2024-08-15T03:00:12",
      organization: "OCR",
      status: "Failed",
      recordsProcessed: 0,
      message: "Authentication failed - token expired"
    },
    {
      id: 3,
      timestamp: "2024-08-14T21:15:08",
      organization: "AQA",
      status: "Partial",
      recordsProcessed: 892,
      message: "Some records failed validation"
    }
  ];

  const handleCreateConnection = () => {
    if (!newConnection.name || !newConnection.organization || !newConnection.apiUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "API connection created successfully"
    });
    
    setNewConnection({
      name: "",
      organization: "",
      apiUrl: "",
      authMethod: "",
      credentials: "",
      description: ""
    });
    setIsDialogOpen(false);
  };

  const handleTestConnection = (connectionId: number) => {
    toast({
      title: "Testing Connection",
      description: "Testing API connection and authentication..."
    });
  };

  const handleManualSync = (connectionId: number) => {
    toast({
      title: "Sync Started",
      description: "Manual synchronization initiated"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "bg-green-100 text-green-800";
      case "Error":
        return "bg-red-100 text-red-800";
      case "Disconnected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Management</h1>
            <p className="text-gray-600">Manage exam board API connections and data synchronization</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add API Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New API Connection</DialogTitle>
                <DialogDescription>
                  Configure a new exam board API connection
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Connection Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., AQA Results API"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    placeholder="e.g., AQA, OCR, Edexcel"
                    value={newConnection.organization}
                    onChange={(e) => setNewConnection({ ...newConnection, organization: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="apiUrl">API Endpoint URL *</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://api.example.com/v1/results"
                    value={newConnection.apiUrl}
                    onChange={(e) => setNewConnection({ ...newConnection, apiUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="authMethod">Authentication Method</Label>
                  <Input
                    id="authMethod"
                    placeholder="e.g., OAuth2, API Key, JWT"
                    value={newConnection.authMethod}
                    onChange={(e) => setNewConnection({ ...newConnection, authMethod: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="credentials">Credentials/Keys</Label>
                  <Textarea
                    id="credentials"
                    placeholder="Enter API keys, tokens, or other credentials..."
                    value={newConnection.credentials}
                    onChange={(e) => setNewConnection({ ...newConnection, credentials: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional notes about this connection..."
                    value={newConnection.description}
                    onChange={(e) => setNewConnection({ ...newConnection, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateConnection} className="w-full">
                  Create Connection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* API Connections */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Connections</CardTitle>
            <CardDescription>
              Manage connections to exam board APIs for automated results retrieval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {apiConnections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-600">{connection.organization}</p>
                      <p className="text-sm text-gray-500 mt-1">{connection.endpoint}</p>
                    </div>
                    <Badge className={getStatusColor(connection.status)}>
                      {connection.status === "Connected" && <Wifi className="h-3 w-3 mr-1" />}
                      {connection.status === "Disconnected" && <WifiOff className="h-3 w-3 mr-1" />}
                      {connection.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Connection Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Auth: {connection.authMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Sync: {connection.syncFrequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          <span>Last: {new Date(connection.lastSync).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTestConnection(connection.id)}
                        >
                          <Wifi className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleManualSync(connection.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Synchronization Logs</CardTitle>
            <CardDescription>
              Recent API synchronization attempts and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {syncLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{log.organization}</h4>
                        <Badge className={getLogStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{log.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()} • {log.recordsProcessed} records
                      </p>
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

export default ApiManagement;
