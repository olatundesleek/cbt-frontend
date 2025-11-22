/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { LuSettings } from "react-icons/lu";
import { Button } from "@/components/ui";
import api, { errorLogger } from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";
import { useEffect, BaseSyntheticEvent } from "react";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/ui/input";
import { QuestionsInBank } from "@/types/dashboard.types";

const schema = Yup.object({
  optionA: Yup.string().required("Option A is required"),
  optionB: Yup.string().required("Option B is required"),
  optionC: Yup.string().required("Option C is required"),
  optionD: Yup.string().required("Option D is required"),
  questionText: Yup.string().required("Question Text is required"),
  correctAnswer: Yup.string().required("Correct answer is required"),
  marks: Yup.string()
    .min(0, "Mark cannot be less than 0")
    .required("Question mark is required"),
});

type FormProps = Yup.InferType<typeof schema>;

interface CreateQuestionProps {
  bankId: string;
  type: "update" | "create";
  closeModal: () => void;
  singleQuestion: QuestionsInBank | null;
}

const CreateQuestion = ({
  bankId,
  type,
  closeModal,
  singleQuestion,
}: CreateQuestionProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const questionOptions = [
    {
      label: "Option A",
      value: "A",
    },
    {
      label: "Option B",
      value: "B",
    },
    {
      label: "Option C",
      value: "C",
    },
    {
      label: "Option D",
      value: "D",
    },
  ];

  const handleSubmitQuestion: SubmitHandler<FormProps> = async (
    data,
    event: BaseSyntheticEvent<object, HTMLButtonElement> | undefined
  ) => {
    // @ts-expect-error
    const buttonValue = event?.nativeEvent.submitter.value;
    const options = [data.optionA, data.optionB, data.optionC, data.optionD];
    const answerIndex = questionOptions.findIndex(
      (item) => item.value === data.correctAnswer
    );
    const answer = options[answerIndex];

    const json = {
      options,
      answer,
      text: data.questionText,
      marks: Number(data.marks),
    };

    const payload =
      type === "create" ? { ...json, bankId: Number(bankId) } : json;

    try {
      const res =
        type === "update"
          ? await api.patch(`/question/${singleQuestion?.id}`, payload)
          : await api.post("/question", payload);

      await queryClient.invalidateQueries({
        queryKey: ["questionBanks", bankId],
      });
      toast.success(res.data.message || "Successful");
      reset();

      if (buttonValue !== "save-another") {
        closeModal();
      }
    } catch (error) {
      errorLogger(error);
    }
  };

  useEffect(() => {
    if (type !== "update") return;

    const correctAnswerIndex = (singleQuestion?.options as string[]).findIndex(
      (item) => item === singleQuestion?.answer
    );

    const correctAnswer = questionOptions[correctAnswerIndex].value;

    setValue("questionText", singleQuestion?.text as string);
    setValue("optionA", singleQuestion?.options[0] as string);
    setValue("optionB", singleQuestion?.options[1] as string);
    setValue("optionC", singleQuestion?.options[2] as string);
    setValue("optionD", singleQuestion?.options[3] as string);
    setValue("correctAnswer", correctAnswer);
    setValue("marks", `${singleQuestion?.marks}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, setValue, singleQuestion]);

  return (
    <div className="flex flex-col gap-1 bg-background rounded-xl w-full p-3">
      <span className="font-medium">Create Question</span>

      <form
        onSubmit={handleSubmit(handleSubmitQuestion)}
        className="flex flex-col gap-3 w-full"
      >
        <Input
          label="Question Text"
          name="questionText"
          placeholder="What is 1 + 5?"
          hookFormRegister={register}
          errorText={errors.questionText && errors.questionText.message}
        />

        <Input
          label="Option A"
          name="optionA"
          placeholder="6"
          hookFormRegister={register}
          errorText={errors.optionA && errors.optionA.message}
        />

        <Input
          label="Option B"
          name="optionB"
          placeholder="4"
          hookFormRegister={register}
          errorText={errors.optionB && errors.optionB.message}
        />

        <Input
          label="Option C"
          name="optionC"
          placeholder="7"
          hookFormRegister={register}
          errorText={errors.optionC && errors.optionC.message}
        />

        <Input
          label="Option D"
          name="optionD"
          placeholder="10"
          hookFormRegister={register}
          errorText={errors.optionD && errors.optionD.message}
        />

        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="correctAnswer">
              <span className="text-sm text-neutral-600">Correct Answer</span>

              <select
                id="correctAnswer"
                {...register("correctAnswer")}
                className="block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
              >
                <option value={""} disabled>
                  Select Correct Answer
                </option>
                {questionOptions.map((answer) => (
                  <option key={answer.value} value={answer.value}>
                    {answer.label}
                  </option>
                ))}
              </select>
            </label>

            {errors?.correctAnswer?.message && (
              <small className="text-error-500">
                {errors?.correctAnswer?.message}
              </small>
            )}
          </div>

          <Input
            label="Marks"
            name="marks"
            placeholder="1"
            type="number"
            min={0}
            hookFormRegister={register}
            errorText={errors.marks && errors.marks.message}
          />
        </div>

        <div className="flex flex-row items-center gap-3">
          <div className="w-fit">
            <Button type="submit" disabled={isSubmitting}>
              Save Question
            </Button>
          </div>

          {type === "create" && (
            <div className="w-fit">
              <button
                value="save-another"
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm border border-neutral-200 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-fit hover:bg-neutral-200 rounded-md"
              >
                <div className="flex flex-row items-center gap-2">
                  <span>Save & Add Another</span>
                  <LuSettings />
                </div>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
