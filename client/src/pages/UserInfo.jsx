import React from "react";
import { useUser } from "../contexts/UserProvider";

const UserInfo = () => {
  const user = useUser();
  return <div></div>;
};

export default UserInfo;
