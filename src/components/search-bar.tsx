"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { expertises, locations } from '@/lib/types';

interface SearchBarProps {
  searchTerm: string;
  selectedExpertise: string;
  selectedLocation: string;
  onSearchTermChange: (value: string) => void;
  onExpertiseChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}


export function SearchBar({
  searchTerm,
  selectedExpertise,
  selectedLocation,
  onSearchTermChange,
  onExpertiseChange,
  onLocationChange,
}: SearchBarProps) {
  return (
    <Card className="p-4 shadow-md bg-background/50 sticky top-20 z-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or firm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <Select value={selectedExpertise} onValueChange={onExpertiseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Expertise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Expertises</SelectItem>
            {expertises.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
