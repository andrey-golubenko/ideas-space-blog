'use server'

import * as z from 'zod'
import { getCurrentUser } from '~/utils/helpers/server.helpers'
import { ManagePostSchema } from '~/schemas'
import { getUserById } from '~/services/user'
import { db } from '~/libs/db'

export const newPost = async (
  values: Omit<z.infer<typeof ManagePostSchema>, 'files'> & {
    imageUrls: string[]
  }
) => {
  const validatedFields = ManagePostSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { error: 'Unauthorized!' }
  }

  const dbUser = await getUserById(user?.id)

  if (!dbUser) {
    return { error: 'Unauthorized!' }
  }

  const { title, content, imageUrls, published, categories } =
    validatedFields.data

  const categoryIds = categories?.map((category) => {
    return (category as { id: string; name: string })?.id
  })

  try {
    await db.post.create({
      data: {
        title,
        content,
        imageUrls,
        published,
        authorId: dbUser?.id,
        categories: {
          create: categoryIds?.map((catId) => {
            return {
              category: {
                connect: { id: catId }
              }
            }
          })
        }
      }
    })

    return { success: 'Post has been successfully created!' }
  } catch {
    return { error: 'Something went wrong!' }
  }
}
