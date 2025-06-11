import React from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  IconContainer,
  WarningIcon,
  TextContainer,
  Title,
  Description,
  TaskName,
  ActionsContainer,
  CancelButton,
  DeleteButton,
} from "./DeleteConfirmModal.styles";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <ModalOverlay onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Backdrop */}
      <ModalContainer onClick={onCancel} />

      {/* Modal */}
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <IconContainer>
          <WarningIcon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </WarningIcon>
        </IconContainer>

        <TextContainer>
          <Title id="modal-title">Excluir Tarefa</Title>
          <Description id="modal-description">
            Tem certeza que deseja excluir a tarefa{" "}
            <TaskName>{taskTitle}</TaskName>?
            <br />
            Esta ação não pode ser desfeita.
          </Description>
        </TextContainer>

        <ActionsContainer>
          <CancelButton
            onClick={onCancel}
            aria-label="Cancelar exclusão da tarefa"
          >
            Cancelar
          </CancelButton>
          <DeleteButton
            onClick={onConfirm}
            aria-label={`Confirmar exclusão da tarefa ${taskTitle}`}
          >
            Excluir
          </DeleteButton>
        </ActionsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;
