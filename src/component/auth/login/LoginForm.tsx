"use client"

import { LoginSchema, LoginType } from "@/domain/zod/LoginSchema"

import { AppRouteManager } from "@/service/AppRouteManager"
import { addToast, Button, Form, Input } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const toggleVisibility = () => setIsVisible(!isVisible)

  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (data: LoginType) => {
      return await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })
    },
    onSuccess: (response) => {
      console.log(response)
      if (response?.error) {
        setFormData({
          email: "",
          password: "",
        })
        setErrors({
          email: "Invalid email or password",
          password: "",
        })
      } else {
        router.push(AppRouteManager.HOME)
      }
    },
    onError: (error) => {
      addToast({ title: error.message })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const safeFormData = LoginSchema.safeParse(formData)
    if (!safeFormData.success) {
      const fieldErrors = safeFormData.error.flatten().fieldErrors
      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email ? fieldErrors.email[0] : "",
        password: fieldErrors.password ? fieldErrors.password[0] : "",
      }))
      return
    }
    const { email, password } = safeFormData.data
    mutation.mutate({
      email,
      password,
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
    <Form className="max-w-xs gap-y-6" onSubmit={handleSubmit}>
      <Input
        isRequired
        errorMessage={errors.email}
        isInvalid={!!errors.email}
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        value={formData.email}
        onChange={handleChange}
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
  )
}
