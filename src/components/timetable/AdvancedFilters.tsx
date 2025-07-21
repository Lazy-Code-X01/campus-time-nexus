import { useState } from "react";
import { Search, Filter, Calendar, Users, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AdvancedFiltersProps {
  onSearchChange: (query: string) => void;
  onRoomFilter: (room: string) => void;
  onTimeSlotFilter: (slot: string) => void;
  onCapacityFilter: (capacity: string) => void;
  onAvailabilityFilter: (available: boolean) => void;
}

const mockRooms = [
  { id: "A101", name: "Lecture Hall A101", capacity: 120 },
  { id: "B205", name: "Seminar Room B205", capacity: 30 },
  { id: "C301", name: "Computer Lab C301", capacity: 40 },
  { id: "D105", name: "Physics Lab D105", capacity: 25 }
];

const timeSlots = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
  "16:00-17:00", "17:00-18:00"
];

export function AdvancedFilters({
  onSearchChange,
  onRoomFilter,
  onTimeSlotFilter,
  onCapacityFilter,
  onAvailabilityFilter
}: AdvancedFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
  };

  const addFilter = (type: string, value: string) => {
    const filter = `${type}:${value}`;
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    onSearchChange("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, lecturers, rooms..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Room
            </label>
            <Select onValueChange={(value) => {
              onRoomFilter(value);
              addFilter("room", value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {mockRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Slot
            </label>
            <Select onValueChange={(value) => {
              onTimeSlotFilter(value);
              addFilter("time", value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Min Capacity
            </label>
            <Select onValueChange={(value) => {
              onCapacityFilter(value);
              addFilter("capacity", value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Min capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Size</SelectItem>
                <SelectItem value="20">20+ seats</SelectItem>
                <SelectItem value="50">50+ seats</SelectItem>
                <SelectItem value="100">100+ seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability
            </label>
            <Select onValueChange={(value) => {
              onAvailabilityFilter(value === "available");
              addFilter("availability", value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Slots</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="booked">Booked Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.map((filter) => {
                  const [type, value] = filter.split(":");
                  return (
                    <Badge
                      key={filter}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeFilter(filter)}
                    >
                      {type}: {value} ×
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}