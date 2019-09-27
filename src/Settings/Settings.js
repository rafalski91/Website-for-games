import React from 'react';
import lang from '../lang';
import './Settings.css';
import { EventEmitter } from '../EventEmitter'


class Settings extends React.Component {

  setLang(lang) {
    localStorage.setItem('lang', lang);
    EventEmitter.dispatch('langChange', true)
  }

  render() {
    return (
        <>
          <h2>Please select language:</h2>
          <div className="language-container">
            <button className="btn btn-danger polish" onClick={this.setLang.bind(this, 'pl')}>PL</button>
            <button className="btn btn-primary english" onClick={this.setLang.bind(this, 'en')}>EN</button>
          </div>
        </>
    );
  } 
}

export default Settings;
