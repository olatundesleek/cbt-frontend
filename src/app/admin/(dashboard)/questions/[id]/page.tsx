"use client";

import Modal from "@/components/modal";
import AppTable, { TableDataItem } from "@/components/table";
import { Button, SpinnerMini } from "@/components/ui";
import { useGetQuestionsInBank } from "@/features/dashboard/queries/useDashboard";
import { errorLogger } from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";
import { QuestionsInBank } from "@/types/dashboard.types";
import { useParams } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateQuestion from "./create-question";
import { useMutation } from "@tanstack/react-query";
import { dashboardServices } from "@/services/dashboardService";
import { MdDeleteOutline } from "react-icons/md";

const Questions = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { id: questionBankId } = useParams();
  const { back: goBack } = useRouter();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: QuestionsInBank | null;
    type: "create" | "update" | "delete";
  }>({
    isOpen: false,
    modalContent: null,
    type: "create",
  });
  const {
    data: questions,
    isLoading,
    error,
  } = useGetQuestionsInBank(`${questionBankId}`);

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | QuestionsInBank | ("create" | "update" | "delete") | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // delete question
  const { mutate: deleteFn, isPending: isDeleting } = useMutation({
    mutationFn: dashboardServices.deleteQuestion,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success(data.message || "Deleted Successfully");
      updateModalState({ key: "isOpen", value: false });
    },
    onError: (error) => errorLogger(error),
  });

  // select items
  const handleSelectQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  };

  // download questions template
  const handleImportQuestions = async () => {
    if (!selectedFile) {
      return inputRef.current?.click();
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append("bankId", `${questionBankId}`);
    formData.append("questions", selectedFile);

    try {
      const res = await dashboardServices.uploadQuestions(formData);
      await queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast.success(res.message);
      setSelectedFile(null);
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsPending(false);
    }
  };

  if (error) {
    errorLogger(error);
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <button
          className="self-start cursor-pointer"
          title="Go back"
          onClick={goBack}
        >
          <IoMdArrowRoundBack size={20} />
        </button>

        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-2xl font-semibold">Questions</h1>

          <div className="w-fit">
            <Button
              onClick={() => {
                updateModalState({ key: "isOpen", value: true });
                updateModalState({ key: "type", value: "create" });
              }}
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SpinnerMini color="#0c4a6e" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
          <div className="grid col-span-1 lg:col-span-2">
            <AppTable
              data={questions ?? []}
              isLoading={isLoading}
              headerColumns={["Question", "Answer", "Options", "Mark"]}
              itemKey={({ item }) => `${item.id}`}
              onActionClick={({ item }) =>
                updateModalState({ key: "modalContent", value: item })
              }
              renderItem={({ item }) => (
                <>
                  <TableDataItem>{item.text}</TableDataItem>
                  <TableDataItem>{item.answer}</TableDataItem>
                  <TableDataItem>
                    {item.options?.join?.(", ") ?? ""}
                  </TableDataItem>
                  <TableDataItem>{item.marks}</TableDataItem>
                </>
              )}
              actionModalContent={
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      updateModalState({ key: "type", value: "update" });
                      updateModalState({ key: "isOpen", value: true });
                    }}
                    className="px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      updateModalState({ key: "type", value: "delete" });
                      updateModalState({ key: "isOpen", value: true });
                    }}
                    className="px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              }
            />
          </div>

          <div className="col-span-1 flex flex-col gap-5 w-full">
            <div className="p-3 flex flex-col gap-3 w-full border border-neutral-200 rounded-2xl">
              <span className="text-base font-bold">Question Bank Summary</span>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  <span>Total Questions</span>
                  <span>{questions?.length}</span>
                </div>
                <div className="flex flex-row items-center justify-between w-full">
                  <span>Bank ID</span>
                  <span>{questionBankId}</span>
                </div>
              </div>
            </div>

            <div className="p-3 flex flex-col gap-3 w-full border border-neutral-200 rounded-2xl">
              <span className="text-base font-bold">Upload CSV File</span>

              <Link
                download
                href={`${
                  process.env.NEXT_PUBLIC_API_URL
                }${dashboardServices.getQuestionsTemplate()}`}
                className="px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm border border-neutral-200 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-fit hover:bg-neutral-200 rounded-md"
              >
                Download Template
              </Link>

              <div className="flex flex-col gap-4 w-full">
                {/* PUT QUESTIONS HERE */}

                <div className="flex flex-col gap-2 w-fit">
                  <Button disabled={isPending} onClick={handleImportQuestions}>
                    {isPending
                      ? "Uploading..."
                      : selectedFile
                      ? "Upload selected file"
                      : "Import Questions"}
                  </Button>
                  <input
                    hidden
                    ref={inputRef}
                    type="file"
                    onChange={handleSelectQuestion}
                    accept=".csv"
                  />
                  {selectedFile && (
                    <div className="flex flex-row items-center justify-between gap-4 w-full">
                      <span className="text-base font-medium">
                        {selectedFile?.name}
                      </span>
                      <button
                        type="button"
                        className="cursor-pointer opacity-100 hover:opacity-70"
                        onClick={() => setSelectedFile(null)}
                      >
                        <MdDeleteOutline color="#ef4444" size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* modal to delete and update a question bank */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: "isOpen", value: value as boolean })
        }
      >
        {modalState.type !== "delete" ? (
          <CreateQuestion
            bankId={`${questionBankId}`}
            type={modalState.type}
            singleQuestion={modalState.modalContent}
            closeModal={() => updateModalState({ key: "isOpen", value: false })}
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="text-lg text-error-700 font-medium">
                Delete Question
              </span>
              <span className="text-sm font-normal">
                This action is irreversible
              </span>
            </div>

            <div className="flex flex-row items-center justify-center w-full">
              <div className="flex flex-row items-center gap-2 w-full max-w-[50%] mx-auto">
                <Button
                  variant="danger"
                  disabled={isDeleting}
                  onClick={() => deleteFn(`${modalState?.modalContent?.id}`)}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </Button>

                <Button
                  disabled={isDeleting}
                  onClick={() =>
                    updateModalState({ key: "isOpen", value: false })
                  }
                >
                  No, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Questions;
