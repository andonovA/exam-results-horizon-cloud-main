
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, User, Calendar, Award, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentPortal = () => {
  const { toast } = useToast();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const studentData = {
    name: "Emma Johnson",
    yearGroup: "Year 11",
    upn: "H801200001001",
    results: [
      {
        id: 1,
        examTitle: "GCSE Mathematics",
        examCode: "8300",
        grade: "7",
        points: 7,
        status: "Released",
        examDate: "2024-06-15",
        releaseDate: "2024-08-15"
      },
      {
        id: 2,
        examTitle: "GCSE English Language",
        examCode: "8261",
        grade: "6",
        points: 6,
        status: "Released",
        examDate: "2024-06-10",
        releaseDate: "2024-08-15"
      },
      {
        id: 3,
        examTitle: "GCSE Combined Science",
        examCode: "8464",
        grade: "6-6",
        points: 12,
        status: "Embargoed",
        examDate: "2024-06-20",
        releaseDate: "2024-08-22"
      }
    ],
    mockResults: [
      {
        id: 1,
        examTitle: "Mathematics Mock 1",
        grade: "6",
        examDate: "2024-03-15",
        feedback: "Good understanding of algebra, work on geometry"
      },
      {
        id: 2,
        examTitle: "English Literature Mock",
        grade: "7",
        examDate: "2024-03-20",
        feedback: "Excellent analysis, improve essay structure"
      }
    ]
  };

  const handleLogin = () => {
    if (!studentId || !password) {
      toast({
        title: "Login Error",
        description: "Please enter both Student ID and password",
        variant: "destructive"
      });
      return;
    }

    // Simulate login
    setIsLoggedIn(true);
    toast({
      title: "Welcome",
      description: `Welcome back, ${studentData.name}!`
    });
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Download Started",
      description: "Your results statement is being generated..."
    });
  };

  const getGradeColor = (grade: string) => {
    const numGrade = parseInt(grade);
    if (numGrade >= 7) return "bg-green-100 text-green-800";
    if (numGrade >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released":
        return "bg-green-100 text-green-800";
      case "Embargoed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Student Portal</CardTitle>
            <CardDescription>
              Access your examination results securely
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student ID / UPN</Label>
              <Input
                id="studentId"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login to Portal
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Forgot your password? <span className="text-blue-600 cursor-pointer">Contact school office</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{studentData.name}</h1>
                <p className="text-sm text-gray-600">{studentData.yearGroup} • UPN: {studentData.upn}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Exam Results</TabsTrigger>
            <TabsTrigger value="mocks">Mock Results</TabsTrigger>
            <TabsTrigger value="help">Help & Support</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Official Examination Results
                    </CardTitle>
                    <CardDescription>Your GCSE and A Level results</CardDescription>
                  </div>
                  <Button onClick={handleDownloadStatement} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Statement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.results.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{result.examTitle}</h3>
                          <p className="text-sm text-gray-600">Code: {result.examCode}</p>
                          <p className="text-sm text-gray-500">
                            Exam Date: {new Date(result.examDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                          {result.status === "Released" && (
                            <div className="text-right">
                              <Badge className={getGradeColor(result.grade)} variant="outline">
                                Grade {result.grade}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">{result.points} points</p>
                            </div>
                          )}
                          {result.status === "Embargoed" && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Results embargoed</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Available: {new Date(result.releaseDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mocks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mock Examination Results
                </CardTitle>
                <CardDescription>Your internal assessment results and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.mockResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{result.examTitle}</h3>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(result.examDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">{result.feedback}</p>
                        </div>
                        <Badge className={getGradeColor(result.grade)} variant="outline">
                          Grade {result.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Get help with your results and next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Understanding Your Results</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    GCSE grades range from 9 (highest) to 1 (lowest), with 4 considered a 'standard pass' 
                    and 5 a 'strong pass'.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sixth Form applications and requirements</li>
                    <li>• Apprenticeship opportunities</li>
                    <li>• Results appeals process</li>
                    <li>• Resit options for GCSE subjects</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600">
                    Email: <span className="text-blue-600">results@school.edu</span><br />
                    Phone: <span className="text-blue-600">01234 567890</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentPortal;
