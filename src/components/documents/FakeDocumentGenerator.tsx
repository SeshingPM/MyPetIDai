import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SUPABASE_URL } from "@/config/env";

interface FakeDocumentGeneratorProps {
  onDocumentsAdded: () => void;
}

const FAKE_DOCUMENTS = [
  {
    name: "Vaccination Record - Rabies",
    category: "Vaccination Record",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/vaccination_record.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Annual Checkup Report",
    category: "Medical Report",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/medical_report.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Pet Insurance Policy",
    category: "Insurance Policy",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/insurance_policy.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Adoption Certificate",
    category: "Adoption Certificate",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/adoption_certificate.jpg`,
    file_type: "image/jpeg",
  },
  {
    name: "Basic Training Completion",
    category: "Training Certificate",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/training_certificate.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Microchip Registration",
    category: "Microchip Information",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/microchip_reg.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Heartworm Medication Prescription",
    category: "Prescription",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/prescription.pdf`,
    file_type: "application/pdf",
  },
  {
    name: "Pet Passport",
    category: "Other",
    file_url: `${SUPABASE_URL}/storage/v1/object/public/documents/samples/pet_passport.pdf`,
    file_type: "application/pdf",
  },
];

const FakeDocumentGenerator: React.FC<FakeDocumentGeneratorProps> = ({
  onDocumentsAdded,
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateFakeDocuments = async () => {
    setIsGenerating(true);

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Not authenticated");
      }

      const userId = userData.user.id;

      // Add each fake document to the database
      for (const doc of FAKE_DOCUMENTS) {
        await supabase.from("documents").insert({
          name: doc.name,
          category: doc.category,
          file_url: doc.file_url,
          file_type: doc.file_type,
          user_id: userId,
        });
      }

      toast({
        title: "Demo Documents Added",
        description: `${FAKE_DOCUMENTS.length} sample documents have been added to your collection.`,
      });

      onDocumentsAdded();
    } catch (error) {
      console.error("Error generating fake documents:", error);
      toast({
        title: "Error",
        description: "Failed to add sample documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleGenerateFakeDocuments}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Database className="h-4 w-4 animate-pulse" />
          Adding...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Add Sample Documents
        </>
      )}
    </Button>
  );
};

export default FakeDocumentGenerator;
