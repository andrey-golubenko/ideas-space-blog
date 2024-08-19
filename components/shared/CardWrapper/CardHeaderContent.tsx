import { type HTMLAttributes } from 'react'

import { cn } from '~/libs/utils'
import { fontPoppins } from '~/utils/constants/fonts'

interface IAuthHeaderProps {
  title?: string
  label?: string
}

const CardHeaderContent = ({
  title,
  label
}: IAuthHeaderProps & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className={cn('text-3xl font-semibold', fontPoppins.className)}>
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default CardHeaderContent
