import {notification} from "antd";

export default {
  openNotificationWithIcon(type, title, description) {
    notification[type]({
      message: title,
      description: description,
    });
  }
}