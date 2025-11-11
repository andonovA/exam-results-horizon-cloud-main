
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, FileText, Award, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const performanceData = [
    { subject: "Mathematics", currentYear: 85, previousYear: 78, trend: "up" },
    { subject: "English Language", currentYear: 82, previousYear: 85, trend: "down" },
    { subject: "Science", currentYear: 79, previousYear: 76, trend: "up" },
    { subject: "History", currentYear: 88, previousYear: 90, trend: "down" },
    { subject: "Geography", currentYear: 84, previousYear: 81, trend: "up" }
  ];

  const gradeDistribution = [
    { grade: "9", count: 45, percentage: 12 },
    { grade: "8", count: 78, percentage: 21 },
    { grade: "7", count: 92, percentage: 25 },
    { grade: "6", count: 68, percentage: 18 },
    { grade: "5", count: 54, percentage: 15 },
    { grade: "4", count: 28, percentage: 7 },
    { grade: "3", count: 8, percentage: 2 }
  ];

  const departmentComparison = [
    { department: "Mathematics", avgGrade: 6.8, studentsCount: 145, color: "#3B82F6" },
    { department: "English", avgGrade: 6.5, studentsCount: 138, color: "#10B981" },
    { department: "Science", avgGrade: 6.2, studentsCount: 167, color: "#F59E0B" },
    { department: "Humanities", avgGrade: 7.1, studentsCount: 89, color: "#8B5CF6" },
    { department: "Languages", avgGrade: 6.9, studentsCount: 76, color: "#EF4444" }
  ];

  const monthlyTrends = [
    { month: "Jan", results: 0 },
    { month: "Feb", results: 0 },
    { month: "Mar", results: 45 },
    { month: "Apr", results: 0 },
    { month: "May", results: 123 },
    { month: "Jun", results: 298 },
    { month: "Jul", results: 167 },
    { month: "Aug", results: 89 }
  ];

  const keyMetrics = [
    { title: "Overall Pass Rate", value: "94.2%", change: "+2.1%", trend: "up", icon: Award },
    { title: "Average Grade", value: "6.7", change: "+0.3", trend: "up", icon: TrendingUp },
    { title: "Total Students", value: "1,247", change: "+45", trend: "up", icon: Users },
    { title: "Subjects Assessed", value: "23", change: "0", trend: "neutral", icon: FileText }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Performance insights and examination statistics</p>
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Year</SelectItem>
              <SelectItem value="previous">Previous Year</SelectItem>
              <SelectItem value="comparison">Year Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center p-6">
                <metric.icon className="h-12 w-12 text-blue-600 mr-4" />
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <div className="flex items-center mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : metric.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    ) : null}
                    <span className={`text-sm ${
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject Performance Comparison
              </CardTitle>
              <CardDescription>Current vs Previous Year Average Scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="currentYear" fill="#3B82F6" name="Current Year" />
                  <Bar dataKey="previousYear" fill="#94A3B8" name="Previous Year" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Overall grade distribution across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, percentage }) => `Grade ${grade}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Average grades and student counts by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentComparison.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: dept.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{dept.department}</p>
                        <p className="text-sm text-gray-600">{dept.studentsCount} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{dept.avgGrade}</p>
                      <p className="text-sm text-gray-600">Avg Grade</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Results Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Results Release Timeline</CardTitle>
              <CardDescription>Monthly distribution of released results</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="results" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
