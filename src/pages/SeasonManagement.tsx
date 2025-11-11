
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Plus, FileText, ExternalLink, Wrench, Search, Filter, MoreVertical } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SeasonManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [series, setSeries] = useState([
    {
      id: 1,
      name: "May 2024",
      type: "External",
      status: "Active",
      startDate: "2024-05-01",
      endDate: "2024-07-31",
      syllabusCount: 156,
      entriesCount: 847,
      organization: "AQA"
    },
    {
      id: 2,
      name: "November 2024",
      type: "External",
      status: "Draft",
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      syllabusCount: 45,
      entriesCount: 234,
      organization: "OCR"
    },
    {
      id: 3,
      name: "March 2025",
      type: "Internal",
      status: "Planning",
      startDate: "2025-03-01",
      endDate: "2025-03-15",
      syllabusCount: 12,
      entriesCount: 0,
      organization: "Internal"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSeries, setNewSeries] = useState({
    name: "",
    type: "External",
    startDate: "",
    endDate: "",
    organization: ""
  });
  const [selectedExistingSeries, setSelectedExistingSeries] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Available External series (not currently displayed in table)
  const availableExternalSeries = [
    {
      id: 4,
      name: "June 2024",
      type: "External",
      status: "Active",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      syllabusCount: 120,
      entriesCount: 650,
      organization: "Edexcel"
    },
    {
      id: 5,
      name: "September 2024",
      type: "External",
      status: "Draft",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      syllabusCount: 80,
      entriesCount: 420,
      organization: "WJEC"
    },
    {
      id: 6,
      name: "January 2025",
      type: "External",
      status: "Planning",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      syllabusCount: 95,
      entriesCount: 0,
      organization: "AQA"
    }
  ];

  // Filter available series to exclude those already in the table
  const availableSeriesToSelect = availableExternalSeries.filter(availableSeries => 
    !series.some(displayedSeries => displayedSeries.id === availableSeries.id)
  );

  const handleCreateSeries = () => {
    if (newSeries.type === "External") {
      // For External type, select from available series not in table
      if (!selectedExistingSeries) {
        toast({
          title: "Error",
          description: "Please select an External series to add",
          variant: "destructive"
        });
        return;
      }

      const selectedSeries = availableExternalSeries.find(s => s.id.toString() === selectedExistingSeries);
      if (!selectedSeries) {
        toast({
          title: "Error",
          description: "Selected series not found",
          variant: "destructive"
        });
        return;
      }

      // Add the selected series to the table
      setSeries([...series, selectedSeries]);
      setIsDialogOpen(false);
      setSelectedExistingSeries("");
      setNewSeries({ name: "", type: "External", startDate: "", endDate: "", organization: "" });
      
      toast({
        title: "Success",
        description: `${selectedSeries.name} has been added to the table`
      });
      return;
    }

    // For Internal type, create new series with name and dates
    if (!newSeries.name || !newSeries.startDate || !newSeries.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const seriesItem = {
      id: series.length + 1,
      ...newSeries,
      organization: newSeries.type === "Internal" ? "Internal" : newSeries.organization,
      status: "Draft",
      syllabusCount: 0,
      entriesCount: 0
    };

    setSeries([...series, seriesItem]);
    setNewSeries({ name: "", type: "External", startDate: "", endDate: "", organization: "" });
    setSelectedExistingSeries("");
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "New series created successfully"
    });
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
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

  const getTypeVariant = (type: string): "default" | "secondary" | "outline" => {
    return type === "Internal" ? "secondary" : "outline";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getAcademicYear = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
    
    // UK academic year runs from September (9) to August (8)
    // If month is September-December, academic year is that year to next year
    // If month is January-August, academic year is previous year to that year
    if (month >= 9) {
      return `${year} to ${year + 1}`;
    } else {
      return `${year - 1} to ${year}`;
    }
  };

  const filteredSeries = series.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: series.length,
    active: series.filter(s => s.status === "Active").length,
    draft: series.filter(s => s.status === "Draft").length,
    planning: series.filter(s => s.status === "Planning").length,
    totalEntries: series.reduce((sum, s) => sum + s.entriesCount, 0),
    totalSyllabuses: series.reduce((sum, s) => sum + s.syllabusCount, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Series Management</h1>
            <p className="text-muted-foreground">Manage examination series (Internal and External)</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Series
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{newSeries.type === "External" ? "Select External Series" : "Create New Internal Series"}</DialogTitle>
                <DialogDescription>
                  {newSeries.type === "External" 
                    ? "Select an existing External series to add to the table" 
                    : "Set up a new Internal examination series"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seriesType">Type</Label>
                  <Select value={newSeries.type} onValueChange={(value) => {
                    setNewSeries({ ...newSeries, type: value, organization: value === "Internal" ? "Internal" : "" });
                    setSelectedExistingSeries("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="External">External</SelectItem>
                      <SelectItem value="Internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newSeries.type === "External" ? (
                  <div>
                    <Label htmlFor="existingSeries">Select External Series to Add</Label>
                    <Select value={selectedExistingSeries} onValueChange={setSelectedExistingSeries}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an External series to add to table" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSeriesToSelect.length === 0 ? (
                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No available External series to add
                          </div>
                        ) : (
                          availableSeriesToSelect.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.name} ({s.startDate} to {s.endDate}) - {s.status}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {availableSeriesToSelect.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        All available External series are already displayed in the table.
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="seriesName">Series Name</Label>
                      <Input
                        id="seriesName"
                        placeholder="e.g., May 2025"
                        value={newSeries.name}
                        onChange={(e) => setNewSeries({ ...newSeries, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newSeries.startDate}
                          onChange={(e) => setNewSeries({ ...newSeries, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newSeries.endDate}
                          onChange={(e) => setNewSeries({ ...newSeries, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
                <Button onClick={handleCreateSeries} className="w-full">
                  {newSeries.type === "External" ? "Add Series" : "Create Series"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Series</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.draft}</div>
              <p className="text-xs text-muted-foreground mt-1">Draft</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.planning}</div>
              <p className="text-xs text-muted-foreground mt-1">Planning</p>
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
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground mt-1">Total Entries</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                All Series ({filteredSeries.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search series..."
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSeries.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No series found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create a new series to get started"}
                </p>
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Series Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Syllabuses</TableHead>
                  <TableHead>Entries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSeries.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(item.type)}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getAcademicYear(item.startDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-4 w-4" />
                        {item.syllabusCount}
                      </div>
                    </TableCell>
                    <TableCell>{item.entriesCount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {item.type === "Internal" && (
                            <DropdownMenuItem
                              onClick={() => navigate(`/mock-exam-setup/${item.id}`)}
                            >
                              <Wrench className="h-4 w-4 mr-2" />
                              Setup Basedata
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => navigate(`/entries-management/${item.id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Manage Entries
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default SeasonManagement;
