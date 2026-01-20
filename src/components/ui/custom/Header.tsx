import React from 'react'
import logo from '@/assets/logo.png'
import { Button } from '../button'

const Header = () => {
  return (
    <div>
      <div className='flex justify-between items-center px-10 shadow'>
        <img src={logo} alt="logo" height={130} width={130} />
        <Button>Get Started</Button>
      </div>
    </div>
  )
}

export default Header
