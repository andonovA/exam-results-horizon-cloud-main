
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Search, Plus, Check, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const ExamSetup = () => {
  const { toast } = useToast();
  const [selectedOrganization, setSelectedOrganization] = useState("AQA");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExams, setSelectedExams] = useState<number[]>([]);

  const basedataExams = [
    {
      id: 1,
      code: "8300",
      title: "GCSE Mathematics",
      level: "GCSE",
      season: "Summer 2024",
      organization: "AQA",
      selected: false
    },
    {
      id: 2,
      code: "8261",
      title: "GCSE English Language",
      level: "GCSE",
      season: "Summer 2024",
      organization: "AQA",
      selected: false
    },
    {
      id: 3,
      code: "8464",
      title: "GCSE Combined Science: Trilogy",
      level: "GCSE",
      season: "Summer 2024",
      organization: "AQA",
      selected: false
    },
    {
      id: 4,
      code: "7357",
      title: "A Level Psychology",
      level: "A Level",
      season: "Summer 2024",
      organization: "AQA",
      selected: false
    },
    {
      id: 5,
      code: "7402",
      title: "A Level Biology",
      level: "A Level",
      season: "Summer 2024",
      organization: "AQA",
      selected: false
    }
  ];

  const filteredExams = basedataExams.filter(exam =>
    exam.organization === selectedOrganization &&
    (exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     exam.code.includes(searchTerm))
  );

  const handleExamSelection = (examId: number) => {
    setSelectedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleAddExams = () => {
    if (selectedExams.length === 0) {
      toast({
        title: "No exams selected",
        description: "Please select at least one exam to add to the season",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${selectedExams.length} exams added to the current season`
    });
    setSelectedExams([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Setup</h1>
          <p className="text-gray-600">Fetch and select exams from basedata organizations</p>
        </div>

        {/* Organization Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basedata Organization
            </CardTitle>
            <CardDescription>
              Select the awarding organization to fetch available exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AQA">AQA</SelectItem>
                  <SelectItem value="OCR">OCR</SelectItem>
                  <SelectItem value="Edexcel">Edexcel</SelectItem>
                  <SelectItem value="WJEC">WJEC</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Fetch Latest Exams
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search exams by title or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleAddExams}
                disabled={selectedExams.length === 0}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Selected ({selectedExams.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Available Exams - {selectedOrganization}</CardTitle>
            <CardDescription>
              Select exams to add to the current season
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    checked={selectedExams.includes(exam.id)}
                    onCheckedChange={() => handleExamSelection(exam.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <Badge variant="outline">{exam.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Code: {exam.code} • {exam.organization} • {exam.season}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedExams.includes(exam.id) ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    )}
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

export default ExamSetup;
