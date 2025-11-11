import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">School Basedata Upload</h1>
              <p className="text-muted-foreground mt-1">
                Upload and manage school-specific basedata for examination series
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
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Basedata
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
    </div>
  );
};

export default BasedataUpload;

