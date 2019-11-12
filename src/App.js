import React from 'react';
import './App.css';
import { withAuthenticator } from "aws-amplify-react";
import CreatePost from './components/CreatePost'
import DisplayPosts from './components/DisplayPosts';

function App() {
  return (
    <div className="App">
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true});
