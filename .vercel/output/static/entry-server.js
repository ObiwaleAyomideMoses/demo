import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { NavLink, Routes, Route } from "react-router-dom";
const HeaderNavigationBar = () => {
  return /* @__PURE__ */ jsxs("section", { className: "header-navigation-bar", children: [
    /* @__PURE__ */ jsx(NavLink, { to: "/", children: "Home" }),
    /* @__PURE__ */ jsx(NavLink, { to: "/about", children: "AboutUs" }),
    /* @__PURE__ */ jsx(NavLink, { to: "/contactUs", children: "Contact Us" })
  ] });
};
const Layout = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(HeaderNavigationBar, {}),
    /* @__PURE__ */ jsx("section", { className: "pages", children })
  ] });
};
const Home = () => {
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx("h3", { children: "Home" }),
    "Home, sweet home 🏠."
  ] });
};
const About = () => {
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx("h3", { children: "About Us" }),
    "We're all about React server-side rendering 📟."
  ] });
};
const ContactUs = () => {
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx("h3", { children: "Contact Us" }),
    "Contact us using your telepathic abilities 🤣."
  ] });
};
const Router = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/contactUs", element: /* @__PURE__ */ jsx(ContactUs, {}) })
  ] });
};
function render({ path }) {
  const html = ReactDOMServer.renderToString(
    // The renderToString method, is used to convert React components to an HTML string, which can be sent to the client for initial rendering.
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: path, children: /* @__PURE__ */ jsx(Router, {}) }) })
  );
  return { html };
}
export {
  render
};
