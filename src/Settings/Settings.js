import React from 'react';
import lang from '../lang.json';
import './Settings.css';
import { EventEmitter } from '../EventEmitter'


class Settings extends React.Component {
  constructor() {
    super();
  }

  setLang(lang) {
    localStorage.setItem('lang', lang);
    EventEmitter.dispatch('langChange', true)
  }

  render() {
    return (
      <section>
        <div className="container">
          <h2>Please select language:</h2>
          <button className="btn btn-danger" onClick={this.setLang.bind(this, 'pl')}>PL</button>
          <button className="btn btn-primary" onClick={this.setLang.bind(this, 'en')}>EN</button>
        </div>
      </section>
    );
  } 
}

export default Settings;
