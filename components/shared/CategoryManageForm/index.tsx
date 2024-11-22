'use client'

import { type FormHTMLAttributes } from 'react'
import { type UseFormReturn } from 'react-hook-form'

import { Form } from '~/components/ui/form'
import TextField from '~/components/shared/TextField'
import TextAreaField from '~/components/shared/TextAreaField'
import FilesField from '~/components/shared/FilesField'
import FormError from '~/components/FormError'
import FormSuccess from '~/components/FormSuccess'
import LoadableButton from '~/components/shared/LoadableButton'
import { TManageCategoryForm } from '~/types'

interface IPostManageFormProps {
  form: UseFormReturn<TManageCategoryForm>
  handleOnSubmit: (values: TManageCategoryForm) => void
  label: string
  isDisabled: boolean
  success?: string
  error?: string
}

const CategoryManageForm = ({
  form,
  handleOnSubmit,
  label,
  isDisabled,
  success,
  error,
  ...props
}: IPostManageFormProps & FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="space-y-8"
        encType="multipart/form-data"
        {...props}
      >
        <div className="space-y-6">
          <TextField
            control={form.control}
            name="name"
            label="Category name"
            placeholder="Unique name for the category"
            isPending={isDisabled}
          />

          <TextField
            control={form.control}
            name="slug"
            label="Category slug"
            placeholder="The URL of the category page, in lowercase only, separated by a dash"
            isPending={isDisabled}
          />

          <FilesField
            name="file"
            additionalName="imageUrl"
            validateErrors={form.formState.errors.file}
            isPending={isDisabled}
          />

          <TextAreaField
            control={form.control}
            name="description"
            label="Category description"
            placeholder="A short description of the category"
            isPending={isDisabled}
            maxLength={200}
            rows={5}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <LoadableButton
            type="submit"
            isDisabled={isDisabled}
            label={label}
          />
        </div>
      </form>
    </Form>
  )
}

export default CategoryManageForm
