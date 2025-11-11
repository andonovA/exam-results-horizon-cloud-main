
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, FileText, Shield, TrendingUp, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const [currentSeason] = useState({
    name: "May 2024",
    status: "Active",
    embargoEnd: "2024-08-15",
    totalExams: 156,
    assignedStudents: 847,
    completedExams: 89
  });

  const quickStats = [
    { title: "Active Seasons", value: "3", icon: Calendar, color: "text-blue-600" },
    { title: "Total Students", value: "1,247", icon: Users, color: "text-green-600" },
    { title: "Pending Results", value: "23", icon: FileText, color: "text-orange-600" },
    { title: "Embargoed Results", value: "5", icon: Shield, color: "text-red-600" }
  ];

  const recentActivity = [
    { action: "Results imported", subject: "AQA Mathematics", time: "2 hours ago" },
    { action: "Embargo set", subject: "OCR English Literature", time: "1 day ago" },
    { action: "Students assigned", subject: "Edexcel Biology", time: "2 days ago" },
    { action: "Season published", subject: "Summer 2024", time: "1 week ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Examination Results Management</h1>
          <p className="text-gray-600">Comprehensive platform for KS4/KS5 examination lifecycle management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center p-6">
                <stat.icon className={`h-12 w-12 ${stat.color} mr-4`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Season Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Season: {currentSeason.name}
              </CardTitle>
              <CardDescription>Overview of active examination season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Season Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {currentSeason.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Embargo Ends</span>
                  <span className="text-sm text-gray-600">{currentSeason.embargoEnd}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exams Completed</span>
                    <span>{currentSeason.completedExams}/{currentSeason.totalExams}</span>
                  </div>
                  <Progress value={(currentSeason.completedExams / currentSeason.totalExams) * 100} className="w-full" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => navigate('/season-management')} size="sm">
                    Manage Season
                  </Button>
                  <Button onClick={() => navigate('/results-management')} variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/exam-setup')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Setup New Exams
                </Button>
                <Button 
                  onClick={() => navigate('/student-assignment')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign Students
                </Button>
                <Button 
                  onClick={() => navigate('/analytics')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  onClick={() => navigate('/embargo-management')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Embargo Controls
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
