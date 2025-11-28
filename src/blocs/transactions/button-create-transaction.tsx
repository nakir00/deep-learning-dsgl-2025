import { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateTransactionForm from '@/components/transactions/forms/create-transaction-form';


const ButtonCreateTransaction = ({ onCreateTransaction }: { onCreateTransaction?: () => void }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCreateTransaction = () => {

    setIsOpen(false);
    if (onCreateTransaction) {
      onCreateTransaction();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-4">
          <Plus className="w-4 h-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Nouvelle Transaction
          </DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour créer une nouvelle transaction
          </DialogDescription>
        </DialogHeader>

        <CreateTransactionForm onCreateTransaction={() => handleCreateTransaction()} />
      </DialogContent>
    </Dialog>
  );
};

export default ButtonCreateTransaction;