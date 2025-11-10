"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  appName: Yup.string().required("App Name is required"),
  institutionName: Yup.string().required("Institution Name is required"),
  shortName: Yup.string().required("Short Name is required"),
  supportEmail: Yup.string().required("Email is required"),
});

type FormProps = Yup.InferType<typeof schema>;

export default function AdminSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      appName: "",
      institutionName: "",
      shortName: "",
      supportEmail: "",
    },
    resolver: yupResolver(schema),
  });

  const updateSettings: SubmitHandler<FormProps> = (data) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-4xl text-foreground font-bold">System Settings</h1>

      <form
        onSubmit={handleSubmit(updateSettings)}
        className="flex flex-col gap-3 w-full"
      >
        <Input
          label="App Name"
          hookFormRegister={register}
          name="appName"
          errorText={errors.appName && errors?.appName.message}
        />

        <Input
          label="Institution Name"
          hookFormRegister={register}
          name="institutionName"
          errorText={errors.institutionName && errors?.institutionName.message}
        />

        <Input
          label="Short Name"
          hookFormRegister={register}
          name="shortName"
          errorText={errors.shortName && errors?.shortName.message}
        />

        <Input
          label="Support Email"
          hookFormRegister={register}
          name="supportEmail"
          errorText={errors.supportEmail && errors?.supportEmail.message}
        />

        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}
