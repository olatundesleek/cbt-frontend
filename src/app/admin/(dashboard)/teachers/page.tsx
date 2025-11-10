"use client";

import AppTable from "@/components/table";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authService } from "@/services/authService";
import { UserRole } from "@/types/auth.types";
import toast from "react-hot-toast";
import { errorLogger } from "@/lib/axios";

const schema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be minimum of 6 characters")
    .required("Password is required"),
});

type FormProps = Yup.InferType<typeof schema>;

export default function AdminTeachersPage() {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { firstName: "", lastName: "", userName: "", password: "" },
    resolver: yupResolver(schema),
  });

  const handleRegisterTeacher: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      password: data.password,
      role: "TEACHER" as UserRole,
    };

    try {
      const res = await authService.register(payload);
      toast.success(res.message || "Success");
      resetForm();
    } catch (error) {
      errorLogger(error);
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Manage Teachers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
        <div className="col-span-1 flex flex-col gap-1 bg-background rounded-xl w-full p-3">
          <span className="font-medium">Create Teacher</span>

          <form
            onSubmit={handleSubmit(handleRegisterTeacher)}
            className="flex flex-col gap-3 w-full"
          >
            <Input
              label="First Name"
              name="firstName"
              placeholder="First Name"
              hookFormRegister={register}
              errorText={errors.firstName && errors.firstName.message}
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
              hookFormRegister={register}
              errorText={errors.lastName && errors.lastName.message}
            />

            <Input
              label="User Name"
              name="userName"
              placeholder="User Name"
              hookFormRegister={register}
              errorText={errors.userName && errors.userName.message}
            />

            <div className="flex flex-row items-center gap-2 w-full">
              <Input
                type={togglePassword ? "text" : "password"}
                label="Password"
                name="password"
                placeholder="Password"
                className="flex-1"
                hookFormRegister={register}
                errorText={errors.password && errors.password.message}
              />

              <div className="w-fit self-end">
                <Button onClick={() => setTogglePassword((prev) => !prev)}>
                  {togglePassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </div>

            <div className="w-fit">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Teacher"}
              </Button>
            </div>
          </form>
        </div>

        <div className="col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <AppTable
            data={[]}
            centralizeLabel
            label="All Teachers"
            headerColumns={["s/n", "Teacher Name", "Class"]}
            itemKey={({ itemIndex }) => `${itemIndex}`}
            renderItem={({ item }) => <></>}
          />
        </div>
      </div>
    </section>
  );
}
