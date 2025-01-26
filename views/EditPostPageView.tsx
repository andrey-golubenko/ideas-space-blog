'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import useGlobalStore from '~/store'
import { editPost } from '~/actions/edit-post'
import {
  destroyImagesInCld,
  saveImagesToCld
} from '~/services/imagesProcessing'
import { useCleaningItem } from '~/hooks/useCleaningItem'
import AppCardWrapper from '~/components/shared/CardWrapper/AppCardWrapper'
import PostManageForm from '~/components/shared/PostManageForm'
import { CLOUDINARY_POSTS_IMAGES_FOLDER } from '~/utils/constants'
import { ManagePostSchema } from '~/schemas'
import { type TDeserializedPost, type TManagePostForm } from '~/types'

interface IEditPostViewProps {
  isLogged: boolean
}

const EditPostPageView = ({ isLogged }: IEditPostViewProps) => {
  const [success, setSuccess] = useState<string | undefined>('')
  const [error, setError] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const [singlePost, setSinglePost] = useGlobalStore((state) => {
    return [state.singlePost, state.setSinglePost]
  })

  const {
    id: postId,
    title,
    content,
    imageUrls,
    published,
    categories: editablePostCategories
  } = singlePost as FullPost

  const categoriesFieldValues = editablePostCategories?.map(
    (editPostCategory) => {
      return editPostCategory?.categoryId
    }
  )

  const isDisabled = isPending || !isLogged

  const isEditablePostExist = !!Object.values(singlePost)?.length

  const form = useForm<TManagePostForm>({
    defaultValues: {
      title: '',
      content: '',
      files: [],
      imageUrls: [],
      published: false,
      categories: []
    },
    resolver: zodResolver(ManagePostSchema)
  })

  useEffect(() => {
    if (Object.values(singlePost)?.length) {
      form.reset({
        title,
        content,
        imageUrls,
        published: published || false,
        categories: categoriesFieldValues
      })
    }
  }, [isEditablePostExist])

  useCleaningItem(setSinglePost)

  const handleOnSubmit = (values: TManagePostForm) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const newImageUrls = values?.imageUrls || []

      const initialPostImageUrls =
        (singlePost as TDeserializedPost)?.imageUrls || []

      const deletedImageUrls = initialPostImageUrls.filter((url) => {
        return !newImageUrls.includes(url)
      })

      if (deletedImageUrls?.length) {
        try {
          await destroyImagesInCld(
            deletedImageUrls,
            `${CLOUDINARY_POSTS_IMAGES_FOLDER}/${postId}`
          )
        } catch {
          return
        }
      }

      const uploadedFiles = values?.files || []

      let newImageUrlsFromFiles: string[] | null = []

      if (uploadedFiles?.length) {
        newImageUrlsFromFiles = await saveImagesToCld(
          uploadedFiles,
          `${CLOUDINARY_POSTS_IMAGES_FOLDER}/${postId}`,
          setError
        )

        if (!newImageUrlsFromFiles) {
          return
        }

        if (error) return
      }

      const { files, ...restValues } = values

      const newPostValues: TManagePostForm = {
        ...restValues,
        imageUrls: [...newImageUrlsFromFiles, ...newImageUrls]
      }

      editPost(newPostValues, postId as string).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)

        if (data?.success) {
          toast.success(data?.success, {
            richColors: true,
            closeButton: true,
            duration: 5000
          })

          setSinglePost({})

          router.back()
        }
      })
    })
  }

  return (
    <AppCardWrapper
      headerTitle="📄 Post"
      headerLabel={`Edit post - ${title || ''}`}
    >
      <PostManageForm
        form={form}
        handleOnSubmit={handleOnSubmit}
        label="Edit post"
        isDisabled={isDisabled}
        success={success}
        error={error}
      />
    </AppCardWrapper>
  )
}

export default EditPostPageView
