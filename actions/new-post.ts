'use server'

import * as z from 'zod'
import { getCurrentUser } from '~/utils/helpers/server.helpers'
import { ManagePostSchema } from '~/schemas'
import { getUserById } from '~/services/user'
import { db } from '~/libs/db'

export const newPost = async (
  values: z.infer<typeof ManagePostSchema>
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

  const { title, content, published } = validatedFields.data

  try {
    await db.post.create({
      data: {
        title,
        content,
        published,
        authorId: dbUser?.id
      }
    })

    return { success: 'Post has been successfully created!' }
  } catch {
    return { error: 'Something went wrong!' }
  }
}
