import React from 'react'
import logo from '@/assets/logo.png'
import { Button } from '../button'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';


const Header = () => {
  const {user} = useUser();
  return (
    <div>
      <div className='flex justify-between items-center px-10 shadow'>
        <img src={logo} alt="logo" height={130} width={130} />
        {!user ? <SignInButton mode='modal'><Button>Get Started</Button></SignInButton> : <div className='flex gap-5 items-center'><UserButton /><Link to="/workspace"><Button>Go to Workspace</Button></Link></div>}
      </div>
    </div>
  )
}

export default Header
