import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, ChevronDown, ChevronRight, Search, Filter, Plus, X, ChevronLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SyllabusOption {
  optionId: string;
  optionCode: string;
  optionTitle: string;
  examDate?: string;
  examTime?: string;
}

interface Syllabus {
  id: string;
  code: string;
  title: string;
  organization: string;
  level: string;
  options: SyllabusOption[];
}

interface Series {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  syllabuses: Syllabus[];
}

const BasedataUpload = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedSeries, setExpandedSeries] = useState<Set<number>>(new Set());
  const [expandedSyllabuses, setExpandedSyllabuses] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedSeriesForWizard, setSelectedSeriesForWizard] = useState<string>("");
  const [newSyllabus, setNewSyllabus] = useState({
    code: "",
    title: "",
    organization: "",
    level: "GCSE"
  });
  const [syllabusOptions, setSyllabusOptions] = useState<Array<{
    code: string;
    title: string;
    examDate?: string;
    examTime?: string;
  }>>([]);
  const [currentOption, setCurrentOption] = useState({
    code: "",
    title: "",
    examDate: "",
    examTime: ""
  });
  
  // Create Season state
  const [createSeasonDialogOpen, setCreateSeasonDialogOpen] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "Draft"
  });

  // Mock data - in real app, this would be fetched from API
  const [series, setSeries] = useState<Series[]>([
    {
      id: 1,
      name: "May 2024",
      type: "External",
      status: "Active",
      startDate: "2024-05-01",
      endDate: "2024-07-31",
      syllabuses: [
        {
          id: "1",
          code: "8300",
          title: "GCSE Mathematics",
          organization: "AQA",
          level: "GCSE",
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
          organization: "AQA",
          level: "GCSE",
          options: [
            { optionId: "2-1", optionCode: "8261/1", optionTitle: "Paper 1: Explorations in Creative Reading" },
            { optionId: "2-2", optionCode: "8261/2", optionTitle: "Paper 2: Writers' Viewpoints" },
          ]
        },
        {
          id: "3",
          code: "8464",
          title: "GCSE Combined Science: Trilogy",
          organization: "AQA",
          level: "GCSE",
          options: [
            { optionId: "3-1", optionCode: "8464/B/1F", optionTitle: "Biology Paper 1 Foundation" },
            { optionId: "3-2", optionCode: "8464/B/1H", optionTitle: "Biology Paper 1 Higher" },
            { optionId: "3-3", optionCode: "8464/C/1F", optionTitle: "Chemistry Paper 1 Foundation" },
            { optionId: "3-4", optionCode: "8464/C/1H", optionTitle: "Chemistry Paper 1 Higher" },
          ]
        }
      ]
    },
    {
      id: 2,
      name: "November 2024",
      type: "External",
      status: "Draft",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      syllabuses: [
        {
          id: "4",
          code: "7357",
          title: "A Level Psychology",
          organization: "AQA",
          level: "A Level",
          options: [
            { optionId: "4-1", optionCode: "7357/1", optionTitle: "Paper 1: Introductory Topics" },
            { optionId: "4-2", optionCode: "7357/2", optionTitle: "Paper 2: Psychology in Context" },
          ]
        }
      ]
    },
    {
      id: 3,
      name: "June 2025",
      type: "External",
      status: "Planning",
      startDate: "2025-06-01",
      endDate: "2025-07-31",
      syllabuses: [
        {
          id: "5",
          code: "8700",
          title: "GCSE English Literature",
          organization: "AQA",
          level: "GCSE",
          options: [
            { optionId: "5-1", optionCode: "8700/1", optionTitle: "Paper 1: Shakespeare and the 19th-century novel" },
            { optionId: "5-2", optionCode: "8700/2", optionTitle: "Paper 2: Modern texts and poetry" },
          ]
        },
        {
          id: "6",
          code: "7408",
          title: "A Level Physics",
          organization: "AQA",
          level: "A Level",
          options: [
            { optionId: "6-1", optionCode: "7408/1", optionTitle: "Paper 1" },
            { optionId: "6-2", optionCode: "7408/2", optionTitle: "Paper 2" },
            { optionId: "6-3", optionCode: "7408/3A", optionTitle: "Paper 3A" },
          ]
        }
      ]
    }
  ]);

  const toggleSeries = (seriesId: number) => {
    const newExpanded = new Set(expandedSeries);
    if (newExpanded.has(seriesId)) {
      newExpanded.delete(seriesId);
    } else {
      newExpanded.add(seriesId);
    }
    setExpandedSeries(newExpanded);
  };

  const toggleSyllabus = (syllabusId: string) => {
    const newExpanded = new Set(expandedSyllabuses);
    if (newExpanded.has(syllabusId)) {
      newExpanded.delete(syllabusId);
    } else {
      newExpanded.add(syllabusId);
    }
    setExpandedSyllabuses(newExpanded);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, Excel, or JSON file",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would upload the file to the server
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded and is being processed`
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getTypeVariant = (type: string): "default" | "secondary" | "outline" => {
    return type === "Internal" ? "secondary" : "outline";
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Active":
        return "default";
      case "Draft":
        return "secondary";
      case "Planning":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredSeries = series.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.syllabuses.some(s => 
                           s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.code.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: series.length,
    totalSyllabuses: series.reduce((sum, s) => sum + s.syllabuses.length, 0),
    totalOptions: series.reduce((sum, s) => 
      sum + s.syllabuses.reduce((syllabusSum, syllabus) => syllabusSum + syllabus.options.length, 0), 0
    )
  };

  // Create Season handler
  const handleCreateSeason = () => {
    if (!newSeason.name || !newSeason.startDate || !newSeason.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const season: Series = {
      id: series.length + 1,
      name: newSeason.name,
      type: "External",
      status: newSeason.status,
      startDate: newSeason.startDate,
      endDate: newSeason.endDate,
      syllabuses: []
    };

    setSeries([...series, season]);
    setCreateSeasonDialogOpen(false);
    setNewSeason({ name: "", startDate: "", endDate: "", status: "Draft" });
    
    toast({
      title: "Success",
      description: `Season "${newSeason.name}" created successfully`
    });
  };

  // Wizard handlers
  const handleOpenWizard = () => {
    setWizardOpen(true);
    setWizardStep(1);
    setSelectedSeriesForWizard("");
    setNewSyllabus({ code: "", title: "", organization: "", level: "GCSE" });
    setSyllabusOptions([]);
    setCurrentOption({ code: "", title: "", examDate: "", examTime: "" });
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
    setWizardStep(1);
    setSelectedSeriesForWizard("");
    setNewSyllabus({ code: "", title: "", organization: "", level: "GCSE" });
    setSyllabusOptions([]);
    setCurrentOption({ code: "", title: "", examDate: "", examTime: "" });
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!selectedSeriesForWizard) {
        toast({
          title: "Error",
          description: "Please select a season",
          variant: "destructive"
        });
        return;
      }
      setWizardStep(2);
    } else if (wizardStep === 2) {
      if (!newSyllabus.code || !newSyllabus.title || !newSyllabus.organization) {
        toast({
          title: "Error",
          description: "Please fill in all syllabus fields",
          variant: "destructive"
        });
        return;
      }
      setWizardStep(3);
    } else if (wizardStep === 3) {
      if (syllabusOptions.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one option",
          variant: "destructive"
        });
        return;
      }
      setWizardStep(4);
    }
  };

  const handlePreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleAddOption = () => {
    if (!currentOption.code || !currentOption.title) {
      toast({
        title: "Error",
        description: "Please fill in option code and title",
        variant: "destructive"
      });
      return;
    }
    setSyllabusOptions([...syllabusOptions, {
      code: currentOption.code,
      title: currentOption.title,
      examDate: currentOption.examDate || undefined,
      examTime: currentOption.examTime || undefined
    }]);
    setCurrentOption({ code: "", title: "", examDate: "", examTime: "" });
  };

  const handleRemoveOption = (index: number) => {
    setSyllabusOptions(syllabusOptions.filter((_, i) => i !== index));
  };

  const handleFinishWizard = () => {
    const selectedSeriesItem = series.find(s => s.id.toString() === selectedSeriesForWizard);
    if (!selectedSeriesItem) return;

    const syllabusToAdd: Syllabus = {
      id: `${selectedSeriesItem.id}-${Date.now()}`,
      code: newSyllabus.code,
      title: newSyllabus.title,
      organization: newSyllabus.organization,
      level: newSyllabus.level,
      options: syllabusOptions.map((opt, idx) => ({
        optionId: `${selectedSeriesItem.id}-${Date.now()}-${idx}`,
        optionCode: opt.code,
        optionTitle: opt.title,
        examDate: opt.examDate,
        examTime: opt.examTime
      }))
    };

    setSeries(prevSeries => prevSeries.map(s => {
      if (s.id.toString() === selectedSeriesForWizard) {
        return {
          ...s,
          syllabuses: [...s.syllabuses, syllabusToAdd]
        };
      }
      return s;
    }));

    toast({
      title: "Success",
      description: `Syllabus "${newSyllabus.title}" with ${syllabusOptions.length} option(s) added to ${selectedSeriesItem.name}`
    });

    handleCloseWizard();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Center Specific Basedata</h1>
              <p className="text-muted-foreground mt-1">
                Upload and manage center-specific basedata for examination series
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Center Basedata
              </Button>
              <Button
                onClick={() => setCreateSeasonDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Season
              </Button>
              <Button
                onClick={handleOpenWizard}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Syllabus
              </Button>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Series</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalSyllabuses}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Syllabuses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalOptions}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Options</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Series & Basedata ({filteredSeries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search series or syllabuses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredSeries.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No series found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your filters"
                      : "Upload basedata to get started"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSeries.map((seriesItem) => (
                    <Card key={seriesItem.id} className="overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleSeries(seriesItem.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedSeries.has(seriesItem.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <CardTitle className="text-lg">{seriesItem.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {seriesItem.startDate} to {seriesItem.endDate}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getTypeVariant(seriesItem.type)}>
                              {seriesItem.type}
                            </Badge>
                            <Badge variant={getStatusVariant(seriesItem.status)}>
                              {seriesItem.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {seriesItem.syllabuses.length} {seriesItem.syllabuses.length === 1 ? "Syllabus" : "Syllabuses"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedSeries.has(seriesItem.id) && (
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {seriesItem.syllabuses.map((syllabus) => (
                              <Card key={syllabus.id} className="border-l-4 border-l-blue-500">
                                <CardHeader 
                                  className="cursor-pointer hover:bg-muted/50 transition-colors py-3"
                                  onClick={() => toggleSyllabus(syllabus.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {expandedSyllabuses.has(syllabus.id) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <div>
                                        <div className="font-semibold">{syllabus.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                          Code: {syllabus.code} | Level: {syllabus.level} | Org: {syllabus.organization}
                                        </div>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {syllabus.options.length} {syllabus.options.length === 1 ? "Option" : "Options"}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                {expandedSyllabuses.has(syllabus.id) && (
                                  <CardContent className="pt-0">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Option Code</TableHead>
                                          <TableHead>Option Title</TableHead>
                                          {syllabus.options.some(opt => opt.examDate) && (
                                            <>
                                              <TableHead>Exam Date</TableHead>
                                              <TableHead>Exam Time</TableHead>
                                            </>
                                          )}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {syllabus.options.map((option) => (
                                          <TableRow key={option.optionId}>
                                            <TableCell className="font-mono text-sm">
                                              {option.optionCode}
                                            </TableCell>
                                            <TableCell>{option.optionTitle}</TableCell>
                                            {syllabus.options.some(opt => opt.examDate) && (
                                              <>
                                                <TableCell>
                                                  {option.examDate ? new Date(option.examDate).toLocaleDateString('en-GB') : "—"}
                                                </TableCell>
                                                <TableCell>{option.examTime || "—"}</TableCell>
                                              </>
                                            )}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                )}
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Syllabus Wizard */}
      <Dialog open={wizardOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseWizard();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Add Syllabus Wizard
            </DialogTitle>
            <DialogDescription>
              Step {wizardStep} of 4: {wizardStep === 1 && "Select Season"} 
              {wizardStep === 2 && "Syllabus Details"} 
              {wizardStep === 3 && "Add Options"} 
              {wizardStep === 4 && "Review"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Step 1: Select Season */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="season">Select Season</Label>
                  <Select value={selectedSeriesForWizard} onValueChange={setSelectedSeriesForWizard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a season" />
                    </SelectTrigger>
                    <SelectContent>
                      {series.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name} ({s.type}) - {s.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedSeriesForWizard && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      {(() => {
                        const selected = series.find(s => s.id.toString() === selectedSeriesForWizard);
                        if (!selected) return null;
                        return (
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Name:</span> {selected.name}</div>
                            <div><span className="font-medium">Type:</span> {selected.type}</div>
                            <div><span className="font-medium">Status:</span> {selected.status}</div>
                            <div><span className="font-medium">Dates:</span> {selected.startDate} to {selected.endDate}</div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 2: Syllabus Details */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="syllabusCode">Syllabus Code</Label>
                    <Input
                      id="syllabusCode"
                      placeholder="e.g., CUSTOM-001"
                      value={newSyllabus.code}
                      onChange={(e) => setNewSyllabus({ ...newSyllabus, code: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="syllabusLevel">Level</Label>
                    <Select value={newSyllabus.level} onValueChange={(value) => setNewSyllabus({ ...newSyllabus, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GCSE">GCSE</SelectItem>
                        <SelectItem value="A Level">A Level</SelectItem>
                        <SelectItem value="BTEC">BTEC</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="syllabusTitle">Syllabus Title</Label>
                  <Input
                    id="syllabusTitle"
                    placeholder="e.g., Custom Mathematics Syllabus"
                    value={newSyllabus.title}
                    onChange={(e) => setNewSyllabus({ ...newSyllabus, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="syllabusOrg">Organization</Label>
                  <Input
                    id="syllabusOrg"
                    placeholder="e.g., Center Name or Custom"
                    value={newSyllabus.organization}
                    onChange={(e) => setNewSyllabus({ ...newSyllabus, organization: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Add Options */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-semibold mb-3">Add Options</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="optionCode">Option Code</Label>
                      <Input
                        id="optionCode"
                        placeholder="e.g., CUSTOM-001/1"
                        value={currentOption.code}
                        onChange={(e) => setCurrentOption({ ...currentOption, code: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionTitle">Option Title</Label>
                      <Input
                        id="optionTitle"
                        placeholder="e.g., Paper 1"
                        value={currentOption.title}
                        onChange={(e) => setCurrentOption({ ...currentOption, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="examDate">Exam Date (Optional)</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={currentOption.examDate}
                        onChange={(e) => setCurrentOption({ ...currentOption, examDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="examTime">Exam Time (Optional)</Label>
                      <Input
                        id="examTime"
                        type="time"
                        value={currentOption.examTime}
                        onChange={(e) => setCurrentOption({ ...currentOption, examTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddOption} className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {syllabusOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Options ({syllabusOptions.length})</Label>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {syllabusOptions.map((opt, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono text-sm">{opt.code}</TableCell>
                              <TableCell>{opt.title}</TableCell>
                              <TableCell>{opt.examDate || "—"}</TableCell>
                              <TableCell>{opt.examTime || "—"}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveOption(idx)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Syllabus Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Syllabus Code</Label>
                        <div className="font-mono font-medium">{newSyllabus.code}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Level</Label>
                        <div>{newSyllabus.level}</div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-muted-foreground">Syllabus Title</Label>
                        <div className="font-medium">{newSyllabus.title}</div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-muted-foreground">Organization</Label>
                        <div>{newSyllabus.organization}</div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-muted-foreground">Season</Label>
                        <div>{series.find(s => s.id.toString() === selectedSeriesForWizard)?.name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Options ({syllabusOptions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {syllabusOptions.map((opt, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono text-sm">{opt.code}</TableCell>
                              <TableCell>{opt.title}</TableCell>
                              <TableCell>{opt.examDate || "—"}</TableCell>
                              <TableCell>{opt.examTime || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={wizardStep === 1 ? handleCloseWizard : handlePreviousStep}
                className="flex items-center gap-2"
              >
                {wizardStep === 1 ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                {wizardStep < 4 ? (
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleFinishWizard} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Add Syllabus
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Season Dialog */}
      <Dialog open={createSeasonDialogOpen} onOpenChange={setCreateSeasonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Season
            </DialogTitle>
            <DialogDescription>
              Create a new examination season to organize your syllabuses and entries
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="seasonName">Season Name *</Label>
              <Input
                id="seasonName"
                placeholder="e.g., Spring 2024, Summer 2024"
                value={newSeason.name}
                onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="seasonStatus">Status *</Label>
              <Select 
                value={newSeason.status} 
                onValueChange={(value) => setNewSeason({ ...newSeason, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newSeason.startDate}
                  onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newSeason.endDate}
                  onChange={(e) => setNewSeason({ ...newSeason, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateSeasonDialogOpen(false);
                  setNewSeason({ name: "", startDate: "", endDate: "", status: "Draft" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSeason}>
                Create Season
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BasedataUpload;

