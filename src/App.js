import React from "react";
import { BrowserRouter, Route, Redirect, Link } from "react-router-dom";

function firstElement(obj) {
  return Object.keys(obj).find((item, index) => index === 0);
}

const BreedTypesList = ({ breedTypes, activeTypeName, onChange }) => (
  <ul>
    {Object.keys(breedTypes).map((key) => (
      <li
        key={key}
        style={activeTypeName === key ? { backgroundColor: "green" } : null}
        onClick={() => onChange(key)}
      >
        <Link to={`/details/${key}`}>{key}</Link>
      </li>
    ))}
  </ul>
);

class BreedTypeDetails extends React.Component {
  state = {
    breed: null,
  };

  async componentDidMount() {
    const response = await fetch(
      `https://dog.ceo/api/breed/${this.props.type}/images`
    );
    const breed = await response.json();

    this.setState({
      breed: breed.message,
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      const response = await fetch(
        `https://dog.ceo/api/breed/${this.props.type}/images`
      );
      const breed = await response.json();

      this.setState({
        breed: breed.message,
      });
    }
  }

  render() {
    if (this.state.breed === null) {
      return "....Loading....";
    }

    return (
      <ul>
        {this.state.breed.map((url, index) => (
          <li key={index}>
            <img src={url} />
          </li>
        ))}
      </ul>
    );
  }
}

const Pages = {
  LIST: "LIST",
  DETAILS: "DETAILS",
};

class BreeedsApp extends React.Component {
  state = {
    breedTypes: null,
    breedType: null,
    activeTypeName: null,
    page: Pages.LIST,
  };

  async componentDidMount() {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const breedTypes = await response.json();

    this.setState({
      breedTypes: breedTypes.message,
      activeTypeName: firstElement(breedTypes.message),
    });
  }

  render() {
    if (this.state.breedTypes === null) {
      return "...Loading...";
    }
    return (
      <BrowserRouter>
        <Route path="/">
          <Redirect to="/list"></Redirect>
        </Route>

        <Route path="/list">
          <BreedTypesList
            breedTypes={this.state.breedTypes}
            activeTypeName={this.state.activeTypeName}
            onChange={(activeTypeName) =>
              this.setState({ activeTypeName, page: Pages.DETAILS })
            }
          />
        </Route>
        <Route
          path="/details/:name"
          render={(args) => (
            <>
              <BreedTypeDetails
                type={Object.keys(this.state.breedTypes).find(
                  (breed) => breed === this.state.activeTypeName
                )}
              />
              <Link to="/list">Back</Link>
            </>
          )}
        />
      </BrowserRouter>
    );
  }
}

export default BreeedsApp;
