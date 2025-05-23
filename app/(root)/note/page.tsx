'use client'

import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import UploadNoteAction from '@/app/_component/UploadNote'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Note = () => {
  const me = useQuery(api.user.getMe)
  const admin = me?.admin
  const notes = useQuery(api.getting.getNotes) || []

  const [searchQuery, setSearchQuery] = useState('')
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  const [filterCourseCode, setFilterCourseCode] = useState('')

  const filteredNotes = notes.filter((note) => {
    const dateMatch = filterDate
      ? new Date(note._creationTime).toLocaleDateString() === format(filterDate, 'dd/MM/yyyy')
      : true
    const searchMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase())
    const courseMatch = filterCourseCode
      ? note.courseCode === filterCourseCode || note.courseCode === 'ALL'
      : true
    return dateMatch && searchMatch && courseMatch
  })

  const deleteNote = useMutation(api.uploading.deleteNote)
  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote({ noteId })
    } catch (err) {
      alert('Error deleting note')
    }
  }

  const downloadAllImages = async (urls: string[], title: string) => {
    const zip = new JSZip()
    await Promise.all(
      urls.map(async (url, i) => {
        const res = await fetch(url)
        const blob = await res.blob()
        zip.file(`${title}_${i + 1}.jpg`, blob)
      })
    )
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${title}.zip`)
  }

  const downloadSingleImage = async (url: string, title: string, i: number) => {
    const res = await fetch(url)
    const blob = await res.blob()
    saveAs(blob, `${title}_${i + 1}.jpg`)
  }

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Classroom Notes</h1>
        {admin && <UploadNoteAction />}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-56 justify-start">
              {filterDate ? format(filterDate, 'PPP') : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={(date) => setFilterDate(date || null)}
              className="border-none"
            />
          </PopoverContent>
        </Popover>
        <Select onValueChange={(val) => setFilterCourseCode(val === 'all' ? '' : val)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {[...new Set(notes.map((n) => n.courseCode))].map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => (
          <div key={index} className="rounded-lg border bg-white p-4 shadow-md flex flex-col gap-2">
            <div className="text-sm text-gray-600">{note.courseCode}</div>
            <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
            <div className="text-xs text-gray-400">
              Posted: {new Date(note._creationTime).toLocaleDateString()}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {note.imageUrl.map((url, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSingleImage(url, note.title, i)}
                >
                  Download {i + 1}
                </Button>
              ))}
              {note.imageUrl.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAllImages(note.imageUrl, note.title)}
                >
                  Download All
                </Button>
              )}
            </div>

            {admin && (
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      This will permanently delete the note. Are you sure?
                    </DialogDescription>
                    <DialogFooter>
                      <Button onClick={() => handleDelete(note._id)} className="bg-red-500 text-white">
                        Yes, Delete
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Note
