
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Shield, Clock, Check, Search, Upload, AlertCircle, Filter, Users, Award, Printer } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const ResultsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [entrySearchTerm, setEntrySearchTerm] = useState("");
  const [entryStatusFilter, setEntryStatusFilter] = useState("all");
  const [entrySyllabusFilter, setEntrySyllabusFilter] = useState("all");
  const [selectedEntryForPrint, setSelectedEntryForPrint] = useState<string>("");

  // Import Overview Stats
  const importStats = {
    totalRecords: 324,
    imported: 289,
    pendingReview: 23,
    errors: 12,
    lastSync: "14:30 today"
  };

  // Mock entries data (in real app, this would come from API/shared state)
  const entries = [
    {
      id: 1,
      syllabusCode: "8300",
      optionCode: "8300/1H",
      optionTitle: "Paper 1 Higher",
      pupilsCount: 4,
      pupilIds: [1, 2, 3, 4],
      status: "Active",
      results: {
        1: { grade: "7", points: 7, status: "Validated" },
        2: { grade: "8", points: 8, status: "Validated" },
        3: { grade: "6", points: 6, status: "Pending Review" },
        4: { grade: "9", points: 9, status: "Validated" }
      }
    },
    {
      id: 2,
      syllabusCode: "8700",
      optionCode: "8700/1",
      optionTitle: "Paper 1",
      pupilsCount: 3,
      pupilIds: [2, 3, 4],
      status: "Active",
      results: {
        2: { grade: "6", points: 6, status: "Validated" },
        3: { grade: "7", points: 7, status: "Validated" },
        4: { grade: "8", points: 8, status: "Pending Review" }
      }
    }
  ];

  // Mock pupils data
  const pupils = [
    { id: 1, name: "John Smith", year: "11", regGroup: "11A", studentId: "1001" },
    { id: 2, name: "Emma Johnson", year: "11", regGroup: "11A", studentId: "1002" },
    { id: 3, name: "James Williams", year: "11", regGroup: "11B", studentId: "1003" },
    { id: 4, name: "Sophie Brown", year: "11", regGroup: "11B", studentId: "1004" }
  ];

  // Mock syllabuses data
  const syllabuses = [
    {
      id: 1,
      code: "8300",
      title: "GCSE Mathematics",
      level: "GCSE"
    },
    {
      id: 2,
      code: "8700",
      title: "GCSE English Language",
      level: "GCSE"
    }
  ];

  // Transform entries results into student results format
  const transformEntriesToStudentResults = () => {
    const studentResultsMap = new Map<number, {
      id: number;
      name: string;
      studentId: string;
      yearGroup: string;
      results: Array<{ subject: string; code: string; grade: string; points: number; status: string }>;
      status: string;
    }>();

    // Process each entry
    entries.forEach(entry => {
      const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
      
      entry.pupilIds.forEach(pupilId => {
        const pupil = pupils.find(p => p.id === pupilId);
        const result = entry.results?.[pupilId];
        
        if (!pupil || !result) return;

        if (!studentResultsMap.has(pupilId)) {
          studentResultsMap.set(pupilId, {
            id: pupilId,
            name: pupil.name,
            studentId: pupil.studentId,
            yearGroup: `Year ${pupil.year}`,
            results: [],
            status: "Validated" // Default, will be updated based on results
          });
        }

        const studentResult = studentResultsMap.get(pupilId)!;
        studentResult.results.push({
          subject: syllabus?.title || entry.optionTitle,
          code: entry.optionCode,
          grade: result.grade,
          points: result.points,
          status: result.status
        });

        // Update overall status based on individual result statuses
        if (result.status === "Pending Review" && studentResult.status === "Validated") {
          studentResult.status = "Pending Review";
        } else if (result.status === "Conflict") {
          studentResult.status = "Conflict";
        }
      });
    });

    return Array.from(studentResultsMap.values());
  };

  // Transform entry results to student results format
  const entryStudentResults = transformEntriesToStudentResults();

  // Original student results (from imports/other sources)
  const originalStudentResults = [
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

  // Merge original results with entry results
  const mergedStudentResults = [...originalStudentResults];
  entryStudentResults.forEach(entryStudent => {
    const existingIndex = mergedStudentResults.findIndex(s => s.studentId === entryStudent.studentId);
    if (existingIndex >= 0) {
      // Merge results for existing student
      mergedStudentResults[existingIndex].results = [
        ...mergedStudentResults[existingIndex].results,
        ...entryStudent.results
      ];
      // Update status if needed
      if (entryStudent.status === "Conflict" || 
          (entryStudent.status === "Pending Review" && mergedStudentResults[existingIndex].status === "Validated")) {
        mergedStudentResults[existingIndex].status = entryStudent.status;
      }
    } else {
      // Add new student
      mergedStudentResults.push(entryStudent);
    }
  });

  const studentResults = mergedStudentResults;

  const filteredResults = studentResults.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || student.status.toLowerCase().replace(" ", "") === statusFilter;
    const matchesSubject = subjectFilter === "all" || 
      student.results.some(result => {
        const subjectLower = result.subject.toLowerCase();
        if (subjectFilter === "mathematics") return subjectLower.includes("mathematics") || subjectLower.includes("math");
        if (subjectFilter === "english") return subjectLower.includes("english");
        if (subjectFilter === "sciences") return subjectLower.includes("science") || subjectLower.includes("physics") || 
          subjectLower.includes("chemistry") || subjectLower.includes("biology");
        return false;
      });
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Validated":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-orange-100 text-orange-800";
      case "Conflict":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade: string) => {
    const numGrade = parseInt(grade);
    if (!isNaN(numGrade)) {
      if (numGrade >= 8) return "bg-blue-100 text-blue-800 border-blue-200";
      if (numGrade >= 6) return "bg-green-100 text-green-800 border-green-200";
      if (numGrade >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
      return "bg-red-100 text-red-800 border-red-200";
    }
    const upperGrade = grade.toUpperCase();
    if (upperGrade.includes("A*") || upperGrade === "A*") return "bg-blue-100 text-blue-800 border-blue-200";
    if (upperGrade === "A") return "bg-green-100 text-green-800 border-green-200";
    if (upperGrade === "B") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (upperGrade === "C" || upperGrade === "D") return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
    const matchesSearch = entry.syllabusCode.toLowerCase().includes(entrySearchTerm.toLowerCase()) ||
                         entry.optionCode.toLowerCase().includes(entrySearchTerm.toLowerCase()) ||
                         entry.optionTitle.toLowerCase().includes(entrySearchTerm.toLowerCase()) ||
                         syllabus?.title.toLowerCase().includes(entrySearchTerm.toLowerCase());
    const matchesSyllabus = entrySyllabusFilter === "all" || entry.syllabusCode === entrySyllabusFilter;
    
    // Check if any result matches status filter
    const matchesStatus = entryStatusFilter === "all" || 
      Object.values(entry.results || {}).some(result => {
        const statusLower = result.status.toLowerCase().replace(" ", "");
        return statusLower === entryStatusFilter.toLowerCase().replace(" ", "");
      });
    
    return matchesSearch && matchesSyllabus && matchesStatus;
  });

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

  const handlePrintEntry = () => {
    if (!selectedEntryForPrint) {
      toast({
        title: "Error",
        description: "Please select an entry to print",
        variant: "destructive"
      });
      return;
    }
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          nav,
          button:not(.print-button),
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .print-preview {
            page-break-inside: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
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
            {/* Entries Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Results by Entries
                </CardTitle>
                <CardDescription>View results organized by examination entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Entry Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by syllabus, option code, or title..."
                      value={entrySearchTerm}
                      onChange={(e) => setEntrySearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={entrySyllabusFilter} onValueChange={setEntrySyllabusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Syllabuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Syllabuses</SelectItem>
                      {syllabuses.map((syl) => (
                        <SelectItem key={syl.id} value={syl.code}>
                          {syl.code} - {syl.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={entryStatusFilter} onValueChange={setEntryStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="validated">Validated</SelectItem>
                      <SelectItem value="pendingreview">Pending Review</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Entries Results Table */}
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No entries found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => {
                      const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
                      const entryPupils = pupils.filter(p => entry.pupilIds?.includes(p.id));
                      
                      return (
                        <div key={entry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {syllabus?.title || entry.syllabusCode}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {entry.optionCode} - {entry.optionTitle}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Syllabus: {entry.syllabusCode} • {entry.pupilsCount} pupils
                                </p>
                              </div>
                              <Badge variant="outline">{entry.status}</Badge>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Pupil Name</TableHead>
                                  <TableHead>Student ID</TableHead>
                                  <TableHead>Year</TableHead>
                                  <TableHead>Grade</TableHead>
                                  <TableHead>Points</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {entryPupils.map((pupil) => {
                                  const result = entry.results?.[pupil.id];
                                  return (
                                    <TableRow key={pupil.id}>
                                      <TableCell className="font-medium">{pupil.name}</TableCell>
                                      <TableCell className="font-mono text-sm">{pupil.studentId}</TableCell>
                                      <TableCell>Year {pupil.year}</TableCell>
                                      <TableCell>
                                        {result?.grade ? (
                                          <Badge className={getGradeColor(result.grade)} variant="outline">
                                            {result.grade}
                                          </Badge>
                                        ) : (
                                          <span className="text-muted-foreground">-</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {result?.points !== undefined && result.points > 0 ? (
                                          <span className="font-medium">{result.points}</span>
                                        ) : (
                                          <span className="text-muted-foreground">-</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {result?.status ? (
                                          <Badge className={getStatusColor(result.status)} variant="outline">
                                            {result.status}
                                          </Badge>
                                        ) : (
                                          <Badge className={getStatusColor("Pending")} variant="outline">
                                            Pending
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pupils Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Results by Pupils
                </CardTitle>
                <CardDescription>View results organized by individual pupils</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pupil Filters */}
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

                {/* Student Results */}
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No students found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="no-print">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Print Entry Results
                </CardTitle>
                <CardDescription>Select an entry to print results with pupil grades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Entry</label>
                    <Select value={selectedEntryForPrint} onValueChange={setSelectedEntryForPrint}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an entry to print" />
                      </SelectTrigger>
                      <SelectContent>
                        {entries.map((entry) => {
                          const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
                          return (
                            <SelectItem key={entry.id} value={entry.id.toString()}>
                              {syllabus?.title || entry.syllabusCode} - {entry.optionCode} ({entry.optionTitle})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-6">
                    <Button 
                      onClick={handlePrintEntry} 
                      disabled={!selectedEntryForPrint}
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Print Preview */}
            {selectedEntryForPrint && (() => {
              const entry = entries.find(e => e.id.toString() === selectedEntryForPrint);
              if (!entry) return null;
              
              const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
              const entryPupils = pupils.filter(p => entry.pupilIds?.includes(p.id));
              
              return (
                <>
                  <Card className="no-print">
                    <CardHeader>
                      <CardTitle>Print Preview</CardTitle>
                      <CardDescription>Review the entry results before printing</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="print:shadow-none print:border-0">
                    <CardContent className="p-6 print:p-4">
                    <div className="print-preview space-y-6">
                      {/* Header */}
                      <div className="text-center border-b pb-4 print:border-b-2">
                        <h1 className="text-2xl font-bold mb-2 print:text-xl">
                          {syllabus?.title || entry.syllabusCode}
                        </h1>
                        <p className="text-lg text-gray-600 print:text-base">
                          {entry.optionCode} - {entry.optionTitle}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 print:text-xs">
                          Syllabus Code: {entry.syllabusCode} | Entry ID: {entry.id} | Date: {new Date().toLocaleDateString()}
                        </p>
                      </div>

                      {/* Results Table */}
                      <div className="overflow-x-auto">
                        <Table className="print:text-sm">
                          <TableHeader>
                            <TableRow className="print:border-b-2">
                              <TableHead className="print:font-bold print:py-2">#</TableHead>
                              <TableHead className="print:font-bold print:py-2">Pupil Name</TableHead>
                              <TableHead className="print:font-bold print:py-2">Student ID</TableHead>
                              <TableHead className="print:font-bold print:py-2">Year Group</TableHead>
                              <TableHead className="print:font-bold print:py-2 text-center">Grade</TableHead>
                              <TableHead className="print:font-bold print:py-2 text-center">Points</TableHead>
                              <TableHead className="print:font-bold print:py-2">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entryPupils.map((pupil, index) => {
                              const result = entry.results?.[pupil.id];
                              return (
                                <TableRow key={pupil.id} className="print:border-b">
                                  <TableCell className="print:py-2">{index + 1}</TableCell>
                                  <TableCell className="font-medium print:py-2">{pupil.name}</TableCell>
                                  <TableCell className="font-mono text-sm print:py-2">{pupil.studentId}</TableCell>
                                  <TableCell className="print:py-2">Year {pupil.year}</TableCell>
                                  <TableCell className="text-center print:py-2">
                                    {result?.grade ? (
                                      <span className="font-bold text-lg print:text-base">{result.grade}</span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center print:py-2">
                                    {result?.points !== undefined && result.points > 0 ? (
                                      <span className="font-medium">{result.points}</span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="print:py-2">
                                    {result?.status || "Pending"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Summary */}
                      <div className="border-t pt-4 print:border-t-2 print:pt-2">
                        <div className="grid grid-cols-3 gap-4 text-sm print:text-xs">
                          <div>
                            <span className="font-medium">Total Pupils: </span>
                            <span>{entryPupils.length}</span>
                          </div>
                          <div>
                            <span className="font-medium">Results Entered: </span>
                            <span>{Object.values(entry.results || {}).filter(r => r.grade).length}</span>
                          </div>
                          <div>
                            <span className="font-medium">Pending: </span>
                            <span>{Object.values(entry.results || {}).filter(r => !r.grade || r.status === "Pending").length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default ResultsManagement;
