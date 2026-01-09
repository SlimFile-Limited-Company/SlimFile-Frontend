import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Filter, Trash2, FileArchive, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const fetchHistory = async (page: number, search: string, fileType: string) => {
  const token = localStorage.getItem('jwt');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '20',
    ...(search && { search }),
    ...(fileType && { fileType })
  });

  const res = await fetch(`${API_BASE_URL}/dashboard/history?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export default function DashboardHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-history', page, search, fileType],
    queryFn: () => fetchHistory(page, search, fileType)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_BASE_URL}/dashboard/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent'] });
      toast({
        title: 'Item deleted',
        description: 'History item has been removed successfully.',
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFileTypeChange = (value: string) => {
    setFileType(value === 'all' ? '' : value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compression History</h1>
        <p className="text-gray-600 mt-1">View and manage your compression history.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* File Type Filter */}
              <Select value={fileType || 'all'} onValueChange={handleFileTypeChange}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="application/pdf">PDFs</SelectItem>
                  <SelectItem value="application">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-4">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-12">
              <FileArchive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No history found</p>
              <p className="text-sm text-gray-400">
                {search || fileType
                  ? 'Try adjusting your filters'
                  : 'Start compressing files to build your history'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Original Size</TableHead>
                      <TableHead>Compressed Size</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.filename}</TableCell>
                        <TableCell>{formatBytes(item.originalSize)}</TableCell>
                        <TableCell>{formatBytes(item.compressedSize)}</TableCell>
                        <TableCell>
                          <span className="text-green-600 font-semibold">
                            {formatBytes(item.spaceSaved)} ({item.compressionRatio}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {item.operation}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile List */}
              <div className="md:hidden space-y-4">
                {data.items.map((item: any) => (
                  <div key={item._id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                          <FileArchive className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{item.filename}</p>
                          <p className="text-sm text-gray-500 capitalize">{item.operation}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(item._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Original:</span>
                        <span className="ml-1 font-medium">{formatBytes(item.originalSize)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Compressed:</span>
                        <span className="ml-1 font-medium">{formatBytes(item.compressedSize)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Saved:</span>
                        <span className="ml-1 font-semibold text-green-600">
                          {formatBytes(item.spaceSaved)} ({item.compressionRatio}%)
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Page {data.page} of {data.pages} ({data.total} items)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={data.page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={data.page === data.pages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete History Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this item from your history. This action cannot be undone.
              Note: The actual compressed file has already been downloaded and is not stored on our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
