import React from "react";
import { useDispatch } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut, userSignOutSuccess } from "appRedux/actions/Auth";
import { Link } from "react-router-dom";

const UserInfo = () => {

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userSignOut())
    dispatch(userSignOutSuccess())
    window.sessionStorage.clear()
    localStorage.clear();
  }

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li><Link to={'/profile'}>My Account</Link></li>
      <li onClick={() => logout()}>Logout
      </li>
    </ul>
  );

  return (
    <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
      trigger="click">
      <Avatar src={"https://via.placeholder.com/150"}
        className="gx-avatar gx-pointer" alt="" />
    </Popover>
  )

}

export default UserInfo;
