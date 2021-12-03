import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut, userSignOutSuccess } from "appRedux/actions/Auth";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { UserOutlined } from "@ant-design/icons";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('Guest')

  const logout = () => {
    dispatch(userSignOut())
    dispatch(userSignOutSuccess())
    window.sessionStorage.clear()
    localStorage.clear();
  }

  useEffect(() => {
    Amplify.Auth.currentAuthenticatedUser()
      .then(async user => {
        if (user) {
          let username = user.attributes.given_name + ' ' + user.attributes.family_name
          setUsername(username)
        }
      }).catch(e => {
        console.log(e)
      })

  }, []);

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li><Link to={'/profile'}>My Account</Link></li>
      <li onClick={() => logout()}>Logout
      </li>
    </ul>
  );

  return (

    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />}
          className="gx-size-40 gx-pointer gx-mr-3" alt="" />
        <span className="gx-avatar-name">{username}<i
          className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
      </Popover>
    </div>

  )
};

export default UserProfile;
