"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { expertises, locations } from '@/lib/types';

export function SearchBar() {
  return (
    <Card className="p-4 shadow-md bg-background/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, firm, or keyword..."
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Expertise" />
          </SelectTrigger>
          <SelectContent>
            {expertises.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="w-full sm:col-span-2 lg:col-span-1">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </Card>
  );
}
