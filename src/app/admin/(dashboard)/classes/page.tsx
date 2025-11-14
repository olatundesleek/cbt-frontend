"use client";

import React, { useState, ReactNode } from "react";
import { GoPlus } from "react-icons/go";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { FaUser } from "react-icons/fa6";
// import { HiUserGroup } from "react-icons/hi";
// import { LuBuilding2 } from "react-icons/lu";
import AppTable, { TableDataItem } from "@/components/table";
import {
  useGetClasses,
  useGetTeachers,
} from "@/features/dashboard/queries/useDashboard";
import { MdDelete } from "react-icons/md";
import api, { errorLogger } from "@/lib/axios";
import { formatDate } from "../../../../../utils/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/query-provider";
import { AllClassesResponse } from "@/types/dashboard.types";
import Modal from "@/components/modal";

const headerColumns = [
  "Class Name",
  "Teacher's Name",
  "Total Courses",
  "Created On",
  "Action",
];

const schema = Yup.object({
  teacher: Yup.string().required("Teacher is required"),
  nameOfClass: Yup.string().required("Name of class is required"),
});

type FormProps = Yup.InferType<typeof schema>;

const AdminClasses = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllClassesResponse | null;
  }>({
    isOpen: false,
    modalContent: null,
  });

  // create class form
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      teacher: "",
      nameOfClass: "",
    },
  });

  // assign class teacher form
  const {
    register: assignTeacherReg,
    handleSubmit: assignTeacherSubmit,
    reset: assignTeacherReset,
    formState: {
      errors: assignTeacherError,
      isSubmitting: assignTeacherIsSubmitting,
    },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      teacher: "",
      nameOfClass: "",
    },
  });

  const {
    data: allClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClasses();

  const {
    data: allTeachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetTeachers();

  const quickStats: { icon: ReactNode; label: string; count: number }[] = [
    {
      icon: <FaUser color="#0284c7" />,
      label: "Total Classes",
      count: allClasses ? allClasses?.length : 0,
    },
    // {
    //   icon: <HiUserGroup color="#0284c7" />,
    //   label: "Total Students",
    //   count: "1,344",
    // },
  ];

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AllClassesResponse | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // create class
  const handleCreateClass: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      className: data.nameOfClass,
      teacherId: Number(data.teacher),
    };

    try {
      const response = await api.post("/class", payload);
      queryClient.invalidateQueries({ queryKey: ["classes"] }); // invalidate and refetch classes
      resetForm();
      toast.success(response.data.message || "Created Successfully");
    } catch (error) {
      errorLogger(error);
    }
  };

  // assign teacher and class
  const handleAssignClass: SubmitHandler<FormProps> = async (data) => {
    try {
      const response = await api.patch(
        `/teachers/${data.nameOfClass}/assign-class-teacher`,
        {
          teacherId: Number(data.teacher),
        }
      );
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(response.data.message || "Assigned Successfully");
      assignTeacherReset();
    } catch (error) {
      errorLogger(error);
    }
  };

  // delete class
  const handleDeleteClass = async () => {
    setIsDeleting(true);

    try {
      const res = await api.delete(`class/${modalState?.modalContent?.id}`);
      queryClient.invalidateQueries({ queryKey: ["classes"] }); // invalidate and refetch classes
      toast.success(res.data.message || "Deleted Successfully");
      updateModalState({ key: "isOpen", value: false });
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (classesError) {
    errorLogger(classesError);
  }
  if (teachersError) {
    errorLogger(teachersError);
  }

  return (
    <>
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-semibold">Manage Classes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-base font-bold">Create A Class</span>

              <form
                onSubmit={handleSubmit(handleCreateClass)}
                className="flex flex-col items-stretch gap-2 w-full"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="teacher">
                    <span className="text-sm text-neutral-600">
                      Select Teacher
                    </span>

                    <select
                      id="teacher"
                      {...register("teacher")}
                      disabled={teachersLoading || !allTeachers}
                      className="block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
                    >
                      <option value={""} disabled>
                        Select Teacher
                      </option>
                      {allTeachers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.firstname + " " + teacher.lastname}
                        </option>
                      ))}
                    </select>
                  </label>

                  {errors?.teacher?.message && (
                    <small className="text-error-500">
                      {errors?.teacher?.message}
                    </small>
                  )}
                </div>

                <Input
                  label="Name of class"
                  name="nameOfClass"
                  autoFocus={false}
                  placeholder="Name of Class"
                  hookFormRegister={register}
                  errorText={errors?.nameOfClass?.message}
                />

                <div className="w-fit">
                  <Button
                    type="submit"
                    disabled={classesLoading || teachersLoading || isSubmitting}
                  >
                    <div className="flex flex-row items-center gap-2 w-full">
                      <GoPlus />
                      <span>
                        {isSubmitting ? "Creating" : "Create New Class"}
                      </span>
                    </div>
                  </Button>
                </div>
              </form>
            </div>

            <AppTable
              data={allClasses ?? []}
              label="All Classes"
              isLoading={classesLoading}
              headerColumns={headerColumns}
              itemKey={({ itemIndex }) => `${itemIndex}`}
              onRowPress={({ item }) => {
                updateModalState({ key: "isOpen", value: true });
                updateModalState({ key: "modalContent", value: item });
              }}
              renderItem={({ item }) => (
                <>
                  <TableDataItem>{item.className}</TableDataItem>
                  <TableDataItem>
                    {item.teacher.firstname + " " + item.teacher.lastname}
                  </TableDataItem>
                  <TableDataItem>{item.courses.length}</TableDataItem>
                  <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
                  <TableDataItem>
                    <div className="flex items-center justify-center">
                      <MdDelete color="#ef4444" size={20} />
                    </div>
                  </TableDataItem>
                </>
              )}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-5 bg-background rounded-xl w-full p-3">
            <div className="flex flex-col gap-3 w-full">
              <div className="py-2 border-b border-b-neutral-500">
                <span className="text-base font-bold">
                  Assign Teacher to a Class
                </span>
              </div>

              <form
                onSubmit={assignTeacherSubmit(handleAssignClass)}
                className="flex flex-col items-stretch gap-2 w-full"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="teacher">
                    <span className="text-sm text-neutral-600">
                      Select Teacher
                    </span>

                    <select
                      id="teacher"
                      {...assignTeacherReg("teacher")}
                      disabled={teachersLoading || !allTeachers}
                      className="block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
                    >
                      <option value={""} disabled>
                        Select Teacher
                      </option>
                      {allTeachers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.firstname + " " + teacher.lastname}
                        </option>
                      ))}
                    </select>
                  </label>

                  {assignTeacherError?.teacher?.message && (
                    <small className="text-error-500">
                      {assignTeacherError?.teacher?.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="class">
                    <span className="text-sm text-neutral-600">
                      Select Class
                    </span>

                    <select
                      id="class"
                      {...assignTeacherReg("nameOfClass")}
                      disabled={teachersLoading || !allTeachers}
                      className="block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
                    >
                      <option value={""} disabled>
                        Select Class
                      </option>
                      {allClasses?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.className}
                        </option>
                      ))}
                    </select>
                  </label>

                  {assignTeacherError?.nameOfClass?.message && (
                    <small className="text-error-500">
                      {assignTeacherError?.nameOfClass?.message}
                    </small>
                  )}
                </div>

                <div className="w-fit">
                  <Button
                    type="submit"
                    disabled={
                      classesLoading ||
                      teachersLoading ||
                      assignTeacherIsSubmitting
                    }
                  >
                    {assignTeacherIsSubmitting ? "Assigning" : "Assign"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="py-2 border-b border-b-neutral-500">
                <span className="text-base font-bold">Quick Stats</span>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1 w-full">
                    <div className="flex flex-row items-center gap-2">
                      <>{stat.icon}</>
                      <span className="text-sm text-neutral-600">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-base font-medium">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: "isOpen", value: value as boolean })
        }
      >
        <div className="w-full h-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-lg text-error-700 font-medium">
              Delete Class
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
                onClick={handleDeleteClass}
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
      </Modal>
    </>
  );
};

export default AdminClasses;
