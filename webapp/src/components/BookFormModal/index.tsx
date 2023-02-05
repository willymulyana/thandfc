import { Doctor, SlotInput, useBookAppointmentMutation } from '@/generated/core.graphql'
import {
  Button,
  Input, Modal,
  ModalBody,
  ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useToast
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { FC, useCallback } from 'react'
import { useForm } from "react-hook-form"

type Props = {
  injectedData: {doctor:Doctor, slot:SlotInput},
  visible: boolean;
  onClose: () => void
}

const BookFormModal: FC<Props> = ({ injectedData, visible, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  // const [addItem, { loading: addingItems }] = useAddItemMutation();
  const [bookAppointment, { loading}] = useBookAppointmentMutation();
  const toast = useToast();

  const doBookAppointment = useCallback(async (patientName:string, description:string) => {
    try {
      await bookAppointment({
        variables: {
          bookAppointmentInput: {
            slot: {
              doctorId: injectedData.slot.doctorId,
              start: injectedData.slot.start,
              end: injectedData.slot.end
            },
            patientName,
            description
          }
        }
      });

      onClose();

      toast({
        title: 'Submitted',
        description: "Your booking has been submitted.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (ex) {
      let msg = "Something went wrong.";
      try {
        msg = ex.message;
      } catch(ex) {}

      toast({
        title: 'Error',
        description: msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  },[bookAppointment]);

  const onSubmit = (data:any) => {
    doBookAppointment(data.name, data.description);
  }
  
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You are about to book appointment with</Text>
            <Text size="md" fontWeight="bold">Dr. {injectedData?.doctor.name.split('_').join(' ').toLocaleUpperCase()}</Text>
            <Text>on</Text>
            <Text size="md" fontWeight="bold">{injectedData ? format(parseISO(injectedData?.slot.start), "d MMM yyyy h:mm a") : ''}</Text>
            <Text marginTop="3" marginBottom="3">please provide your details and submit your booking</Text>

            <Input {...register("name", { required: true, maxLength: 20, pattern: /^[A-Za-z]+$/i })} 
                placeholder="Your name" marginTop="2" disabled={loading} />
            {errors.name?.type === 'required' && <Text role="alert" color='red'>Name is required</Text>}
            <Textarea {...register("description", { required: true, maxLength: 50})} 
                placeholder="Description ..." marginTop="2" disabled={loading} />
            {errors.description?.type === 'required' && <Text role="alert" color='red'>Description is required</Text>}

          </ModalBody>

          <ModalFooter>
              <Button type="submit" colorScheme='blue' mr={3} isLoading={loading}>
                Submit
              </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default BookFormModal;
