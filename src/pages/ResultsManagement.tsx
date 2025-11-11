
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Shield, Clock, Check, Search, Upload, AlertCircle, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const ResultsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Import Overview Stats
  const importStats = {
    totalRecords: 324,
    imported: 289,
    pendingReview: 23,
    errors: 12,
    lastSync: "14:30 today"
  };

  const studentResults = [
    {
      id: 1,
      name: "Alice Johnson",
      studentId: "12345",
      yearGroup: "Year 13",
      results: [
        { subject: "Mathematics", code: "MATH-H", grade: "A*", points: 56, status: "Validated" },
        { subject: "Physics", code: "PHYS-H", grade: "A", points: 52, status: "Validated" },
        { subject: "Chemistry", code: "CHEM-H", grade: "A", points: 50, status: "Validated" }
      ],
      status: "Validated"
    },
    {
      id: 2,
      name: "Ben Smith",
      studentId: "12346",
      yearGroup: "Year 13",
      results: [
        { subject: "English Literature", code: "ENG-H", grade: "B", points: 44, status: "Pending Review" },
        { subject: "History", code: "HIST-H", grade: "A", points: 48, status: "Validated" },
        { subject: "Geography", code: "GEOG-H", grade: "B", points: 42, status: "Validated" }
      ],
      status: "Pending Review"
    },
    {
      id: 3,
      name: "Charlie Davis",
      studentId: "12347",
      yearGroup: "Year 13",
      results: [
        { subject: "Biology", code: "BIOL-H", grade: "A*", points: 56, status: "Conflict" },
        { subject: "Chemistry", code: "CHEM-H", grade: "A", points: 50, status: "Validated" }
      ],
      status: "Conflict"
    }
  ];

  const filteredResults = studentResults.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || student.status.toLowerCase().replace(" ", "") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Validated":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-orange-100 text-orange-800";
      case "Conflict":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleManualImport = () => {
    toast({
      title: "Import Started",
      description: "Manual results import initiated"
    });
  };

  const handleValidateResult = (studentId: number) => {
    toast({
      title: "Result Validated",
      description: "Student result has been validated successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Results Management</h1>
          <p className="text-gray-600">Import, validate, and manage examination results</p>
        </div>

        {/* Import Status Alert */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Import Status:</span>
            <span className="text-blue-700">Last sync completed at {importStats.lastSync}. {importStats.pendingReview} records require attention.</span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Results Import Overview</TabsTrigger>
            <TabsTrigger value="browse">Browse Results</TabsTrigger>
            <TabsTrigger value="validation">Validation Queue</TabsTrigger>
            <TabsTrigger value="reports">Generate Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Import Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="flex items-center p-6">
                  <FileText className="h-12 w-12 text-blue-600 mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{importStats.totalRecords}</p>
                    <p className="text-sm text-gray-600">Total Records</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <Check className="h-12 w-12 text-green-600 mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{importStats.imported}</p>
                    <p className="text-sm text-gray-600">Imported</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <Clock className="h-12 w-12 text-orange-600 mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{importStats.pendingReview}</p>
                    <p className="text-sm text-gray-600">Pending Review</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-600 mr-4" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{importStats.errors}</p>
                    <p className="text-sm text-gray-600">Errors</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Import Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status of Results Import from Exam Board APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Import Progress</span>
                    <span>{importStats.imported}/{importStats.totalRecords}</span>
                  </div>
                  <Progress value={(importStats.imported / importStats.totalRecords) * 100} className="w-full" />
                  <div className="flex gap-4 mt-4">
                    <Button onClick={handleManualImport} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Manual Import
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Report
                    </Button>
                    <Button variant="outline">Sync Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by student name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="validated">Validated</SelectItem>
                      <SelectItem value="pendingreview">Pending Review</SelectItem>
                      <SelectItem value="conflict">Conflict</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Student Results */}
            <Card>
              <CardHeader>
                <CardTitle>Student Results</CardTitle>
                <CardDescription>{filteredResults.length} students found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredResults.map((student) => (
                    <div key={student.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">ID: {student.studentId} • {student.yearGroup}</p>
                        </div>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {student.results.map((result, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{result.subject}</p>
                                <p className="text-sm text-gray-600">{result.code}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{result.grade}</p>
                                <p className="text-sm text-gray-600">({result.points}pts)</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {student.status === "Pending Review" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleValidateResult(student.id)}
                          >
                            Validate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Validation Queue</CardTitle>
                <CardDescription>Results requiring manual review and validation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentResults.filter(s => s.status === "Pending Review" || s.status === "Conflict").map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{student.name} ({student.studentId})</p>
                          <p className="text-sm text-gray-600">
                            {student.status === "Conflict" ? "Grade conflict detected" : "Awaiting validation"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm">Validate</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Export results data and generate compliance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Export All Results</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Validation Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Shield className="h-6 w-6" />
                    <span>Embargo Compliance</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Check className="h-6 w-6" />
                    <span>Grade Distribution</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultsManagement;
