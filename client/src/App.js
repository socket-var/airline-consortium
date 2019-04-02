import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import { sayHello } from "./redux/actions";

class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.sayHello();
    }, 3000);
  }
  render() {
    const text = this.props.text;
    return (
      <div className="App">
        <header className="App-header">
          <p>{text}</p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { text: state.helloReducer.text };
};
const mapDispatchToProps = { sayHello };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
