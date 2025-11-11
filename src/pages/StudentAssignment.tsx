
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, User, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const StudentAssignment = () => {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const exams = [
    { id: "1", title: "GCSE Mathematics", code: "8300" },
    { id: "2", title: "GCSE English Language", code: "8261" },
    { id: "3", title: "A Level Psychology", code: "7357" }
  ];

  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      yearGroup: "Year 11",
      previousSubjects: ["Mathematics", "English"],
      suggestedMatch: 95,
      upn: "H801200001001"
    },
    {
      id: 2,
      name: "James Smith",
      yearGroup: "Year 11",
      previousSubjects: ["Mathematics", "Science"],
      suggestedMatch: 90,
      upn: "H801200001002"
    },
    {
      id: 3,
      name: "Sarah Williams",
      yearGroup: "Year 13",
      previousSubjects: ["Psychology", "Biology"],
      suggestedMatch: 88,
      upn: "H801200001003"
    },
    {
      id: 4,
      name: "Michael Brown",
      yearGroup: "Year 11",
      previousSubjects: ["Mathematics", "Physics"],
      suggestedMatch: 85,
      upn: "H801200001004"
    },
    {
      id: 5,
      name: "Jessica Davis",
      yearGroup: "Year 13",
      previousSubjects: ["English", "History"],
      suggestedMatch: 75,
      upn: "H801200001005"
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.upn.includes(searchTerm)
  );

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStudents = () => {
    if (!selectedExam || selectedStudents.length === 0) {
      toast({
        title: "Assignment Error",
        description: "Please select an exam and at least one student",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${selectedStudents.length} students assigned to exam`
    });
    setSelectedStudents([]);
  };

  const getSuggestionColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-800";
    if (match >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Assignment</h1>
          <p className="text-gray-600">Assign students to exams with intelligent suggestions</p>
        </div>

        {/* Exam Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Exam Selection
            </CardTitle>
            <CardDescription>
              Choose an exam to assign students to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-96">
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title} ({exam.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                disabled={!selectedExam}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Get Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or UPN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleAssignStudents}
                disabled={!selectedExam || selectedStudents.length === 0}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Assign Selected ({selectedStudents.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Students</CardTitle>
            <CardDescription>
              Students sorted by suggestion match based on previous subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents
                .sort((a, b) => b.suggestedMatch - a.suggestedMatch)
                .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentSelection(student.id)}
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">
                        {student.yearGroup} • UPN: {student.upn}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Previous subjects:</span>
                        {student.previousSubjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getSuggestionColor(student.suggestedMatch)}>
                      {student.suggestedMatch}% match
                    </Badge>
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

export default StudentAssignment;
