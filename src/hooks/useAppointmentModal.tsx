import { useState } from 'react';

interface UseAppointmentModalProps {
  preSelectedExpert?: string;
  preSelectedService?: string;
}

export const useAppointmentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preSelectedExpert, setPreSelectedExpert] = useState<string | undefined>();
  const [preSelectedService, setPreSelectedService] = useState<string | undefined>();

  const openModal = (options?: UseAppointmentModalProps) => {
    if (options?.preSelectedExpert) {
      setPreSelectedExpert(options.preSelectedExpert);
    }
    if (options?.preSelectedService) {
      setPreSelectedService(options.preSelectedService);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPreSelectedExpert(undefined);
    setPreSelectedService(undefined);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    preSelectedExpert,
    preSelectedService
  };
};