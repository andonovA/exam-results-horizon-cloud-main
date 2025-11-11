import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Plus, Search, Users, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface Syllabus {
  id: string;
  code: string;
  title: string;
  level: string;
  organization: string;
  options: Array<{
    optionId: string;
    optionCode: string;
    optionTitle: string;
  }>;
}

interface Candidate {
  id: number;
  name: string;
  year: string;
  regGroup: string;
  studentId?: string;
}

interface CourseInstance {
  id: number;
  syllabusCode: string;
  syllabusTitle: string;
  organization: string;
  level: string;
  candidatesCount: number;
  candidates: Candidate[];
  createdAt: string;
  status: string;
}

const CourseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>("");
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<"syllabus" | "candidates">("syllabus");
  const [selectionMode, setSelectionMode] = useState<"specific" | "year" | "regGroup">("specific");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedRegGroup, setSelectedRegGroup] = useState<string>("");

  // Global basedata syllabuses
  const globalSyllabuses: Syllabus[] = [
    {
      id: "1",
      code: "8300",
      title: "GCSE Mathematics",
      level: "GCSE",
      organization: "AQA",
      options: [
        { optionId: "1-1", optionCode: "8300/1F", optionTitle: "Paper 1 Foundation" },
        { optionId: "1-2", optionCode: "8300/1H", optionTitle: "Paper 1 Higher" },
        { optionId: "1-3", optionCode: "8300/2F", optionTitle: "Paper 2 Foundation" },
        { optionId: "1-4", optionCode: "8300/2H", optionTitle: "Paper 2 Higher" },
      ]
    },
    {
      id: "2",
      code: "8261",
      title: "GCSE English Language",
      level: "GCSE",
      organization: "AQA",
      options: [
        { optionId: "2-1", optionCode: "8261/1", optionTitle: "Paper 1: Explorations in Creative Reading" },
        { optionId: "2-2", optionCode: "8261/2", optionTitle: "Paper 2: Writers' Viewpoints" },
      ]
    },
    {
      id: "3",
      code: "8464",
      title: "GCSE Combined Science: Trilogy",
      level: "GCSE",
      organization: "AQA",
      options: [
        { optionId: "3-1", optionCode: "8464/B/1F", optionTitle: "Biology Paper 1 Foundation" },
        { optionId: "3-2", optionCode: "8464/B/1H", optionTitle: "Biology Paper 1 Higher" },
        { optionId: "3-3", optionCode: "8464/C/1F", optionTitle: "Chemistry Paper 1 Foundation" },
        { optionId: "3-4", optionCode: "8464/C/1H", optionTitle: "Chemistry Paper 1 Higher" },
      ]
    },
    {
      id: "4",
      code: "7357",
      title: "A Level Psychology",
      level: "A Level",
      organization: "AQA",
      options: [
        { optionId: "4-1", optionCode: "7357/1", optionTitle: "Paper 1: Introductory Topics" },
        { optionId: "4-2", optionCode: "7357/2", optionTitle: "Paper 2: Psychology in Context" },
      ]
    },
  ];

  // Available candidates/pupils
  const availableCandidates: Candidate[] = [
    { id: 1, name: "John Smith", year: "11", regGroup: "11A", studentId: "STU001" },
    { id: 2, name: "Emma Johnson", year: "11", regGroup: "11A", studentId: "STU002" },
    { id: 3, name: "James Williams", year: "11", regGroup: "11B", studentId: "STU003" },
    { id: 4, name: "Sophie Brown", year: "11", regGroup: "11B", studentId: "STU004" },
    { id: 5, name: "Oliver Davis", year: "12", regGroup: "12A", studentId: "STU005" },
    { id: 6, name: "Isabella Wilson", year: "12", regGroup: "12A", studentId: "STU006" },
    { id: 7, name: "Lucas Martinez", year: "11", regGroup: "11B", studentId: "STU007" },
    { id: 8, name: "Mia Anderson", year: "12", regGroup: "12B", studentId: "STU008" },
    { id: 9, name: "Noah Taylor", year: "11", regGroup: "11A", studentId: "STU009" },
    { id: 10, name: "Ava Thomas", year: "12", regGroup: "12B", studentId: "STU010" },
  ];

  const [courseInstances, setCourseInstances] = useState<CourseInstance[]>([
    {
      id: 1,
      syllabusCode: "8300",
      syllabusTitle: "GCSE Mathematics",
      organization: "AQA",
      level: "GCSE",
      candidatesCount: 5,
      candidates: availableCandidates.slice(0, 5),
      createdAt: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      syllabusCode: "8261",
      syllabusTitle: "GCSE English Language",
      organization: "AQA",
      level: "GCSE",
      candidatesCount: 3,
      candidates: availableCandidates.slice(2, 5),
      createdAt: "2024-01-20",
      status: "Active"
    }
  ]);

  const filteredSyllabuses = globalSyllabuses.filter(syllabus =>
    syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.code.includes(searchTerm)
  );

  const filteredCandidates = availableCandidates.filter(candidate => {
    if (selectionMode === "year" && selectedYear) {
      return candidate.year === selectedYear;
    }
    if (selectionMode === "regGroup" && selectedRegGroup) {
      return candidate.regGroup === selectedRegGroup;
    }
    return candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           candidate.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedSyllabus = globalSyllabuses.find(s => s.id === selectedSyllabusId);

  const handleSyllabusSelect = () => {
    if (!selectedSyllabusId) {
      toast({
        title: "Error",
        description: "Please select a syllabus",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep("candidates");
    setSelectionMode("specific");
    setSelectedCandidates([]);
    setSelectedYear("");
    setSelectedRegGroup("");
    setSearchTerm("");
  };

  const handleCandidateToggle = (candidateId: number) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleCreateCourse = () => {
    if (!selectedSyllabus) {
      toast({
        title: "Error",
        description: "Please select a syllabus",
        variant: "destructive"
      });
      return;
    }

    let candidatesToAdd: number[] = [];
    let candidatesCount = 0;

    if (selectionMode === "specific") {
      if (selectedCandidates.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one candidate",
          variant: "destructive"
        });
        return;
      }
      candidatesToAdd = selectedCandidates;
      candidatesCount = selectedCandidates.length;
    } else if (selectionMode === "year") {
      if (!selectedYear) {
        toast({
          title: "Error",
          description: "Please select a year group",
          variant: "destructive"
        });
        return;
      }
      candidatesToAdd = availableCandidates.filter(c => c.year === selectedYear).map(c => c.id);
      candidatesCount = candidatesToAdd.length;
    } else if (selectionMode === "regGroup") {
      if (!selectedRegGroup) {
        toast({
          title: "Error",
          description: "Please select a reg group",
          variant: "destructive"
        });
        return;
      }
      candidatesToAdd = availableCandidates.filter(c => c.regGroup === selectedRegGroup).map(c => c.id);
      candidatesCount = candidatesToAdd.length;
    }

    if (candidatesCount === 0) {
      toast({
        title: "Error",
        description: "No candidates found for the selected criteria",
        variant: "destructive"
      });
      return;
    }

    const selectedCandidateObjects = availableCandidates.filter(c =>
      candidatesToAdd.includes(c.id)
    );

    const newCourse: CourseInstance = {
      id: courseInstances.length + 1,
      syllabusCode: selectedSyllabus.code,
      syllabusTitle: selectedSyllabus.title,
      organization: selectedSyllabus.organization,
      level: selectedSyllabus.level,
      candidatesCount: candidatesCount,
      candidates: selectedCandidateObjects,
      createdAt: new Date().toISOString().split('T')[0],
      status: "Active"
    };

    setCourseInstances([...courseInstances, newCourse]);
    setIsCreateDialogOpen(false);
    setSelectedSyllabusId("");
    setSelectedCandidates([]);
    setCurrentStep("syllabus");
    setSelectionMode("specific");
    setSelectedYear("");
    setSelectedRegGroup("");
    setSearchTerm("");

    toast({
      title: "Success",
      description: `Course instance created successfully with ${candidatesCount} candidate${candidatesCount !== 1 ? 's' : ''}`
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setSelectedSyllabusId("");
      setSelectedCandidates([]);
      setCurrentStep("syllabus");
      setSelectionMode("specific");
      setSelectedYear("");
      setSelectedRegGroup("");
      setSearchTerm("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Course Management</h1>
            <p className="text-muted-foreground">Create and manage course instances with syllabus and candidate assignments</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Course Instance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {currentStep === "syllabus" ? "Select Syllabus" : "Select Candidates"}
                </DialogTitle>
                <DialogDescription>
                  {currentStep === "syllabus"
                    ? "Choose a syllabus from the basedata for this course instance"
                    : `Select candidates for ${selectedSyllabus?.code} - ${selectedSyllabus?.title}`}
                </DialogDescription>
              </DialogHeader>

              {currentStep === "syllabus" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search syllabuses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedSyllabusId} onValueChange={setSelectedSyllabusId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a syllabus from basedata" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSyllabuses.map(syllabus => (
                        <SelectItem key={syllabus.id} value={syllabus.id}>
                          {syllabus.code} - {syllabus.title} ({syllabus.organization}) - {syllabus.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedSyllabus && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm">Selected Syllabus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div><strong>Code:</strong> {selectedSyllabus.code}</div>
                          <div><strong>Title:</strong> {selectedSyllabus.title}</div>
                          <div><strong>Organization:</strong> {selectedSyllabus.organization}</div>
                          <div><strong>Level:</strong> {selectedSyllabus.level}</div>
                          <div><strong>Options:</strong> {selectedSyllabus.options.length}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSyllabusSelect} disabled={!selectedSyllabusId}>
                      Next: Select Candidates
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-base mb-3 block">Selection Method</Label>
                    <Select value={selectionMode} onValueChange={(value: "specific" | "year" | "regGroup") => {
                      setSelectionMode(value);
                      setSelectedCandidates([]);
                      setSelectedYear("");
                      setSelectedRegGroup("");
                      setSearchTerm("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="specific">Specific Candidates</SelectItem>
                        <SelectItem value="year">Whole Year Group</SelectItem>
                        <SelectItem value="regGroup">Whole Reg Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectionMode === "specific" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="relative flex-1 mr-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllCandidates}
                        >
                          {selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0 ? "Deselect All" : "Select All"}
                        </Button>
                      </div>

                      <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                                  onCheckedChange={handleSelectAllCandidates}
                                />
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Student ID</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Reg Group</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCandidates.map((candidate) => (
                              <TableRow key={candidate.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedCandidates.includes(candidate.id)}
                                    onCheckedChange={() => handleCandidateToggle(candidate.id)}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{candidate.name}</TableCell>
                                <TableCell>{candidate.studentId || "N/A"}</TableCell>
                                <TableCell>{candidate.year}</TableCell>
                                <TableCell>{candidate.regGroup}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {selectedCandidates.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected
                        </div>
                      )}
                    </>
                  )}

                  {selectionMode === "year" && (
                    <div>
                      <Label className="text-base mb-3 block">Select Year Group</Label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year group" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(availableCandidates.map(c => c.year))).sort().map(year => (
                            <SelectItem key={year} value={year}>
                              Year {year} ({availableCandidates.filter(c => c.year === year).length} candidates)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedYear && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <div className="text-sm font-medium mb-2">
                            Selected: Year {selectedYear} ({availableCandidates.filter(c => c.year === selectedYear).length} candidates)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {availableCandidates.filter(c => c.year === selectedYear).map(c => c.name).join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectionMode === "regGroup" && (
                    <div>
                      <Label className="text-base mb-3 block">Select Reg Group</Label>
                      <Select value={selectedRegGroup} onValueChange={setSelectedRegGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reg group" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(availableCandidates.map(c => c.regGroup))).sort().map(regGroup => (
                            <SelectItem key={regGroup} value={regGroup}>
                              {regGroup} ({availableCandidates.filter(c => c.regGroup === regGroup).length} candidates)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedRegGroup && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <div className="text-sm font-medium mb-2">
                            Selected: {selectedRegGroup} ({availableCandidates.filter(c => c.regGroup === selectedRegGroup).length} candidates)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {availableCandidates.filter(c => c.regGroup === selectedRegGroup).map(c => c.name).join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep("syllabus")}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleCreateCourse} 
                      disabled={
                        (selectionMode === "specific" && selectedCandidates.length === 0) ||
                        (selectionMode === "year" && !selectedYear) ||
                        (selectionMode === "regGroup" && !selectedRegGroup)
                      }
                    >
                      {selectionMode === "specific" && `Create Course Instance with ${selectedCandidates.length} Candidate${selectedCandidates.length !== 1 ? 's' : ''}`}
                      {selectionMode === "year" && selectedYear && `Create Course Instance with Year ${selectedYear} (${availableCandidates.filter(c => c.year === selectedYear).length} candidates)`}
                      {selectionMode === "year" && !selectedYear && "Create Course Instance"}
                      {selectionMode === "regGroup" && selectedRegGroup && `Create Course Instance with ${selectedRegGroup} (${availableCandidates.filter(c => c.regGroup === selectedRegGroup).length} candidates)`}
                      {selectionMode === "regGroup" && !selectedRegGroup && "Create Course Instance"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Instances
            </CardTitle>
            <CardDescription>All created course instances with their syllabus and candidate assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {courseInstances.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No course instances created yet. Click "Create Course Instance" to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Syllabus</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseInstances.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{course.syllabusCode} - {course.syllabusTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell>{course.organization}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {course.candidatesCount}
                        </div>
                      </TableCell>
                      <TableCell>{course.createdAt}</TableCell>
                      <TableCell>
                        <Badge variant={course.status === "Active" ? "default" : "secondary"}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // View candidates detail - could open a dialog
                            toast({
                              title: "Course Details",
                              description: `${course.candidatesCount} candidates enrolled in ${course.syllabusTitle}`
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseManagement;

