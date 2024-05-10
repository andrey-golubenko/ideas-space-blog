import linksItems from '~/links'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="flex items-center justify-center space-x-4 bg-[#2C2C32] px-0 py-8">
      <Navigation navLinks={linksItems} />
    </header>
  )
}
