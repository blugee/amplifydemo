import React, { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";

import Sidebar from "../Sidebar/index";
import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";

import Topbar from "../Topbar/index";
import App from "routes/index";
import { useSelector } from "react-redux";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
} from "../../constants/ThemeSetting";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import { useRouteMatch } from "react-router-dom";
import Customizer from "../Customizer";
import _cv_version from "../../_cv_version";
import { API } from "aws-amplify";

const { Content, Footer } = Layout;

const MainApp = () => {
  const [footerText, setFooterText] = useState('Copyright © 2021 Canoja Technologies, LLC and Affiliates.');

  useEffect(() => {
    async function fetchData() {
      var res = await API.post('PaymentGatewayAPI', '/paymentgateway/generalSettings', {})
      if (res.success) {  
        res = res.result
        if (res && res.length > 0) {
          localStorage.setItem('generalSettings', JSON.stringify(res[0]) )
          setFooterText(res[0].copyrightText)
        }
      }else{
        console.log(JSON.stringify(res))
      }
    }
    fetchData();
  }, [])

  const { navStyle } = useSelector(({ settings }) => settings);
  const match = useRouteMatch();

  const getContainerClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DARK_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-container-wrap";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-container-wrap";
      default:
        return '';
    }
  };
  const getNavStyles = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return <HorizontalDefault />;
      case NAV_STYLE_DARK_HORIZONTAL:
        return <HorizontalDark />;
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return <InsideHeader />;
      case NAV_STYLE_ABOVE_HEADER:
        return <AboveHeader />;
      case NAV_STYLE_BELOW_HEADER:
        return <BelowHeader />;
      case NAV_STYLE_FIXED:
        return <Topbar />;
      case NAV_STYLE_DRAWER:
        return <Topbar />;
      case NAV_STYLE_MINI_SIDEBAR:
        return <Topbar />;
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <NoHeaderNotification />;
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <NoHeaderNotification />;
      default:
        return null;
    }
  };

  
  var arr =  _cv_version.version ? _cv_version.version.split("-"):[];
  arr.pop();
  var version = arr.join("-")

  return (
    <Layout className="gx-app-layout">
      <Sidebar />
      <Layout>
        {getNavStyles(navStyle)}
        <Content className={`gx-layout-content ${getContainerClass(navStyle)} `}>
          <App match={match} />
          <Footer>
            <Row>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <div className="gx-layout-footer-content" style={{ textAlign: "left" }}>
                  <p>{version}</p>
                </div>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <div className="gx-layout-footer-content" style={{ textAlign: "center" }}>
                  <p dangerouslySetInnerHTML={{ __html: footerText }} />
                </div>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <div className="gx-layout-footer-content" style={{ textAlign: "right" }} >
                  <a rel="noopener noreferrer" href="https://canoja-verify-images.s3.amazonaws.com/CanojaTech-Privacy-Policy-v3.pdf" target="_blank" >Privacy Policy | </a>
                  <a rel="noopener noreferrer" href="https://canoja-verify-images.s3.amazonaws.com/CanojaTech-Terms-of-service-v3.pdf" target="_blank">Terms of Service</a>
                </div>

              </Col>
            </Row>
          </Footer>
        </Content>
        <Customizer />
      </Layout>
    </Layout>
  )
};
export default MainApp;

