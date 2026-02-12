import React, { useContext } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '../button'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { UserDetailContext } from '../../../../context/UserDetailContext';
import { Diamond, Gem } from 'lucide-react';


const Header = () => {
  const { user } = useUser();
  const location = useLocation();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  console.log(location.pathname);

  return (
    <div>
      <div className='flex justify-between items-center px-10 shadow'>
        <Link to="/"><img src={logo} alt="logo" height={130} width={130} /></Link>
        {!user ?
          <SignInButton mode='modal'>
            <Button>Get Started</Button>
          </SignInButton>
          : <div className='flex gap-5 items-center'>
            <UserButton />
            {location.pathname.includes('workspace') ?
              <div className='flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-full'>
                <Gem />{userDetail?.credits ?? 0}
              </div> :
              <Link to="/workspace">
                <Button>Go to Workspace</Button>
              </Link>
            }
          </div>}
      </div>
    </div>
  )
}

export default Header
