import React from "react";
import { useSelector } from "react-redux";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import IntlMessages from "../../util/IntlMessages";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";
import * as urlConfig from '../../constants/URLConstant';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const HorizontalNav = () => {

  const navStyle = useSelector(({ settings }) => settings.navStyle);
  const { pathname } = useSelector(({ common }) => common);

  const getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";
    }
  };

  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];
  return (

    <Menu
      defaultOpenKeys={[defaultOpenKeys]}
      selectedKeys={[selectedKeys]}
      mode="horizontal">
      <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="main"
        title={<IntlMessages id="sidebar.main" />}>

        <Menu.Item key={urlConfig.NAVBAR_DASHBOARD_KEY}>
          <Link to={urlConfig.NAVBAR_DASHBOARD}><i className="icon icon-dasbhoard" />
            <span><IntlMessages id="sidebar.dashboard" /></span></Link>
        </Menu.Item>

      </SubMenu>

      <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="admin"
        title={<IntlMessages id="sidebar.admin" />}>
        <MenuItemGroup key="admin" className="gx-menu-group"
          title={<IntlMessages id="sidebar.admin" />}>
          <Menu.Item key={urlConfig.NAVBAR_USER_KEY}>
            <Link to={urlConfig.ADMIN_USER_LIST}><i className="icon icon-user-o" />
              <span><IntlMessages id="sidebar.users" /></span></Link>
          </Menu.Item>
          <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="billing"
            title={<span> <i className="icon icon-draft" />
              <span><IntlMessages id="sidebar.billing" /></span></span>} >
            <Menu.Item key={urlConfig.NAVBAR_SUBSCRIPTION_KEY}>
              <Link to={urlConfig.ADMIN_SUBSCRIPTION_LIST}><i className="icon icon-affix" />
                <span><IntlMessages id="sidebar.subscription" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_TRANSECTIONS_KEY}>
              <Link to={urlConfig.ADMIN_TRANSECTIONS_LIST}><i className="icon icon-chat" />
                <span><IntlMessages id="sidebar.transactions" /></span></Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="report"
            title={<span> <i className="icon icon-files" />
              <span><IntlMessages id="sidebar.reports" /></span></span>} >
            <Menu.Item key={urlConfig.NAVBAR_PENDING_REPORT_KEY}>
              <Link to={urlConfig.ADMIN_PENDING_REPORT_LIST}><i className="icon icon-files" />
                <span><IntlMessages id="sidebar.pendingReport" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_PURCHASED_REPORT_KEY}>
              <Link to={urlConfig.ADMIN_PURCHASED_REPORT_LIST}><i className="icon icon-files" />
                <span><IntlMessages id="sidebar.purchasedReports" /></span></Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key={urlConfig.NAVBAR_LICENSE_INFORMATION_KEY}>
            <Link to={urlConfig.ADMIN_LICENSE_INFORMATION_LIST}><i className="icon icon-ellipse-v" />
              <span><IntlMessages id="sidebar.licenseinformation" /></span></Link>
          </Menu.Item>
          <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="settings"
            title={<span> <i className="icon icon-setting" />
              <span><IntlMessages id="sidebar.settings" /></span></span>} >
            <Menu.Item key={urlConfig.NAVBAR_GENERAL_SETTINGS_KEY}>
              <Link to={urlConfig.ADMIN_GENERAL_SETTINGS_LIST}><i className="icon icon-inbox" />
                <span><IntlMessages id="sidebar.generalsettings" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_ALERT_SETTINGS_KEY}>
              <Link to={urlConfig.ADMIN_ALERT_SETTINGS_LIST}><i className="icon icon-inbox" />
                <span><IntlMessages id="sidebar.alertsetings" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_SUBSCRIPTION_PAGE_KEY}>
              <Link to={urlConfig.ADMIN_SUBSCRIPTION_PAGE_LIST}><i className="icon icon-forgot-password" />
                <span><IntlMessages id="sidebar.subscriptionPage" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_MAIN_FILTER_LIST_KEY}>
              <Link to={urlConfig.ADMIN_MAIN_FILTER_LIST}><i className="icon icon-filter-circle" />
                <span><IntlMessages id="sidebar.licensemainfilterlist" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_COUNTRY_KEY}>
              <Link to={urlConfig.ADMIN_COUNTRY_LIST}><i className="icon icon-menu-lines" />
                <span><IntlMessages id="sidebar.country" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_STATE_KEY}>
              <Link to={urlConfig.ADMIN_STATE_LIST}><i className="icon icon-navigation" />
                <span><IntlMessages id="sidebar.state" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_SUPPORT_SETTINGS_KEY}>
              <Link to={urlConfig.ADMIN_SUPPORT_SETTINGS_LIST}><i className="icon icon-inbox" />
                <span><IntlMessages id="sidebar.supportSettings" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_MAINTENANCE_WINDOW_KEY}>
              <Link to={urlConfig.ADMIN_MAINTENANCE_WINDOW_LIST}><i className="icon icon-plain-list-divider" />
                <span><IntlMessages id="sidebar.maintenanceWindow" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_CRONJOB_SETTINGS_KEY}>
                  <Link to={urlConfig.ADMIN_CRONJOB_SETTINGS_LIST}><i className="icon icon-inbox" />
                    <span><IntlMessages id="sidebar.cronjobSettings" /></span></Link>
                </Menu.Item>
          </SubMenu>
          <SubMenu popupClassName={getNavStyleSubMenuClass(navStyle)} key="paymentgateway"
            title={<span> <i className="icon icon-important" />
              <span><IntlMessages id="sidebar.paymentgateway" /></span></span>} >
            <Menu.Item key={urlConfig.NAVBAR_AUTHORIZENET_USER_KEY}>
              <Link to={urlConfig.ADMIN_AUTHORIZENET_USER_LIST}><i className="icon icon-profile" />
                <span><IntlMessages id="sidebar.authorizeuser" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_PRODUCT_KEY}>
              <Link to={urlConfig.ADMIN_PRODUCT_LIST}><i className="icon icon-apps" />
                <span><IntlMessages id="sidebar.product" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_PRICING_KEY}>
              <Link to={urlConfig.ADMIN_PRICING_LIST}><i className="icon icon-lising-dbrd" />
                <span><IntlMessages id="sidebar.pricing" /></span></Link>
            </Menu.Item>

            <Menu.Item key={urlConfig.NAVBAR_SUBSCRIPTION_PLAN_KEY}>
              <Link to={urlConfig.ADMIN_SUBSCRIPTION_PLAN_LIST}><i className="icon icon-cards-list-view" />
                <span><IntlMessages id="sidebar.subscriptionplan" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_FEATURES_KEY}>
              <Link to={urlConfig.ADMIN_FEATURES_LIST}><i className="icon icon-cards-list-view" />
                <span><IntlMessages id="sidebar.features" /></span></Link>
            </Menu.Item>

            {/* <Menu.Item key={urlConfig.NAVBAR_CUSTOMER_KEY}>
                <Link to={urlConfig.ADMIN_CUSTOMER_LIST}><i className="icon icon-profile" />
                  <span><IntlMessages id="sidebar.customers" /></span></Link>
              </Menu.Item> */}

            {/* <Menu.Item key={urlConfig.NAVBAR_NOTES_KEY}>
                <Link to={urlConfig.ADMIN_NOTES_LIST}><i className="icon icon-copy" />
                  <span><IntlMessages id="sidebar.notes" /></span></Link>
              </Menu.Item> */}
            <Menu.Item key={urlConfig.NAVBAR_COUPON_KEY}>
              <Link to={urlConfig.ADMIN_COUPON_LIST}><i className="icon icon-ticket-new" />
                <span><IntlMessages id="sidebar.coupon" /></span></Link>
            </Menu.Item>
            <Menu.Item key={urlConfig.NAVBAR_PROMOTION_CODE_KEY}>
              <Link to={urlConfig.ADMIN_PROMOTION_CODE_LIST}><i className="icon icon-map-drawing" />
                <span><IntlMessages id="sidebar.promotioncode" /></span></Link>
            </Menu.Item>

          </SubMenu>





        </MenuItemGroup>



      </SubMenu>


    </Menu>

  );
};

HorizontalNav.propTypes = {};

export default HorizontalNav;

