"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { HiUserGroup } from "react-icons/hi";
import { LuBuilding2 } from "react-icons/lu";
import AppTable, { TableDataItem } from "@/components/table";
import {
  useGetClasses,
  useGetTeachers,
} from "@/features/dashboard/queries/useDashboard";
import api, { errorLogger } from "@/lib/axios";
import { formatDate } from "../../../../../utils/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/query-provider";
import {
  AllClassesResponse,
  AllTeachersResponse,
} from "@/types/dashboard.types";
import Modal from "@/components/modal";

type FormProps = Yup.InferType<typeof schema>;

interface UpdateClassProps {
  singleClass: AllClassesResponse | null;
  allTeachers: AllTeachersResponse[];
  closeModal: () => void;
}

const headerColumns = [
  "Class Name",
  "Teacher's Name",
  "Total Courses",
  "Created On",
];

const schema = Yup.object({
  teacher: Yup.string().required("Teacher is required"),
  nameOfClass: Yup.string().required("Name of class is required"),
});

const UpdateClass = ({
  singleClass,
  closeModal,
  allTeachers,
}: UpdateClassProps) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      teacher: "",
      nameOfClass: "",
    },
  });

  const handleUpdateClass: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      className: data.nameOfClass,
      teacherId: Number(data.teacher),
    };

    try {
      const response = await api.patch(`/class/${singleClass?.id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ["classes"] });
      resetForm();
      closeModal();
      toast.success(response.data.message || "Updated Successfully");
    } catch (error) {
      errorLogger(error);
    }
  };

  useEffect(() => {
    if (!singleClass) return;

    setValue("teacher", `${singleClass.teacherId}`);
    setValue("nameOfClass", singleClass.className);
  }, [singleClass, setValue]);

  if (!singleClass) return null;

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-base font-bold">Update Class</span>

      <form
        onSubmit={handleSubmit(handleUpdateClass)}
        className="flex flex-col items-stretch gap-2 w-full"
      >
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="teacher">
            <span className="text-sm text-neutral-600">Select Teacher</span>

            <select
              id="teacher"
              {...register("teacher")}
              disabled={!allTeachers.length}
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
            <small className="text-error-500">{errors?.teacher?.message}</small>
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
          <Button type="submit" disabled={isSubmitting}>
            <div className="flex flex-row items-center gap-2 w-full">
              <GoPlus />
              <span>{isSubmitting ? "Updating..." : "Update Class"}</span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

const AdminClasses = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllClassesResponse | null;
    type: "update" | "delete";
  }>({
    isOpen: false,
    modalContent: null,
    type: "update",
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
      icon: <LuBuilding2 color="#0284c7" />,
      label: "Total Classes",
      count: allClasses ? allClasses?.length : 0,
    },
    {
      icon: <HiUserGroup color="#0284c7" />,
      label: "Total Teachers",
      count: allTeachers ? allTeachers.length : 0,
    },
  ];

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AllClassesResponse | ("update" | "delete") | null;
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
      await queryClient.invalidateQueries({ queryKey: ["classes"] }); // invalidate and refetch classes
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
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
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
      await queryClient.invalidateQueries({ queryKey: ["classes"] }); // invalidate and refetch classes
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
            onActionClick={({ item }) =>
              updateModalState({ key: "modalContent", value: item })
            }
            renderItem={({ item }) => (
              <>
                <TableDataItem>{item.className}</TableDataItem>
                <TableDataItem>
                  {item.teacher.firstname + " " + item.teacher.lastname}
                </TableDataItem>
                <TableDataItem>{item.courses.length}</TableDataItem>
                <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
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
                  <span className="text-sm text-neutral-600">Select Class</span>

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

      {/* modal to delete and update a class */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: "isOpen", value: value as boolean })
        }
      >
        {modalState.type === "update" ? (
          <UpdateClass
            singleClass={modalState.modalContent}
            allTeachers={allTeachers ?? []}
            closeModal={() => updateModalState({ key: "isOpen", value: false })}
          />
        ) : (
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
        )}
      </Modal>
    </section>
  );
};

export default AdminClasses;
