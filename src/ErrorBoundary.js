import React, { useContext } from "react";

import { NotificationContext } from "./NotificationContext";

class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState(() => ({ error }));
    this.props.pushError(error);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

export function ErrorBoundary({ children }) {
  const { pushError } = useContext(NotificationContext);
  return <ErrorCatcher pushError={pushError}>{children}</ErrorCatcher>;
}
