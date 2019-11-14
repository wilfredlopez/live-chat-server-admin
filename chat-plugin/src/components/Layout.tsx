import React, { Component } from "react";

class Layout extends Component {
  render() {
    return (
      <>
        <div id="layout-root">
          <div className="after-layout">{this.props.children}</div>
        </div>
      </>
    );
  }
}

export default Layout;
