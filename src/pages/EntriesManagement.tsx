import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Users, FileText, Copy, Search, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const EntriesManagement = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on seriesId
  const seriesData = {
    id: seriesId,
    name: "May 2024",
    type: "External",
    organization: "AQA"
  };

  const [syllabuses, setSyllabuses] = useState([
    {
      id: 1,
      code: "8300",
      title: "GCSE Mathematics",
      level: "GCSE",
      options: [
        { id: 1, code: "8300/1H", title: "Paper 1 Higher", entries: 45, examDate: "2024-11-15", examTime: "09:00" },
        { id: 2, code: "8300/2H", title: "Paper 2 Higher", entries: 45, examDate: "2024-11-18", examTime: "13:00" },
        { id: 3, code: "8300/3H", title: "Paper 3 Higher", entries: 45, examDate: "2024-11-20", examTime: "09:00" }
      ]
    },
    {
      id: 2,
      code: "8700",
      title: "GCSE English Language",
      level: "GCSE",
      options: [
        { id: 4, code: "8700/1", title: "Paper 1", entries: 38, examDate: "2024-11-22", examTime: "09:00" },
        { id: 5, code: "8700/2", title: "Paper 2", entries: 38, examDate: "2024-11-25", examTime: "13:00" }
      ]
    }
  ]);

  const [entries, setEntries] = useState([
    {
      id: 1,
      syllabusCode: "8300",
      optionCode: "8300/1H",
      optionTitle: "Paper 1 Higher",
      pupilsCount: 4,
      pupilIds: [1, 2, 3, 4],
      status: "Active"
    },
    {
      id: 2,
      syllabusCode: "8700",
      optionCode: "8700/1",
      optionTitle: "Paper 1",
      pupilsCount: 3,
      pupilIds: [2, 3, 4],
      status: "Active"
    }
  ]);

  const [pupils] = useState([
    { id: 1, name: "John Smith", year: "11", regGroup: "11A", subjects: ["Mathematics", "English"] },
    { id: 2, name: "Emma Johnson", year: "11", regGroup: "11A", subjects: ["Mathematics", "Science"] },
    { id: 3, name: "James Williams", year: "11", regGroup: "11B", subjects: ["English", "History"] },
    { id: 4, name: "Sophie Brown", year: "11", regGroup: "11B", subjects: ["Mathematics", "English", "Science"] },
    { id: 5, name: "Oliver Davis", year: "12", regGroup: "12A", subjects: ["Mathematics", "Physics"] },
    { id: 6, name: "Isabella Wilson", year: "12", regGroup: "12A", subjects: ["English", "Chemistry"] },
    { id: 7, name: "Lucas Martinez", year: "12", regGroup: "12B", subjects: ["Mathematics", "Biology"] },
    { id: 8, name: "Mia Anderson", year: "10", regGroup: "10A", subjects: ["Mathematics", "English"] }
  ]);

  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [isCreateSyllabusOpen, setIsCreateSyllabusOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedPupils, setSelectedPupils] = useState<number[]>([]);
  const [copySyllabusSource, setCopySyllabusSource] = useState("");
  const [selectionMode, setSelectionMode] = useState<"specific" | "year" | "regGroup">("specific");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedRegGroup, setSelectedRegGroup] = useState<string>("");
  const [viewDetailsEntry, setViewDetailsEntry] = useState<number | null>(null);
  const [entrySearchTerm, setEntrySearchTerm] = useState("");
  const [entryFilterSyllabus, setEntryFilterSyllabus] = useState<string>("all");

  const [newSyllabus, setNewSyllabus] = useState({
    code: "",
    title: "",
    level: "GCSE"
  });

  const [newOption, setNewOption] = useState({
    code: "",
    title: ""
  });

  const [syllabusOptions, setSyllabusOptions] = useState<any[]>([]);

  const handleCreateEntry = () => {
    if (!selectedSyllabus || !selectedOption) {
      toast({
        title: "Error",
        description: "Please select a syllabus and option",
        variant: "destructive"
      });
      return;
    }

    let pupilsToAdd: number[] = [];
    let pupilsCount = 0;

    if (selectionMode === "specific") {
      if (selectedPupils.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one pupil",
          variant: "destructive"
        });
        return;
      }
      pupilsToAdd = selectedPupils;
      pupilsCount = selectedPupils.length;
    } else if (selectionMode === "year") {
      if (!selectedYear) {
        toast({
          title: "Error",
          description: "Please select a year group",
          variant: "destructive"
        });
        return;
      }
      pupilsToAdd = pupils.filter(p => p.year === selectedYear).map(p => p.id);
      pupilsCount = pupilsToAdd.length;
    } else if (selectionMode === "regGroup") {
      if (!selectedRegGroup) {
        toast({
          title: "Error",
          description: "Please select a reg group",
          variant: "destructive"
        });
        return;
      }
      pupilsToAdd = pupils.filter(p => p.regGroup === selectedRegGroup).map(p => p.id);
      pupilsCount = pupilsToAdd.length;
    }

    if (pupilsCount === 0) {
      toast({
        title: "Error",
        description: "No pupils found for the selected criteria",
        variant: "destructive"
      });
      return;
    }

    const syllabus = syllabuses.find(s => s.code === selectedSyllabus);
    const option = syllabus?.options.find(o => o.code === selectedOption);

    const entry = {
      id: entries.length + 1,
      syllabusCode: selectedSyllabus,
      optionCode: selectedOption,
      optionTitle: option?.title || "",
      pupilsCount: pupilsCount,
      pupilIds: pupilsToAdd,
      status: "Active"
    };

    setEntries([...entries, entry]);
    setSelectedSyllabus("");
    setSelectedOption("");
    setSelectedPupils([]);
    setSyllabusOptions([]);
    setSelectionMode("specific");
    setSelectedYear("");
    setSelectedRegGroup("");
    setIsCreateEntryOpen(false);

    toast({
      title: "Success",
      description: `Entry created successfully with ${pupilsCount} pupil${pupilsCount !== 1 ? 's' : ''}`
    });
  };

  const handleCreateSyllabus = () => {
    if (!newSyllabus.code || !newSyllabus.title || syllabusOptions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and add at least one option",
        variant: "destructive"
      });
      return;
    }

    const syllabus = {
      id: syllabuses.length + 1,
      ...newSyllabus,
      options: syllabusOptions
    };

    setSyllabuses([...syllabuses, syllabus]);
    setNewSyllabus({ code: "", title: "", level: "GCSE" });
    setSyllabusOptions([]);
    setIsCreateSyllabusOpen(false);

    toast({
      title: "Success",
      description: "Syllabus created successfully"
    });
  };

  const handleAddOption = () => {
    if (!newOption.code || !newOption.title) {
      toast({
        title: "Error",
        description: "Please fill in option code and title",
        variant: "destructive"
      });
      return;
    }

    setSyllabusOptions([
      ...syllabusOptions,
      {
        id: syllabusOptions.length + 1,
        ...newOption,
        entries: 0
      }
    ]);
    setNewOption({ code: "", title: "" });
  };

  const handleCopySyllabus = () => {
    if (!copySyllabusSource) {
      toast({
        title: "Error",
        description: "Please select a syllabus to copy",
        variant: "destructive"
      });
      return;
    }

    const sourceSyllabus = syllabuses.find(s => s.code === copySyllabusSource);
    if (sourceSyllabus) {
      setNewSyllabus({
        code: sourceSyllabus.code + "-COPY",
        title: sourceSyllabus.title + " (Copy)",
        level: sourceSyllabus.level
      });
      setSyllabusOptions(sourceSyllabus.options.map(opt => ({ ...opt, entries: 0 })));
      setCopySyllabusSource("");
      
      toast({
        title: "Success",
        description: "Syllabus copied, you can now modify it"
      });
    }
  };

  const handleSyllabusChange = (code: string) => {
    setSelectedSyllabus(code);
    const syllabus = syllabuses.find(s => s.code === code);
    setSyllabusOptions(syllabus?.options || []);
    setSelectedOption("");
  };

  const togglePupilSelection = (pupilId: number) => {
    setSelectedPupils(prev =>
      prev.includes(pupilId)
        ? prev.filter(id => id !== pupilId)
        : [...prev, pupilId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/season-management")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Entries Management</h1>
            <p className="text-muted-foreground">
              Managing entries for <Badge variant="outline">{seriesData.name}</Badge> - {seriesData.organization}
            </p>
          </div>

          <div className="flex gap-2">
            {seriesData.type === "Internal" && (
              <Dialog open={isCreateSyllabusOpen} onOpenChange={setIsCreateSyllabusOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Create Syllabus
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Internal Syllabus</DialogTitle>
                    <DialogDescription>
                      Create a new syllabus for internal exams or copy from existing
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="create">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="create">Create New</TabsTrigger>
                      <TabsTrigger value="copy">Copy Existing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="create" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="syllabusCode">Syllabus Code</Label>
                          <Input
                            id="syllabusCode"
                            placeholder="e.g., MOCK-8300"
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
                              <SelectItem value="A-Level">A-Level</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="syllabusTitle">Syllabus Title</Label>
                        <Input
                          id="syllabusTitle"
                          placeholder="e.g., GCSE Mathematics Mock"
                          value={newSyllabus.title}
                          onChange={(e) => setNewSyllabus({ ...newSyllabus, title: e.target.value })}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <Label className="text-base">Options/Papers</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
                          <div>
                            <Label htmlFor="optionCode">Option Code</Label>
                            <Input
                              id="optionCode"
                              placeholder="e.g., MOCK-8300/1"
                              value={newOption.code}
                              onChange={(e) => setNewOption({ ...newOption, code: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="optionTitle">Option Title</Label>
                            <Input
                              id="optionTitle"
                              placeholder="e.g., Paper 1"
                              value={newOption.title}
                              onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                          Add Option
                        </Button>

                        {syllabusOptions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {syllabusOptions.map((opt) => (
                              <div key={opt.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{opt.code} - {opt.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSyllabusOptions(syllabusOptions.filter(o => o.id !== opt.id))}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button onClick={handleCreateSyllabus} className="w-full">
                        Create Syllabus
                      </Button>
                    </TabsContent>

                    <TabsContent value="copy" className="space-y-4">
                      <div>
                        <Label htmlFor="copySyllabus">Select Syllabus to Copy</Label>
                        <Select value={copySyllabusSource} onValueChange={setCopySyllabusSource}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a syllabus" />
                          </SelectTrigger>
                          <SelectContent>
                            {syllabuses.map((syl) => (
                              <SelectItem key={syl.id} value={syl.code}>
                                {syl.code} - {syl.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCopySyllabus} className="w-full flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Syllabus
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={isCreateEntryOpen} onOpenChange={(open) => {
              setIsCreateEntryOpen(open);
              if (!open) {
                setSelectedSyllabus("");
                setSelectedOption("");
                setSelectedPupils([]);
                setSyllabusOptions([]);
                setSelectionMode("specific");
                setSelectedYear("");
                setSelectedRegGroup("");
              }
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Manual Entry</DialogTitle>
                  <DialogDescription>
                    Select syllabus, option, and assign pupils
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="syllabus">Syllabus</Label>
                    <Select value={selectedSyllabus} onValueChange={handleSyllabusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select syllabus" />
                      </SelectTrigger>
                      <SelectContent>
                        {syllabuses.map((syl) => (
                          <SelectItem key={syl.id} value={syl.code}>
                            {syl.code} - {syl.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSyllabus && syllabusOptions.length > 0 && (
                    <div>
                      <Label htmlFor="option">Option/Paper</Label>
                      <Select value={selectedOption} onValueChange={setSelectedOption}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {syllabusOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.code}>
                              {opt.code} - {opt.title}
                              {opt.examDate && opt.examTime && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({opt.examDate} at {opt.examTime})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedOption && (
                    <div className="border rounded p-4 space-y-4">
                      <div>
                        <Label className="text-base mb-3 block">Selection Method</Label>
                        <Select value={selectionMode} onValueChange={(value: "specific" | "year" | "regGroup") => {
                          setSelectionMode(value);
                          setSelectedPupils([]);
                          setSelectedYear("");
                          setSelectedRegGroup("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="specific">Specific Pupils</SelectItem>
                            <SelectItem value="year">Whole Year Group</SelectItem>
                            <SelectItem value="regGroup">Whole Reg Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectionMode === "specific" && (
                        <div>
                          <Label className="text-base mb-3 block">Select Pupils ({selectedPupils.length} selected)</Label>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {pupils.map((pupil) => (
                              <div key={pupil.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                                <Checkbox
                                  id={`pupil-${pupil.id}`}
                                  checked={selectedPupils.includes(pupil.id)}
                                  onCheckedChange={() => togglePupilSelection(pupil.id)}
                                />
                                <label
                                  htmlFor={`pupil-${pupil.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">{pupil.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Year {pupil.year} - Reg: {pupil.regGroup} - {pupil.subjects.join(", ")}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectionMode === "year" && (
                        <div>
                          <Label className="text-base mb-3 block">Select Year Group</Label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year group" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(new Set(pupils.map(p => p.year))).sort().map(year => (
                                <SelectItem key={year} value={year}>
                                  Year {year} ({pupils.filter(p => p.year === year).length} pupils)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedYear && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <div className="text-sm font-medium mb-2">
                                Selected: Year {selectedYear} ({pupils.filter(p => p.year === selectedYear).length} pupils)
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {pupils.filter(p => p.year === selectedYear).map(p => p.name).join(", ")}
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
                              {Array.from(new Set(pupils.map(p => p.regGroup))).sort().map(regGroup => (
                                <SelectItem key={regGroup} value={regGroup}>
                                  {regGroup} ({pupils.filter(p => p.regGroup === regGroup).length} pupils)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedRegGroup && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <div className="text-sm font-medium mb-2">
                                Selected: {selectedRegGroup} ({pupils.filter(p => p.regGroup === selectedRegGroup).length} pupils)
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {pupils.filter(p => p.regGroup === selectedRegGroup).map(p => p.name).join(", ")}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Button onClick={handleCreateEntry} className="w-full">
                    {selectionMode === "specific" && `Create Entry with ${selectedPupils.length} Pupil${selectedPupils.length !== 1 ? 's' : ''}`}
                    {selectionMode === "year" && selectedYear && `Create Entry with Year ${selectedYear} (${pupils.filter(p => p.year === selectedYear).length} pupils)`}
                    {selectionMode === "year" && !selectedYear && "Create Entry"}
                    {selectionMode === "regGroup" && selectedRegGroup && `Create Entry with ${selectedRegGroup} (${pupils.filter(p => p.regGroup === selectedRegGroup).length} pupils)`}
                    {selectionMode === "regGroup" && !selectedRegGroup && "Create Entry"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{entries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Syllabuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{syllabuses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Pupils</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {entries.reduce((sum, entry) => sum + entry.pupilsCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Available Syllabuses
            </CardTitle>
            <CardDescription>Syllabuses available for this series</CardDescription>
          </CardHeader>
          <CardContent>
            {syllabuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No syllabuses configured</p>
                <p className="text-sm mt-1">
                  {seriesData.type === "Internal" 
                    ? "Create a syllabus to get started" 
                    : "Syllabuses will appear here once configured"}
                </p>
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Total Entries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syllabuses.map((syllabus) => (
                  <TableRow key={syllabus.id}>
                    <TableCell className="font-mono font-medium">{syllabus.code}</TableCell>
                    <TableCell>{syllabus.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{syllabus.level}</Badge>
                    </TableCell>
                    <TableCell>{syllabus.options.length}</TableCell>
                    <TableCell>
                      {syllabus.options.reduce((sum, opt) => sum + opt.entries, 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Entries List
                </CardTitle>
                <CardDescription>All entries for this series</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={entrySearchTerm}
                    onChange={(e) => setEntrySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={entryFilterSyllabus} onValueChange={setEntryFilterSyllabus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by syllabus" />
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const filteredEntries = entries.filter(entry => {
                const matchesSearch = entry.syllabusCode.toLowerCase().includes(entrySearchTerm.toLowerCase()) ||
                                     entry.optionCode.toLowerCase().includes(entrySearchTerm.toLowerCase()) ||
                                     entry.optionTitle.toLowerCase().includes(entrySearchTerm.toLowerCase());
                const matchesSyllabus = entryFilterSyllabus === "all" || entry.syllabusCode === entryFilterSyllabus;
                return matchesSearch && matchesSyllabus;
              });

              return filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No entries found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entrySearchTerm || entryFilterSyllabus !== "all"
                      ? "Try adjusting your filters"
                      : "Create an entry to get started"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Syllabus Code</TableHead>
                      <TableHead>Option Code</TableHead>
                      <TableHead>Option Title</TableHead>
                      <TableHead>Pupils</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono">{entry.syllabusCode}</TableCell>
                        <TableCell className="font-mono">{entry.optionCode}</TableCell>
                        <TableCell>{entry.optionTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {entry.pupilsCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{entry.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit Pupils
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setViewDetailsEntry(entry.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={viewDetailsEntry !== null} onOpenChange={(open) => !open && setViewDetailsEntry(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {viewDetailsEntry && (() => {
              const entry = entries.find(e => e.id === viewDetailsEntry);
              if (!entry) return null;
              
              const entryPupils = pupils.filter(p => entry.pupilIds?.includes(p.id));
              const syllabus = syllabuses.find(s => s.code === entry.syllabusCode);
              const option = syllabus?.options.find(o => o.code === entry.optionCode);
              
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Entry Details</DialogTitle>
                    <DialogDescription>
                      Complete information for this entry
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Entry Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Entry Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Syllabus Code</Label>
                            <div className="font-mono font-medium">{entry.syllabusCode}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Syllabus Title</Label>
                            <div>{syllabus?.title || "N/A"}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Option Code</Label>
                            <div className="font-mono font-medium">{entry.optionCode}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Option Title</Label>
                            <div>{entry.optionTitle}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Level</Label>
                            <div>
                              <Badge variant="outline">{syllabus?.level || "N/A"}</Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Status</Label>
                            <div>
                              <Badge variant="default">{entry.status}</Badge>
                            </div>
                          </div>
                          {option?.examDate && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Exam Date</Label>
                              <div>{option.examDate}</div>
                            </div>
                          )}
                          {option?.examTime && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Exam Time</Label>
                              <div>{option.examTime}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pupils List */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Pupils ({entryPupils.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {entryPupils.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No pupils assigned to this entry
                          </div>
                        ) : (
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Year</TableHead>
                                  <TableHead>Reg Group</TableHead>
                                  <TableHead>Subjects</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {entryPupils.map((pupil) => (
                                  <TableRow key={pupil.id}>
                                    <TableCell className="font-medium">{pupil.name}</TableCell>
                                    <TableCell>Year {pupil.year}</TableCell>
                                    <TableCell>{pupil.regGroup}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {pupil.subjects.map((subject, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {subject}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EntriesManagement;
