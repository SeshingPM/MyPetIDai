import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logger from "@/utils/logger";

interface EmailDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    fileUrl: string;
  } | null;
}

/**
 * Dialog component for sharing a document via email
 * Uses Supabase Edge Function to send email with document share link
 */
const EmailDocumentDialog: React.FC<EmailDocumentDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!document || !email) return;

    setIsSending(true);
    setError(null);

    try {
      // Get auth token for the API call
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("You must be logged in to share documents");
      }

      // Call the Supabase Edge Function directly
      logger.info("Sending document email via Edge Function");
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "send-document-email",
        {
          body: {
            documentId: document.id,
            recipientEmail: email,
            subject: subject,
            message: message,
          },
        }
      );

      // Log response for debugging
      logger.info("Email function response:", result);

      if (fnError) {
        logger.error("Error calling send-document-email function:", fnError);
        throw new Error(fnError.message || "Failed to send email");
      }

      if (!result) {
        throw new Error("No response from email function");
      }

      // Success, show confirmation
      setEmailSent(true);
      logger.info("Email sent successfully", result);
    } catch (error) {
      logger.error("Error sending document email:", error);
      setError(
        error.message ||
          "There was a problem sending the email. Please try again."
      );
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    // Reset the form state when dialog is closed
    if (emailSent) {
      toast.success("Email sent successfully");
    }
    onOpenChange(false);

    // Reset state after closing
    setTimeout(() => {
      setEmailSent(false);
      setError(null);
      setEmail("");
      setMessage("");
      setSubject("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Document</DialogTitle>
          <DialogDescription>
            Share this document directly via email
          </DialogDescription>
        </DialogHeader>

        {emailSent ? (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Email Sent Successfully
            </h3>
            <p className="text-gray-500 mb-6">
              Your document has been shared with {email}
            </p>
            <Button onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email</Label>
                <Input
                  id="recipient"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  type="email"
                  required
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Document Sharing"
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I wanted to share this document with you..."
                  rows={3}
                  disabled={isSending}
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSending}
              >
                Cancel
              </Button>

              <Button onClick={handleSend} disabled={isSending || !email}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailDocumentDialog;
