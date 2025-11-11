
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, Users, Settings, Plus, Calendar, Bell, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const EmbargoManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [masterEmbargoActive, setMasterEmbargoActive] = useState(true);
  const [autoRelease, setAutoRelease] = useState(true);
  const [preReleaseNotification, setPreReleaseNotification] = useState(24);

  const [newEmbargo, setNewEmbargo] = useState({
    examTitle: "",
    startDate: "",
    endDate: "",
    authorizedUsers: "",
    notes: ""
  });

  const embargoControls = {
    masterActive: true,
    scheduledReleaseDate: "15/08/2024 09:00",
    autoRelease: true,
    preReleaseHours: 24
  };

  const examBoardStatus = [
    {
      id: 1,
      name: "AQA",
      status: "Active",
      embargoEnd: "15/08/2024 09:00",
      lastSync: "Until 2024-08-15 09:00"
    },
    {
      id: 2,
      name: "Edexcel",
      status: "Active", 
      embargoEnd: "15/08/2024 09:00",
      lastSync: "Until 2024-08-15 09:00"
    },
    {
      id: 3,
      name: "OCR",
      status: "Pending",
      embargoEnd: "15/08/2024 09:00",
      lastSync: "Until 2024-08-15 09:00"
    },
    {
      id: 4,
      name: "WJEC",
      status: "Released",
      embargoEnd: "12/08/2024 09:00",
      lastSync: "Released"
    }
  ];

  const authorizedUsers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@school.edu",
      role: "Head Teacher",
      lastAccess: "2024-06-25 14:30",
      status: "Active"
    },
    {
      id: 2,
      name: "Mark Thompson", 
      email: "mark.thompson@school.edu",
      role: "Deputy Head",
      lastAccess: "2024-06-25 09:45",
      status: "Active"
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.williams@school.edu", 
      role: "Exams Officer",
      lastAccess: "2024-06-25 16:20",
      status: "Active"
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@school.edu",
      role: "Data Manager",
      lastAccess: "Never",
      status: "Inactive"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "Released":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateEmbargo = () => {
    if (!newEmbargo.examTitle || !newEmbargo.startDate || !newEmbargo.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Embargo created successfully"
    });
    
    setNewEmbargo({
      examTitle: "",
      startDate: "",
      endDate: "",
      authorizedUsers: "",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  const handleAddAuthorizedUser = () => {
    toast({
      title: "User Added",
      description: "New authorized user has been added successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Embargo Management</h1>
          <p className="text-gray-600">Control examination result embargo rules and release schedules</p>
        </div>

        {/* Embargo Active Alert */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-900">Embargo Currently Active:</span>
            <span className="text-yellow-700">Results are restricted to authorized personnel only.</span>
          </div>
        </div>

        <Tabs defaultValue="controls" className="space-y-6">
          <TabsList>
            <TabsTrigger value="controls">Embargo Controls</TabsTrigger>
            <TabsTrigger value="examboards">Exam Board Status</TabsTrigger>
            <TabsTrigger value="users">Authorized Users</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-6">
            {/* Master Embargo Control */}
            <Card>
              <CardHeader>
                <CardTitle>Master Embargo Control</CardTitle>
                <CardDescription>Manage embargo settings and release schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Embargo Active</Label>
                    <p className="text-sm text-gray-600">Master control for all embargo restrictions</p>
                  </div>
                  <Switch 
                    checked={masterEmbargoActive} 
                    onCheckedChange={setMasterEmbargoActive}
                  />
                </div>

                <div>
                  <Label htmlFor="releaseDate">Scheduled Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="datetime-local"
                    defaultValue="2024-08-15T09:00"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Auto Release</Label>
                      <p className="text-sm text-gray-600">Enable automatic release</p>
                    </div>
                    <Switch 
                      checked={autoRelease} 
                      onCheckedChange={setAutoRelease}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preRelease">Pre-Release Notification</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="preRelease"
                        type="number"
                        value={preReleaseNotification}
                        onChange={(e) => setPreReleaseNotification(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">hours before release</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examboards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Board Status</CardTitle>
                <CardDescription>Current embargo status for each awarding organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {examBoardStatus.map((board) => (
                    <div key={board.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{board.name}</h3>
                        <Badge className={getStatusColor(board.status)}>
                          {board.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{board.lastSync}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Until {board.embargoEnd}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Authorized Users</CardTitle>
                    <CardDescription>Staff members with embargo access permissions</CardDescription>
                  </div>
                  <Button onClick={handleAddAuthorizedUser} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Authorized User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authorizedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.role} • {user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Last Access: {user.lastAccess}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmbargoManagement;
