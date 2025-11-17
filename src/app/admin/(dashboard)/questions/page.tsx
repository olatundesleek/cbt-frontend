"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTable, { TableDataItem } from "@/components/table";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import {
  useGetCourses,
  useGetQuestionBank,
} from "@/features/dashboard/queries/useDashboard";
import api, { errorLogger } from "@/lib/axios";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/query-provider";

type FormProps = Yup.InferType<typeof schema>;

const schema = Yup.object({
  questionBankName: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  course: Yup.string().required("Course is required"),
});

const QuestionBank = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { questionBankName: "", course: "", description: "" },
    resolver: yupResolver(schema),
  });

  //get all courses
  const {
    data: allCourses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCourses();

  // get all question banks
  //   const {
  //     data: allQuestionBank,
  //     isLoading: questionBankLoading,
  //     error: questionBankError,
  //   } = useGetQuestionBank();

  const handleCreateQuestionBank: SubmitHandler<FormProps> = async (data) => {
    const { questionBankName, description } = data;

    const payload = {
      questionBankName,
      description,
      courseId: Number(data.course),
    };

    try {
      const res = await api.post("/questionBanks ", payload);
      toast.success(res.data.message || "Success");
      await queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      resetForm();
    } catch (error) {
      errorLogger(error);
    }
  };

  //   if (coursesError || questionBankError) {
  //     errorLogger(coursesError || questionBankError);
  //   }

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Question Bank</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
        <div className="col-span-1 flex flex-col gap-1 bg-background rounded-xl w-full p-3">
          <span className="font-medium">Create Question Bank</span>

          <form
            onSubmit={handleSubmit(handleCreateQuestionBank)}
            className="flex flex-col gap-3 w-full"
          >
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="course">
                <span className="text-sm text-neutral-600">Select Course</span>

                <select
                  id="course"
                  {...register("course")}
                  disabled={coursesLoading}
                  className="block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
                >
                  <option value={""} disabled>
                    Select Course
                  </option>
                  {allCourses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course?.title}
                    </option>
                  ))}
                </select>
              </label>

              {errors?.course?.message && (
                <small className="text-error-500">
                  {errors?.course?.message}
                </small>
              )}
            </div>

            <Input
              label="Question Bank Name"
              name="questionBankName"
              placeholder="Math 403 Questions"
              hookFormRegister={register}
              errorText={
                errors.questionBankName && errors.questionBankName.message
              }
            />

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="description" className="text-sm text-neutral-600">
                Question Description
              </label>
              <textarea
                id="description"
                placeholder="Basic Mathematics For SS2 students"
                {...register("description")}
                className="rounded-md border border-neutral-300 p-1 bg-background text-foreground caret-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              ></textarea>
              {errors?.description?.message && (
                <small className="text-error-500">
                  {errors?.description?.message}
                </small>
              )}
            </div>

            <div className="w-fit">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Question Bank"}
              </Button>
            </div>
          </form>
        </div>

        <div className="col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <span>Question Bank Table</span>
        </div>
      </div>
    </section>
  );
};

export default QuestionBank;
