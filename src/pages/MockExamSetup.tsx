import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Search, Plus, Check, ArrowLeft, Calendar, Clock, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface SyllabusOption {
  optionId: string;
  optionCode: string;
  optionTitle: string;
  examDate?: string;
  examTime?: string;
}

interface SelectedSyllabus {
  id: string;
  code: string;
  title: string;
  organization: string;
  level: string;
  options: SyllabusOption[];
}

const MockExamSetup = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [configuredSyllabuses, setConfiguredSyllabuses] = useState<SelectedSyllabus[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedSourceSeriesId, setSelectedSourceSeriesId] = useState<string>("");

  // Mock series data - in real app, fetch based on seriesId
  const seriesName = "Mock Series - November 2024";

  // Mock existing series with their basedata configurations
  const existingSeriesWithBasedata = [
    {
      id: "1",
      name: "March 2025",
      type: "Internal",
      basedata: [
        {
          id: "1",
          code: "8300",
          title: "GCSE Mathematics",
          organization: "Internal",
          level: "GCSE",
          options: [
            { optionId: "1-1", optionCode: "8300/1H", optionTitle: "Paper 1 Higher", examDate: "2025-03-10", examTime: "09:00" },
            { optionId: "1-2", optionCode: "8300/2H", optionTitle: "Paper 2 Higher", examDate: "2025-03-12", examTime: "09:00" },
          ]
        },
        {
          id: "2",
          code: "8261",
          title: "GCSE English Language",
          organization: "Internal",
          level: "GCSE",
          options: [
            { optionId: "2-1", optionCode: "8261/1", optionTitle: "Paper 1: Explorations in Creative Reading", examDate: "2025-03-14", examTime: "09:00" },
          ]
        }
      ]
    },
    {
      id: "2",
      name: "November 2024",
      type: "Internal",
      basedata: [
        {
          id: "1",
          code: "8300",
          title: "GCSE Mathematics",
          organization: "Internal",
          level: "GCSE",
          options: [
            { optionId: "1-1", optionCode: "8300/1H", optionTitle: "Paper 1 Higher", examDate: "2024-11-05", examTime: "09:00" },
            { optionId: "1-2", optionCode: "8300/2H", optionTitle: "Paper 2 Higher", examDate: "2024-11-07", examTime: "09:00" },
            { optionId: "1-3", optionCode: "8300/3H", optionTitle: "Paper 3 Higher", examDate: "2024-11-09", examTime: "09:00" },
          ]
        },
        {
          id: "3",
          code: "8464",
          title: "GCSE Combined Science: Trilogy",
          organization: "Internal",
          level: "GCSE",
          options: [
            { optionId: "3-1", optionCode: "8464/B/1H", optionTitle: "Biology Paper 1 Higher", examDate: "2024-11-11", examTime: "09:00" },
            { optionId: "3-2", optionCode: "8464/C/1H", optionTitle: "Chemistry Paper 1 Higher", examDate: "2024-11-13", examTime: "09:00" },
          ]
        }
      ]
    }
  ];

  // Global basedata syllabuses
  const globalSyllabuses = [
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

  const filteredSyllabuses = globalSyllabuses.filter(syllabus =>
    syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.code.includes(searchTerm)
  );

  const handleAddSyllabus = () => {
    if (!selectedSyllabusId || selectedOptions.length === 0) {
      toast({
        title: "Incomplete selection",
        description: "Please select a syllabus and at least one option",
        variant: "destructive"
      });
      return;
    }

    const syllabus = globalSyllabuses.find(s => s.id === selectedSyllabusId);
    if (!syllabus) return;

    const selectedOptionDetails = syllabus.options.filter(opt => 
      selectedOptions.includes(opt.optionId)
    );

    const newSyllabus: SelectedSyllabus = {
      id: syllabus.id,
      code: syllabus.code,
      title: syllabus.title,
      organization: syllabus.organization,
      level: syllabus.level,
      options: selectedOptionDetails
    };

    setConfiguredSyllabuses([...configuredSyllabuses, newSyllabus]);
    setShowAddDialog(false);
    setSelectedSyllabusId("");
    setSelectedOptions([]);

    toast({
      title: "Syllabus added",
      description: `${syllabus.title} with ${selectedOptionDetails.length} options added to series`
    });
  };

  const handleDateTimeUpdate = (syllabusId: string, optionId: string, field: 'examDate' | 'examTime', value: string) => {
    setConfiguredSyllabuses(prev => prev.map(syllabus => {
      if (syllabus.id !== syllabusId) return syllabus;
      
      return {
        ...syllabus,
        options: syllabus.options.map(opt => 
          opt.optionId === optionId ? { ...opt, [field]: value } : opt
        )
      };
    }));
  };

  const handleCloneBasedata = () => {
    if (!selectedSourceSeriesId) {
      toast({
        title: "Error",
        description: "Please select a source series",
        variant: "destructive"
      });
      return;
    }

    const sourceSeries = existingSeriesWithBasedata.find(s => s.id === selectedSourceSeriesId);
    if (!sourceSeries || !sourceSeries.basedata || sourceSeries.basedata.length === 0) {
      toast({
        title: "Error",
        description: "Selected series has no basedata to clone",
        variant: "destructive"
      });
      return;
    }

    // Clone the basedata (convert to SelectedSyllabus format)
    const clonedSyllabuses: SelectedSyllabus[] = sourceSeries.basedata.map(syllabus => ({
      id: syllabus.id,
      code: syllabus.code,
      title: syllabus.title,
      organization: syllabus.organization,
      level: syllabus.level,
      options: syllabus.options.map(opt => ({
        optionId: opt.optionId,
        optionCode: opt.optionCode,
        optionTitle: opt.optionTitle,
        examDate: opt.examDate,
        examTime: opt.examTime
      }))
    }));

    setConfiguredSyllabuses(clonedSyllabuses);
    setShowCloneDialog(false);
    setSelectedSourceSeriesId("");

    toast({
      title: "Success",
      description: `Basedata cloned from ${sourceSeries.name}. You can modify dates and times as needed.`
    });
  };

  const handleSaveConfiguration = () => {
    const incompleteOptions = configuredSyllabuses.some(syllabus =>
      syllabus.options.some(opt => !opt.examDate || !opt.examTime)
    );

    if (incompleteOptions) {
      toast({
        title: "Incomplete configuration",
        description: "Please set date and time for all options",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Configuration saved",
      description: `Mock exam basedata configured for ${seriesName}`
    });
    navigate("/season-management");
  };

  const selectedSyllabusData = globalSyllabuses.find(s => s.id === selectedSyllabusId);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/season-management")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series Management
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mock Exam Basedata Setup</h1>
          <p className="text-muted-foreground">Configure syllabuses and options for {seriesName}</p>
        </div>

        {/* Add Syllabus Section */}
        {!showAddDialog ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Syllabus from Basedata
                </Button>
                <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Clone from Existing Season
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clone Basedata from Existing Season</DialogTitle>
                      <DialogDescription>
                        Select a season to copy its basedata configuration. You can modify dates and times after cloning.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={selectedSourceSeriesId} onValueChange={setSelectedSourceSeriesId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a season to clone from" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingSeriesWithBasedata.map(series => (
                            <SelectItem key={series.id} value={series.id}>
                              {series.name} ({series.basedata?.length || 0} syllabuses)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedSourceSeriesId && (() => {
                        const selectedSeries = existingSeriesWithBasedata.find(s => s.id === selectedSourceSeriesId);
                        if (!selectedSeries) return null;
                        return (
                          <div className="border rounded-lg p-4 space-y-2">
                            <div className="font-medium text-sm">{selectedSeries.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedSeries.basedata?.length || 0} syllabus(es) with {selectedSeries.basedata?.reduce((sum, s) => sum + (s.options?.length || 0), 0) || 0} option(s) will be cloned
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              <div className="font-medium mb-1">Syllabuses:</div>
                              {selectedSeries.basedata?.map(s => (
                                <div key={s.id}>• {s.code} - {s.title}</div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setShowCloneDialog(false);
                          setSelectedSourceSeriesId("");
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleCloneBasedata} disabled={!selectedSourceSeriesId}>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone Basedata
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Syllabus and Options</CardTitle>
              <CardDescription>Choose from global basedata syllabuses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <SelectValue placeholder="Select a syllabus" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSyllabuses.map(syllabus => (
                    <SelectItem key={syllabus.id} value={syllabus.id}>
                      {syllabus.code} - {syllabus.title} ({syllabus.organization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSyllabusData && (
                <div className="space-y-2 border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Select Options:</h4>
                  {selectedSyllabusData.options.map(option => (
                    <div key={option.optionId} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedOptions.includes(option.optionId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptions([...selectedOptions, option.optionId]);
                          } else {
                            setSelectedOptions(selectedOptions.filter(id => id !== option.optionId));
                          }
                        }}
                      />
                      <label className="text-sm">
                        {option.optionCode} - {option.optionTitle}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddSyllabus}>
                  <Check className="h-4 w-4 mr-2" />
                  Add Selected
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddDialog(false);
                  setSelectedSyllabusId("");
                  setSelectedOptions([]);
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configured Syllabuses */}
        <Card>
          <CardHeader>
            <CardTitle>Configured Syllabuses</CardTitle>
            <CardDescription>Set exam dates and times for each option</CardDescription>
          </CardHeader>
          <CardContent>
            {configuredSyllabuses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No syllabuses configured yet. Add syllabuses from global basedata.
              </p>
            ) : (
              <div className="space-y-6">
                {configuredSyllabuses.map((syllabus) => (
                  <div key={syllabus.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-semibold text-foreground">{syllabus.title}</h3>
                      <Badge variant="outline">{syllabus.level}</Badge>
                      <Badge variant="secondary">{syllabus.organization}</Badge>
                      <span className="text-sm text-muted-foreground ml-auto">Code: {syllabus.code}</span>
                    </div>

                    <div className="space-y-3">
                      {syllabus.options.map((option) => (
                        <div key={option.optionId} className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{option.optionCode}</p>
                            <p className="text-xs text-muted-foreground">{option.optionTitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="date"
                                value={option.examDate || ""}
                                onChange={(e) => handleDateTimeUpdate(syllabus.id, option.optionId, 'examDate', e.target.value)}
                                className="w-40"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="time"
                                value={option.examTime || ""}
                                onChange={(e) => handleDateTimeUpdate(syllabus.id, option.optionId, 'examTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => navigate("/season-management")}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveConfiguration}>
                    <Check className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MockExamSetup;
