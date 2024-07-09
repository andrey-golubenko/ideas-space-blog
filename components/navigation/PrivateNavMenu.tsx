'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import useActive from '~/hooks/useActive'
import { PRIVATE_NAV_LINKS, PATHS } from '~/utils/constants/constants'

const PrivateNavMenu = () => {
  const isActive = useActive()

  return (
    <>
      {PRIVATE_NAV_LINKS.map(({ label, href }) => {
        return (
          <Link
            key={label}
            href={href}
            className={
              isActive(href) ? 'header-link-active' : 'header-link'
            }
          >
            {label}
          </Link>
        )
      })}

      <Link
        href="#"
        onClick={() => {
          return signOut({ callbackUrl: PATHS.logIn })
        }}
        className="header-link"
      >
        Log out
      </Link>
    </>
  )
}

export default PrivateNavMenu
