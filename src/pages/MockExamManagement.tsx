
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Calendar, Clock, Users, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const MockExamManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMockExam, setNewMockExam] = useState({
    title: "",
    subject: "",
    duration: "",
    date: "",
    time: "",
    venue: "",
    notes: ""
  });

  const mockExams = [
    {
      id: 1,
      title: "GCSE Mathematics Mock 1",
      subject: "Mathematics",
      date: "2024-11-15",
      time: "09:00",
      duration: "90 minutes",
      venue: "Main Hall",
      studentsAssigned: 145,
      status: "Scheduled"
    },
    {
      id: 2,
      title: "GCSE English Literature Mock",
      subject: "English Literature",
      date: "2024-11-18",
      time: "13:30",
      duration: "105 minutes",
      venue: "Sports Hall",
      studentsAssigned: 138,
      status: "Draft"
    },
    {
      id: 3,
      title: "A Level Psychology Mock",
      subject: "Psychology",
      date: "2024-11-12",
      time: "09:00",
      duration: "120 minutes",
      venue: "Exam Room 1",
      studentsAssigned: 67,
      status: "Completed"
    }
  ];

  const handleCreateMockExam = () => {
    if (!newMockExam.title || !newMockExam.subject || !newMockExam.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Mock exam created successfully"
    });
    
    setNewMockExam({
      title: "",
      subject: "",
      duration: "",
      date: "",
      time: "",
      venue: "",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Exam Management</h1>
            <p className="text-gray-600">Create and manage internal mock examinations</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Mock Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Mock Exam</DialogTitle>
                <DialogDescription>
                  Set up a new internal mock examination
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Exam Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., GCSE Mathematics Mock 1"
                    value={newMockExam.title}
                    onChange={(e) => setNewMockExam({ ...newMockExam, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={newMockExam.subject} onValueChange={(value) => setNewMockExam({ ...newMockExam, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English Language">English Language</SelectItem>
                      <SelectItem value="English Literature">English Literature</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMockExam.date}
                      onChange={(e) => setNewMockExam({ ...newMockExam, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMockExam.time}
                      onChange={(e) => setNewMockExam({ ...newMockExam, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 90 minutes"
                      value={newMockExam.duration}
                      onChange={(e) => setNewMockExam({ ...newMockExam, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      placeholder="e.g., Main Hall"
                      value={newMockExam.venue}
                      onChange={(e) => setNewMockExam({ ...newMockExam, venue: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this mock exam..."
                    value={newMockExam.notes}
                    onChange={(e) => setNewMockExam({ ...newMockExam, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateMockExam} className="w-full">
                  Create Mock Exam
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-12 w-12 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Mock Exams</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-12 w-12 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-12 w-12 text-orange-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">350</p>
                <p className="text-sm text-gray-600">Students Assigned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-12 w-12 text-purple-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Days to Next</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Mock Examinations</CardTitle>
            <CardDescription>
              Manage internal mock examinations and student assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockExams.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-600">Subject: {exam.subject}</p>
                    </div>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Exam Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(exam.date).toLocaleDateString()} at {exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {exam.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Venue: {exam.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Students ({exam.studentsAssigned})
                      </h4>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            Assign Students
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
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

export default MockExamManagement;
