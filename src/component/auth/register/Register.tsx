"use client"
import { register } from "@/actions/auth/register"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import {
  RegisterClientSchema,
  RegisterClientType,
  RegisterUploadType,
} from "@/domain/zod/RegisterSchema"
import { AppRouteManager } from "@/service/AppRouteManager"
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
} from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function Register() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [formData, setFormData] = useState<RegisterClientType>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const router = useRouter()

  const toggleVisibility = () => setIsVisible(!isVisible)

  const mutation = useMutation({
    mutationFn: async (data: RegisterUploadType) => {
      return await register(data)
    },
    onSuccess: (response) => {
      if (response.status === HttpStatus.CREATED) {
        addToast({ title: "Registration successful" })
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
        })
        router.push(AppRouteManager.LOGIN)
      } else {
        addToast({ title: response?.errors![0] })
      }
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const safeFormData = RegisterClientSchema.safeParse(formData)
    if (!safeFormData.success) {
      const fieldErrors = safeFormData.error.flatten().fieldErrors
      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email ? fieldErrors.email[0] : "",
        password: fieldErrors.password ? fieldErrors.password[0] : "",
        confirmPassword: fieldErrors.confirmPassword
          ? fieldErrors.confirmPassword[0]
          : "",
        fullName: fieldErrors.fullName ? fieldErrors.fullName[0] : "",
      }))
      return
    }
    const { email, password, fullName } = safeFormData.data
    mutation.mutate({
      email,
      password,
      fullName,
    })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <Card
        classNames={{
          base: "p-12",
          // body:"flex flex-col items-center"
        }}
      >
        <CardHeader>
          <h1 className="text-3xl mb-12 mx-auto font-semibold">Register</h1>
        </CardHeader>
        <CardBody>
          <Form className=" w-80 gap-y-6" onSubmit={handleSubmit}>
            <Input
              isRequired
              errorMessage={errors.fullName}
              label="Name"
              labelPlacement="outside"
              name="fullName"
              placeholder="Enter your name"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              isInvalid={!!errors.fullName}
            />
            <Input
              isRequired
              errorMessage={errors.email}
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Input
              className="max-w-xs"
              labelPlacement="outside"
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-lg text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              errorMessage={errors.password}
              isInvalid={!!errors.password}
            />
            <Input
              className="max-w-xs"
              labelPlacement="outside"
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-lg text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Confirm password"
              placeholder="Confirm your password"
              type={isVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              errorMessage={errors.confirmPassword}
              isInvalid={!!errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="bordered"
              className="w-full mt-4"
              isLoading={mutation.isPending}
              isDisabled={mutation.isPending}
            >
              Submit
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}
