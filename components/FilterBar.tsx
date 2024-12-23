'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterBarProps {
  onFilterChange: (filter: string) => void
  onSearchChange: (search: string) => void
}

export default function FilterBar({ onFilterChange, onSearchChange }: FilterBarProps) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const handleFilterChange = (value: string) => {
    setFilter(value)
    onFilterChange(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearchChange(e.target.value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search by port or phone number"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <Select value={filter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ports</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

