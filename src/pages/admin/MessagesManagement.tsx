
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Message } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Loader2, Trash2, Mail, MailOpen, Search } from 'lucide-react';

const MessagesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: dbService.getMessages,
  });

  const markAsReadMutation = useMutation({
    mutationFn: dbService.markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Mark Message as Read",
        description: error.message || "There was a problem updating the message.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Message",
        description: error.message || "There was a problem deleting the message.",
        variant: "destructive",
      });
    }
  });

  const openMessage = async (message: Message) => {
    setSelectedMessage(message);
    setIsOpen(true);
    
    // Mark as read if not already read
    if (!message.read) {
      await markAsReadMutation.mutateAsync(message.id);
    }
  };

  // Filter messages by search query
  const filteredMessages = messages?.filter(message => {
    const query = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(query) ||
      message.email.toLowerCase().includes(query) ||
      message.subject.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
  });

  // Count unread messages
  const unreadCount = messages?.filter(message => !message.read).length || 0;

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'PPP');
    } catch (error) {
      return dateStr;
    }
  };

  // Format time for display
  const formatTime = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'p');
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-portfolio-gray mt-1">
              You have <span className="text-portfolio-blue font-medium">{unreadCount}</span> unread messages
            </p>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portfolio-gray/50" size={16} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 py-2 pr-4 bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-portfolio-blue/50 text-white w-56 md:w-64"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : filteredMessages && filteredMessages.length > 0 ? (
            <table className="min-w-full divide-y divide-portfolio-dark/60">
              <thead className="bg-portfolio-darkest">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-portfolio-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-portfolio-dark/40">
                {filteredMessages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`${!message.read ? 'bg-portfolio-blue/5' : ''} hover:bg-portfolio-darkest transition-colors cursor-pointer`}
                    onClick={() => openMessage(message)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {message.read ? (
                        <MailOpen size={18} className="text-portfolio-gray" />
                      ) : (
                        <Mail size={18} className="text-portfolio-blue" />
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`${!message.read ? 'font-medium text-white' : 'text-portfolio-gray'}`}>
                        {message.name}
                      </div>
                      <div className="text-xs text-portfolio-gray">{message.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`${!message.read ? 'font-medium text-white' : 'text-portfolio-gray'} truncate max-w-md`}>
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">
                      <div>{formatDate(message.created_at)}</div>
                      <div className="text-xs">{formatTime(message.created_at)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-portfolio-dark border-portfolio-dark/60">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                            <AlertDialogDescription className="text-portfolio-gray">
                              Are you sure you want to delete this message? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => deleteMutation.mutate(message.id)}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              {searchQuery ? (
                <div className="text-portfolio-gray">
                  <Search className="h-12 w-12 mx-auto text-portfolio-gray/30 mb-4" />
                  <p>No messages found matching "{searchQuery}"</p>
                  <button 
                    className="text-portfolio-blue hover:underline mt-2 text-sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="text-portfolio-gray">
                  <Mail className="h-12 w-12 mx-auto text-portfolio-gray/30 mb-4" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-portfolio-dark border-portfolio-dark/60 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {selectedMessage?.subject}
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-portfolio-dark/40 pb-4">
                <div>
                  <h3 className="font-medium text-white">{selectedMessage.name}</h3>
                  <p className="text-sm text-portfolio-gray">{selectedMessage.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-portfolio-gray">{formatDate(selectedMessage.created_at)}</p>
                  <p className="text-xs text-portfolio-gray">{formatTime(selectedMessage.created_at)}</p>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-white min-h-[200px] max-h-[400px] overflow-y-auto">
                {selectedMessage.message}
              </div>

              <div className="pt-4 border-t border-portfolio-dark/40 flex justify-between items-center">
                <div>
                  {selectedMessage.read ? (
                    <Badge variant="outline" className="bg-portfolio-darkest text-portfolio-gray">
                      Read
                    </Badge>
                  ) : (
                    <Badge className="bg-portfolio-blue text-white">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-portfolio-dark border-portfolio-dark/60">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                        <AlertDialogDescription className="text-portfolio-gray">
                          Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => {
                            if (selectedMessage) {
                              deleteMutation.mutate(selectedMessage.id);
                              setIsOpen(false);
                            }
                          }}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesManagement;
